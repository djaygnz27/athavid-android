
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
import { useState, useEffect } from "react";
import { auth } from "./api.js";

const GOOGLE_CLIENT_ID = "200749117149-l9litb11sb8aanco05im228chukbf0o6.apps.googleusercontent.com";
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

// ─── Google Finish Step (username + dob + 18+ confirm) ───────────────────────
function GoogleFinishStep({ googlePayload, onSuccess }) {
  const { email, name, picture, sub } = googlePayload;
  const suggestedUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").toLowerCase();

  const [username, setUsername] = useState(suggestedUsername);
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
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
    display:"block", width:"100%", padding:"12px 0",
    background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none",
    borderRadius:14, color:"#0B0C1A", fontWeight:800, fontSize:16,
    cursor:"pointer", marginBottom:10,
  };

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
      // Check if user already exists
      let existingUsers;
      try {
        const res = await fetch(
          `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(email)}&limit=5`,
          { headers: { "Content-Type": "application/json" } }
        );
        existingUsers = await res.json();
      } catch { existingUsers = []; }

      const items = Array.isArray(existingUsers) ? existingUsers : (existingUsers?.items || []);
      let sachiUser = items.find(u => u.email === email);

      if (!sachiUser) {
        // Create new profile
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
            })
          }
        ).then(r => r.json());
        sachiUser = created;
      }

      localStorage.setItem("sachi_dob", dob);
      if (country) localStorage.setItem("sachi_country", country);

      const sessionUser = {
        id: sachiUser.id || sachiUser.created_by,
        email,
        full_name: name || sachiUser.display_name,
        avatar_url: picture || sachiUser.avatar_url,
        _google: true,
        _sachiProfileId: sachiUser.id,
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
      {/* Google profile preview */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:20 }}>
        {picture && <img src={picture} style={{ width:72, height:72, borderRadius:"50%", border:"3px solid #F5C842", marginBottom:10 }} />}
        <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>{name}</div>
        <div style={{ color:"#888", fontSize:13 }}>{email}</div>
        <div style={{ background:"rgba(80,200,80,0.12)", border:"1px solid rgba(80,200,80,0.3)", borderRadius:20, padding:"4px 14px", marginTop:8, color:"#6fcf6f", fontSize:12, fontWeight:700 }}>
          ✓ Verified with Google
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
        Where are you from? <span style={{color:"#888", fontSize:11}}>(optional)</span>
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

      {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12 }}>{error}</div>}

      <button onClick={handleFinish} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Setting up your profile…" : "Let's Go 🚀"}
      </button>
    </div>
  );
}

// ─── Google One Tap Button ─────────────────────────────────────────────────────
function GoogleOneTap({ onGoogleVerified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "filled_black", size: "large", width: 320, text: "continue_with", shape: "pill", logo_alignment: "left" }
      );
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);

  const handleCredential = async (response) => {
    setLoading(true); setError("");
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]));

      // Check if returning user (already has a profile)
      let existingUsers;
      try {
        const res = await fetch(
          `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(payload.email)}&limit=5`,
          { headers: { "Content-Type": "application/json" } }
        );
        existingUsers = await res.json();
      } catch { existingUsers = []; }

      const items = Array.isArray(existingUsers) ? existingUsers : (existingUsers?.items || []);
      const sachiUser = items.find(u => u.email === payload.email);

      if (sachiUser) {
        // Returning user — log straight in, no extra steps
        const sessionUser = {
          id: sachiUser.id,
          email: payload.email,
          full_name: payload.name || sachiUser.display_name,
          avatar_url: payload.picture || sachiUser.avatar_url,
          _google: true,
          _sachiProfileId: sachiUser.id,
        };
        localStorage.setItem("sachi_google_user", JSON.stringify(sessionUser));
        localStorage.setItem("sachi_user", JSON.stringify(sessionUser));
        onGoogleVerified({ payload, existingUser: sessionUser });
      } else {
        // New user — show finish step
        onGoogleVerified({ payload, existingUser: null });
      }
    } catch(e) {
      console.error(e);
      setError("Sign-in failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", marginBottom:16 }}>
      {loading && <div style={{ color:"#F5C842", fontSize:13, marginBottom:8 }}>Signing you in…</div>}
      {error && <div style={{ color:"#ff6b6b", fontSize:12, marginBottom:8 }}>{error}</div>}
      <div id="google-signin-btn" />
    </div>
  );
}

// ─── Main Auth Modal ───────────────────────────────────────────────────────────
export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("form"); // form | otp | forgot | reset | google_finish
  const [googlePayload, setGooglePayload] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleGoogleVerified = ({ payload, existingUser }) => {
    if (existingUser) {
      // Returning user — straight in
      onSuccess(existingUser);
    } else {
      // New user — show the finish step
      setGooglePayload(payload);
      setStep("google_finish");
    }
  };

  const submitForgot = async () => {
    if (!email) return setError("Enter your email address.");
    setLoading(true); setError("");
    try {
      await auth.forgotPassword(email);
      setStep("reset");
    } catch (e) { setError(e.message || "Could not send reset email."); }
    finally { setLoading(false); }
  };

  const submitReset = async () => {
    if (!resetToken || !newPassword) return setError("Enter the reset token and your new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    try {
      await auth.resetPassword(email, resetToken, newPassword);
      setStep("form"); setMode("login"); setError(""); setResetToken(""); setNewPassword("");
      alert("✅ Password reset! Please log in with your new password.");
    } catch (e) { setError(e.message || "Invalid token. Try again."); }
    finally { setLoading(false); }
  };

  const submitForm = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    if (mode === "signup" && !agreedToTerms) return setError("Please confirm you are 18 years or older.");
    if (mode === "signup" && !dob) return setError("Please enter your date of birth.");
    if (mode === "signup") {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 13) return setError("You must be at least 13 years old to join Sachi.");
    }
    setLoading(true); setError("");
    try {
      if (mode === "login") {
        const loginData = await auth.signIn(email, password);
        const user = loginData.user || auth.getUser();
        // If returning user has no location saved, prompt them
        const hasLocation = localStorage.getItem("sachi_country_code") || localStorage.getItem("sachi_country");
        if (!hasLocation) {
          setStep("location_prompt");
          setLoading(false);
          // store user so we can call onSuccess after
          window._sachiPendingUser = user;
          return;
        }
        onSuccess(user);
      } else {
        await auth.signUp(email, password, name || email.split("@")[0], { date_of_birth: dob });
        localStorage.setItem("sachi_dob", dob);
        setStep("country");
      }
    } catch (e) { setError(e.message || "Something went wrong."); }
    finally { setLoading(false); }
  };

  const submitOtp = async () => {
    const code = otp.trim();
    if (!code) return setError("Enter the code from your email.");
    setLoading(true); setError("");
    try {
      await auth.verifyOtp(email, code);
      onSuccess(auth.getUser());
    } catch (e) { setError(e.message || "Invalid code. Try again."); }
    finally { setLoading(false); }
  };

  const inp = {
    display:"block", width:"100%", boxSizing:"border-box",
    background:"rgba(255,255,255,0.08)", border:"1px solid rgba(245,200,66,0.15)",
    borderRadius:12, padding:"14px 16px", color:"#fff", fontSize:15,
    outline:"none", marginBottom:12,
  };
  const btn = {
    display:"block", width:"100%", padding:"14px 0",
    background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none",
    borderRadius:14, color:"#0B0C1A", fontWeight:800, fontSize:16,
    cursor:"pointer", marginBottom:10,
  };
  const backBtn = { display:"block", width:"100%", padding:"10px 0", background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)" }} />
      <div style={{
        position:"relative", zIndex:3001, background:"#12132A", borderRadius:24, border:"1px solid rgba(245,200,66,0.1)",
        padding:"20px 20px 24px", width:"100%", maxWidth:400, maxHeight:"92vh", overflowY:"auto",
      }}>

        {/* ── Google Finish Step ── */}
        {step === "google_finish" && googlePayload && (
          <GoogleFinishStep googlePayload={googlePayload} onSuccess={onSuccess} />
        )}

        {/* ── Main Form ── */}
        {step === "form" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, margin:"8px 0 4px" }}>Join Sachi</div>
              <div style={{ color:"#777", fontSize:14 }}>Your stage. Share with the world.</div>
            </div>

            <GoogleOneTap onGoogleVerified={handleGoogleVerified} />

            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
              <span style={{ color:"#555", fontSize:12 }}>or continue with email</span>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
            </div>

            <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:4, marginBottom:12 }}>
              {["signup","login"].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  style={{ flex:1, padding:"10px 0", border:"none", borderRadius:10, cursor:"pointer",
                    fontWeight:700, fontSize:14,
                    background: mode===m ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "transparent",
                    color: mode===m ? "#fff" : "#666" }}>
                  {m==="signup" ? "Sign Up" : "Log In"}
                </button>
              ))}
            </div>

            {mode==="signup" && (
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} />
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={inp}
              onKeyDown={e => e.key==="Enter" && submitForm()} />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars)" type="password" style={inp}
              onKeyDown={e => e.key==="Enter" && submitForm()} />
            {mode==="signup" && (
              <>
                <div style={{ marginBottom:4, color:"#888", fontSize:12 }}>Birthday <span style={{color:"#ff6b6b"}}>*</span></div>
                <input value={dob} onChange={e => setDob(e.target.value)} type="date"
                  max={new Date().toISOString().slice(0,10)} style={{ ...inp, colorScheme:"dark" }} />
                <label style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12, cursor:"pointer" }}>
                  <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                    style={{ width:20, height:20, accentColor:"#F5C842", flexShrink:0 }} />
                  <span style={{ color:"#ccc", fontSize:14, fontWeight:600 }}>I confirm I am 18 years or older</span>
                </label>
                <div style={{ color:"#555", fontSize:11, marginBottom:14, lineHeight:1.5 }}>
                  By signing up you agree to our{" "}
                  <a href="/terms" target="_blank" style={{ color:"#F5C842" }}>Terms</a> &amp;{" "}
                  <a href="/privacy" target="_blank" style={{ color:"#F5C842" }}>Privacy Policy</a>.
                </div>
              </>
            )}

            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}
            <button onClick={submitForm} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : mode==="signup" ? "Create Account" : "Log In"}
            </button>
            {mode==="login" && (
              <button onClick={() => { setStep("forgot"); setError(""); }} style={backBtn}>Forgot password?</button>
            )}
            <button onClick={onClose} style={backBtn}>Cancel</button>
          </>
        )}

        {/* ── Country Step ── */}
        {step === "country" && (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:40 }}>🌍</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, margin:"8px 0 4px" }}>Where are you from?</div>
              <div style={{ color:"#777", fontSize:14 }}>We'll add your flag and city to your posts</div>
            </div>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={{ display:"block", width:"100%", boxSizing:"border-box", background:"#1a1b2e", border:"2px solid rgba(245,200,66,0.4)", borderRadius:14, padding:"16px", color: country ? "#fff" : "#888", fontSize:16, outline:"none", marginBottom:16, cursor:"pointer" }}
            >
              <option value="" style={{background:"#1a1b2e", color:"#888"}}>Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c} style={{background:"#1a1b2e", color:"#fff"}}>{c}</option>)}
            </select>

            {/* Location permission request */}
            <div style={{ background:"rgba(245,200,66,0.07)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:14, padding:"14px 16px", marginBottom:18 }}>
              <div style={{ color:"#F5C842", fontWeight:800, fontSize:14, marginBottom:6 }}>📍 Enable precise location?</div>
              <div style={{ color:"#888", fontSize:12, marginBottom:12, lineHeight:1.5 }}>
                Show your city on every post — like <strong style={{color:"#fff"}}>📍 New York, US</strong>. You can change this anytime.
              </div>
              <button onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      // Save that location was granted
                      localStorage.setItem("sachi_location_granted", "true");
                      // Reverse geocode to get country/region
                      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
                        .then(r => r.json())
                        .then(data => {
                          const addr = data.address || {};
                          const detectedCountry = addr.country || "";
                          const region = addr.state || addr.city || addr.county || "";
                          if (detectedCountry && !country) setCountry(detectedCountry);
                          localStorage.setItem("sachi_region", region);
                          if (addr.country_code) localStorage.setItem("sachi_country_code", addr.country_code.toUpperCase());
                        }).catch(()=>{});
                    },
                    () => { /* denied — no problem */ },
                    { timeout: 8000 }
                  );
                }
              }}
                style={{ width:"100%", padding:"11px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:11, color:"#0B0C1A", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                📍 Yes, show my location on posts
              </button>
            </div>

            <button onClick={() => { if (country) localStorage.setItem("sachi_country", country); setStep("otp"); }}
              style={{ display:"block", width:"100%", padding:"14px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#0B0C1A", fontWeight:800, fontSize:16, cursor:"pointer", marginBottom:10 }}>
              {country ? "Continue →" : "Skip for now"}
            </button>
          </>
        )}

        {/* ── Location Prompt (shown after login if no location saved) ── */}
        {step === "location_prompt" && (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:44 }}>📍</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, margin:"8px 0 4px" }}>Where are you posting from?</div>
              <div style={{ color:"#777", fontSize:14 }}>We'll add your flag to your posts. You can skip this.</div>
            </div>

            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={{ display:"block", width:"100%", boxSizing:"border-box", background:"#1a1b2e", border:"2px solid rgba(245,200,66,0.4)", borderRadius:14, padding:"16px", color: country ? "#fff" : "#888", fontSize:16, outline:"none", marginBottom:16, cursor:"pointer" }}
            >
              <option value="" style={{background:"#1a1b2e", color:"#888"}}>🌍 Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c} style={{background:"#1a1b2e", color:"#fff"}}>{c}</option>)}
            </select>

            <div style={{ background:"rgba(245,200,66,0.07)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ color:"#F5C842", fontWeight:800, fontSize:14, marginBottom:6 }}>📍 Or use my precise location</div>
              <div style={{ color:"#888", fontSize:12, marginBottom:10, lineHeight:1.5 }}>Auto-detects your city — shows as <strong style={{color:"#fff"}}>📍 New York, US</strong> on posts.</div>
              <button onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
                        .then(r => r.json())
                        .then(data => {
                          const addr = data.address || {};
                          const code = addr.country_code ? addr.country_code.toUpperCase() : null;
                          const region = addr.state || addr.city || addr.county || null;
                          if (code) { localStorage.setItem("sachi_country_code", code); setCountry(addr.country || code); }
                          if (region) localStorage.setItem("sachi_region", region);
                          const u = window._sachiPendingUser; delete window._sachiPendingUser;
                          onSuccess(u);
                        }).catch(() => { const u = window._sachiPendingUser; delete window._sachiPendingUser; onSuccess(u); });
                    },
                    () => {},
                    { timeout: 8000 }
                  );
                }
              }} style={{ width:"100%", padding:"11px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:11, color:"#0B0C1A", fontWeight:800, fontSize:14, cursor:"pointer" }}>
                📍 Use My Location
              </button>
            </div>

            <button onClick={() => {
              if (country) localStorage.setItem("sachi_country", country);
              const u = window._sachiPendingUser; delete window._sachiPendingUser;
              onSuccess(u);
            }} style={{ display:"block", width:"100%", padding:"14px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)", border:"none", borderRadius:14, color:"#0B0C1A", fontWeight:800, fontSize:16, cursor:"pointer", marginBottom:10 }}>
              {country ? "Save & Continue →" : "Skip for now"}
            </button>
          </>
        )}

        {/* ── OTP Step ── */}
        {step === "otp" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>📧</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 4px" }}>Check your email</div>
              <div style={{ color:"#777", fontSize:13 }}>We sent a verification code to<br/><strong style={{color:"#F5C842"}}>{email}</strong></div>
            </div>
            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter verification code" style={inp}
              onKeyDown={e => e.key==="Enter" && submitOtp()} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}
            <button onClick={submitOtp} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying…" : "Verify & Join"}
            </button>
            <button onClick={() => auth.resendOtp(email).catch(()=>{})} style={backBtn}>Resend code</button>
            <button onClick={() => { setStep("form"); setError(""); }} style={backBtn}>← Back</button>
          </>
        )}

        {/* ── Forgot Password ── */}
        {step === "forgot" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:36 }}>🔑</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 4px" }}>Reset Password</div>
              <div style={{ color:"#777", fontSize:13 }}>Enter your email and we'll send a reset code</div>
            </div>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" type="email" style={inp}
              onKeyDown={e => e.key==="Enter" && submitForgot()} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}
            <button onClick={submitForgot} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Sending…" : "Send Reset Code"}
            </button>
            <button onClick={() => { setStep("form"); setError(""); }} style={backBtn}>← Back to Login</button>
          </>
        )}

        {/* ── Reset Password ── */}
        {step === "reset" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:36 }}>🔐</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 4px" }}>Set New Password</div>
              <div style={{ color:"#777", fontSize:13 }}>Enter the code from your email</div>
            </div>
            <input value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Reset code" style={inp} />
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" type="password" style={inp}
              onKeyDown={e => e.key==="Enter" && submitReset()} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}
            <button onClick={submitReset} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
            <button onClick={() => { setStep("form"); setError(""); }} style={backBtn}>← Back</button>
          </>
        )}

      </div>
    </div>
  );
}
