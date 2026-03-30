import { useState } from "react";
import { auth } from "./api.js";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signup"); // signup | login
  const [step, setStep] = useState("form");   // form | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitForm = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      if (mode === "login") {
        await auth.signIn(email, password);
        onSuccess(auth.getUser());
      } else {
        const res = await auth.signUp(email, password, name || email.split("@")[0]);
        // If OTP required, show OTP step
        if (res.requires_otp || res.message?.toLowerCase().includes("verify") || res.detail?.toLowerCase().includes("otp")) {
          setStep("otp");
        } else {
          // Direct signup worked
          const token = res.access_token || res.token;
          if (token) { auth.setToken(token); if (res.user) localStorage.setItem("sachi_user", JSON.stringify(res.user)); }
          onSuccess(auth.getUser() || res.user);
        }
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const submitOtp = async () => {
    if (!otp.trim()) return setError("Enter the code from your email.");
    setLoading(true); setError("");
    try {
      await auth.verifyOtp(email, otp.trim());
      onSuccess(auth.getUser());
    } catch (e) {
      setError(e.message || "Invalid code. Try again.");
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
    borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15, outline:"none",
    boxSizing:"border-box", marginBottom:12
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", padding:"24px 24px 48px", zIndex:3001 }}>
        <div style={{ width:40, height:4, background:"#333", borderRadius:99, margin:"0 auto 24px" }} />

        {step === "form" ? (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, marginBottom:4 }}>Join Sachi</div>
              <div style={{ color:"#666", fontSize:14 }}>Create an account to post videos</div>
            </div>

            {/* Tab */}
            <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:4, marginBottom:20 }}>
              {["signup","login"].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  style={{ flex:1, padding:"10px 0", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14,
                    background: mode === m ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "transparent",
                    color: mode === m ? "#fff" : "#666" }}>
                  {m === "signup" ? "Sign Up" : "Log In"}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={inputStyle} />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
              onKeyDown={e => e.key === "Enter" && submitForm()} style={inputStyle} />

            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}

            <button onClick={submitForm} disabled={loading}
              style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Log In"}
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📧</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, marginBottom:4 }}>Check your email</div>
              <div style={{ color:"#888", fontSize:14, lineHeight:1.5 }}>We sent a verification code to<br/><span style={{ color:"#ff8e53" }}>{email}</span></div>
            </div>

            <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit code"
              onKeyDown={e => e.key === "Enter" && submitOtp()}
              style={{ ...inputStyle, textAlign:"center", fontSize:24, letterSpacing:8, fontWeight:700 }} />

            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}

            <button onClick={submitOtp} disabled={loading}
              style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", opacity: loading ? 0.7 : 1, marginBottom:12 }}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button onClick={() => auth.resendOtp(email).catch(()=>{})}
              style={{ width:"100%", padding:12, background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, color:"#888", fontSize:14, cursor:"pointer" }}>
              Resend code
            </button>

            <button onClick={() => { setStep("form"); setError(""); setOtp(""); }}
              style={{ width:"100%", padding:10, background:"none", border:"none", color:"#555", fontSize:13, cursor:"pointer", marginTop:8 }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
