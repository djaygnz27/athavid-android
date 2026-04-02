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
  async list() {
    return request("GET", `/apps/${APP_ID}/entities/SachiVideo?is_approved=true&is_archived=false&sort=-created_date`);
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID}/entities/SachiVideo`, data);
  },
  async update(id, data) {
    return request("PUT", `/apps/${APP_ID}/entities/SachiVideo/${id}`, data);
  },
  async myVideos(userId) {
    return request("GET", `/apps/${APP_ID}/entities/SachiVideo?user_id=${userId}`);
  },
  async byUser(userId) {
    // Fetch all videos and filter client-side by user_id
    let all = [];
    let skip = 0;
    const limit = 100;
    while (true) {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiVideo?limit=${limit}&skip=${skip}&sort=-created_date`);
      const items = Array.isArray(res) ? res : (res?.items || []);
      all = all.concat(items);
      if (items.length < limit) break;
      skip += limit;
      if (skip > 500) break; // safety cap
    }
    return all.filter(v => v.user_id === userId && !v.is_archived);
  },
  async delete(id) {
    return request("DELETE", `/apps/${APP_ID}/entities/SachiVideo/${id}`);
  },
};

export const comments = {
  async list(videoId) {
    return request("GET", `/apps/${APP_ID}/entities/SachiComment?video_id=${videoId}`);
  },
  async create(data) {
    return request("POST", `/apps/${APP_ID}/entities/SachiComment`, data);
  },
};

export async function uploadFile(file) {
  // Upload directly to Base44 storage — CORS open, works with or without auth
  const token = getToken();
  const form = new FormData();
  form.append("file", file);

  // Build headers — only add Authorization if we have a token
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    `https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/integration-endpoints/Core/UploadFile`,
    { method: "POST", headers, body: form }
  );

  // If 404 or non-JSON, give a clear error
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
    return request("GET", `/apps/${APP_ID}/entities/Follow?follower_id=${follower_id}`);
  },
  async getFollowers(following_id) {
    return request("GET", `/apps/${APP_ID}/entities/Follow?following_id=${following_id}`);
  },
  async getFollowingVideos(userIds) {
    // fetch videos from followed users
    const ids = userIds.join(",");
    return request("GET", `/apps/${APP_ID}/entities/SachiVideo?is_approved=true&is_archived=false&sort=-created_date`);
  }
};

// ── Recommendation Engine ──────────────────────────────────────────────────
export const interests = {
  // Fetch a user's interest scores
  async get(userId) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/UserInterest?user_id=${userId}&limit=100`);
      return Array.isArray(res) ? res : (res?.items || []);
    } catch { return []; }
  },

  // Record a signal: like=3pts, watch(50%+)=1pt, follow=5pts
  async signal(userId, hashtags, points) {
    if (!userId || !hashtags?.length) return;
    const existing = await this.get(userId);
    const now = new Date().toISOString();
    for (const tag of hashtags) {
      const clean = tag.replace(/^#/, "").toLowerCase().trim();
      if (!clean) continue;
      const entry = existing.find(e => e.hashtag === clean);
      if (entry) {
        // Decay old score slightly then add new points (recency matters)
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

  // Score a list of videos against user's interests and return sorted list
  async rankFeed(userId, videoList) {
    if (!userId) return videoList; // guests get chronological feed
    const userInterests = await this.get(userId);
    if (!userInterests.length) return videoList; // no data yet, return as-is

    // Build a score map: hashtag -> interest score
    const scoreMap = {};
    for (const i of userInterests) {
      scoreMap[i.hashtag.toLowerCase()] = i.score || 0;
    }

    // Score each video
    const scored = videoList.map(v => {
      const tags = (v.hashtags || []).map(t => t.replace(/^#/, "").toLowerCase());
      let relevance = 0;
      for (const tag of tags) {
        relevance += scoreMap[tag] || 0;
      }
      return { ...v, _relevance: relevance };
    });

    // Sort: high relevance first, but mix in some recency so feed doesn't get stale
    // Top 30% by relevance, rest by date
    scored.sort((a, b) => {
      // Blend: 70% relevance score + 30% recency bonus
      const recencyA = new Date(a.created_date || 0).getTime() / 1e12;
      const recencyB = new Date(b.created_date || 0).getTime() / 1e12;
      const scoreA = (a._relevance * 0.7) + (recencyA * 0.3);
      const scoreB = (b._relevance * 0.7) + (recencyB * 0.3);
      return scoreB - scoreA;
    });

    return scored;
  }
};
