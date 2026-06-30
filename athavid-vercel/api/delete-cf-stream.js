// api/delete-cf-stream.js
// Deletes a Cloudflare Stream video by UID.
// Called when:
//   1. An upload fails mid-way (cleanup the reserved session)
//   2. A user deletes their post (cleanup CF storage)
// This prevents orphaned CF sessions from eating into the 1,000 min quota.

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  if (!CF_TOKEN) return res.status(500).json({ error: "CLOUDFLARE_API_TOKEN not set" });

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch(e) {} }

  const { stream_uid } = body;
  if (!stream_uid) return res.status(400).json({ error: "stream_uid required" });

  try {
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/stream/${stream_uid}`,
      {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${CF_TOKEN}` },
      }
    );

    // CF returns 204 No Content on success, or 404 if already gone — both are fine
    if (cfRes.status === 204 || cfRes.status === 404) {
      return res.status(200).json({ success: true, stream_uid });
    }

    const err = await cfRes.text();
    return res.status(500).json({ error: "CF delete failed", details: err });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
