const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = `https://api.base44.com/api/apps/${APP_ID}`;

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Strip /api/proxy prefix to get the Base44 path
  const path = req.url.replace(/^\/api\/proxy/, "") || "/";

  const upstreamHeaders = {};
  if (req.headers.authorization) upstreamHeaders["Authorization"] = req.headers.authorization;
  if (req.headers["content-type"]) upstreamHeaders["Content-Type"] = req.headers["content-type"];

  try {
    // Read raw body
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    const fetchOptions = {
      method: req.method,
      headers: upstreamHeaders,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && rawBody.length > 0) {
      fetchOptions.body = rawBody;
    }

    const response = await fetch(`${BASE_URL}${path}`, fetchOptions);
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.setHeader("Content-Type", contentType);
      return res.status(response.status).send(text);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
