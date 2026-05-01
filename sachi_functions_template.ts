/**
 * SACHI STREAM — Backend Functions Template
 * Drop these into your Sachi Stream app's backend functions
 * Update the constants at the top — everything else works as-is
 * 
 * Functions included:
 *   1. getPublicFeed
 *   2. podcastWelcome
 *   3. podcastGoLiveNotify
 *   4. createLiveStream
 *   5. getOrCreateWallet
 *   6. processGiftPayment
 *   7. createCheckoutSession (Stripe coins)
 *   8. moderateContent (AI moderation)
 */

import base44 from "./base44_sdk"; // auto-available in Sachi Stream app

// ─────────────────────────────────────────────
// CONSTANTS — UPDATE THESE IN YOUR NEW APP
// ─────────────────────────────────────────────
const APP_ID            = "YOUR_SACHI_STREAM_APP_ID";
const BASE_URL          = "https://YOUR_SACHI_STREAM_APP_ID.base44.app";
const CLOUDFLARE_ACCT   = "YOUR_CLOUDFLARE_ACCOUNT_ID";
const CLOUDFLARE_TOKEN  = "YOUR_CLOUDFLARE_API_TOKEN";
const STRIPE_SECRET_KEY = "YOUR_STRIPE_SECRET_KEY";
const OPENAI_API_KEY    = "YOUR_OPENAI_API_KEY";

// ─────────────────────────────────────────────
// 1. GET PUBLIC FEED
// Returns paginated SachiVideo feed, excluding archived/unapproved
// Query params: limit, skip, hashtag (optional filter)
// ─────────────────────────────────────────────
export async function getPublicFeed(req: Request): Promise<Response> {
  const url    = new URL(req.url);
  const limit  = parseInt(url.searchParams.get("limit") || "20");
  const skip   = parseInt(url.searchParams.get("skip")  || "0");
  const tag    = url.searchParams.get("hashtag");

  try {
    let filter: any = { is_archived: false, is_approved: true };
    if (tag) filter.hashtags = tag;

    const videos = await base44.asServiceRole.entities.SachiVideo
      .filter(filter, { limit, skip, sort: "-created_date" });

    return Response.json({ videos, has_more: videos.length === limit });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 2. PODCAST WELCOME EMAIL
// Sends a welcome email when a new podcast is created
// Body: { podcast_id, host_email, host_name, podcast_title }
// ─────────────────────────────────────────────
export async function podcastWelcome(req: Request): Promise<Response> {
  const { podcast_id, host_email, host_name, podcast_title } = await req.json();

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <img src="${BASE_URL}/logo.png" style="height:48px;margin-bottom:16px;" />
      <h2 style="color:#F5C842;">Welcome to Sachi Podcasts, ${host_name}!</h2>
      <p>Your podcast <strong>${podcast_title}</strong> is now live on Sachi Stream.</p>
      <p>Share your RTMP stream key from your host dashboard and go live anytime.</p>
      <a href="${BASE_URL}/podcast-host" 
         style="background:#F5C842;color:#0B0C1A;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Open Host Dashboard
      </a>
      <p style="margin-top:24px;color:#888;font-size:12px;">
        Questions? Email us at podcasts@sachistream.com
      </p>
    </div>
  `;

  try {
    // Use Base44 built-in email (or swap for SendGrid/Resend)
    await fetch("https://api.base44.com/v1/email/send", {
      method: "POST",
      headers: { "x-api-key": process.env.BASE44_API_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({
        to: host_email,
        subject: `🎙️ Your Sachi Podcast is Live — ${podcast_title}`,
        html
      })
    });

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 3. PODCAST GO LIVE NOTIFY
// Notifies podcast followers when host goes live
// Body: { podcast_id }
// ─────────────────────────────────────────────
export async function podcastGoLiveNotify(req: Request): Promise<Response> {
  const { podcast_id } = await req.json();

  try {
    const podcast = await base44.asServiceRole.entities.SachiPodcast.get(podcast_id);
    if (!podcast) return Response.json({ error: "Podcast not found" }, { status: 404 });

    // Mark podcast as live
    await base44.asServiceRole.entities.SachiPodcast.update(podcast_id, { is_live: true });

    // TODO: Query followers of this podcast and send push/in-app notifications
    // For now — log it (replace with your notification service)
    console.log(`📡 ${podcast.title} went LIVE — notify ${podcast.follower_count} followers`);

    return Response.json({ success: true, podcast_title: podcast.title });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 4. CREATE LIVE STREAM (Cloudflare Stream)
// Creates an RTMP live input for a host
// Body: { user_id, username, title }
// ─────────────────────────────────────────────
export async function createLiveStream(req: Request): Promise<Response> {
  const { user_id, username, title } = await req.json();

  try {
    // Create Cloudflare live input
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCT}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          meta: { name: `${username} - ${title}` },
          recording: { mode: "automatic" }
        })
      }
    );

    const cf = await cfRes.json();
    if (!cf.success) throw new Error(cf.errors?.[0]?.message || "Cloudflare error");

    const { uid, rtmps, playback } = cf.result;

    // Save to SachiLiveRoom
    const room = await base44.asServiceRole.entities.SachiLiveRoom.create({
      host_id:       user_id,
      host_username: username,
      title,
      is_live:       false,
      stream_type:   "rtmp",
      rtmp_url:      rtmps.url,
      stream_key:    rtmps.streamKey,
      hls_url:       playback.hls,
      cf_input_id:   uid,
      viewer_count:  0,
    });

    return Response.json({
      room_id:    room.id,
      rtmp_url:   rtmps.url,
      stream_key: rtmps.streamKey,
      hls_url:    playback.hls,
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 5. GET OR CREATE COIN WALLET
// Returns existing wallet or creates one for a user
// Body: { user_id, username }
// ─────────────────────────────────────────────
export async function getOrCreateWallet(req: Request): Promise<Response> {
  const { user_id, username } = await req.json();

  try {
    const existing = await base44.asServiceRole.entities.SachiCoinWallet
      .filter({ user_id });

    if (existing.length > 0) {
      return Response.json({ wallet: existing[0] });
    }

    const wallet = await base44.asServiceRole.entities.SachiCoinWallet.create({
      user_id,
      username,
      coins:           0,
      total_purchased: 0,
      total_spent:     0,
    });

    return Response.json({ wallet });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 6. PROCESS GIFT PAYMENT
// Deducts coins from sender, credits host earnings
// Body: { room_id, sender_id, sender_username, sender_avatar, host_id, host_username, gift_id, gift_name, gift_emoji, gift_value_coins, gift_value_usd }
// ─────────────────────────────────────────────
export async function processGiftPayment(req: Request): Promise<Response> {
  const body = await req.json();
  const { sender_id, host_id, gift_value_coins, gift_value_usd } = body;

  try {
    // 1. Check sender wallet
    const wallets = await base44.asServiceRole.entities.SachiCoinWallet.filter({ user_id: sender_id });
    if (!wallets.length) return Response.json({ error: "Sender wallet not found" }, { status: 404 });
    const wallet = wallets[0];

    if (wallet.coins < gift_value_coins) {
      return Response.json({ error: "Insufficient coins" }, { status: 400 });
    }

    // 2. Deduct coins from sender
    await base44.asServiceRole.entities.SachiCoinWallet.update(wallet.id, {
      coins:       wallet.coins - gift_value_coins,
      total_spent: wallet.total_spent + gift_value_coins,
    });

    // 3. Record gift
    await base44.asServiceRole.entities.SachiGift.create(body);

    // 4. Update host earnings (host keeps 80%)
    const hostCut = gift_value_usd * 0.8;
    const earnings = await base44.asServiceRole.entities.SachiHostEarning.filter({ host_id });

    if (earnings.length > 0) {
      const e = earnings[0];
      await base44.asServiceRole.entities.SachiHostEarning.update(e.id, {
        total_coins_received: e.total_coins_received + gift_value_coins,
        total_usd_earned:     e.total_usd_earned + hostCut,
        pending_payout_usd:   e.pending_payout_usd + hostCut,
      });
    } else {
      await base44.asServiceRole.entities.SachiHostEarning.create({
        host_id,
        host_username:        body.host_username,
        total_coins_received: gift_value_coins,
        total_usd_earned:     hostCut,
        pending_payout_usd:   hostCut,
        paid_out_usd:         0,
        payout_status:        "pending",
      });
    }

    return Response.json({ success: true, host_cut_usd: hostCut });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 7. CREATE STRIPE CHECKOUT SESSION (Coin Purchase)
// Body: { user_id, username, package: "100"|"500"|"1200"|"3000" }
// ─────────────────────────────────────────────
const COIN_PACKAGES: Record<string, { coins: number; price_cents: number }> = {
  "100":  { coins: 100,  price_cents: 99   },
  "500":  { coins: 500,  price_cents: 399  },
  "1200": { coins: 1200, price_cents: 799  },
  "3000": { coins: 3000, price_cents: 1799 },
};

export async function createCheckoutSession(req: Request): Promise<Response> {
  const { user_id, username, package: pkg } = await req.json();
  const coinPkg = COIN_PACKAGES[pkg];
  if (!coinPkg) return Response.json({ error: "Invalid package" }, { status: 400 });

  try {
    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]":         "card",
        "line_items[0][price_data][currency]":                   "usd",
        "line_items[0][price_data][unit_amount]":                String(coinPkg.price_cents),
        "line_items[0][price_data][product_data][name]":         `${coinPkg.coins} Sachi Coins`,
        "line_items[0][quantity]":                               "1",
        "mode":                                                   "payment",
        "success_url":                                           `${BASE_URL}/coins?success=1&session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url":                                            `${BASE_URL}/coins?cancelled=1`,
        "metadata[user_id]":                                      user_id,
        "metadata[username]":                                     username,
        "metadata[coins]":                                        String(coinPkg.coins),
      })
    });

    const session = await stripeRes.json();
    if (session.error) throw new Error(session.error.message);

    // Record pending purchase
    await base44.asServiceRole.entities.SachiCoinPurchase.create({
      user_id,
      username,
      stripe_session_id: session.id,
      coins_purchased:   coinPkg.coins,
      amount_paid_usd:   coinPkg.price_cents / 100,
      status:            "pending",
    });

    return Response.json({ checkout_url: session.url });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// 8. MODERATE CONTENT (AI)
// Checks caption/text for policy violations
// Body: { caption, username, video_id }
// ─────────────────────────────────────────────
export async function moderateContent(req: Request): Promise<Response> {
  const { caption, username, video_id } = await req.json();

  try {
    const aiRes = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: caption })
    });

    const result = await aiRes.json();
    const flagged = result.results?.[0]?.flagged || false;
    const categories = result.results?.[0]?.categories || {};

    if (flagged) {
      // Auto-archive the video
      await base44.asServiceRole.entities.SachiVideo.update(video_id, {
        is_approved:  false,
        is_ai_detected: true,
        archive_date: new Date().toISOString(),
      });

      console.log(`🚨 Content flagged for @${username} — video ${video_id}`);
    }

    return Response.json({ flagged, categories, video_id });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
