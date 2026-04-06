
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

const GOOGLE_CLIENT_ID = "200749117149-l9litb11sb8aanco05im228chukbf0o6.apps.googleusercontent.com";
const APP_ID = "69b2ee18a8e6fb58c7f0261c";
const BASE_URL = "https://sachi-c7f0261c.base44.app/api";

// ─── Finish Step: new Google users pick username, dob, country ────────────────
function FinishStep({ googlePayload, onSuccess }) {
  const { email, name, picture } = googlePayload;
  const suggested = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g,"").toLowerCase();

  const [username, setUsername] = useState(suggested);
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
    display:"block", width:"100%", padding:"14px 0",
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

      localStorage.setItem("sachi_dob", dob);
      if (country) localStorage.setItem("sachi_country", country);

      const sessionUser = {
        id: created.id,
        email,
        full_name: name || username.trim(),
        avatar_url: picture || "",
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

// ─── Google Sign-In Button ────────────────────────────────────────────────────
function GoogleSignInButton({ onVerified }) {
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
    setError("");
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]));

      // Check for existing Sachi profile
      let existingUser = null;
      try {
        const res = await fetch(
          `${BASE_URL}/apps/${APP_ID}/entities/AthaVidUser?email=${encodeURIComponent(payload.email)}&limit=5`,
          { headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data?.items || []);
        const found = items.find(u => u.email === payload.email);
        if (found) {
          existingUser = {
            id: found.id,
            email: found.email,
            full_name: found.display_name || payload.name,
            avatar_url: found.avatar_url || payload.picture,
            _google: true,
            _sachiProfileId: found.id,
          };
          localStorage.setItem("sachi_google_user", JSON.stringify(existingUser));
          localStorage.setItem("sachi_user", JSON.stringify(existingUser));
        }
      } catch {}

      onVerified({ payload, existingUser });
    } catch(e) {
      console.error(e);
      setError("Sign-in failed. Please try again.");
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <div id="google-signin-btn" style={{ minHeight:44 }} />
      {error && <div style={{ color:"#ff6b6b", fontSize:13 }}>{error}</div>}
    </div>
  );
}

// ─── Main Auth Modal ──────────────────────────────────────────────────────────
export default function AuthModal({ onClose, onSuccess }) {
  const [step, setStep] = useState("google"); // google | finish
  const [googlePayload, setGooglePayload] = useState(null);

  const handleVerified = ({ payload, existingUser }) => {
    if (existingUser) {
      onSuccess(existingUser);
    } else {
      setGooglePayload(payload);
      setStep("finish");
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)" }} />
      <div style={{
        position:"relative", zIndex:3001, background:"#12132A",
        borderRadius:24, border:"1px solid rgba(245,200,66,0.1)",
        padding:"28px 24px 32px", width:"100%", maxWidth:400,
        maxHeight:"92vh", overflowY:"auto",
      }}>

        {/* ── Google Sign-In ── */}
        {step === "google" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🌸</div>
            <div style={{ color:"#fff", fontWeight:900, fontSize:24, marginBottom:6 }}>Join Sachi</div>
            <div style={{ color:"#777", fontSize:14, marginBottom:28 }}>Your stage. Share your truth with the world.</div>

            <GoogleSignInButton onVerified={handleVerified} />

            <div style={{ color:"#555", fontSize:11, marginTop:20, lineHeight:1.6 }}>
              By continuing you agree to our{" "}
              <a href="/terms" target="_blank" style={{ color:"#F5C842" }}>Terms</a> &amp;{" "}
              <a href="/privacy" target="_blank" style={{ color:"#F5C842" }}>Privacy Policy</a>.
            </div>

            <button onClick={onClose} style={{ marginTop:16, background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer" }}>
              Maybe later
            </button>
          </div>
        )}

        {/* ── Finish Profile ── */}
        {step === "finish" && googlePayload && (
          <FinishStep googlePayload={googlePayload} onSuccess={onSuccess} />
        )}

      </div>
    </div>
  );
}
