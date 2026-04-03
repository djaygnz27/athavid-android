import { useState, useEffect } from "react";

export default function Landing({ onEnter }) {
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 2800);
    const t2 = setTimeout(() => onEnter(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0B0C1A",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: "opacity 0.7s ease",
      opacity: phase === "out" ? 0 : 1,
    }}>
      <style>{`
        @keyframes starRise {
          from { opacity:0; transform:scale(0.5) rotate(-15deg); }
          to   { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes wordIn {
          from { opacity:0; transform:translateY(20px); letter-spacing: 8px; }
          to   { opacity:1; transform:translateY(0); letter-spacing: -1px; }
        }
        @keyframes tagIn {
          from { opacity:0; }
          to   { opacity:0.5; }
        }
        @keyframes glowRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,200,66,0.0), 0 0 40px rgba(245,200,66,0.15); }
          50%       { box-shadow: 0 0 0 18px rgba(245,200,66,0.0), 0 0 80px rgba(245,200,66,0.3); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .sachi-logo-icon {
          animation: starRise 0.8s cubic-bezier(0.34,1.56,0.64,1) both, glowRing 2.5s ease-in-out 0.8s infinite;
        }
        .sachi-word {
          animation: wordIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both;
        }
        .sachi-tag {
          animation: tagIn 1s ease 1.2s both;
        }
      `}</style>

      {/* Logo — gold star diamond */}
      <div className="sachi-logo-icon" style={{
        width: 96, height: 96, borderRadius: 28,
        background: "linear-gradient(145deg, #1A1B30, #232440)",
        border: "1.5px solid rgba(245,200,66,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 32,
      }}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.4 9.6H22.4L16 14.4L18.4 22L12 17.2L5.6 22L8 14.4L1.6 9.6H9.6L12 2Z"
            fill="url(#goldGrad)" stroke="none"/>
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C842"/>
              <stop offset="100%" stopColor="#FF9500"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      <div className="sachi-word" style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 62, fontWeight: 900, lineHeight: 1,
          background: "linear-gradient(135deg, #F5C842 0%, #FFD580 40%, #FF9500 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -1,
          animation: "shimmer 3s linear 1s infinite",
        }}>
          sachi
        </div>
      </div>

      {/* Tagline */}
      <div className="sachi-tag" style={{
        marginTop: 18, color: "rgba(255,255,255,0.4)", fontSize: 13,
        letterSpacing: 3, textTransform: "uppercase", fontWeight: 500
      }}>
        Share Everything
      </div>

      {/* Bottom dots */}
      <div className="sachi-tag" style={{ position:"absolute", bottom:48, display:"flex", gap:6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: i===0 ? 20 : 6, height: 6, borderRadius: 99,
            background: i===0 ? "#F5C842" : "rgba(255,255,255,0.15)",
            transition: "all 0.3s"
          }} />
        ))}
      </div>
    </div>
  );
}
