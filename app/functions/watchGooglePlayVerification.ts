import { createClientFromRequest } from "https://cdn.base44.com/base44-deno-sdk.js";

export default async function handler(req: Request): Promise<Response> {
  const body = await req.json();
  const base44 = createClientFromRequest(req);

  const messageIds: string[] = body.data?.new_message_ids ?? [];
  if (messageIds.length === 0) {
    return new Response(JSON.stringify({ status: "no_new_messages" }), { status: 200 });
  }

  const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");
  const authHeader = { Authorization: `Bearer ${accessToken}` };

  const GOOGLE_PLAY_KEYWORDS = [
    "google play",
    "play console",
    "developer account",
    "verification",
    "verified",
    "approved",
    "identity verification",
    "account approved",
    "account registration",
    "developer registration",
    "play store",
    "sachi",
  ];

  for (const messageId of messageIds) {
    // Use metadata format first — much cheaper, avoids downloading full body for non-matches
    const metaRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
      { headers: authHeader }
    );
    if (!metaRes.ok) continue;

    const meta = await metaRes.json();
    const headers = meta.payload?.headers ?? [];

    const subject = headers.find((h: any) => h.name === "Subject")?.value ?? "";
    const from    = headers.find((h: any) => h.name === "From")?.value ?? "";
    const date    = headers.find((h: any) => h.name === "Date")?.value ?? "";

    const metaCombined = `${subject} ${from}`.toLowerCase();

    const isFromGoogle = from.toLowerCase().includes("google") ||
                         from.toLowerCase().includes("play") ||
                         from.toLowerCase().includes("noreply@") && from.toLowerCase().includes("google");

    const hasKeywordInMeta = GOOGLE_PLAY_KEYWORDS.some(kw => metaCombined.includes(kw));

    // Early exit — don't fetch body if subject/from clearly not relevant
    if (!isFromGoogle && !hasKeywordInMeta) continue;

    // Now fetch full body only for potentially relevant emails
    const fullRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      { headers: authHeader }
    );
    if (!fullRes.ok) continue;

    const message = await fullRes.json();

    // Get body text
    let bodyText = "";
    const getBody = (parts: any[]): string => {
      if (!parts) return "";
      for (const part of parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        }
        if (part.parts) {
          const nested = getBody(part.parts);
          if (nested) return nested;
        }
      }
      return "";
    };

    if (message.payload?.body?.data) {
      bodyText = atob(message.payload.body.data.replace(/-/g, "+").replace(/_/g, "/"));
    } else if (message.payload?.parts) {
      bodyText = getBody(message.payload.parts);
    }

    const combined = `${subject} ${from} ${bodyText}`.toLowerCase();
    const isGooglePlayEmail = GOOGLE_PLAY_KEYWORDS.some(kw => combined.includes(kw));

    if (!isGooglePlayEmail && !isFromGoogle) continue;

    // Determine status
    let status = "📬 New Google Play Email Detected";
    let emoji = "📬";

    if (combined.includes("approved") || combined.includes("verified") || combined.includes("congratulations")) {
      status = "✅ ACCOUNT APPROVED!";
      emoji = "🎉";
    } else if (combined.includes("pending") || combined.includes("under review") || combined.includes("processing")) {
      status = "⏳ Verification Still Pending";
      emoji = "⏳";
    } else if (combined.includes("rejected") || combined.includes("denied") || combined.includes("not approved")) {
      status = "❌ Verification Issue - Action Required";
      emoji = "🚨";
    } else if (combined.includes("additional information") || combined.includes("more information") || combined.includes("action required")) {
      status = "⚠️ Action Required - More Info Needed";
      emoji = "⚠️";
    }

    const notification = `${emoji} GOOGLE PLAY ALERT — lasanjaya@gmail.com

Status: ${status}
From: ${from}
Subject: ${subject}
Date: ${date}

${bodyText.slice(0, 500)}${bodyText.length > 500 ? "..." : ""}`;

    await base44.asServiceRole.messaging.sendMessage(notification);
    console.log(`Google Play email detected: ${subject} | Status: ${status}`);
  }

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}
