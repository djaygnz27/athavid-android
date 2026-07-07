// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — Landing.jsx (SPLASH PAGE)                             ║
// ║ 3-variant rotating splash — cycles every 3 days automatically     ║
// ║ Logo: sachi-logo-new.png (the current S logo) used across all      ║
// ║       3 variants — only the color theme + ambient FX differ now   ║
// ║ Variants restored from the old distinct-theme system (Classic gold ║
// ║  + violet / Neon cyan + electric blue / Bloom pink + magenta),     ║
// ║  each with its own background, ambient particle style, and a      ║
// ║  unique signature effect (Neon = scanline sweep, Bloom = pulsing   ║
// ║  halo bloom behind the logo).                                     ║
// ║ Props: onEnter (fn), prefetchDone (bool)                          ║
// ║ Last verified: 2026-07-07                                          ║
// ╚════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef, useCallback } from "react";

const LOGO_SRC = "/sachi-logo-new.png";

const SPLASH_STYLES = [
  {
    key: "classic",
    label: "Classic",
    src: LOGO_SRC,
    glow: "#F5C842",
    ring: "#7c3aed",
    bg: "radial-gradient(ellipse at 50% 18%, #3b1f6e 0%, #1e0d45 35%, #120830 65%, #0a0518 100%)",
    ambient: "petals",
  },
  {
    key: "neon",
    label: "Neon",
    src: LOGO_SRC,
    glow: "#00f0ff",
    ring: "#0084ff",
    bg: "radial-gradient(ellipse at 50% 15%, #062a4a 0%, #041c33 35%, #020f1e 65%, #01060f 100%)",
    ambient: "rain",
  },
  {
    key: "bloom",
    label: "Bloom",
    src: LOGO_SRC,
    glow: "#ff6ecd",
    ring: "#c026d3",
    bg: "radial-gradient(ellipse at 50% 20%, #4a1440 0%, #2b0d30 35%, #180820 65%, #0a0412 100%)",
    ambient: "orbs",
  },
];

function getSplashStyleIndex() {
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return Math.floor(daysSinceEpoch / 3) % SPLASH_STYLES.length;
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.8 + Math.random() * 2,
  dur: 1.5 + Math.random() * 3,
  delay: Math.random() * 6,
}));

// Classic ambient — falling sakura-style petals
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: (3 + Math.random() * 94).toFixed(1) + "%",
  delay: (Math.random() * 8).toFixed(2) + "s",
  dur: (7 + Math.random() * 5).toFixed(2) + "s",
  size: 5 + Math.random() * 9,
  drift: ((Math.random() - 0.5) * 45).toFixed(0),
}));

// Neon ambient — fast falling digital light streaks
const RAIN = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: (2 + Math.random() * 96).toFixed(1) + "%",
  delay: (Math.random() * 3).toFixed(2) + "s",
  dur: (0.7 + Math.random() * 0.9).toFixed(2) + "s",
  height: 18 + Math.random() * 34,
}));

// Bloom ambient — soft drifting bokeh orbs
const ORBS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: (4 + Math.random() * 92).toFixed(1) + "%",
  delay: (Math.random() * 9).toFixed(2) + "s",
  dur: (9 + Math.random() * 6).toFixed(2) + "s",
  size: 10 + Math.random() * 22,
  drift: ((Math.random() - 0.5) * 60).toFixed(0),
  blur: (1 + Math.random() * 2.5).toFixed(1),
}));

export default function Landing({ onEnter, prefetchDone = false }) {
  const startIdx = getSplashStyleIndex();
  const [displayIdx, setDisplayIdx] = useState(startIdx);
  const [phase, setPhase] = useState("idle");
  const [leaving, setLeaving] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const [glowPulse, setGlowPulse] = useState(false);
  const [burstParticles, setBurstParticles] = useState([]);
  const [lightningOn, setLightningOn] = useState(false);
  const leavingRef = useRef(false);

  const currentStyle = SPLASH_STYLES[displayIdx];

  const handleEnter = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    setTimeout(() => onEnter(), 500);
  }, [onEnter]);

  // Entrance
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("in"), 60);
    const t2 = setTimeout(() => handleEnter(), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Prefetch shortcut
  useEffect(() => {
    if (!prefetchDone) return;
    const t = setTimeout(() => handleEnter(), 4000);
    return () => clearTimeout(t);
  }, [prefetchDone]);

  // Glow pulse
  useEffect(() => {
    const iv = setInterval(() => {
      setGlowPulse(true);
      setTimeout(() => setGlowPulse(false), 700);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  // Lightning flash every ~4-6s
  useEffect(() => {
    let timeout;
    const fire = () => {
      setLightningOn(true);
      setTimeout(() => setLightningOn(false), 160);
      timeout = setTimeout(fire, 4000 + Math.random() * 2500);
    };
    timeout = setTimeout(fire, 3000 + Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Style swap every 3s (cycles through all 3 in-session)
  useEffect(() => {
    const iv = setInterval(() => {
      setLogoVisible(false);
      setTimeout(() => {
        const nextIdx = (displayIdx + 1) % SPLASH_STYLES.length;
        setDisplayIdx(nextIdx);
        // Burst particles
        const pts = Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * 360;
          const dist = 60 + Math.random() * 55;
          return {
            id: i,
            tx: Math.cos((angle * Math.PI) / 180) * dist,
            ty: Math.sin((angle * Math.PI) / 180) * dist,
          };
        });
        setBurstParticles(pts);
        setLightningOn(true);
        setTimeout(() => setLightningOn(false), 160);
        setTimeout(() => setBurstParticles([]), 800);
      }, 350);
      setTimeout(() => setLogoVisible(true), 400);
    }, 3000);
    return () => clearInterval(iv);
  }, [displayIdx]);

  return (
    <>
      {/* Lightning flash overlay */}
      {lightningOn && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 40%, ${currentStyle.glow}28 0%, transparent 65%)`,
          animation: "sachiFlash 0.16s ease-out forwards",
        }} />
      )}

      <div
        onClick={handleEnter}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: currentStyle.bg,
          transition: "background 0.9s ease",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          overflow: "hidden", cursor: "pointer",
          opacity: leaving ? 0 : phase === "in" ? 1 : 0,
        }}
      >
        <style>{`
          @keyframes twinkle {
            0%,100% { opacity:0.12; transform:scale(1); }
            50%      { opacity:0.95; transform:scale(1.5); }
          }
          @keyframes petalFall {
            0%   { transform:translateY(-30px) rotate(0deg) translateX(0); opacity:0; }
            6%   { opacity:0.55; }
            90%  { opacity:0.15; }
            100% { transform:translateY(110vh) rotate(720deg) translateX(var(--pdrift)); opacity:0; }
          }
          @keyframes rainFall {
            0%   { transform:translateY(-15vh); opacity:0; }
            10%  { opacity:0.9; }
            85%  { opacity:0.5; }
            100% { transform:translateY(115vh); opacity:0; }
          }
          @keyframes orbFloat {
            0%   { transform:translateY(20vh) translateX(0) scale(0.8); opacity:0; }
            10%  { opacity:0.65; }
            50%  { transform:translateY(-40vh) translateX(var(--odrift)) scale(1.1); }
            90%  { opacity:0.35; }
            100% { transform:translateY(-105vh) translateX(calc(var(--odrift) * 1.6)) scale(0.9); opacity:0; }
          }
          @keyframes scanLine {
            0%   { top:-4px; opacity:0; }
            8%   { opacity:1; }
            92%  { opacity:1; }
            100% { top:102%; opacity:0; }
          }
          @keyframes haloPulse {
            0%,100% { transform:scale(0.9); opacity:0.35; }
            50%     { transform:scale(1.2); opacity:0.65; }
          }
          @keyframes sachiFlash {
            0%   { opacity:1; }
            100% { opacity:0; }
          }
          @keyframes ringCW {
            0%   { transform:rotate(0deg); }
            100% { transform:rotate(360deg); }
          }
          @keyframes ringCCW {
            0%   { transform:rotate(0deg); }
            100% { transform:rotate(-360deg); }
          }
          @keyframes glowIdlePulse {
            0%,100% { opacity:0.7; }
            50%     { opacity:1; }
          }
          @keyframes textBreath {
            0%,100% { opacity:0.72; letter-spacing:0.22em; }
            50%     { opacity:1;   letter-spacing:0.28em; }
          }
          @keyframes shimmerSlide {
            0%   { background-position:-320px 0; }
            100% { background-position:320px 0; }
          }
          @keyframes particleFly {
            0%   { transform:translate(-50%,-50%) scale(1.1); opacity:1; }
            100% { transform:translate(calc(-50% + var(--ptx)), calc(-50% + var(--pty))) scale(0); opacity:0; }
          }
          @keyframes logoEntrance {
            0%   { opacity:0; transform:scale(0.85) translateY(10px); filter:blur(6px); }
            100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
          }
          @keyframes loadingBlink {
            0%,100% { opacity:0.35; }
            50%     { opacity:0.9; }
          }
        `}</style>

        {/* Stars — common to all styles */}
        {STARS.map(s => (
          <div key={s.id} style={{
            position: "absolute",
            left: s.x + "%", top: s.y + "%",
            width: s.size, height: s.size,
            borderRadius: "50%", background: "#fff",
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Classic — falling petals */}
        {currentStyle.ambient === "petals" && PETALS.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            left: p.left, top: "-10px",
            width: p.size, height: p.size,
            borderRadius: "60% 0 60% 0",
            background: `linear-gradient(135deg, ${currentStyle.glow}88, ${currentStyle.ring}55)`,
            animation: `petalFall ${p.dur} ${p.delay} ease-in infinite`,
            "--pdrift": p.drift + "px",
            pointerEvents: "none",
          }} />
        ))}

        {/* Neon — falling digital light streaks */}
        {currentStyle.ambient === "rain" && RAIN.map(r => (
          <div key={r.id} style={{
            position: "absolute",
            left: r.left, top: "-15vh",
            width: 2, height: r.height,
            borderRadius: 2,
            background: `linear-gradient(180deg, transparent, ${currentStyle.glow}dd, transparent)`,
            boxShadow: `0 0 6px ${currentStyle.glow}`,
            animation: `rainFall ${r.dur} ${r.delay} linear infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Neon — signature scanline sweep across the whole screen */}
        {currentStyle.ambient === "rain" && (
          <div style={{
            position: "absolute", left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${currentStyle.glow}, transparent)`,
            boxShadow: `0 0 18px 3px ${currentStyle.glow}aa`,
            animation: "scanLine 3.4s linear infinite",
            pointerEvents: "none",
          }} />
        )}

        {/* Bloom — soft drifting bokeh orbs */}
        {currentStyle.ambient === "orbs" && ORBS.map(o => (
          <div key={o.id} style={{
            position: "absolute",
            left: o.left, bottom: "-10vh",
            width: o.size, height: o.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${currentStyle.glow}99, ${currentStyle.ring}33 70%, transparent 100%)`,
            filter: `blur(${o.blur}px)`,
            animation: `orbFloat ${o.dur} ${o.delay} ease-in-out infinite`,
            "--odrift": o.drift + "px",
            pointerEvents: "none",
          }} />
        ))}

        {/* ── Logo zone ── */}
        <div style={{
          position: "relative",
          width: 280, height: 280,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "logoEntrance 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          {/* Bloom — pulsing halo behind the logo */}
          {currentStyle.ambient === "orbs" && (
            <div style={{
              position: "absolute",
              width: 260, height: 260, borderRadius: "50%",
              background: `radial-gradient(circle, ${currentStyle.glow}55 0%, ${currentStyle.ring}33 45%, transparent 75%)`,
              filter: "blur(22px)",
              animation: "haloPulse 3.4s ease-in-out infinite",
              pointerEvents: "none",
            }} />
          )}

          {/* Outer spinning dashed ring */}
          <svg width={280} height={280} style={{
            position: "absolute", inset: 0,
            animation: "ringCW 10s linear infinite",
            pointerEvents: "none",
          }}>
            <circle cx={140} cy={140} r={132} fill="none"
              stroke={currentStyle.ring} strokeWidth={1.5}
              strokeDasharray="7 16" opacity={0.45} />
          </svg>
          {/* Inner counter-rotating ring */}
          <svg width={280} height={280} style={{
            position: "absolute", inset: 0,
            animation: "ringCCW 6s linear infinite",
            pointerEvents: "none",
          }}>
            <circle cx={140} cy={140} r={120} fill="none"
              stroke={currentStyle.glow} strokeWidth={1}
              strokeDasharray="3 22" opacity={0.3} />
          </svg>

          {/* Logo box — transparent, no background */}
          <div style={{
            position: "relative",
            width: 220, height: 220,
            borderRadius: 0,
            overflow: "visible",
            background: "transparent",
            border: "none",
            opacity: logoVisible ? 1 : 0,
            filter: glowPulse
              ? `drop-shadow(0 0 32px ${currentStyle.glow}) drop-shadow(0 0 60px ${currentStyle.ring}88)`
              : `drop-shadow(0 0 18px ${currentStyle.glow}88) drop-shadow(0 0 36px ${currentStyle.ring}44)`,
            transition: "opacity 0.35s ease, filter 0.6s ease",
          }}>
            <img
              src={currentStyle.src}
              alt="Sachi"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>

          {/* Corner sparks */}
          {[
            { top: 28, left: 28 },
            { top: 28, right: 28 },
            { bottom: 28, left: 28 },
            { bottom: 28, right: 28 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: "absolute", ...pos,
              width: 7, height: 7,
              borderRadius: "50%",
              background: currentStyle.glow,
              boxShadow: `0 0 10px ${currentStyle.glow}, 0 0 4px #fff`,
              animation: `twinkle ${1.1 + i * 0.4}s ease-in-out ${i * 0.25}s infinite`,
              pointerEvents: "none",
            }} />
          ))}

          {/* Particle burst */}
          {burstParticles.map(p => (
            <div key={p.id} style={{
              position: "absolute",
              left: "50%", top: "50%",
              width: 6, height: 6,
              borderRadius: "50%",
              background: currentStyle.glow,
              boxShadow: `0 0 8px ${currentStyle.glow}`,
              animation: "particleFly 0.75s ease-out forwards",
              "--ptx": p.tx + "px",
              "--pty": p.ty + "px",
              pointerEvents: "none",
            }} />
          ))}
        </div>

        {/* Wordmark */}
        <div style={{
          marginTop: 20,
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          lineHeight: 1,
        }}>
          <span style={{
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: "#ffffff",
            fontFamily: "'Georgia', serif",
            textShadow: `0 0 28px ${currentStyle.glow}99, 0 2px 4px #000c`,
          }}>Sachi</span>
          <span style={{
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: "0.12em",
            color: currentStyle.glow,
            fontFamily: "system-ui, sans-serif",
            textShadow: `0 0 18px ${currentStyle.glow}88`,
          }}>Stream</span>
        </div>

        {/* Tagline */}
        <div style={{
          marginTop: 6,
          fontSize: 11,
          letterSpacing: "0.22em",
          color: currentStyle.glow,
          textTransform: "uppercase",
          animation: "textBreath 3s ease-in-out infinite",
          fontFamily: "system-ui, sans-serif",
          textShadow: `0 0 10px ${currentStyle.glow}88`,
        }}>
          SACHI MEANS TRUTH
        </div>

        {/* Divider */}
        <div style={{
          width: 40, height: 1,
          background: `linear-gradient(90deg, transparent, ${currentStyle.glow}, transparent)`,
          margin: "14px auto 0",
          boxShadow: `0 0 8px ${currentStyle.glow}`,
        }} />

        {/* Body copy */}
        <div style={{
          marginTop: 16, textAlign: "center",
          color: "#c8bde8", fontSize: 15, lineHeight: 1.65, maxWidth: 280,
          fontFamily: "system-ui, sans-serif",
        }}>
          Real moments. Real people.<br />
          <span style={{ color: "#ffffff", fontWeight: 600 }}>No filters.</span>
        </div>

        {/* FC text */}
        <div style={{
          marginTop: 18, textAlign: "center",
          color: currentStyle.glow, fontSize: 13, fontWeight: 600, maxWidth: 270,
          fontFamily: "system-ui, sans-serif",
          textShadow: `0 0 12px ${currentStyle.glow}66`,
          lineHeight: 1.6,
        }}>
          We're looking for 50 Founding Creators<br />
          <span style={{ color: "#9d8ec4", fontWeight: 400, fontSize: 12.5 }}>
            to shape Sachi and help test before we go LIVE.
          </span>
        </div>

        {/* Tap prompt */}
        <div style={{
          marginTop: 14,
          padding: "7px 20px", borderRadius: 20,
          border: `1px solid ${currentStyle.glow}55`,
          background: `${currentStyle.glow}0f`,
          color: currentStyle.glow, fontSize: 11.5,
          letterSpacing: "0.14em",
          fontFamily: "system-ui, sans-serif",
          boxShadow: `0 0 18px ${currentStyle.glow}22`,
          animation: "glowIdlePulse 2.5s ease-in-out infinite",
        }}>
          TAP ANYWHERE TO ENTER
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
          {SPLASH_STYLES.map((l, i) => (
            <div key={i} style={{
              width: i === displayIdx ? 22 : 7, height: 7,
              borderRadius: 4,
              background: i === displayIdx ? currentStyle.glow : "#251d3a",
              boxShadow: i === displayIdx ? `0 0 10px ${currentStyle.glow}` : "none",
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

        {/* Shimmer loading bar */}
        <div style={{
          marginTop: 26, width: 160, height: 3, borderRadius: 2,
          background: "#12082a", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: `linear-gradient(90deg, transparent 0%, ${currentStyle.glow} 40%, #ffffffcc 50%, ${currentStyle.glow} 60%, transparent 100%)`,
            backgroundSize: "320px 100%",
            animation: "shimmerSlide 1.7s linear infinite",
          }} />
        </div>

        <div style={{
          marginTop: 10, color: "#3d2d55", fontSize: 11,
          letterSpacing: "0.18em", fontFamily: "system-ui, sans-serif",
          animation: "loadingBlink 2.2s ease-in-out infinite",
        }}>
          LOADING SACHI…
        </div>
      </div>
    </>
  );
}
