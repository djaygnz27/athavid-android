// ╔════════════════════════════════════════════════════════════════════════╗
// ║ api/_r2sign.js                                                          ║
// ║ Shared R2 (S3-compatible) SigV4 signing helpers.                        ║
// ║ Added 2026-07-02 to support R2 Multipart Upload (initiate/part/complete)║
// ║ alongside the existing single-PUT presigned URL flow.                  ║
// ╚════════════════════════════════════════════════════════════════════════╝

const REGION = "auto";
const SERVICE = "s3";

async function sha256hex(data) {
  const buf = await crypto.subtle.digest("SHA-256", typeof data === "string" ? new TextEncoder().encode(data) : data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function hmacRaw(key, data) {
  const k = typeof key === "string"
    ? await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    : await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)));
}

async function hmacHex(key, data) {
  const raw = await hmacRaw(key, data);
  return Array.from(raw).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getSigningKey(secret, date, region, service) {
  const kDate = await hmacRaw(`AWS4${secret}`, date);
  const kRegion = await hmacRaw(kDate, region);
  const kService = await hmacRaw(kRegion, service);
  return await hmacRaw(kService, "aws4_request");
}

function nowStamps() {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return { dateStr, dateOnly: dateStr.slice(0, 8) };
}

// Presigned URL (query-string auth) — for the browser to PUT/POST directly.
// Used for: single-file PUT (existing), and per-part PUT (new, multipart).
async function presignedUrl({ accountId, bucket, accessKey, secretKey, method, key, query = {}, expires = 3600 }) {
  const { dateStr, dateOnly } = nowStamps();
  const credentialScope = `${dateOnly}/${REGION}/${SERVICE}/aws4_request`;
  const credential = `${accessKey}/${credentialScope}`;
  const host = `${bucket}.${accountId}.r2.cloudflarestorage.com`;

  const queryParams = new URLSearchParams({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": credential,
    "X-Amz-Date": dateStr,
    "X-Amz-Expires": String(expires),
    "X-Amz-SignedHeaders": "host",
    ...query,
  });
  // AWS requires query params sorted by key for the canonical request string.
  const sortedQuery = new URLSearchParams([...queryParams.entries()].sort((a, b) => a[0].localeCompare(b[0])));

  const canonicalRequest = [
    method,
    `/${key}`,
    sortedQuery.toString(),
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    dateStr,
    credentialScope,
    await sha256hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(secretKey, dateOnly, REGION, SERVICE);
  const signature = await hmacHex(signingKey, stringToSign);

  return `https://${host}/${key}?${sortedQuery.toString()}&X-Amz-Signature=${signature}`;
}

// Fully signed request (Authorization header) — for server-side calls to R2
// (initiate multipart, complete multipart). Body is hashed and signed properly.
async function signedRequest({ accountId, bucket, accessKey, secretKey, method, key, query = {}, body = "", extraHeaders = {} }) {
  const { dateStr, dateOnly } = nowStamps();
  const credentialScope = `${dateOnly}/${REGION}/${SERVICE}/aws4_request`;
  const host = `${bucket}.${accountId}.r2.cloudflarestorage.com`;

  const sortedQueryEntries = Object.entries(query).sort((a, b) => a[0].localeCompare(b[0]));
  const canonicalQuery = sortedQueryEntries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const bodyHash = await sha256hex(body || "");

  const headerEntries = [["host", host], ["x-amz-content-sha256", bodyHash], ["x-amz-date", dateStr],
    ...Object.entries(extraHeaders).map(([k, v]) => [k.toLowerCase(), v])]
    .sort((a, b) => a[0].localeCompare(b[0]));

  const canonicalHeaders = headerEntries.map(([k, v]) => `${k}:${v}\n`).join("");
  const signedHeaders = headerEntries.map(([k]) => k).join(";");

  const canonicalRequest = [
    method,
    `/${key}`,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    bodyHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    dateStr,
    credentialScope,
    await sha256hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(secretKey, dateOnly, REGION, SERVICE);
  const signature = await hmacHex(signingKey, stringToSign);

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `https://${host}/${key}${canonicalQuery ? "?" + canonicalQuery : ""}`;
  const headers = {
    "x-amz-content-sha256": bodyHash,
    "x-amz-date": dateStr,
    "Authorization": authorization,
    ...extraHeaders,
  };

  return fetch(url, { method, headers, body: body || undefined });
}

module.exports = { presignedUrl, signedRequest, sha256hex };
