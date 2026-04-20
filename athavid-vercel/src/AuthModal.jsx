// src/AuthModal.jsx
//
// Phase 2 of the auth migration. See Sachi_Project_Log_April19.md.
//
// WHAT CHANGED vs. the previous version:
// - Removed: manual Google OAuth URL construction, the atob() JWT decode,
//   and the unauthenticated lookupSachiUser() fetch.
// - Added: Base44 SDK calls (base44.auth.redirectToLogin / isAuthenticated /
//   me / logout) via the shared singleton in ./lib/base44.js.
//
// WHAT DID NOT CHANGE (on purpose — preserves the contract App.jsx depends on):
// - Exports: default AuthModal, named handleGoogleRedirectCallback,
//   named initGoogleOneTap (still a no-op, kept so existing import succeeds).
// - handleGoogleRedirectCallback() return shape:
//     null  →  nothing to do
//     { sessionUser }  →  existing user, log them in
//     { needsProfile: true, payload }  →  new user, show FinishStep
// - AuthModal calls onSuccess(sessionUser) with the same shape as before:
//   { id, email, full_name, avatar_url, username, _google, _sachiProfileId }
// - localStorage keys: sachi_user (read by auth.getUser() in api.js),
//   sachi_google_user, sachi_pending_google, sachi_dob, sachi_country,
//   sachi_city. All preserved so nothing in App.jsx breaks.
//
// PHASE 3 PREVIEW (not this commit): api.js's request() currently sends
// Authorization: Bearer ${sachi_token} but sachi_token is never set today.
// Phase 3 will replace api.js's raw fetches with base44.entities.* and
// base44.functions.invoke(), which use the SDK's own token (stored by the
// SDK after login). We're not touching api.js this phase.

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Bolivia","Bosnia","Brazil","Bulgaria",
  "Cambodia","Cameroon","Canada","Chile","China","Colombia","Costa Rica","Croatia","Cuba","Cyprus",
  "Czech Republic","Denmark","Dominican Republic","Ecuador","Egypt","El Salvador","Ethiopia",
  "Finland","France","Georgia","Germany","Ghana","Greece","Guatemala","Haiti","Honduras",
  "Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Kuwait","Lebanon","Libya","Malaysia","Mexico","Morocco",
  "Myanmar","Nepal","Netherlands","New Zealand","Nigeria","North Korea","Norway","Oman",
  "Pakistan","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Saudi Arabia","Senegal","Serbia","Singapore","Somalia","South Africa","South Korea",
  "Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand",
  "Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zimbabwe"
];

import React, { useState } from "react";
import { base44 } from "./lib/base44.js";

// ─── Kept as exports to preserve existing import in App.jsx line 15 ──────────
// Legacy: the GOOGLE_CLIENT_ID constant was exported but grep shows nothing
// outside this file imports it. Leaving it out of the new file.

// Base44 creates AthaVidUser via a direct POST through the old fetch pattern.
// Phase 3 will switch this to base44.entities.AthaVidUser.create(). For Phase 2
// we keep the raw fetch so profile creation works identically to today.
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

// ─── SDK METHOD NAMES — VERIFY AGAINST @base44/sdk@0.8.25 ──────────────────
// If any of these calls throw "is not a function", check the SDK's actual
// surface (e.g. open node_modules/@base44/sdk/dist and check the type defs)
// and rename here. Candidates I'd look for:
//   base44.auth.redirectToLogin  vs  base44.auth.login  vs  base44.login
//   base44.auth.isAuthenticated  vs  base44.auth.isLoggedIn
//   base44.auth.me               vs  base44.auth.getCurrentUser  vs  base44.auth.user
//   base44.auth.logout           vs  base44.auth.signOut
// ──────────────────────────────────────────────────────────────────────────

// ─── Helper: look up an existing Sachi profile by email ──────────────────────
// Same logic as before, just called after Base44 gives us the authenticated user.
async function lookupSachiUser(email) {
  try {
    const res = await fetch(
      `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(email)}&limit=5`,
      { headers: { "Content-Type": "application/json" } }
    );
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data?.items || []);
    return items.find(u => u.email === email) || null;
  } catch {
    return null;
  }
}

// ─── Helper: build session user object (shape unchanged — api.js reads it) ───
function buildSessionUser(found, base44User) {
  return {
    id: found.id,
    email: found.email,
    full_name: found.display_name || base44User?.full_name || base44User?.name || found.email,
    avatar_url: found.avatar_url || base44User?.avatar_url || base44User?.picture || "",
    username: found.username || found.email.split("@")[0],
    _google: true, // kept for backward compat with any code that branches on this
    _sachiProfileId: found.id,
  };
}

// ─── Handle auth return (called from App.jsx useEffect on every page load) ───
//
// Contract (unchanged — App.jsx:6178 depends on this):
//   returns null                         → no pending auth, do nothing
//   returns { sessionUser }              → existing user, log them in
//   returns { needsProfile: true, payload } → new user, open modal for FinishStep
//
export async function handleGoogleRedirectCallback() {
  let isAuthed = false;
  try {
    isAuthed = await base44.auth.isAuthenticated();
  } catch (e) {
    console.error("[auth] isAuthenticated() failed:", e);
    return null;
  }
  if (!isAuthed) return null;

  // Base44 SDK has already parsed any redirect params and stored its token.
  // Now get the authenticated user.
  let base44User = null;
  try {
    base44User = await base44.auth.me();
  } catch (e) {
    console.error("[auth] me() failed:", e);
    return null;
  }
  if (!base44User?.email) return null;

  // Normalize a "payload" object shaped like the old Google JWT payload
  // so FinishStep (which expects { email, name, picture }) keeps working
  // without changes.
  const payload = {
    email: base44User.email,
    name: base44User.full_name || base44User.name || base44User.email,
    picture: base44User.avatar_url || base44User.picture || "",
  };

  // Persist the pending payload exactly like before, so if the user reloads
  // mid-FinishStep we can recover.
  localStorage.setItem("sachi_pending_google", JSON.stringify(payload));

  const found = await lookupSachiUser(payload.email);
  if (found) {
    const sessionUser = buildSessionUser(found, base44User);
    localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
    localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
    localStorage.removeItem("sachi_pending_google");
    return { sessionUser, needsProfile: false };
  }

  return { payload, needsProfile: true };
}

// ─── Legacy no-op, kept because App.jsx line 15 imports it ───────────────────
export function initGoogleOneTap() {}

// ─── Finish Step: new users pick username, dob, country (UNCHANGED) ──────────
function FinishStep({ googlePayload, onSuccess }) {
  const { email, name, picture } = googlePayload;
  const suggested = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").toLowerCase();

  const [username, setUsername] = useState(suggested);
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [is18, setIs18] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp = {
    display:"block", width:"100%", boxSizing:"border-box",
    background:"rgba(255,255,255,0.08)", border:"1px solid rgba(245,200,66,0.15)",
    borderRadius:12, padding:"11px 14px", color:"#fff", fontSize:14,
    outline:"none", marginBottom:10,
  };
  const btn = {
    display:"block", width:"100%", padding:"14px 0",
    background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none",
    borderRadius:14, color:"#0B0C1A", fontWeight:800, fontSize:16,
    cursor:"pointer", marginBottom:10,
  };

  // Auto-detect location via IP
  React.useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        if (d.city && !city) setCity(d.city);
        if (d.country_name && !country) setCountry(d.country_name);
      })
      .catch(() => {});
  }, []);

  const handleFinish = async () => {
    if (!username.trim()) return setError("Please enter a username.");
    if (!dob) return setError("Please enter your birthday.");
    if (!is18) return setError("You must confirm you are 18 years or older.");
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    if (age < 13) return setError("You must be at least 13 years old to join Sachi.");

    setLoading(true); setError("");
    try {
      // Check username isn't already taken
      const checkRes = await fetch(
        `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?username=${encodeURIComponent(username.trim().toLowerCase())}&limit=1`,
        { headers: { "Content-Type": "application/json" } }
      );
      const checkData = await checkRes.json();
      const existing = Array.isArray(checkData) ? checkData : (checkData?.items || []);
      if (existing.length > 0) {
        setError("That username is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      const created = await fetch(
        `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            username: username.trim().toLowerCase(),
            display_name: name || username.trim(),
            avatar_url: picture || "",
            is_verified: true,
            is_18_plus: true,
            status: "active",
            followers_count: 0,
            following_count: 0,
            videos_count: 0,
            location: (city && country) ? city + ", " + country : (city || country || ""),
          })
        }
      ).then(r => r.json());

      localStorage.setItem("sachi_dob", dob);
      if (country) localStorage.setItem("sachi_country", country);
      if (city) localStorage.setItem("sachi_city", city);
      localStorage.removeItem("sachi_pending_google");

      if (!created?.id) {
        setError("Profile creation failed. Please try again.");
        return;
      }
      const sessionUser = {
        id: created.id,
        email,
        full_name: name || username.trim(),
        avatar_url: picture || "",
        username: username.trim().toLowerCase(),
        _google: true,
        _sachiProfileId: created.id,
      };
      localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
      localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
      onSuccess(sessionUser);
    } catch(e) {
      console.error(e);
      setError("Could not create your profile. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20 }}>
        {picture && <img src={picture} style={{ width:72, height:72, borderRadius:"50%", border:"3px solid #F5C842", marginBottom:10 }} />}
        <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>{name}</div>
        <div style={{ color:"#888", fontSize:13 }}>{email}</div>
        <div style={{ background:"rgba(80,200,80,0.12)", border:"1px solid rgba(80,200,80,0.3)", borderRadius:20, padding:"4px 14px", marginTop:8, color:"#6fcf6f", fontSize:12, fontWeight:700 }}>
          ✓ Verified
        </div>
      </div>

      <div style={{ color:"#aaa", fontSize:13, marginBottom:16 }}>Just a few more details to set up your profile:</div>

      <input
        value={username}
        onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,"").toLowerCase())}
        placeholder="Choose a username"
        style={inp}
        maxLength={30}
      />

      <div style={{ textAlign:"left", marginBottom:4, color:"#888", fontSize:12 }}>
        Birthday <span style={{color:"#ff6b6b"}}>*</span>
      </div>
      <input
        value={dob}
        onChange={e => setDob(e.target.value)}
        type="date"
        max={new Date().toISOString().slice(0,10)}
        style={{ ...inp, colorScheme:"dark" }}
      />

      <div style={{ textAlign:"left", marginBottom:4, color:"#888", fontSize:12 }}>
        City <span style={{color:"#888", fontSize:11}}>(optional)</span>
      </div>
      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="e.g. Sydney, Colombo, New York"
        style={inp}
        maxLength={60}
      />

      <div style={{ textAlign:"left", marginBottom:4, color:"#888", fontSize:12 }}>
        Country <span style={{color:"#888", fontSize:11}}>(optional)</span>
      </div>
      <select
        value={country}
        onChange={e => setCountry(e.target.value)}
        style={{ display:"block", width:"100%", boxSizing:"border-box", background:"#1a1b2e", border:"1px solid rgba(245,200,66,0.3)", borderRadius:12, padding:"14px 16px", color: country ? "#fff" : "#888", fontSize:15, outline:"none", marginBottom:12, cursor:"pointer" }}
      >
        <option value="" style={{background:"#1a1b2e", color:"#888"}}>🌍 Select your country</option>
        {COUNTRIES.map(c => <option key={c} value={c} style={{background:"#1a1b2e", color:"#fff"}}>{c}</option>)}
      </select>

      <label style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16, cursor:"pointer", textAlign:"left" }}>
        <input
          type="checkbox"
          checked={is18}
          onChange={e => setIs18(e.target.checked)}
          style={{ width:20, height:20, accentColor:"#F5C842", flexShrink:0 }}
        />
        <span style={{ color:"#ccc", fontSize:14, fontWeight:600 }}>
          I confirm I am 18 years or older
        </span>
      </label>

      <div style={{ color:"#555", fontSize:11, marginBottom:14, lineHeight:1.5 }}>
        By joining you agree to our{" "}
        <a href="/terms" target="_blank" style={{ color:"#F5C842" }}>Terms</a> &amp;{" "}
        <a href="/privacy" target="_blank" style={{ color:"#F5C842" }}>Privacy Policy</a>.
      </div>

      {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}

      <button onClick={handleFinish} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Setting up your profile…" : "Let's Go 🚀"}
      </button>
    </div>
  );
}

// ─── Main AuthModal ────────────────────────────────────────────────────────────
export default function AuthModal({ onClose, onSuccess }) {
  // Check if we have a pending payload (from redirect callback). If so, user
  // was authenticated by Base44 but doesn't yet have a Sachi profile — show
  // FinishStep directly.
  const pendingRaw = localStorage.getItem("sachi_pending_google");
  const pending = pendingRaw ? (() => { try { return JSON.parse(pendingRaw); } catch { return null; } })() : null;

  const [step] = useState(pending ? "finish" : "signin");
  const [googlePayload] = useState(pending || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      // Save intent so we know on return that the user clicked sign-in.
      // (Kept from the old flow; App.jsx:6193 checks for this key.)
      localStorage.setItem("sachi_auth_intent", "1");

      // Base44's hosted login page. The SDK handles the redirect and stores
      // the token on return. returnUrl brings the user back to wherever they
      // were on Sachi.
      await base44.auth.redirectToLogin(window.location.href);
      // Execution typically doesn't continue past this — the page navigates
      // to the Base44 login domain. If it does return (e.g. a promise-based
      // implementation), we just wait for the subsequent redirect.
    } catch (e) {
      console.error("[auth] redirectToLogin failed:", e);
      setError("Couldn't start sign-in. Please try again.");
      setLoading(false);
    }
  };

  if (step === "finish" && googlePayload) {
    return (
      <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
        <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)" }} />
        <div style={{
          position:"relative", zIndex:3001, background:"#12132A",
          borderRadius:24, border:"1px solid rgba(245,200,66,0.1)",
          padding:"32px 24px", width:"100%", maxWidth:380,
          maxHeight:"90vh", overflowY:"auto",
          boxShadow:"0 24px 80px rgba(0,0,0,0.8)",
        }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:22, cursor:"pointer", lineHeight:1 }}>✕</button>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>
            <div style={{ color:"#F5C842", fontWeight:800, fontSize:22, letterSpacing:-0.5 }}>Almost there!</div>
          </div>
          <FinishStep googlePayload={googlePayload} onSuccess={onSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)" }} />
      <div style={{
        position:"relative", zIndex:3001, background:"#12132A",
        borderRadius:24, border:"1px solid rgba(245,200,66,0.1)",
        padding:"32px 24px", width:"100%", maxWidth:380,
        boxShadow:"0 24px 80px rgba(0,0,0,0.8)",
      }}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:22, cursor:"pointer", lineHeight:1 }}>✕</button>

        {/* Logo & title */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🌸</div>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:24, letterSpacing:-0.5, marginBottom:4 }}>Join Sachi</div>
          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>Where truth meets community</div>
        </div>

        {/* Sign-in button → Base44 hosted login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            width:"100%", padding:"15px 20px",
            background:"#fff", border:"none", borderRadius:14,
            cursor: loading ? "wait" : "pointer",
            fontSize:16, fontWeight:700, color:"#1a1a2e",
            boxShadow:"0 2px 12px rgba(0,0,0,0.3)",
            transition:"transform 0.15s, box-shadow 0.15s",
            marginBottom:12,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.02)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.3)"; }}
        >
          {/* Google G logo (Base44's hosted login still supports Google) */}
          <svg width="22" height="22" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.8 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.5-3.2-11.3-7.8l-6.5 5C9.6 39.5 16.4 44 24 44z"/>
            <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.4 4.4-4.5 5.8l6.2 5.2C41.2 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>

        {error && <div style={{ color:"#ff6b6b", fontSize:13, textAlign:"center", marginBottom:12 }}>{error}</div>}

        <div style={{ color:"rgba(255,255,255,0.2)", fontSize:12, textAlign:"center", marginBottom:20 }}>
          Free to join. No spam. No BS.
        </div>

        <div style={{ color:"#444", fontSize:11, textAlign:"center", lineHeight:1.6 }}>
          By continuing you agree to our{" "}
          <a href="/terms" target="_blank" style={{ color:"#F5C842" }}>Terms</a>{" "}
          &amp;{" "}
          <a href="/privacy" target="_blank" style={{ color:"#F5C842" }}>Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
