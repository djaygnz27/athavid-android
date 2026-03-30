import { useState } from "react";
import { auth } from "./api.js";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("form"); // form | otp
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
        // Registration returns a message about verification code
        setStep("otp");
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const submitOtp = async () => {
    const code = otp.trim();
    if (!code) return setError("Enter the code from your email.");
    setLoading(true); setError("");
    try {
      await auth.verifyOtp(email, code);
      onSuccess(auth.getUser());
    } catch (e) {
      setError(e.message || "Invalid code. Try again.");
    } finally { setLoading(false); }
  };

  const inp = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    marginBottom: 12,
  };

  const btn = {
    display: "block",
    width: "100%",
    padding: "14px 0",
    background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
    border: "none",
    borderRadius: 14,
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 10,
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      {/* backdrop */}
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)" }} />

      {/* card — centred, scrollable */}
      <div style={{
        position:"relative", zIndex:3001,
        background:"#0f0f1a", borderRadius:24,
        padding:"28px 24px 32px",
        width:"100%", maxWidth:400,
        maxHeight:"90vh", overflowY:"auto",
      }}>

        {step === "form" ? (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, margin:"8px 0 4px" }}>Join Sachi</div>
              <div style={{ color:"#777", fontSize:14 }}>Create an account to post videos</div>
            </div>

            {/* tabs */}
            <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:12, padding:4, marginBottom:18 }}>
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
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" style={inp} />
            )}
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" type="email" style={inp} />
            <input value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" type="password"
              onKeyDown={e => e.key==="Enter" && submitForm()} style={inp} />

            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}

            <button onClick={submitForm} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : mode==="signup" ? "Create Account" : "Log In"}
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:40 }}>📧</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 6px" }}>Check your email</div>
              <div style={{ color:"#888", fontSize:14, lineHeight:1.6 }}>
                We sent a 6-digit code to<br/>
                <span style={{ color:"#ff8e53", fontWeight:700 }}>{email}</span>
              </div>
            </div>

            {/* BIG OTP INPUT */}
            <input
              autoFocus
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
              onKeyDown={e => e.key==="Enter" && submitOtp()}
              style={{
                display:"block",
                width:"100%",
                boxSizing:"border-box",
                background:"rgba(255,255,255,0.08)",
                border:"2px solid rgba(255,140,83,0.6)",
                borderRadius:16,
                padding:"18px 0",
                color:"#fff",
                fontSize:36,
                fontWeight:800,
                letterSpacing:12,
                textAlign:"center",
                outline:"none",
                marginBottom:16,
              }}
            />

            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}

            <button onClick={submitOtp} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying…" : "Verify & Enter"}
            </button>

            <button onClick={() => auth.resendOtp(email).catch(()=>{})}
              style={{ display:"block", width:"100%", padding:"12px 0", background:"none",
                border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, color:"#888", fontSize:14, cursor:"pointer", marginBottom:8 }}>
              Resend code
            </button>

            <button onClick={() => { setStep("form"); setError(""); setOtp(""); }}
              style={{ display:"block", width:"100%", padding:"10px 0", background:"none",
                border:"none", color:"#555", fontSize:13, cursor:"pointer" }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
