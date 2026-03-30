// Base44 API — direct REST calls, no auth wall
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://api.base44.com/api/apps";

let sessionToken = null;

export function setToken(t) { sessionToken = t; localStorage.setItem("sachi_token", t); }
export function getToken() { return sessionToken || localStorage.getItem("sachi_token"); }
export function clearToken() { sessionToken = null; localStorage.removeItem("sachi_token"); localStorage.removeItem("sachi_user"); }

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/${APP_ID}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

// Auth
export const auth = {
  async signUp(email, password, fullName) {
    const data = await request("POST", "/auth/sign-up-email", { email, password, full_name: fullName });
    if (data.token) setToken(data.token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async signIn(email, password) {
    const data = await request("POST", "/auth/sign-in-email", { email, password });
    if (data.token) setToken(data.token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  async verifyCode(email, code) {
    const data = await request("POST", "/auth/verify-code", { email, code });
    if (data.token) setToken(data.token);
    if (data.user) localStorage.setItem("sachi_user", JSON.stringify(data.user));
    return data;
  },
  getUser() {
    const u = localStorage.getItem("sachi_user");
    return u ? JSON.parse(u) : null;
  },
  signOut() { clearToken(); }
};

// Entities
export const videos = {
  async list() { return request("GET", "/entities/AthaVidVideo?is_approved=true&is_archived=false&sort=-created_date"); },
  async create(data) { return request("POST", "/entities/AthaVidVideo", data); },
  async update(id, data) { return request("PUT", `/entities/AthaVidVideo/${id}`, data); },
  async myVideos(userId) { return request("GET", `/entities/AthaVidVideo?user_id=${userId}`); },
};

export const comments = {
  async list(videoId) { return request("GET", `/entities/AthaVidComment?video_id=${videoId}`); },
  async create(data) { return request("POST", "/entities/AthaVidComment", data); },
};

// Upload
export async function uploadFile(file) {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/${APP_ID}/integrations/core/upload-file`, {
    method: "POST",
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
    body: form
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.file_url;
}
