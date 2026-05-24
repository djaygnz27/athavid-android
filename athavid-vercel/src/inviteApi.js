// ╔══════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — INVITE API (SachiInvite entity layer)                ║
// ║  • getOrCreate: get/create invite record for a user             ║
// ║  • attributeSignup: called on signup to record who referred who  ║
// ║  • getReferrals: list people a user has referred                 ║
// ║  • getLeaderboard: top referrers sorted by referral_count        ║
// ║  • generateCode: 8-char alphanumeric unique per user             ║
// ╚══════════════════════════════════════════════════════════════════╝
import { request } from "./api.js";

const APP_ID = "69e79122bcc8fb5a04cfb834";

function generateCode(userId) {
  // Deterministic short code from userId + random salt
  const base = userId.replace(/-/g,"").slice(0,6).toUpperCase();
  const salt = Math.random().toString(36).slice(2,5).toUpperCase();
  return `${base}${salt}`;
}

export const invites = {
  // Get existing invite record or create one for this user
  async getOrCreate(userId, username) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiInvite?user_id=${userId}&limit=1`);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      if (items.length > 0) return items[0];
      // Create new invite record
      const code = generateCode(userId);
      return await request("POST", `/apps/${APP_ID}/entities/SachiInvite`, {
        user_id: userId,
        username: username || "user",
        code,
        referral_count: 0
      });
    } catch (e) {
      console.error("invites.getOrCreate error", e);
      return null;
    }
  },

  // Called after signup: attribute new user to referrer's code
  async attributeSignup(inviteCode, inviteeId, inviteeUsername) {
    if (!inviteCode) return;
    try {
      // Find the invite record by code
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiInvite?code=${inviteCode}&limit=1`);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      if (!items.length) return;
      const invite = items[0];
      // Create referral record
      await request("POST", `/apps/${APP_ID}/entities/SachiReferral`, {
        inviter_id: invite.user_id,
        inviter_username: invite.username,
        invite_code: inviteCode,
        invitee_id: inviteeId,
        invitee_username: inviteeUsername
      });
      // Increment referral count on invite record
      await request("PUT", `/apps/${APP_ID}/entities/SachiInvite/${invite.id}`, {
        referral_count: (invite.referral_count || 0) + 1
      });
      // Clear stored code
      localStorage.removeItem("sachi_invite_code");
    } catch (e) {
      console.error("invites.attributeSignup error", e);
    }
  },

  // Get all referrals made by a user
  async getReferrals(userId) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiReferral?inviter_id=${userId}&limit=200&sort=-created_date`);
      return Array.isArray(res) ? res : (res?.items || res?.records || []);
    } catch { return []; }
  },

  // Top referrers leaderboard
  async getLeaderboard() {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiInvite?sort=-referral_count&limit=20`);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      return items.filter(i => (i.referral_count || 0) > 0);
    } catch { return []; }
  },

  // Get invite record by code (for landing page to show inviter info)
  async getByCode(code) {
    try {
      const res = await request("GET", `/apps/${APP_ID}/entities/SachiInvite?code=${code}&limit=1`);
      const items = Array.isArray(res) ? res : (res?.items || res?.records || []);
      return items[0] || null;
    } catch { return null; }
  }
};
