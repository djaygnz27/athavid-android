import { useState } from "react";
import { auth } from "./api.js";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("form"); // form | otp | forgot | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitForgot = async () => {
    if (!email) return setError("Enter your email address.");
    setLoading(true); setError("");
    try {
      await auth.forgotPassword(email);
      setStep("reset");
    } catch (e) {
      setError(e.message || "Could not send reset email.");
    } finally { setLoading(false); }
  };

  const submitReset = async () => {
    if (!resetToken || !newPassword) return setError("Enter the reset token and your new password.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    try {
      await auth.resetPassword(email, resetToken, newPassword);
      setStep("form");
      setMode("login");
      setError("");
      setResetToken(""); setNewPassword("");
      alert("✅ Password reset! Please log in with your new password.");
    } catch (e) {
      setError(e.message || "Invalid token. Try again.");
    } finally { setLoading(false); }
  };

  const submitForm = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      if (mode === "login") {
        const loginData = await auth.signIn(email, password);
        const user = loginData.user || auth.getUser();
        onSuccess(user);
      } else {
        await auth.signUp(email, password, name || email.split("@")[0]);
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
    display: "block", width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 15,
    outline: "none", marginBottom: 12,
  };

  const btn = {
    display: "block", width: "100%", padding: "14px 0",
    background: "linear-gradient(135deg,#ff6b6b,#ff8e53)", border: "none",
    borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16,
    cursor: "pointer", marginBottom: 10,
  };

  const backBtn = {
    display: "block", width: "100%", padding: "10px 0", background: "none",
    border: "none", color: "#555", fontSize: 13, cursor: "pointer",
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)" }} />
      <div style={{
        position:"relative", zIndex:3001, background:"#0f0f1a", borderRadius:24,
        padding:"28px 24px 32px", width:"100%", maxWidth:400, maxHeight:"90vh", overflowY:"auto",
      }}>

        {/* SIGN UP / LOG IN */}
        {step === "form" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, margin:"8px 0 4px" }}>Join Sachi</div>
              <div style={{ color:"#777", fontSize:14 }}>Create an account to post videos</div>
            </div>
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
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} />
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" style={inp} />
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
              onKeyDown={e => e.key==="Enter" && submitForm()} style={inp} />
            {mode === "login" && (
              <button onClick={() => { setStep("forgot"); setError(""); }}
                style={{ display:"block", width:"100%", textAlign:"right", background:"none", border:"none",
                  color:"#ff8e53", fontSize:13, cursor:"pointer", marginTop:-8, marginBottom:8, padding:0 }}>
                Forgot password?
              </button>
            )}
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
            <button onClick={submitForm} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : mode==="signup" ? "Create Account" : "Log In"}
            </button>
          </>
        )}

        {/* FORGOT PASSWORD — enter email */}
        {step === "forgot" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>🔑</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 6px" }}>Reset Password</div>
              <div style={{ color:"#888", fontSize:14 }}>Enter your email and we'll send a reset link</div>
            </div>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
              onKeyDown={e => e.key==="Enter" && submitForgot()} style={inp} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
            <button onClick={submitForgot} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
            <button onClick={() => { setStep("form"); setError(""); }} style={backBtn}>← Back to Log In</button>
          </>
        )}

        {/* RESET PASSWORD — enter token from email + new password */}
        {step === "reset" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>📧</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 6px" }}>Check your email</div>
              <div style={{ color:"#888", fontSize:13, lineHeight:1.6 }}>
                We sent a reset link to <span style={{ color:"#ff8e53", fontWeight:700 }}>{email}</span>.<br/>
                Copy the <strong style={{color:"#fff"}}>reset token</strong> from the link and paste it below.
              </div>
            </div>
            <input autoFocus value={resetToken} onChange={e => setResetToken(e.target.value.trim())}
              placeholder="Paste reset token here" style={{ ...inp, fontSize:13, letterSpacing:1 }} />
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="New password (min 6 chars)" type="password"
              onKeyDown={e => e.key==="Enter" && submitReset()} style={inp} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
            <button onClick={submitReset} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
            <button onClick={() => { setStep("forgot"); setError(""); setResetToken(""); }} style={backBtn}>← Back</button>
          </>
        )}

        {/* VERIFY EMAIL OTP after signup */}
        {step === "otp" && (
          <>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:40 }}>📧</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 6px" }}>Check your email</div>
              <div style={{ color:"#888", fontSize:14, lineHeight:1.6 }}>
                We sent a 6-digit code to<br/>
                <span style={{ color:"#ff8e53", fontWeight:700 }}>{email}</span>
              </div>
            </div>
            <input autoFocus value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
              placeholder="000000" inputMode="numeric" maxLength={6}
              onKeyDown={e => e.key==="Enter" && submitOtp()}
              style={{ display:"block", width:"100%", boxSizing:"border-box",
                background:"rgba(255,255,255,0.08)", border:"2px solid rgba(255,140,83,0.6)",
                borderRadius:16, padding:"18px 0", color:"#fff", fontSize:36,
                fontWeight:800, letterSpacing:12, textAlign:"center", outline:"none", marginBottom:16 }} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
            <button onClick={submitOtp} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying…" : "Verify Email"}
            </button>
            <button onClick={() => auth.resendOtp(email).catch(() => {})}
              style={{ display:"block", width:"100%", padding:"8px 0", background:"none",
                border:"none", color:"#ff8e53", fontSize:13, cursor:"pointer" }}>
              Resend code
            </button>
          </>
        )}

      </div>
    </div>
  );
}
