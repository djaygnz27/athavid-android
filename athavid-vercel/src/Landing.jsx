import { useState, useEffect } from "react";

export default function Landing({ onEnter }) {
  const [phase, setPhase] = useState("in"); // "in" → "hold" → "out"

  useEffect(() => {
    // Hold for 2.5s then fade out and enter
    const t1 = setTimeout(() => setPhase("out"), 2500);
    const t2 = setTimeout(() => onEnter(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0a0a14",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: "opacity 0.7s ease",
      opacity: phase === "out" ? 0 : 1,
    }}>
      <style>{`
        @keyframes logoIn {
          from { opacity:0; transform:scale(0.6); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes textIn {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(255,107,107,0.4); }
          50%       { box-shadow: 0 0 80px rgba(255,107,107,0.7); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes tagIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>

      {/* Logo icon */}
      <div style={{
        width: 110, height: 110, borderRadius: 30,
        background: "linear-gradient(135deg,#ff6b6b,#ff8e53,#ff6b9d)",
        backgroundSize: "200% 200%",
        animation: "logoIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both, glowPulse 2s ease-in-out infinite, gradientShift 3s ease infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 52, marginBottom: 28,
      }}>
        🎬
      </div>

      {/* Welcome text */}
      <div style={{
        animation: "textIn 0.6s ease 0.3s both",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 14, color: "#888", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          Welcome to
        </div>
        <div style={{
          fontSize: 56, fontWeight: 900, lineHeight: 1,
          background: "linear-gradient(135deg,#ff6b6b,#ff8e53,#ff6b9d)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "gradientShift 3s ease infinite",
          letterSpacing: -1,
        }}>
          Sachi
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: 16, color: "#666", fontSize: 15, letterSpacing: 1,
        animation: "tagIn 0.8s ease 0.8s both"
      }}>
        Your Stage. Your Moment. 🔥
      </div>
    </div>
  );
}
