import React, { useState, useEffect } from "react";

export default function Landing({ onEnter }) {
  const [phase, setPhase] = useState("idle");
  const [leaving, setLeaving] = useState(false);
  const [petals] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${6 + Math.random() * 5}s`,
      size: 7 + Math.random() * 9,
      rotation: Math.random() * 360,
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setPhase("in"), 80);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(() => onEnter(), 600);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "radial-gradient(ellipse at 50% 25%, #161830 0%, #0B0C1A 65%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      transition: "opacity 0.6s ease",
      opacity: leaving ? 0 : 1,
    }}>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.65; }
          92%  { opacity: 0.35; }
          100% { transform: translateY(105vh) rotate(600deg); opacity: 0; }
        }
        @keyframes petalSway {
          0%, 100% { margin-left: 0; }
          30%  { margin-left: 18px; }
          70%  { margin-left: -18px; }
        }
        @keyframes logoBloom {
          0%   { transform: scale(0.2) rotate(-25deg); opacity: 0; filter: drop-shadow(0 0 0px #F5C842); }
          55%  { transform: scale(1.15) rotate(4deg); opacity: 1; filter: drop-shadow(0 0 50px rgba(245,200,66,0.9)); }
          75%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 22px rgba(245,200,66,0.55)); }
        }
        @keyframes goldPulse {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(245,200,66,0.3)); }
          50%       { filter: drop-shadow(0 0 50px rgba(245,200,66,0.7)); }
        }
        @keyframes wordIn {
          0%   { opacity: 0; transform: translateY(24px); letter-spacing: 10px; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: -1px; }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(245,200,66,0.25); }
          50%       { box-shadow: 0 4px 36px rgba(245,200,66,0.6), 0 0 0 6px rgba(245,200,66,0.06); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.55; }
        }
        .logo-img {
          animation: logoBloom 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.15s both, goldPulse 3s ease-in-out 1.4s infinite;
        }
        .word-in {
          animation: wordIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.75s both;
        }
        .fade-1 { animation: fadeUp 0.7s ease 1.1s both; }
        .fade-2 { animation: fadeUp 0.7s ease 1.4s both; }
        .fade-3 { animation: fadeUp 0.7s ease 1.7s both; }
        .fade-4 { animation: fadeUp 0.7s ease 2.0s both; }
        .fade-5 { animation: fadeUp 0.7s ease 2.3s both; }
        .cta-btn {
          animation: fadeUp 0.7s ease 2.0s both, ctaPulse 2.8s ease-in-out 2.8s infinite;
          transition: transform 0.15s ease, background 0.2s ease;
        }
        .cta-btn:hover { transform: scale(1.05); background: linear-gradient(135deg,#FFD060,#F5A020) !important; }
        .cta-btn:active { transform: scale(0.96); }
      `}</style>

      {/* Twinkling stars */}
      {Array.from({ length: 38 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 1 + Math.random() * 2,
          height: 1 + Math.random() * 2,
          borderRadius: "50%",
          background: "#fff",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 4}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Sakura petals */}
      {petals.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: -20, left: p.left, pointerEvents: "none",
          animation: `petalFall ${p.duration} ${p.delay} linear infinite, petalSway ${p.duration} ${p.delay} ease-in-out infinite`,
        }}>
          <div style={{
            width: p.size, height: p.size,
            background: "radial-gradient(circle at 35% 35%, #FFD0DC, #FF6B8A55)",
            borderRadius: "50% 10% 50% 10%",
            transform: `rotate(${p.rotation}deg)`,
          }} />
        </div>
      ))}

      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,200,66,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content stack */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        zIndex: 10, padding: "0 24px", textAlign: "center",
      }}>

        {/* Logo */}
        <img
          className="logo-img"
          src="/sachi-icon-v4.png"
          alt="Sachi"
          style={{ width: 108, height: 108, borderRadius: 28, marginBottom: 24 }}
        />

        {/* Wordmark */}
        <div className="word-in">
          <div style={{
            fontSize: 64, fontWeight: 900, lineHeight: 1,
            background: "linear-gradient(135deg, #F5C842 0%, #FFE090 50%, #F5A623 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear 1.5s infinite",
          }}>
            sachi
          </div>
        </div>

        {/* TM */}
        <div className="fade-1" style={{
          fontSize: 10, color: "rgba(255,255,255,0.3)",
          letterSpacing: 4, textTransform: "uppercase", marginTop: 2, fontWeight: 600,
        }}>
          ™
        </div>

        {/* Tagline */}
        <div className="fade-2" style={{
          marginTop: 14, color: "rgba(255,255,255,0.5)",
          fontSize: 14, letterSpacing: 2.5,
          textTransform: "uppercase", fontWeight: 500,
        }}>
          Sachi means Truth
        </div>

        {/* Divider */}
        <div className="fade-3" style={{
          marginTop: 18, width: 44, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.55), transparent)",
        }} />

        {/* Sub tagline */}
        <div className="fade-3" style={{
          marginTop: 14, color: "rgba(255,255,255,0.28)",
          fontSize: 13, letterSpacing: 0.3, lineHeight: 1.7, maxWidth: 240,
        }}>
          Real moments. Real people. No filters.
        </div>

        {/* CTA */}
        <button
          className="cta-btn"
          onClick={handleEnter}
          style={{
            marginTop: 32, padding: "15px 48px",
            fontSize: 15, fontWeight: 700,
            color: "#0B0C1A",
            background: "linear-gradient(135deg, #F5C842, #F5A623)",
            border: "none", borderRadius: 50,
            cursor: "pointer", letterSpacing: 0.4,
          }}
        >
          Enter Sachi ✦
        </button>

        {/* Sign in hint */}
        <div className="fade-5"
          onClick={handleEnter}
          style={{
            marginTop: 14, fontSize: 12,
            color: "rgba(255,255,255,0.22)",
            cursor: "pointer", letterSpacing: 0.2,
          }}
        >
          already a member? sign in →
        </div>

      </div>

      {/* Bottom dots */}
      <div className="fade-5" style={{
        position: "absolute", bottom: 30,
        display: "flex", gap: 7, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === 0 ? 22 : 7, height: 7, borderRadius: 99,
            background: i === 0 ? "#F5C842" : "rgba(255,255,255,0.12)",
          }} />
        ))}
      </div>

    </div>
  );
}
