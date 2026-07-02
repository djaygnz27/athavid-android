// ╔════════════════════════════════════════════════════════════════════════╗
// ║ api/r2-part-url.js                                                      ║
// ║ Returns a presigned PUT URL for ONE part of an R2 multipart upload.     ║
// ║ Added 2026-07-02 as part of the multipart video upload fix.             ║
// ╚════════════════════════════════════════════════════════════════════════╝

const { presignedUrl } = require("./_r2sign.js");

const CF_ACCOUNT = "a346b1c78fc48549d2de3de99a789a2d";
const R2_BUCKET   = "sachi-media";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://sachistream.com");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
  const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
  if (!R2_ACCESS_KEY || !R2_SECRET_KEY) {
    return res.status(500).json({ error: "R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY not set" });
  }

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) {} }
  const { key, upload_id, part_number } = body;

  if (!key || !upload_id || !part_number) {
    return res.status(400).json({ error: "key, upload_id, and part_number are required" });
  }

  try {
    const url = await presignedUrl({
      accountId: CF_ACCOUNT, bucket: R2_BUCKET,
      accessKey: R2_ACCESS_KEY, secretKey: R2_SECRET_KEY,
      method: "PUT", key,
      query: { partNumber: String(part_number), uploadId: upload_id },
    });
    return res.status(200).json({ url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
