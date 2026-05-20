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

import React, { useState, useEffect, useCallback } from "react";

export const GOOGLE_CLIENT_ID = "124061688969-7ebbn8gph1ej84dli790clptp32gosdt.apps.googleusercontent.com";
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";
const FUNCTIONS_URL = "https://sachi-c7f0261c.base44.app/functions";

// ─── Helper: lookup existing Sachi profile by email ──────────────────────────
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

// ─── Helper: build session user object ───────────────────────────────────────
function buildSessionUser(found, payload) {
  return {
    id: found.id,
    email: found.email,
    full_name: found.display_name || payload?.name || found.email,
    avatar_url: found.avatar_url || payload?.picture || "",
    username: found.username || found.email.split("@")[0],
    _google: true,
    _sachiProfileId: found.id,
  };
}

// ─── Decode JWT payload ───────────────────────────────────────────────────────
function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
  } catch { return null; }
}

// ─── Google OAuth redirect URL builder ───────────────────────────────────────
function buildGoogleAuthUrl() {
  const origin = window.location.origin;
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: origin,
    response_type: "id_token",
    scope: "openid email profile",
    nonce: Math.random().toString(36).slice(2),
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// ─── Handle OAuth redirect return (call this on app boot) ────────────────────
export async function handleGoogleRedirectCallback() {
  const hash = window.location.hash;
  if (!hash || !hash.includes("id_token=")) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const idToken = params.get("id_token");
  if (!idToken) return null;
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  const payload = decodeJwt(idToken);
  if (!payload?.email) return null;
  localStorage.setItem("sachi_pending_google", JSON.stringify(payload));
  const found = await lookupSachiUser(payload.email);
  if (found) {
    const sessionUser = buildSessionUser(found, payload);
    localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
    localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
    localStorage.removeItem("sachi_pending_google");
    return { sessionUser, needsProfile: false };
  }
  return { payload, needsProfile: true };
}

// ─── Legacy no-op ─────────────────────────────────────────────────────────────
export function initGoogleOneTap() {}

// ─── Shared styles ────────────────────────────────────────────────────────────
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

// ─── Finish Step (shared by Google + Email new users) ────────────────────────
function FinishStep({ googlePayload, emailPayload, onSuccess }) {
  const isGoogle = !!googlePayload;
  const email = isGoogle ? googlePayload.email : emailPayload.email;
  const name = isGoogle ? googlePayload.name : "";
  const picture = isGoogle ? googlePayload.picture : "";
  const suggested = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").toLowerCase();

  const [username, setUsername] = useState(suggested);
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [is18, setIs18] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      localStorage.removeItem("sachi_pending_email");

      if (!created?.id) {
        setError("Profile creation failed. Please try again.");
        setLoading(false);
        return;
      }

      const sessionUser = {
        id: created.id,
        email,
        full_name: name || username.trim(),
        avatar_url: picture || "",
        username: username.trim().toLowerCase(),
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
        {name && <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>{name}</div>}
        <div style={{ color:"#888", fontSize:13 }}>{email}</div>
        <div style={{ background:"rgba(80,200,80,0.12)", border:"1px solid rgba(80,200,80,0.3)", borderRadius:20, padding:"4px 14px", marginTop:8, color:"#6fcf6f", fontSize:12, fontWeight:700 }}>
          ✓ Email verified
        </div>
      </div>

      <div style={{ color:"#aaa", fontSize:13, marginBottom:16 }}>Just a few more details to set up your profile:</div>

      <input value={username} onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,"").toLowerCase())} placeholder="Choose a username" style={inp} maxLength={30} />

      <div style={{ textAlign:"left", marginBottom:4, color:"#888", fontSize:12 }}>Birthday <span style={{color:"#ff6b6b"}}>*</span></div>
      <input value={dob} onChange={e => setDob(e.target.value)} type="date" max={new Date().toISOString().slice(0,10)} style={{ ...inp, colorScheme:"dark" }} />

      <div style={{ textAlign:"left", marginBottom:4, color:"#888", fontSize:12 }}>City <span style={{color:"#888", fontSize:11}}>(optional)</span></div>
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Sydney, Colombo, New York" style={inp} maxLength={60} />

      <div style={{ textAlign:"left", marginBottom:4, color:"#888", fontSize:12 }}>Country <span style={{color:"#888", fontSize:11}}>(optional)</span></div>
      <select value={country} onChange={e => setCountry(e.target.value)} style={{ display:"block", width:"100%", boxSizing:"border-box", background:"#1a1b2e", border:"1px solid rgba(245,200,66,0.3)", borderRadius:12, padding:"14px 16px", color: country ? "#fff" : "#888", fontSize:15, outline:"none", marginBottom:12, cursor:"pointer" }}>
        <option value="" style={{background:"#1a1b2e", color:"#888"}}>🌍 Select your country</option>
        {COUNTRIES.map(c => <option key={c} value={c} style={{background:"#1a1b2e", color:"#fff"}}>{c}</option>)}
      </select>

      <label style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16, cursor:"pointer", textAlign:"left" }}>
        <input type="checkbox" checked={is18} onChange={e => setIs18(e.target.checked)} style={{ width:20, height:20, accentColor:"#F5C842", flexShrink:0 }} />
        <span style={{ color:"#ccc", fontSize:14, fontWeight:600 }}>I confirm I am 18 years or older</span>
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

// ─── Email OTP Step ───────────────────────────────────────────────────────────
function EmailOTPStep({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const sendCode = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) return setError("Please enter a valid email address.");
    setLoading(true); setError("");
    try {
      const res = await fetch(`${FUNCTIONS_URL}/sendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to send code");
      setVerifiedEmail(trimmedEmail);
      setCodeSent(true);
      setResendTimer(60);
    } catch(e) {
      setError(e.message || "Could not send code. Please try again.");
    } finally { setLoading(false); }
  };

  const verifyCode = async () => {
    if (!code.trim() || code.trim().length !== 6) return setError("Please enter the 6-digit code.");
    setLoading(true); setError("");
    try {
      const res = await fetch(`${FUNCTIONS_URL}/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifiedEmail, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Verification failed");

      if (data.isNewUser) {
        // Store pending email for FinishStep
        localStorage.setItem("sachi_pending_email", JSON.stringify({ email: verifiedEmail }));
        setIsNewUser(true);
      } else {
        // Existing user — log them in
        const sessionUser = data.user;
        localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
        localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
        onSuccess(sessionUser);
      }
    } catch(e) {
      setError(e.message || "Invalid code. Please try again.");
    } finally { setLoading(false); }
  };

  // New user goes to profile setup
  if (isNewUser) {
    return <FinishStep emailPayload={{ email: verifiedEmail }} onSuccess={onSuccess} />;
  }

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:13, marginBottom:16, padding:0, display:"flex", alignItems:"center", gap:6 }}>
        ← Back
      </button>

      {!codeSent ? (
        <>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:20, marginBottom:6, textAlign:"center" }}>Sign in with Email</div>
          <div style={{ color:"#aaa", fontSize:13, marginBottom:20, textAlign:"center" }}>We'll send a 6-digit code to your inbox</div>

          <input
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            placeholder="Enter your email address"
            type="email"
            style={inp}
            onKeyDown={e => e.key === "Enter" && sendCode()}
            autoFocus
          />

          {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10 }}>{error}</div>}

          <button onClick={sendCode} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending code…" : "Send Code ✉️"}
          </button>
        </>
      ) : (
        <>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:20, marginBottom:6, textAlign:"center" }}>Check your inbox</div>
          <div style={{ color:"#aaa", fontSize:13, marginBottom:4, textAlign:"center" }}>Code sent to</div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:20, textAlign:"center" }}>{verifiedEmail}</div>

          <input
            value={code}
            onChange={e => { setCode(e.target.value.replace(/\D/g,"").slice(0,6)); setError(""); }}
            placeholder="000000"
            type="text"
            inputMode="numeric"
            maxLength={6}
            style={{ ...inp, fontSize:28, fontWeight:800, letterSpacing:10, textAlign:"center" }}
            onKeyDown={e => e.key === "Enter" && verifyCode()}
            autoFocus
          />

          {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10 }}>{error}</div>}

          <button onClick={verifyCode} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Verifying…" : "Verify & Continue →"}
          </button>

          <div style={{ textAlign:"center", marginTop:4 }}>
            {resendTimer > 0 ? (
              <span style={{ color:"#555", fontSize:13 }}>Resend in {resendTimer}s</span>
            ) : (
              <button onClick={sendCode} disabled={loading} style={{ background:"none", border:"none", color:"#F5C842", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                Resend code
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main AuthModal ────────────────────────────────────────────────────────────
export default function AuthModal({ onClose, onSuccess }) {
  const pendingGoogleRaw = localStorage.getItem("sachi_pending_google");
  const pendingEmailRaw = localStorage.getItem("sachi_pending_email");
  const pendingGoogle = pendingGoogleRaw ? (() => { try { return JSON.parse(pendingGoogleRaw); } catch { return null; } })() : null;
  const pendingEmail = pendingEmailRaw ? (() => { try { return JSON.parse(pendingEmailRaw); } catch { return null; } })() : null;

  const [step, setStep] = useState(
    pendingGoogle ? "finish-google" :
    pendingEmail ? "finish-email" :
    "signin"
  );
  const [googlePayload, setGooglePayload] = useState(pendingGoogle || null);
  const [loading, setLoading] = useState(false);

  const handleGoogleRedirect = () => {
    localStorage.setItem("sachi_auth_intent", "1");
    window.location.href = buildGoogleAuthUrl();
  };

  const modalShell = (children) => (
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
        {children}
      </div>
    </div>
  );

  if (step === "finish-google" && googlePayload) {
    return modalShell(
      <>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:22, letterSpacing:-0.5 }}>Almost there!</div>
        </div>
        <FinishStep googlePayload={googlePayload} onSuccess={onSuccess} />
      </>
    );
  }

  if (step === "finish-email" && pendingEmail) {
    return modalShell(
      <>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:22, letterSpacing:-0.5 }}>Almost there!</div>
        </div>
        <FinishStep emailPayload={pendingEmail} onSuccess={onSuccess} />
      </>
    );
  }

  if (step === "email-otp") {
    return modalShell(
      <>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>
        </div>
        <EmailOTPStep onSuccess={onSuccess} onBack={() => setStep("signin")} />
      </>
    );
  }

  // Default: sign in screen
  return modalShell(
    <>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🌸</div>
        <div style={{ color:"#F5C842", fontWeight:800, fontSize:24, letterSpacing:-0.5, marginBottom:4 }}>Join Sachi</div>
        <div style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>Where truth meets community</div>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleRedirect}
        disabled={loading}
        style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:12,
          width:"100%", padding:"15px 20px",
          background:"#fff", border:"none", borderRadius:14,
          cursor: loading ? "wait" : "pointer",
          fontSize:16, fontWeight:700, color:"#1a1a2e",
          boxShadow:"0 2px 12px rgba(0,0,0,0.3)",
          marginBottom:12,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.02)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
      >
        <svg width="22" height="22" viewBox="0 0 48 48">
          <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.8 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
          <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.6 16 19 12 24 12c3.1 0 5.8 1.1 8 2.9l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
          <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.5-3.2-11.3-7.8l-6.5 5C9.6 39.5 16.4 44 24 44z"/>
          <path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.4-2.4 4.4-4.5 5.8l6.2 5.2C41.2 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
        <div style={{ color:"#555", fontSize:12 }}>or</div>
        <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
      </div>

      {/* Email OTP Button */}
      <button
        onClick={() => setStep("email-otp")}
        style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:12,
          width:"100%", padding:"15px 20px",
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:14,
          cursor:"pointer", fontSize:16, fontWeight:700, color:"#fff",
          marginBottom:20,
        }}
        onMouseEnter={e => { e.currentTarget.style.background="rgba(245,200,66,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
      >
        ✉️ Continue with Email
      </button>

      <div style={{ color:"#444", fontSize:11, textAlign:"center", lineHeight:1.6 }}>
        By continuing you agree to our{" "}
        <a href="/terms" target="_blank" style={{ color:"#F5C842" }}>Terms</a>{" "}
        &amp;{" "}
        <a href="/privacy" target="_blank" style={{ color:"#F5C842" }}>Privacy Policy</a>.
      </div>
    </>
  );
}
