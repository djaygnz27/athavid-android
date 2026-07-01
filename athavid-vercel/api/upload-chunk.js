// api/upload-chunk.js
// Proxies a single TUS chunk PATCH from the browser -> Vercel (same-origin,
// small POST, no CORS) -> Cloudflare (server-to-server, Node https).
//
// WHY THIS EXISTS: Jay's real browser hit net::ERR_HTTP2_PROTOCOL_ERROR
// talking DIRECTLY to upload.cloudflarestream.com, on BOTH a single giant
// POST (old direct_upload flow) AND small 5MB TUS PATCH chunks (first fix
// attempt) -- confirmed via live browser console 2026-07-01. Since curl from
// this sandbox uploads to the exact same Cloudflare TUS endpoint flawlessly
// every time, the problem is Chrome's HTTP/2 connection to that specific
// Cloudflare hostname in Jay's environment, not chunk size or request shape.
//
// Fix: the browser never talks to Cloudflare directly anymore. Each small
// chunk goes to our own Vercel domain (same-origin, whatever HTTP version
// works fine there), and THIS server relays it to Cloudflare using Node's
// https module over a forced HTTP/1.1 agent -- completely sidestepping
// whatever is breaking the browser's H2 connection to Cloudflare.
//
// Chunk size must stay under Vercel's hard 4.5MB serverless body limit.

const https = require("https");
const http11Agent = new https.Agent({ keepAlive: false });

function tusPatch(tusUrl, offset, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(tusUrl);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "PATCH",
        agent: http11Agent,
        headers: {
          "Tus-Resumable": "1.0.0",
          "Upload-Offset": String(offset),
          "Content-Type": "application/offset+octet-stream",
          "Content-Length": body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => resolve({
          status: res.statusCode,
          newOffset: res.headers["upload-offset"],
          body: Buffer.concat(chunks).toString(),
        }));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports.config = { api: { bodyParser: false, responseLimit: false } };

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Tus-Url,X-Upload-Offset");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const tusUrl = req.headers["x-tus-url"];
  const offset = parseInt(req.headers["x-upload-offset"] || "0", 10);
  if (!tusUrl) return res.status(400).json({ error: "X-Tus-Url header required" });

  try {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks);

    if (body.length === 0) return res.status(400).json({ error: "Empty chunk body" });

    const result = await tusPatch(decodeURIComponent(tusUrl), offset, body);

    if (result.status < 200 || result.status >= 300) {
      return res.status(500).json({ error: "CF chunk rejected", cf_status: result.status, details: result.body.slice(0, 300) });
    }

    return res.status(200).json({ new_offset: parseInt(result.newOffset, 10) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
