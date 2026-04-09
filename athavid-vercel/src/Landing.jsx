import { useState, useEffect, useRef } from "react";

function SakuraPetal({ style }) {
  return (
    <div style={{
      position: "absolute",
      width: 10, height: 10,
      background: "radial-gradient(circle at 40% 40%, #FFB7C5, #FF6B8A88)",
      borderRadius: "50% 0 50% 0",
      opacity: 0,
      ...style,
    }} />
  );
}

export default function Landing({ onEnter }) {
  const [phase, setPhase] = useState("idle");
  const [petals, setPetals] = useState([]);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Generate petals
    const p = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${5 + Math.random() * 5}s`,
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
    }));
    setPetals(p);

    const t1 = setTimeout(() => setPhase("in"), 100);
    return () => clearTimeout(t1);
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(() => onEnter(), 700);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "radial-gradient(ellipse at 50% 30%, #131630 0%, #0B0C1A 70%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      transition: "opacity 0.7s ease",
      opacity: leaving ? 0 : 1,
    }}>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-40px) rotate(0deg) scale(1); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.6); opacity: 0; }
        }
        @keyframes petalSway {
          0%, 100% { margin-left: 0px; }
          25%  { margin-left: 20px; }
          75%  { margin-left: -20px; }
        }
        @keyframes logoBloom {
          0%   { transform: scale(0.3) rotate(-20deg); opacity: 0; filter: brightness(0.5) drop-shadow(0 0 0px #F5C842); }
          60%  { transform: scale(1.12) rotate(3deg); opacity: 1; filter: brightness(1.2) drop-shadow(0 0 40px rgba(245,200,66,0.8)); }
          80%  { transform: scale(0.96) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1) drop-shadow(0 0 24px rgba(245,200,66,0.5)); }
        }
        @keyframes wordSlide {
          0%   { opacity: 0; transform: translateY(30px); letter-spacing: 12px; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: -1px; }
        }
        @keyframes tagFade {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,200,66,0), 0 0 30px rgba(245,200,66,0.2); }
          50%       { box-shadow: 0 0 0 12px rgba(245,200,66,0), 0 0 60px rgba(245,200,66,0.45); }
        }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,200,66,0.3), 0 4px 24px rgba(245,200,66,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(245,200,66,0.0), 0 4px 32px rgba(245,200,66,0.5); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.3); }
        }
        .sachi-logo {
          animation: logoBloom 1s cubic-bezier(0.34,1.56,0.64,1) 0.2s both, goldPulse 3s ease-in-out 1.2s infinite;
        }
        .sachi-word {
          animation: wordSlide 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s both;
        }
        .sachi-tag {
          animation: tagFade 0.8s ease 1.4s both;
        }
        .sachi-cta {
          animation: tagFade 0.8s ease 1.8s both, ctaGlow 2.5s ease-in-out 2.6s infinite;
        }
        .sachi-cta:hover {
          transform: scale(1.04);
          background: linear-gradient(135deg, #FFD060, #F5A623) !important;
        }
        .sachi-cta:active {
          transform: scale(0.97);
        }
        .star {
          position: absolute;
          border-radius: 50%;
          background: white;
        }
      `}</style>

      {/* Stars background */}
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} className="star" style={{
          width: Math.random() * 2 + 1,
          height: Math.random() * 2 + 1,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
        }} />
      ))}

      {/* Falling sakura petals */}
      {petals.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          top: -20,
          left: p.left,
          animation: `petalFall ${p.duration} ${p.delay} linear infinite, petalSway ${p.duration} ${p.delay} ease-in-out infinite`,
        }}>
          <div style={{
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle at 35% 35%, #FFD0DC, #FF6B8A66)",
            borderRadius: "50% 10% 50% 10%",
            transform: `rotate(${p.rotation}deg)`,
          }} />
        </div>
      ))}

      {/* Ambient glow rings */}
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,200,66,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,107,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>

        {/* Logo */}
        <img
          className="sachi-logo"
          src="/sachi-icon-v4.png"
          alt="Sachi"
          style={{
            width: 110, height: 110,
            borderRadius: 30,
            marginBottom: 28,
          }}
        />

        {/* Wordmark */}
        <div className="sachi-word" style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 68, fontWeight: 900, lineHeight: 1,
            background: "linear-gradient(135deg, #F5C842 0%, #FFE08A 45%, #F5A623 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -1,
            animation: "shimmer 4s linear 1.5s infinite",
          }}>
            sachi
          </div>
          <div style={{
            fontSize: 11, color: "rgba(255,255,255,0.35)",
            letterSpacing: 5, textTransform: "uppercase",
            marginTop: 4, fontWeight: 600,
          }}>
            ™
          </div>
        </div>

        {/* Tagline */}
        <div className="sachi-tag" style={{
          marginTop: 16,
          color: "rgba(255,255,255,0.55)",
          fontSize: 15,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontWeight: 400,
        }}>
          Sachi means Truth
        </div>

        {/* Divider */}
        <div className="sachi-tag" style={{
          marginTop: 20,
          width: 40, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.5), transparent)",
        }} />

        {/* Sub tagline */}
        <div className="sachi-tag" style={{
          marginTop: 16,
          color: "rgba(255,255,255,0.3)",
          fontSize: 13,
          letterSpacing: 0.5,
          textAlign: "center",
          maxWidth: 260,
          lineHeight: 1.6,
        }}>
          Real moments. Real people. No filters.
        </div>

        {/* CTA Button */}
        <button
          className="sachi-cta"
          onClick={handleEnter}
          style={{
            marginTop: 36,
            padding: "14px 44px",
            fontSize: 15,
            fontWeight: 700,
            color: "#0B0C1A",
            background: "linear-gradient(135deg, #F5C842, #F5A623)",
            border: "none",
            borderRadius: 50,
            cursor: "pointer",
            letterSpacing: 0.5,
            transition: "transform 0.2s ease",
          }}
        >
          Enter Sachi ✦
        </button>

        {/* Already a member link */}
        <div className="sachi-tag" style={{
          marginTop: 16,
          fontSize: 12,
          color: "rgba(255,255,255,0.25)",
          cursor: "pointer",
          letterSpacing: 0.3,
        }} onClick={handleEnter}>
          already a member? sign in →
        </div>

      </div>

      {/* Bottom bar */}
      <div className="sachi-tag" style={{
        position: "absolute", bottom: 32,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: i === 0 ? 24 : 7,
            height: 7,
            borderRadius: 99,
            background: i === 0 ? "#F5C842" : "rgba(255,255,255,0.12)",
          }} />
        ))}
      </div>

    </div>
  );
}
