const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";
const APP_BASE = `/apps/${APP_ID}`;

let sessionToken = null;

export function setToken(t) { sessionToken = t; localStorage.setItem("sachi_token", t); }
export function getToken() { return sessionToken || localStorage.getItem("sachi_token"); }
export function clearToken() { sessionToken = null; localStorage.removeItem("sachi_token"); localStorage.removeItem("sachi_user"); }

// request() — with auto-retry on network blips and 401 detection
export async function request(method, path, body, retries = 2) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method, headers, body: body ? JSON.stringify(body) : undefined
      });
      let data;
      try { data = await res.json(); } catch { data = {}; }
      if (res.status === 401) { clearToken(); throw new Error("Session expired. Please sign in again."); }
      if (!res.ok) throw new Error(data.message || data.detail || data.error || `Error ${res.status}`);
      return data;
    } catch(e) {
      lastErr = e;
      if (e.message?.includes("Session expired") || e.message?.match(/Error 4\d\d/)) break;
      if (attempt < retries) await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw lastErr;
}

export const auth = {
  async signIn(email, password) {
    const data = await request("POST", `${APP_BASE}/auth/login`, { email, password });
    const token = data.access_token || data.token;
    if (token) setToken(token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async signUp(email, password, fullName) {
    return request("POST", `${APP_BASE}/auth/register`, { email, password, full_name: fullName });
  },
  async verifyOtp(email, otpCode) {
    const data = await request("POST", `${APP_BASE}/auth/verify-otp`, { email, otp_code: otpCode });
    const token = data.access_token || data.token;
    if (token) setToken(token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async resendOtp(email) {
    return request("POST", `${APP_BASE}/auth/resend-otp`, { email });
  },
  getUser() {
    try {
      const u = localStorage.getItem("sachi_user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  },
  async forgotPassword(email) {
    return request("POST", `${APP_BASE}/auth/reset-password-request`, { email });
  },
  async resetPassword(email, resetToken, newPassword) {
    return request("POST", `${APP_BASE}/auth/reset-password`, {
      reset_token: resetToken,
      new_password: newPassword
    });
  },
  signOut() { clearToken(); }
};

export const videos = {
  async list(limit = 30, skip = 0) {
    return request("GET", `${APP_BASE}/entities/SachiVideo?sort=-created_date&limit=${limit}&skip=${skip}`);
  },
  async create(data) {
    return request("POST", `${APP_BASE}/entities/SachiVideo`, data);
  },
  async update(id, data) {
    return request("PUT", `${APP_BASE}/entities/SachiVideo/${id}`, data);
  },
  async myVideos(userId, userEmail) {
    const res1 = await request("GET", `${APP_BASE}/entities/SachiVideo?user_id=${userId}&limit=500&sort=-created_date`);
    const items1 = res1?.items || (Array.isArray(res1) ? res1 : []);
    let items2 = [];
    if (userEmail) {
      const res2 = await request("GET", `${APP_BASE}/entities/SachiVideo?created_by=${encodeURIComponent(userEmail)}&limit=500&sort=-created_date`);
      items2 = res2?.items || (Array.isArray(res2) ? res2 : []);
    }
    const seen = new Set();
    return [...items1, ...items2].filter(v => {
      if (seen.has(v.id)) return false;
      seen.add(v.id);
      return !v.is_archived;
    });
  },
  // Fixed: was fetching ALL videos in a loop then filtering client-side (N+1 problem).
  // Now filters server-side by user_id directly.
  async byUser(userId) {
    const res = await request("GET", `${APP_BASE}/entities/SachiVideo?user_id=${encodeURIComponent(userId)}&limit=500&sort=-created_date`);
    const items = Array.isArray(res) ? res : (res?.items || []);
    return items.filter(v => !v.is_archived);
  },
  async delete(id) {
    return request("DELETE", `${APP_BASE}/entities/SachiVideo/${id}`);
  },
};

export const comments = {
  async list(videoId) {
    return request("GET", `${APP_BASE}/entities/SachiComment?video_id=${videoId}&sort=created_date&limit=200`);
  },
  async create(data) {
    return request("POST", `${APP_BASE}/entities/SachiComment`, data);
  },
  async update(id, data) {
    return request("PUT", `${APP_BASE}/entities/SachiComment/${id}`, data);
  },
  async delete(id) {
    return request("DELETE", `${APP_BASE}/entities/SachiComment/${id}`);
  },
};

export async function uploadFile(file) {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  // Use APP_BASE so this URL updates if the app ID ever changes
  const res = await fetch(
    `${BASE_URL}${APP_BASE}/integration-endpoints/Core/UploadFile`,
    { method: "POST", headers, body: form }
  );
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch(_) { throw new Error(`Upload error ${res.status}: ${text.slice(0,100)}`); }
  if (!res.ok || data.error) throw new Error(data.error || data.message || "Upload failed");
  return data.file_url;
}

export const follows = {
  async follow(follower_id, follower_username, following_id, following_username) {
    return request("POST", `${APP_BASE}/entities/Follow`, {
      follower_id, follower_username, following_id, following_username
    });
  },
  async unfollow(recordId) {
    return request("DELETE", `${APP_BASE}/entities/Follow/${recordId}`);
  },
  async getFollowing(follower_id) {
    return request("GET", `${APP_BASE}/entities/Follow?follower_id=${follower_id}&limit=500`);
  },
  async getFollowers(following_id) {
    return request("GET", `${APP_BASE}/entities/Follow?following_id=${following_id}&limit=500`);
  },
};

// ── Reports ────────────────────────────────────────────────────────────────
export const reports = {
  async create(data) {
    return request("POST", `${APP_BASE}/entities/SachiReport`, data);
  },
  async list() {
    return request("GET", `${APP_BASE}/entities/SachiReport?sort=-created_date&limit=200`);
  },
  async update(id, data) {
    return request("PUT", `${APP_BASE}/entities/SachiReport/${id}`, data);
  },
};

// ── Bookmarks ──────────────────────────────────────────────────────────────
export const bookmarks = {
  async add(user_id, username, video_id) {
    return request("POST", `${APP_BASE}/entities/SachiBookmark`, { user_id, username, video_id });
  },
  async remove(id) {
    return request("DELETE", `${APP_BASE}/entities/SachiBookmark/${id}`);
  },
  async getByUser(user_id) {
    return request("GET", `${APP_BASE}/entities/SachiBookmark?user_id=${user_id}&limit=500`);
  },
};

// ── Blocks ─────────────────────────────────────────────────────────────────
export const blocks = {
  async block(blocker_id, blocker_username, blocked_id, blocked_username) {
    return request("POST", `${APP_BASE}/entities/SachiBlock`, { blocker_id, blocker_username, blocked_id, blocked_username });
  },
  async unblock(id) {
    return request("DELETE", `${APP_BASE}/entities/SachiBlock/${id}`);
  },
  async getBlockedByUser(blocker_id) {
    return request("GET", `${APP_BASE}/entities/SachiBlock?blocker_id=${blocker_id}&limit=500`);
  },
};

// ── Recommendation Engine ──────────────────────────────────────────────────
export const interests = {
  async get(userId) {
    try {
      const res = await request("GET", `${APP_BASE}/entities/UserInterest?user_id=${userId}&limit=100`);
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
        await request("PUT", `${APP_BASE}/entities/UserInterest/${entry.id}`, {
          score: decayed + points,
          last_updated: now
        }).catch(() => {});
      } else {
        await request("POST", `${APP_BASE}/entities/UserInterest`, {
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

// ── Likes local cache ─────────────────────────────────────────────────────────
const LIKES_CACHE_KEY = "sachi_liked_videos";
function getLikesCache() {
  try { return JSON.parse(localStorage.getItem(LIKES_CACHE_KEY) || "{}"); } catch { return {}; }
}
function setLikesCache(cache) {
  try { localStorage.setItem(LIKES_CACHE_KEY, JSON.stringify(cache)); } catch {}
}
function getCacheKey(video_id, user_id) { return `${user_id}__${video_id}`; }

// ── Likes ──────────────────────────────────────────────────────────────────
export const likes = {
  async add(video_id, user_id, username, display_name, avatar_url) {
    const rec = await request("POST", `${APP_BASE}/entities/SachiLike`, {
      video_id, user_id, username, display_name, avatar_url
    });
    const cache = getLikesCache();
    cache[getCacheKey(video_id, user_id)] = rec.id || "liked";
    setLikesCache(cache);
    return rec;
  },
  async remove(id, video_id, user_id) {
    await request("DELETE", `${APP_BASE}/entities/SachiLike/${id}`);
    const cache = getLikesCache();
    delete cache[getCacheKey(video_id, user_id)];
    setLikesCache(cache);
  },
  async getByVideo(video_id) {
    return request("GET", `${APP_BASE}/entities/SachiLike?video_id=${video_id}&limit=500`);
  },
  async checkUserLiked(video_id, user_id) {
    const cache = getLikesCache();
    const cacheKey = getCacheKey(video_id, user_id);
    if (cache[cacheKey]) {
      return { id: cache[cacheKey], video_id, user_id, _fromCache: true };
    }
    try {
      const res = await request("GET", `${APP_BASE}/entities/SachiLike?video_id=${video_id}&user_id=${user_id}&limit=1`);
      const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
      if (items.length > 0) {
        cache[cacheKey] = items[0].id;
        setLikesCache(cache);
        return items[0];
      }
    } catch(e) {}
    try {
      const storedUser = localStorage.getItem("sachi_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.username) {
          const res2 = await request("GET", `${APP_BASE}/entities/SachiLike?video_id=${video_id}&username=${encodeURIComponent(u.username)}&limit=1`);
          const items2 = Array.isArray(res2) ? res2 : (res2?.records || res2?.items || []);
          if (items2.length > 0) {
            cache[cacheKey] = items2[0].id;
            setLikesCache(cache);
            return items2[0];
          }
        }
      }
    } catch(e) {}
    return null;
  },
};

export const messages = {
  send: (data) => request("POST", `${APP_BASE}/entities/SachiMessage`, data),
  getThread: (user1_id, user2_id) => {
    const thread_id = [user1_id, user2_id].sort().join("_");
    return request("GET", `${APP_BASE}/entities/SachiMessage?thread_id=${thread_id}&limit=100`);
  },
  getInbox: (user_id) => request("GET", `${APP_BASE}/entities/SachiMessage?recipient_id=${user_id}&limit=50`),
  markRead: (id) => request("PATCH", `${APP_BASE}/entities/SachiMessage/${id}`, { is_read: true }),
  getUnreadCount: async (user_id) => {
    const res = await request("GET", `${APP_BASE}/entities/SachiMessage?recipient_id=${user_id}&is_read=false&limit=100`);
    const items = Array.isArray(res) ? res : (res?.records || res?.items || []);
    return items.length;
  }
};

export const notifications = {
  get: (user_id) => request("GET", `${APP_BASE}/entities/SachiNotification?recipient_id=${user_id}&limit=50&sort=-created_date`),
  markRead: (id) => request("PATCH", `${APP_BASE}/entities/SachiNotification/${id}`, { is_read: true }),
  getUnread: async (user_id) => {
    const res = await request("GET", `${APP_BASE}/entities/SachiNotification?recipient_id=${user_id}&is_read=false&limit=50`);
    return Array.isArray(res) ? res : (res?.records || res?.items || []);
  }
};
