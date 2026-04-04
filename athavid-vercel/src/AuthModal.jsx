import { useState, useEffect } from "react";
import { auth } from "./api.js";

// ─── Google One Tap ────────────────────────────────────────────────────────────
// Replace this placeholder with your real Google OAuth Client ID from:
// console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client ID
const GOOGLE_CLIENT_ID = "REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID";

function GoogleOneTap({ onSuccess }) {
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID") return;

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            // Decode the JWT to get user info
            const payload = JSON.parse(atob(response.credential.split(".")[1]));
            const { email, name, picture, sub } = payload;

            // Try to sign in first, if fails create account
            try {
              const loginData = await auth.signIn(email, `google_${sub}`);
              const user = loginData.user || auth.getUser();
              onSuccess(user);
            } catch {
              // Account doesn't exist — create it
              try {
                await auth.signUp(email, `google_${sub}`, name || email.split("@")[0]);
                // Auto-verify (skip OTP for Google users)
                try { await auth.verifyOtp(email, "google_verified"); } catch {}
                const loginData = await auth.signIn(email, `google_${sub}`);
                const user = loginData.user || auth.getUser();
                // Save avatar from Google
                if (picture && user) {
                  try {
                    await fetch(`https://sachi-c7f0261c.base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/entities/AthaVidUser/${user.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.getToken()}` },
                      body: JSON.stringify({ avatar_url: picture }),
                    });
                  } catch {}
                }
                onSuccess(user);
              } catch (e) {
                console.error("Google signup failed:", e);
              }
            }
          } catch (e) {
            console.error("Google One Tap error:", e);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "filled_black",
          size: "large",
          width: 320,
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
        }
      );
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID") return null;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: 16 }}>
      <div id="google-signin-btn" />
    </div>
  );
}

// ─── Main Auth Modal ───────────────────────────────────────────────────────────
export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("signup");
  const [step, setStep] = useState("form"); // form | otp | forgot | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    if (mode === "signup" && !agreedToTerms) return setError("You must agree to the Terms of Service and Privacy Policy to create an account.");
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
        onSuccess(user);
      } else {
        await auth.signUp(email, password, name || email.split("@")[0], { date_of_birth: dob });
        // Store DOB in localStorage for age-gating
        localStorage.setItem("sachi_dob", dob);
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
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(245,200,66,0.15)",
    borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 15,
    outline: "none", marginBottom: 12,
  };

  const btn = {
    display: "block", width: "100%", padding: "14px 0",
    background: "linear-gradient(135deg,#F5C842,#FF9500)", border: "none",
    borderRadius: 14, color: "#0B0C1A", fontWeight: 800, fontSize: 16,
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
        position:"relative", zIndex:3001, background:"#12132A", borderRadius:24, border:"1px solid rgba(245,200,66,0.1)",
        padding:"28px 24px 32px", width:"100%", maxWidth:400, maxHeight:"90vh", overflowY:"auto",
      }}>

        {/* SIGN UP / LOG IN */}
        {step === "form" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>🎬</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:22, margin:"8px 0 4px" }}>Join Sachi</div>
              <div style={{ color:"#777", fontSize:14 }}>Your stage. Share with the world.</div>
            </div>

            {/* ── Google One Tap Button ── */}
            <GoogleOneTap onSuccess={onSuccess} />

            {/* ── Divider ── */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
              <span style={{ color:"#555", fontSize:12 }}>or continue with email</span>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.1)" }} />
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
              <>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} />
                <div style={{ marginBottom:4, color:"#888", fontSize:12 }}>Date of Birth <span style={{color:"#ff6b6b"}}>*</span></div>
                <input value={dob} onChange={e => setDob(e.target.value)} type="date"
                  max={new Date().toISOString().split("T")[0]}
                  style={{ ...inp, colorScheme:"dark" }} />
              </>
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
            {mode === "signup" && (
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:14, marginTop:4 }}>
                <div onClick={() => setAgreedToTerms(v => !v)}
                  style={{ width:22, height:22, borderRadius:6, border: agreedToTerms ? "none" : "2px solid rgba(255,255,255,0.3)",
                    background: agreedToTerms ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.06)",
                    display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, marginTop:1 }}>
                  {agreedToTerms && <span style={{ color:"#fff", fontSize:14, fontWeight:900 }}>✓</span>}
                </div>
                <div style={{ color:"#aaa", fontSize:13, lineHeight:1.6 }}>
                  I am 18 years or older. I have read and agree to the{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer"
                    style={{ color:"#ff8e53", textDecoration:"underline" }}>Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer"
                    style={{ color:"#ff8e53", textDecoration:"underline" }}>Privacy Policy</a>
                  , including that <strong style={{color:"#fff"}}>Sachi is not responsible or liable for content posted by other users.</strong>
                </div>
              </div>
            )}
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
            <button onClick={submitForm} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Please wait…" : mode==="signup" ? "Create Account" : "Log In"}
            </button>
          </>
        )}

        {/* OTP VERIFICATION */}
        {step === "otp" && (
          <>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:40 }}>📧</div>
              <div style={{ color:"#fff", fontWeight:900, fontSize:20, margin:"8px 0 6px" }}>Check your email</div>
              <div style={{ color:"#888", fontSize:14, lineHeight:1.6 }}>
                We sent a 6-digit code to<br/>
                <span style={{ color:"#F5C842", fontWeight:700 }}>{email}</span>
              </div>
            </div>
            <input autoFocus value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="Enter 6-digit code" type="number"
              onKeyDown={e => e.key==="Enter" && submitOtp()}
              style={{ ...inp, fontSize:22, textAlign:"center", letterSpacing:8 }} />
            {error && <div style={{ color:"#ff6b6b", fontSize:13, marginBottom:10, textAlign:"center" }}>{error}</div>}
            <button onClick={submitOtp} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Verifying…" : "Verify & Enter Sachi"}
            </button>
            <button onClick={() => { setStep("form"); setError(""); }} style={backBtn}>← Back</button>
          </>
        )}

        {/* FORGOT PASSWORD */}
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

        {/* RESET PASSWORD */}
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
              {loading ? "Resetting…" : "Set New Password"}
            </button>
            <button onClick={() => { setStep("form"); setError(""); }} style={backBtn}>← Back to Log In</button>
          </>
        )}

      </div>
    </div>
  );
}
