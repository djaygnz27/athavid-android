const APP_ID = "69e79122bcc8fb5a04cfb834";
const BASE_URL = "https://sachi-04cfb834.base44.app/api";

let sessionToken = null;

export function setToken(t) { sessionToken = t; localStorage.setItem("sachi_token", t); }
export function getToken() { return sessionToken || localStorage.getItem("sachi_token"); }
export function clearToken() { sessionToken = null; localStorage.removeItem("sachi_token"); localStorage.removeItem("sachi_user"); }

export async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  let data;
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok) throw new Error(data.message || data.detail || data.error || `Error ${res.status}`);
  return data;
}

export const auth = {
  async signIn(email, password) {
    const data = await request("POST", `/apps/${APP_ID}/auth/login`, { email, password });
    const token = data.access_token || data.token;
    if (token) setToken(token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async signUp(email, password, fullName) {
    return request("POST", `/apps/${APP_ID}/auth/register`, { email, password, full_name: fullName });
  },
  async verifyOtp(email, otpCode) {
    const data = await request("POST", `/apps/${APP_ID}/auth/verify-otp`, { email, otp_code: otpCode });
    const token = data.access_token || data.token;
    if (token) setToken(token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async resendOtp(email) {
    return request("POST", `/apps/${APP_ID}/auth/resend-otp`, { email });
  },
  getUser() {
    const u = localStorage.getItem("sachi_user");
    return u ? JSON.parse(u) : null;
  },
  async forgotPassword(email) {
    return request("POST", `/apps/${APP_ID}/auth/reset-password-request`, { email });
  },
  async resetPassword(email, resetToken, newPassword) {
    return request("POST", `/apps/${APP_ID}/auth/reset-password`, {
      reset_token: resetToken,
      new_password: newPassword
    });
  },
  signOut() { clearToken(); }
};

export const videos = {
  async list(limit = 30, skip = 0) { // ⚡ perf: default 30, paginated
    return request("GET", `/apps/${APP_ID}/entities/SachiVideo?sort=-created_date&limit=${limit}&skip=${skip}`);
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID}/entities/SachiVideo`, data);
  },
  async update(id, data) {
    return request("PUT", `/apps/${APP_ID}/entities/SachiVideo/${id}`, data);
  },
  async myVideos(userId, userEmail) {
    // Fetch by user_id first
    const res1 = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?user_id=${userId}&limit=500&sort=-created_date`);
    const items1 = res1?.items || (Array.isArray(res1) ? res1 : []);
    // Also fetch by created_by email to catch legacy posts
    let items2 = [];
    if (userEmail) {
      const res2 = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?created_by=${encodeURIComponent(userEmail)}&limit=500&sort=-created_date`);
      items2 = res2?.items || (Array.isArray(res2) ? res2 : []);
    }
    // Merge, deduplicate by id
    const seen = new Set();
    return [...items1, ...items2].filter(v => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return !v.is_archived;
    });
  },
  async byUser(userId) {
    // Try user_id first, also fetch by created_by and merge unique results
    const [res1, res2] = await Promise.all([
      request("GET", `/apps/${APP_ID}/entities/SachiVideo?user_id=${userId}&limit=500&sort=-created_date`).catch(() => []),
      request("GET", `/apps/${APP_ID}/entities/SachiVideo?created_by=${userId}&limit=500&sort=-created_date`).catch(() => []),
    ]);
    const items1 = Array.isArray(res1) ? res1 : (res1?.items || []);
    const items2 = Array.isArray(res2) ? res2 : (res2?.items || []);
    // Merge and deduplicate by id
    const seen = new Set();
    const merged = [...items1, ...items2].filter(v => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return !v.is_archived;
    });
    return merged;
  },
  async delete(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiVideo/${id}`);
  },
};

export const comments = {
  async list(videoId) {
    const res = await request("GET", `/apps/${APP_ID}/entities/SachiComment?video_id=${videoId}&sort=created_date&limit=500`);
    return Array.isArray(res) ? res : (res?.items || res?.records || res?.data || []);
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID}/entities/SachiComment`, data);
  },
  async update(id, data) {
    return request("PUT", `/apps/${APP_ID}/entities/SachiComment/${id}`, data);
  },
  async delete(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiComment/${id}`);
  },
};

// ── uploadFile: routes ALL uploads directly to Cloudflare (Stream or R2) ──
// Videos  → Cloudflare Stream via TUS direct upload
// Images  → Cloudflare R2 via presigned PUT URL
// NO files touch Base44 storage or pass through our server
export async function uploadFile(file, onProgress) {
  const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(file.name);

  // 1. Get upload credentials from our Vercel function
  const credRes = await fetch("/api/get-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type:     isVideo ? "video" : "image",
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
    }),
  });
  if (!credRes.ok) {
    const err = await credRes.json().catch(() => ({}));
    throw new Error(err.error || `Upload credential error ${credRes.status}`);
  }
  const creds = await credRes.json();

  if (isVideo) {
    // 2a. R2 direct PUT upload — interim video pipeline (2026-07-01) until
    // Sachi Stream 2.0 replaces it. Switched away from Cloudflare Stream
    // because Jay's desktop Chrome hit net::ERR_HTTP2_PROTOCOL_ERROR talking
    // to upload.cloudflarestream.com specifically (confirmed via live browser
    // console), while R2 uploads from the same desktop already worked fine.
    // get-upload-url now returns R2 presigned-PUT creds for type: "video".
    if (creds.storage === "r2-multipart") {
      // Large file (>=8MB): upload in small 8MB parts instead of one giant
      // PUT. Root cause (2026-07-02): a single huge PUT was failing
      // instantly (0 bytes sent) for multiple unrelated users on different
      // networks/devices -- this is the standard fix for large uploads.
      await r2MultipartUpload(file, creds, onProgress);
      return {
        file_url: creds.public_url,
        thumbnail_url: null,
        stream_uid: null,
        media_url: creds.public_url,
      };
    }

    if (creds.storage === "r2") {
      await r2Upload(file, creds.upload_url, (pct) => { if (onProgress) onProgress(pct); });
      return {
        file_url: creds.public_url,
        thumbnail_url: null,   // client-side captureThumbnail() handles this
        stream_uid: null,      // no Cloudflare Stream session in the R2 path
        media_url: creds.public_url, // direct MP4 — same URL, no HLS needed
      };
    }

    // 2a-legacy. Cloudflare Stream path — only reached if server ever returns
    // a non-R2 video response (e.g. type: "video_stream" credentials). Not
    // used by default anymore; preserved for rollback.
    // cfFormUpload gets its own TUS session via get-tus-session and uploads in chunks.
    // Override creds with the actual session used for upload.
    let uploadedCreds;
    try {
      uploadedCreds = await cfFormUpload(file, null, onProgress);
      // cfFormUpload returns { stream_uid, playback_url, thumbnail_url } from its own session
      if (uploadedCreds?.stream_uid) {
        creds.stream_uid    = uploadedCreds.stream_uid;
        creds.playback_url  = uploadedCreds.playback_url;
        creds.thumbnail_url = uploadedCreds.thumbnail_url;
      }
    } catch (uploadErr) {
      console.error("[Sachi] cfFormUpload failed:", uploadErr.message);
      throw uploadErr;
    }

    // ⛔ LOCKED — MP4 trigger START
    // DO NOT remove or bypass this block without explicit permission from Jay.
    // Fire-and-forget: trigger CF to generate MP4 download in background.
    // Don't await — this used to block upload completion for 30s.
    // The backfill system (admin/automated) sets media_url later if CF isn't ready instantly.
    let media_url = null;
    fetch("/api/trigger-mp4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stream_uid: creds.stream_uid }),
    }).then(r => r.ok ? r.json() : null).catch(() => null);
    // media_url stays null for now — VideoPlayer falls back to HLS which works fine

    return {
      file_url: creds.playback_url,
      thumbnail_url: creds.thumbnail_url,
      stream_uid: creds.stream_uid,
      media_url,  // direct MP4 URL — set immediately if CF is fast, else null (backfill handles it)
    };
    // ⛔ LOCKED — MP4 trigger END
  } else {
    // 2b. PUT directly to R2 presigned URL
    await r2Upload(file, creds.upload_url, onProgress);
    return { file_url: creds.public_url };
  }
}

// Cloudflare Stream direct upload — browser → CF directly (no Vercel proxy,
// so no 4.5MB body cap). The ENTIRE multipart body is pre-built as a single
// in-memory Blob before being sent via one XHR write — this avoids Chrome's
// disk-streaming code path for raw File objects, which was found (2026-07-01)
// to trigger ERR_HTTP2_PROTOCOL_ERROR against Cloudflare's edge on real
// multi-MB video files. curl never hit this bug because it always sends the
// whole body in one shot — this function now matches that behavior exactly.
async function cfFormUpload(file, _uploadUrl, onProgress) {
  if (!file || file.size === 0) throw new Error("File is empty — please select a valid video");

  // TUS chunked resumable upload — replaces the old single-POST direct_upload
  // flow, which was hitting net::ERR_HTTP2_PROTOCOL_ERROR in Chrome on real
  // multi-MB video files (confirmed via live browser console 2026-07-01: the
  // error fires on upload.cloudflarestream.com regardless of how the request
  // body is constructed — it's a large-single-shot-POST-over-HTTP/2 issue,
  // not a JS-side File-streaming issue as first suspected).
  //
  // Fix: get a Cloudflare TUS session and upload the file in small (5MB)
  // sequential PATCH chunks. Verified via live server-side testing: chunked
  // PATCH never triggers the HTTP/2 bug, at any file size.
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB — must be a multiple of 256KB per CF's TUS spec

  // Step 1: ask our server to open a TUS session with Cloudflare
  const sessionRes = await fetch("/api/get-tus-session", {
    method: "POST",
    headers: {
      "X-Max-Duration": "1800",
      "X-File-Size": String(file.size),
      "X-File-Name": encodeURIComponent(file.name || "video.mp4"),
    },
  });
  if (!sessionRes.ok) {
    const errText = await sessionRes.text().catch(() => "");
    throw new Error(`Failed to get upload session: HTTP ${sessionRes.status} — ${errText.slice(0, 200)}`);
  }
  const sessionData = await sessionRes.json();
  const tusUrl = sessionData.tus_upload_url;
  if (!tusUrl) throw new Error("Upload failed: no TUS URL returned by server");

  // Step 2: upload the file in sequential chunks via PATCH
  let offset = 0;
  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const chunk = file.slice(offset, end);

    const newOffset = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PATCH", tusUrl, true);
      xhr.setRequestHeader("Tus-Resumable", "1.0.0");
      xhr.setRequestHeader("Upload-Offset", String(offset));
      xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
      xhr.timeout = 60000; // 60s per chunk is plenty for 5MB

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const respOffset = parseInt(xhr.getResponseHeader("Upload-Offset"), 10);
          resolve(Number.isFinite(respOffset) ? respOffset : end);
        } else {
          reject(new Error(`Chunk upload rejected: HTTP ${xhr.status} at offset ${offset}`));
        }
      };
      xhr.onerror = () => reject(new Error(`Chunk network error at offset ${offset}`));
      xhr.ontimeout = () => reject(new Error(`Chunk timed out at offset ${offset}`));

      xhr.send(chunk);
    });

    offset = newOffset;
    if (onProgress) onProgress(Math.round((offset / file.size) * 100));
  }

  return {
    stream_uid:    sessionData.stream_uid,
    playback_url:  sessionData.playback_url,
    thumbnail_url: sessionData.thumbnail_url,
  };
}

// Direct PUT to R2 presigned URL
// ── R2 Multipart upload (2026-07-02) ───────────────────────────────────────
// Splits large files into small (8MB) parts instead of one giant PUT.
// Each part is uploaded via its own short-lived presigned URL (fetched from
// our server just-in-time), sequentially, with per-part retry. This is the
// standard S3-compatible multipart pattern, chosen after a single massive
// PUT started failing instantly (0 bytes sent) for multiple unrelated users
// on completely different networks/devices on the same day.
async function r2UploadPart(url, chunk, attempt = 1) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.timeout = 60000;
    xhr.onload = () => {
      if (xhr.status < 300) {
        const etag = xhr.getResponseHeader("ETag");
        if (!etag) return reject(new Error(`Part upload succeeded but no ETag header (status ${xhr.status})`));
        return resolve(etag);
      }
      reject(new Error(`Part upload rejected: HTTP ${xhr.status} ${xhr.responseText ? xhr.responseText.slice(0,200) : ""}`));
    };
    xhr.onerror   = () => reject(new Error(`Part upload network error (attempt ${attempt})`));
    xhr.ontimeout = () => reject(new Error(`Part upload timed out (attempt ${attempt})`));
    xhr.send(chunk);
  });
}

async function r2MultipartUpload(file, creds, onProgress) {
  const { key, upload_id, part_size } = creds;
  const totalParts = Math.ceil(file.size / part_size);
  const parts = [];
  let uploadedBytes = 0;

  for (let i = 0; i < totalParts; i++) {
    const partNumber = i + 1;
    const start = i * part_size;
    const end = Math.min(start + part_size, file.size);
    const chunk = file.slice(start, end);

    // Get a presigned URL for this specific part (small, fast call)
    const urlRes = await fetch("/api/r2-part-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, upload_id, part_number: partNumber }),
    });
    if (!urlRes.ok) {
      const err = await urlRes.json().catch(() => ({}));
      throw new Error(err.error || `Failed to get part ${partNumber} URL (${urlRes.status})`);
    }
    const { url } = await urlRes.json();

    // Upload this part, with up to 3 retries (small chunk, cheap to retry)
    let etag = null, lastErr = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        etag = await r2UploadPart(url, chunk, attempt);
        break;
      } catch (e) {
        lastErr = e;
        if (attempt < 3) await new Promise(r => setTimeout(r, 500 * attempt));
      }
    }
    if (!etag) throw new Error(`Part ${partNumber}/${totalParts} failed after 3 attempts: ${lastErr?.message}`);

    parts.push({ part_number: partNumber, etag });
    uploadedBytes += (end - start);
    if (onProgress) onProgress(Math.round((uploadedBytes / file.size) * 100));
  }

  // Finalize the upload
  const completeRes = await fetch("/api/r2-complete-multipart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, upload_id, parts }),
  });
  if (!completeRes.ok) {
    const err = await completeRes.json().catch(() => ({}));
    throw new Error(err.error || `Failed to complete multipart upload (${completeRes.status})`);
  }
}

async function r2Upload(file, uploadUrl, onProgress) {
  // ── Diagnostic-rich R2 upload (2026-07-01) ──────────────────────────────
  // Prior version threw a bare "R2 upload network error" with zero detail,
  // making it impossible to diagnose from a user's screenshot of the alert.
  // This version captures everything available on failure — bytes actually
  // sent before the failure, elapsed time, xhr.status/readyState, and
  // navigator.onLine — and puts it all directly in the thrown error message
  // so it shows up in the alert() the user sees, without needing DevTools.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startTime = Date.now();
    let lastLoaded = 0;
    let lastTotal = file.size || 0;

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.timeout = 120000; // 2 min hard timeout so we get a distinct signal instead of hanging forever

    if (xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          lastLoaded = e.loaded; lastTotal = e.total;
          if (onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    const diag = (label) => {
      const elapsed = Date.now() - startTime;
      const pct = lastTotal ? Math.round((lastLoaded / lastTotal) * 100) : 0;
      return `${label} | sent ${lastLoaded}/${lastTotal} bytes (${pct}%) | ${elapsed}ms | ` +
             `xhr.status=${xhr.status} readyState=${xhr.readyState} | ` +
             `online=${navigator.onLine} | fileType=${file.type} fileSize=${file.size}`;
    };

    xhr.onload = () => {
      if (xhr.status < 300) return resolve();
      reject(new Error(diag(`R2 upload rejected by server (HTTP ${xhr.status})`) +
        (xhr.responseText ? ` | response: ${xhr.responseText.slice(0,300)}` : "")));
    };
    xhr.onerror = () => reject(new Error(diag("R2 upload network error")));
    xhr.ontimeout = () => reject(new Error(diag("R2 upload TIMED OUT after 120s")));
    xhr.onabort = () => reject(new Error(diag("R2 upload aborted")));

    try {
      xhr.send(file);
    } catch (sendErr) {
      reject(new Error(`R2 upload send() threw immediately: ${sendErr.message} | fileType=${file.type} fileSize=${file.size}`));
    }
  });
}

export const follows = {
  async follow(follower_id, follower_username, following_id, following_username) {
    // Block self-follows at the API level
    if (follower_id && follower_id === following_id) return null;
    if (follower_username && follower_username === following_username) return null;
    return request("POST", `/apps/${APP_ID}/entities/Follow`, {
      follower_id, follower_username, following_id, following_username
    });
  },
  async unfollow(recordId) {
    return request("DELETE", `/apps/${APP_ID}/entities/Follow/${recordId}`);
  },
  // ⛔ LOCKED — GET FOLLOWING START
  // DO NOT MODIFY WITHOUT EXPLICIT PERMISSION FROM JAY
  //
  // WHY THIS EXISTS:
  // Old version queried Follow by follower_id ONLY
  // → 26 of 27 Jay follows were stored under ghost ID (69b2ee18...) not real ID
  // → getFollowing(realId) returned 1 result → every followed person showed as "not following"
  //
  // WHAT IT DOES:
  // Queries Follow by BOTH follower_id AND follower_username in parallel
  // Merges + deduplicates by following_id (Map keyed on following_id)
  // Returns a plain array (NOT wrapped in {items:...})
  // All call sites must handle Array.isArray(res) check
  //
  // DO NOT:
  // - Revert to single-query version (breaks follow visibility for all legacy records)
  // - Remove the username query leg
  // - Wrap the return in {items: ...} — all parsers expect plain array
  async getFollowing(follower_id, follower_username) {
    // Query by ID first, then by username to catch records saved under any account ID
    const [res1, res2] = await Promise.all([
      request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${follower_id}&limit=500`).catch(() => []),
      follower_username
        ? request("GET", `/apps/${APP_ID}/entities/Follow?follower_username=${encodeURIComponent(follower_username)}&limit=500`).catch(() => [])
        : Promise.resolve([]),
    ]);
    const arr1 = Array.isArray(res1) ? res1 : (res1?.items || res1?.records || []);
    const arr2 = Array.isArray(res2) ? res2 : (res2?.items || res2?.records || []);
    // Merge and deduplicate by following_id
    const seen = new Map();
    for (const r of [...arr1, ...arr2]) {
      if (r.following_id && !seen.has(r.following_id)) seen.set(r.following_id, r);
    }
    return [...seen.values()];
  },
  // ⛔ LOCKED — GET FOLLOWING END
  async getFollowers(following_id) {
    return request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${following_id}&limit=500`);
  },
};

// ── Reports ────────────────────────────────────────────────────────────────
export const reports = {
  async create(data) {
    return request("POST", `/apps/${APP_ID}/entities/SachiReport`, data);
  },
  async list() {
    return request("GET", `/apps/${APP_ID}/entities/SachiReport?sort=-created_date&limit=200`);
  },
  async update(id, data) {
    return request("PUT", `/apps/${APP_ID}/entities/SachiReport/${id}`, data);
  },
};

// ── Bookmarks ──────────────────────────────────────────────────────────────
export const bookmarks = {
  async add(user_id, username, video_id) {
    return request("POST", `/apps/${APP_ID}/entities/SachiBookmark`, { user_id, username, video_id });
  },
  async remove(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiBookmark/${id}`);
  },
  async getByUser(user_id) {
    return request("GET", `/apps/${APP_ID}/entities/SachiBookmark?user_id=${user_id}&limit=500`);
  },
};

// ── Blocks ─────────────────────────────────────────────────────────────────
export const blocks = {
  async block(blocker_id, blocker_username, blocked_id, blocked_username) {
    return request("POST", `/apps/${APP_ID}/entities/SachiBlock`, { blocker_id, blocker_username, blocked_id, blocked_username });
  },
  async unblock(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiBlock/${id}`);
  },
  async getBlockedByUser(blocker_id) {
    return request("GET", `/apps/${APP_ID}/entities/SachiBlock?blocker_id=${blocker_id}&limit=500`);
  },
};

// ── Recommendation Engine ──────────────────────────────────────────────────
export const interests = {
  async get(userId) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/UserInterest?user_id=${userId}&limit=100`);
      return Array.isArray(res) ? res : (res?.items || []);
    } catch { return []; }
  },

  async signal(userId, hashtags, points) {
    if (!userId || !hashtags?.length) return;
    const existing = await this.get(userId);
    const now = new Date().toISOString();
    for (const tag of hashtags) {
      const clean = tag.replace(/^#/, "").toLowerCase().trim();
      if (!clean) continue;
      const entry = existing.find(e => e.hashtag === clean);
      if (entry) {
        const decayed = Math.max(0, (entry.score || 0) * 0.95);
        await request("PUT", `/apps/${APP_ID}/entities/UserInterest/${entry.id}`, {
          score: decayed + points,
          last_updated: now
        }).catch(() => {});
      } else {
        await request("POST", `/apps/${APP_ID}/entities/UserInterest`, {
          user_id: userId,
          hashtag: clean,
          score: points,
          last_updated: now
        }).catch(() => {});
      }
    }
  },

  async rankFeed(userId, videoList) {
    const byDate = [...videoList].sort((a, b) =>
      new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime()
    );
    if (!userId) return byDate;
    const userInterests = await this.get(userId);
    if (!userInterests.length) return byDate;
    const scoreMap = {};
    for (const i of userInterests) {
      scoreMap[i.hashtag.toLowerCase()] = i.score || 0;
    }
    const totalSignal = Object.values(scoreMap).reduce((s, v) => s + v, 0);
    if (totalSignal < 3) return byDate;
    const scored = byDate.map(v => {
      const tags = (v.hashtags || []).map(t => t.replace(/^#/, "").toLowerCase());
      let relevance = 0;
      for (const tag of tags) relevance += scoreMap[tag] || 0;
      return { ...v, _relevance: relevance };
    });
    const times = scored.map(v => new Date(v.created_date || 0).getTime());
    const minT = Math.min(...times);
    const maxT = Math.max(...times);
    const timeRange = maxT - minT || 1;
    const maxRel = Math.max(...scored.map(v => v._relevance), 1);
    scored.sort((a, b) => {
      const recencyA = (new Date(a.created_date || 0).getTime() - minT) / timeRange;
      const recencyB = (new Date(b.created_date || 0).getTime() - minT) / timeRange;
      const relA = a._relevance / maxRel;
      const relB = b._relevance / maxRel;
      const scoreA = (relA * 0.3) + (recencyA * 0.7);
      const scoreB = (relB * 0.3) + (recencyB * 0.7);
      return scoreB - scoreA;
    });
    return scored;
  }
};

// ── Likes ──────────────────────────────────────────────────────────────────
export const likes = {
  async add(video_id, user_id, username, display_name, avatar_url) {
    return request("POST", `/apps/${APP_ID}/entities/SachiLike`, {
      video_id, user_id, username, display_name, avatar_url
    });
  },
  async remove(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiLike/${id}`);
  },
  async checkUserLiked(video_id, user_id, username) {
    try {
      // Check by user_id first (fast path)
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiLike?video_id=${video_id}&user_id=${user_id}&limit=1`);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      if (items.length > 0) return items[0];
      // Fallback: check by username — handles duplicate accounts (same person, different user_id)
      if (username) {
        const res2 = await request("GET", `/apps/${APP_ID}/entities/SachiLike?video_id=${video_id}&username=${encodeURIComponent(username)}&limit=5`);
        const items2 = Array.isArray(res2) ? res2 : (res2?.items || res2?.records || []);
        if (items2.length > 0) return items2[0];
      }
      return null;
    } catch { return null; }
  },
  async getByVideo(video_id) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiLike?video_id=${video_id}&limit=500`);
      return Array.isArray(res) ? res : (res?.items || res?.records || []);
    } catch { return []; }
  },
};

// ── Messages ───────────────────────────────────────────────────────────────
export const messages = {
  async send({ sender_id, sender_username, sender_avatar, recipient_id, recipient_username, text, thread_id }) {
    return request("POST", `/apps/${APP_ID}/entities/SachiMessage`, {
      sender_id, sender_username, sender_avatar, recipient_id, recipient_username, text,
      thread_id: thread_id || [sender_id, recipient_id].sort().join("_"),
      is_read: false
    });
  },
  async getInbox(user_id) {
    try {
      // Fetch both received AND sent messages so full thread list appears
      const [r1, r2] = await Promise.all([
        request("GET", `/apps/${APP_ID}/entities/SachiMessage?recipient_id=${user_id}&limit=500`).catch(() => []),
        request("GET", `/apps/${APP_ID}/entities/SachiMessage?sender_id=${user_id}&limit=500`).catch(() => []),
      ]);
      const a1 = Array.isArray(r1) ? r1 : (r1?.items || r1?.records || []);
      const a2 = Array.isArray(r2) ? r2 : (r2?.items || r2?.records || []);
      // Merge, deduplicate by id
      const seen = new Map();
      [...a1, ...a2].forEach(m => { if (m.id) seen.set(m.id, m); });
      return [...seen.values()];
    } catch { return []; }
  },
  async getThread(user_id, other_id) {
    try {
      const thread_id = [user_id, other_id].sort().join("_");
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiMessage?thread_id=${thread_id}&limit=500`);
      return Array.isArray(res) ? res : (res?.items || res?.records || []);
    } catch { return []; }
  },
  async markRead(id) {
    return request("PUT", `/apps/${APP_ID}/entities/SachiMessage/${id}`, { is_read: true });
  },
  async getUnreadCount(user_id) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiMessage?recipient_id=${user_id}&is_read=false&limit=500`);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      return items.filter(m => !m.is_read).length;
    } catch { return 0; }
  }
};

export const notifications = {
  async getForUser(user_id) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiNotification?recipient_id=${user_id}&limit=100`);
      return Array.isArray(res) ? res : (res?.items || res?.records || []);
    } catch { return []; }
  },
  async markRead(id) {
    return request("PUT", `/apps/${APP_ID}/entities/SachiNotification/${id}`, { is_read: true });
  },
  async markAllRead(user_id) {
    try {
      const items = await notifications.getForUser(user_id);
      await Promise.all(items.filter(n => !n.is_read).map(n => notifications.markRead(n.id)));
    } catch {}
  },
  async getUnreadCount(user_id) {
    try {
      const items = await notifications.getForUser(user_id);
      return items.filter(n => !n.is_read).length;
    } catch { return 0; }
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID}/entities/SachiNotification`, data);
  }
};

export const AthaVidUser = {
  async filter(params) {
    const query = new URLSearchParams(params).toString();
    return request("GET", `/entities/AthaVidUser?${query}`);
  },
  async getById(id) {
    return request("GET", `/entities/AthaVidUser/${id}`);
  }
};
