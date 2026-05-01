const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";
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
  async list(limit = 30, skip = 0) {
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
    const res = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?user_id=${userId}&limit=500&sort=-created_date`);
    const items = Array.isArray(res) ? res : (res?.items || []);
    return items.filter(v => !v.is_archived);
  },
  async delete(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiVideo/${id}`);
  },
};

export const comments = {
  async list(videoId) {
    return request("GET", `/apps/${APP_ID}/entities/SachiComment?video_id=${videoId}&sort=created_date&limit=200`);
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

// Cloudflare R2 upload via Worker — replaces Base44 file storage
const R2_WORKER_URL = "https://sachi-upload.jaygnz27.workers.dev";

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(R2_WORKER_URL, { method: "POST", body: form });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch(_) { throw new Error(`Upload error ${res.status}: ${text.slice(0,100)}`); }
  if (!res.ok || data.error) throw new Error(data.error || data.message || "Upload failed");
  return data.file_url;
}

export const follows = {
  async follow(follower_id, follower_username, following_id, following_username) {
    return request("POST", `/apps/${APP_ID}/entities/Follow`, {
      follower_id, follower_username, following_id, following_username
    });
  },
  async unfollow(recordId) {
    return request("DELETE", `/apps/${APP_ID}/entities/Follow/${recordId}`);
  },
  async getFollowing(follower_id) {
    return request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${follower_id}&limit=500`);
  },
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
