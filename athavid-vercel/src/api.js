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
    // 2a. Upload video directly from browser → Cloudflare Stream
    // cfFormUpload gets its own CF session via get-cf-session and uploads directly.
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
    // This is what ensures every uploaded video gets a direct MP4 (media_url) in the DB.
    // Without this: uploads are HLS-only → isHlsUrl misdetection → VideoPlayer sets src=undefined → frozen video.
    // Root cause that broke June 24 videos. Fixed 2026-06-25.
    let media_url = null;
    try {
      const dlRes = await fetch("/api/trigger-mp4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stream_uid: creds.stream_uid }),
      });
      if (dlRes.ok) {
        const dlData = await dlRes.json();
        media_url = dlData.media_url || null;
      }
    } catch (e) {
      // Non-fatal — video_url (HLS) still works as fallback
      console.warn("trigger-mp4 failed (non-fatal):", e.message);
    }

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

// Cloudflare Stream 2-step direct upload:
// Step 1: Get a CF upload URL from our tiny Vercel function (/api/get-cf-session) — <1KB request, no size limit issue
// Step 2: Browser uploads the video DIRECTLY to Cloudflare — bypasses Vercel's 4.5MB hard limit entirely
async function cfFormUpload(file, _uploadUrl, onProgress) {
  // Step 1: Get CF upload session (tiny request to Vercel)
  const maxDuration = 1800; // 30 min max
  const sessionRes = await fetch("/api/get-cf-session", {
    method: "POST",
    headers: { "X-Max-Duration": String(maxDuration) },
  });
  if (!sessionRes.ok) {
    const errText = await sessionRes.text();
    throw new Error(`Failed to get upload session: ${sessionRes.status} — ${errText.slice(0, 200)}`);
  }
  const sessionData = await sessionRes.json();
  const cfUploadUrl = sessionData.upload_url;

  // Step 2: Upload directly from browser to Cloudflare (no Vercel size limit)
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", cfUploadUrl, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(new Error(`CF upload failed: HTTP ${xhr.status} — ${xhr.responseText.slice(0, 200)}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed: network error — check your internet connection"));
    xhr.ontimeout = () => reject(new Error("Upload timed out — try a shorter video"));
    xhr.timeout = 600000; // 10 minutes

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });

  // Return the CF metadata from the session
  return {
    stream_uid:    sessionData.stream_uid,
    playback_url:  sessionData.playback_url,
    thumbnail_url: sessionData.thumbnail_url,
  };
}

// Direct PUT to R2 presigned URL
async function r2Upload(file, uploadUrl, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }
    xhr.onload  = () => xhr.status < 300 ? resolve() : reject(new Error(`R2 upload failed: ${xhr.status}`));
    xhr.onerror = () => reject(new Error("R2 upload network error"));
    xhr.send(file);
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
