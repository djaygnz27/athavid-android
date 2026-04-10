// sachiCoins — Stripe checkout for coin purchases + gift sending logic

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";
const STRIPE_BASE = "https://api.stripe.com/v1";

// Coin packages — prices match what was created in Stripe
const COIN_PACKAGES = [
  { id: "p100",  coins: 100,   price_id: "price_1TKVSjKB9bqKOOJ0Njg8IwVw", usd: 0.99,  label: "100 Coins",   bonus: "" },
  { id: "p500",  coins: 500,   price_id: "price_1TKVSkKB9bqKOOJ02I2vMaHF", usd: 3.99,  label: "500 Coins",   bonus: "" },
  { id: "p1200", coins: 1200,  price_id: "price_1TKVSlKB9bqKOOJ0DultXMlu", usd: 7.99,  label: "1200 Coins",  bonus: "Most Popular" },
  { id: "p3500", coins: 3500,  price_id: "price_1TKVSlKB9bqKOOJ0Ew1CcIQ7", usd: 19.99, label: "3500 Coins",  bonus: "Best Value" },
  { id: "p10000",coins: 10000, price_id: "price_1TKVSmKB9bqKOOJ0fOjNzyQy", usd: 49.99, label: "10000 Coins", bonus: "🔥 Super Value" },
];

// Coin → USD conversion: 100 coins = $0.50 host earnings (Sachi takes 50%)
const COINS_PER_DOLLAR_HOST = 200; // host gets $1 per 200 coins received

function stripeReq(method: string, path: string, body?: Record<string, any>) {
  const encoded = body
    ? Object.entries(body).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&")
    : undefined;
  return fetch(`${STRIPE_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${btoa(STRIPE_KEY + ":")}`,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: encoded,
  }).then(r => r.json());
}

async function dbReq(method: string, path: string, body?: any) {
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

async function getWallet(userId: string) {
  const res = await dbReq("GET", `/apps/${APP_ID}/entities/SachiCoinWallet?user_id=${userId}&limit=1`);
  const items = Array.isArray(res) ? res : (res?.items || []);
  return items[0] || null;
}

export default async function handler(req: Request) {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: cors });

  const ok = (data: any) => new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json", ...cors } });
  const err = (msg: string, status = 400) => new Response(JSON.stringify({ error: msg }), { status, headers: { "Content-Type": "application/json", ...cors } });

  try {
    const body = await req.json();
    const { action } = body;

    // ── List coin packages ──────────────────────────────────────────────────
    if (action === "list_packages") {
      return ok({ packages: COIN_PACKAGES });
    }

    // ── Create Stripe checkout session for coin purchase ────────────────────
    if (action === "buy_coins") {
      const { package_id, user_id, username, success_url, cancel_url } = body;
      const pkg = COIN_PACKAGES.find(p => p.id === package_id);
      if (!pkg) return err("Invalid package");

      const session = await stripeReq("POST", "/checkout/sessions", {
        mode: "payment",
        "line_items[0][price]": pkg.price_id,
        "line_items[0][quantity]": "1",
        success_url: success_url || "https://www.sachistream.com?coins=success",
        cancel_url: cancel_url || "https://www.sachistream.com?coins=cancel",
        "metadata[user_id]": user_id,
        "metadata[username]": username || "",
        "metadata[package_id]": package_id,
        "metadata[coins]": String(pkg.coins),
      });

      if (!session.url) return err("Stripe session failed: " + JSON.stringify(session));

      // Record pending purchase
      await dbReq("POST", `/apps/${APP_ID}/entities/SachiCoinPurchase`, {
        user_id, username: username || "",
        stripe_session_id: session.id,
        coins_purchased: pkg.coins,
        amount_paid_usd: pkg.usd,
        status: "pending",
      });

      return ok({ url: session.url, session_id: session.id });
    }

    // ── Verify payment and credit coins ────────────────────────────────────
    if (action === "verify_payment") {
      const { session_id, user_id, username } = body;
      const session = await stripeReq("GET", `/checkout/sessions/${session_id}`);
      if (session.payment_status !== "paid") return err("Payment not completed");

      const coins = parseInt(session.metadata?.coins || "0");
      const pkg = COIN_PACKAGES.find(p => p.id === session.metadata?.package_id);
      if (!coins || !pkg) return err("Invalid session metadata");

      // Check not already credited
      const purchases = await dbReq("GET", `/apps/${APP_ID}/entities/SachiCoinPurchase?stripe_session_id=${session_id}&limit=1`);
      const purchaseList = Array.isArray(purchases) ? purchases : (purchases?.items || []);
      const purchase = purchaseList[0];
      if (purchase?.status === "completed") return ok({ already_credited: true, coins });

      // Update purchase record
      if (purchase) {
        await dbReq("PUT", `/apps/${APP_ID}/entities/SachiCoinPurchase/${purchase.id}`, { status: "completed" });
      }

      // Update or create wallet
      const wallet = await getWallet(user_id);
      if (wallet) {
        await dbReq("PUT", `/apps/${APP_ID}/entities/SachiCoinWallet/${wallet.id}`, {
          coins: (wallet.coins || 0) + coins,
          total_purchased: (wallet.total_purchased || 0) + coins,
        });
      } else {
        await dbReq("POST", `/apps/${APP_ID}/entities/SachiCoinWallet`, {
          user_id, username: username || "",
          coins, total_purchased: coins, total_spent: 0,
        });
      }

      return ok({ success: true, coins_added: coins, total_coins: (wallet?.coins || 0) + coins });
    }

    // ── Get wallet balance ──────────────────────────────────────────────────
    if (action === "get_wallet") {
      const { user_id } = body;
      const wallet = await getWallet(user_id);
      return ok({ coins: wallet?.coins || 0, total_purchased: wallet?.total_purchased || 0, total_spent: wallet?.total_spent || 0 });
    }

    // ── Send a gift ─────────────────────────────────────────────────────────
    if (action === "send_gift") {
      const { user_id, username, avatar_url, room_id, host_id, host_username, gift_id, gift_name, gift_emoji, gift_value_coins } = body;

      // Check wallet
      const wallet = await getWallet(user_id);
      if (!wallet || wallet.coins < gift_value_coins) return err("Not enough coins");

      // Deduct from sender
      await dbReq("PUT", `/apps/${APP_ID}/entities/SachiCoinWallet/${wallet.id}`, {
        coins: wallet.coins - gift_value_coins,
        total_spent: (wallet.total_spent || 0) + gift_value_coins,
      });

      // USD value for host (50% of face value)
      const usdValue = parseFloat((gift_value_coins / COINS_PER_DOLLAR_HOST).toFixed(4));

      // Record gift
      await dbReq("POST", `/apps/${APP_ID}/entities/SachiGift`, {
        room_id, sender_id: user_id, sender_username: username, sender_avatar: avatar_url || "",
        host_id, host_username, gift_id, gift_name, gift_emoji,
        gift_value_coins, gift_value_usd: usdValue,
      });

      // Update host earnings
      const hostEarnings = await dbReq("GET", `/apps/${APP_ID}/entities/SachiHostEarning?host_id=${host_id}&limit=1`);
      const hostList = Array.isArray(hostEarnings) ? hostEarnings : (hostEarnings?.items || []);
      const earning = hostList[0];
      if (earning) {
        await dbReq("PUT", `/apps/${APP_ID}/entities/SachiHostEarning/${earning.id}`, {
          total_coins_received: (earning.total_coins_received || 0) + gift_value_coins,
          total_usd_earned: parseFloat(((earning.total_usd_earned || 0) + usdValue).toFixed(4)),
          pending_payout_usd: parseFloat(((earning.pending_payout_usd || 0) + usdValue).toFixed(4)),
        });
      } else {
        await dbReq("POST", `/apps/${APP_ID}/entities/SachiHostEarning`, {
          host_id, host_username,
          total_coins_received: gift_value_coins,
          total_usd_earned: usdValue,
          pending_payout_usd: usdValue,
          paid_out_usd: 0,
          payout_status: "active",
        });
      }

      return ok({ success: true, coins_remaining: wallet.coins - gift_value_coins, usd_value: usdValue });
    }

    // ── Get host earnings ───────────────────────────────────────────────────
    if (action === "get_earnings") {
      const { host_id } = body;
      const res = await dbReq("GET", `/apps/${APP_ID}/entities/SachiHostEarning?host_id=${host_id}&limit=1`);
      const items = Array.isArray(res) ? res : (res?.items || []);
      const e = items[0];
      return ok({
        total_coins_received: e?.total_coins_received || 0,
        total_usd_earned: e?.total_usd_earned || 0,
        pending_payout_usd: e?.pending_payout_usd || 0,
        paid_out_usd: e?.paid_out_usd || 0,
      });
    }

    // ── Get recent gifts for a room (for animations) ────────────────────────
    if (action === "get_room_gifts") {
      const { room_id, since } = body;
      const url = `/apps/${APP_ID}/entities/SachiGift?room_id=${room_id}&sort=-created_date&limit=20`;
      const res = await dbReq("GET", url);
      const items = Array.isArray(res) ? res : (res?.items || []);
      // Filter by since timestamp if provided
      const filtered = since ? items.filter((g: any) => new Date(g.created_date) > new Date(since)) : items;
      return ok({ gifts: filtered });
    }

    return err("Unknown action");
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
  }
}
