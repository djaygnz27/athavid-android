import React, { useState, useEffect, useRef } from "react";

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.6 + Math.random() * 1.6,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 6,
}));

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + Math.random() * 90}%`,
  delay: `${Math.random() * 10}s`,
  duration: `${8 + Math.random() * 8}s`,
  size: 2 + Math.random() * 4,
  drift: (Math.random() - 0.5) * 60,
  color: i % 3 === 0 ? "#F5C842" : i % 3 === 1 ? "#FF9500" : "#ffffff",
}));

const EKG_W = 260;
const EKG_H = 60;
const ekgPoints = "0,30 30,30 42,8 50,52 58,30 80,30 88,18 96,42 104,30 130,30 142,8 150,52 158,30 180,30 188,18 196,42 204,30 260,30";

export default function Landing({ onEnter }) {
  const [phase, setPhase] = useState("idle");
  const [leaving, setLeaving] = useState(false);
  const [ekgProgress, setEkgProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("in"), 60);
    const t2 = setTimeout(() => handleEnter(), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 2000;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setEkgProgress(p);
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(animate); }, 400);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, []);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => onEnter(), 700);
  };

  const ekgDashTotal = 900;
  const ekgDashOffset = ekgDashTotal * (1 - ekgProgress);

  return (
    <div onClick={handleEnter} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#030308",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", cursor: "pointer",
      opacity: leaving ? 0 : 1,
      transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <style>{`
        @keyframes twinkle {
          0%,100%{ opacity:0.06; transform:scale(0.7); }
          50%    { opacity:0.8;  transform:scale(1.4); }
        }
        @keyframes particleRise {
          0%   { transform:translateY(0) translateX(0) scale(1); opacity:0; }
          10%  { opacity:0.8; }
          90%  { opacity:0.2; }
          100% { transform:translateY(-100vh) translateX(var(--drift)) scale(0.3); opacity:0; }
        }
        @keyframes gridPulse {
          0%,100%{ opacity:0.03; }
          50%    { opacity:0.08; }
        }
        @keyframes logoIn {
          0%   { opacity:0; transform:translateY(-20px) scale(0.9); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes nameIn {
          0%   { opacity:0; transform:translateX(-30px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes tagIn {
          0%   { opacity:0; transform:translateY(16px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes ekgGlow {
          0%,100%{ filter:drop-shadow(0 0 4px rgba(245,200,66,0.6)); }
          50%    { filter:drop-shadow(0 0 18px rgba(245,200,66,1)) drop-shadow(0 0 36px rgba(255,149,0,0.5)); }
        }
        @keyframes scanLine {
          0%   { left:-100%; }
          100% { left:100%; }
        }
        @keyframes pulseRing {
          0%   { transform:scale(1); opacity:0.5; }
          100% { transform:scale(2.8); opacity:0; }
        }
        @keyframes dotBlink {
          0%,100%{ opacity:0.2; transform:scale(0.7); }
          50%    { opacity:1;   transform:scale(1.3); }
        }
        @keyframes shimmer {
          0%   { background-position:-400% center; }
          100% { background-position:400% center; }
        }
        @keyframes borderFlow {
          0%   { background-position:0% 50%; }
          50%  { background-position:100% 50%; }
          100% { background-position:0% 50%; }
        }
        @keyframes heartbeatLoop {
          0%,100%{ transform:scaleY(1); }
          8%     { transform:scaleY(1.12); }
          18%    { transform:scaleY(0.92); }
          28%    { transform:scaleY(1); }
        }
        .logo-in  { animation: logoIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .name-in  { animation: nameIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both; }
        .f1 { animation: tagIn 0.6s ease 0.9s both; }
        .f2 { animation: tagIn 0.6s ease 1.2s both; }
        .f3 { animation: tagIn 0.6s ease 1.5s both; }
        .f4 { animation: tagIn 0.6s ease 1.8s both; }
        .f5 { animation: tagIn 0.6s ease 2.1s both; }
        .f6 { animation: tagIn 0.6s ease 2.4s both; }
        .ekg-glow { animation: ekgGlow 2.5s ease-in-out 1.5s infinite; }
        .hb-loop  { animation: heartbeatLoop 2s ease-in-out 2.2s infinite; transform-origin: center; }
      `}</style>

      {/* Apply button */}
      <div style={{ position:"absolute", top:20, right:20, zIndex:20 }}>
        <button
          onClick={e => { e.stopPropagation(); window.location.href='/apply'; }}
          style={{
            background:"linear-gradient(135deg,#F5C842,#FF9500)",
            color:"#000", border:"none", borderRadius:50,
            padding:"10px 20px", fontWeight:900, fontSize:13,
            cursor:"pointer", letterSpacing:0.3, fontFamily:"inherit",
            display:"flex", alignItems:"center", gap:6,
          }}>
          🌸 Apply — 36/50 Spots Left
        </button>
      </div>

      {/* Grid background */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(245,200,66,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(245,200,66,0.035) 1px, transparent 1px)",
        backgroundSize:"44px 44px",
        animation:"gridPulse 4s ease-in-out infinite",
      }} />

      {/* Scan line */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:2 }}>
        <div style={{
          position:"absolute", top:0, bottom:0, width:"25%",
          background:"linear-gradient(90deg, transparent, rgba(245,200,66,0.025), transparent)",
          animation:"scanLine 7s linear infinite",
        }} />
      </div>

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position:"absolute", borderRadius:"50%", background:"#fff",
          width:s.size, height:s.size,
          left:`${s.x}%`, top:`${s.y}%`,
          animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          pointerEvents:"none", zIndex:1,
        }} />
      ))}

      {/* Rising gold particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position:"absolute", bottom:-10, left:p.left, pointerEvents:"none", zIndex:1,
          "--drift":`${p.drift}px`,
          animation:`particleRise ${p.duration} ${p.delay} ease-in infinite`,
        }}>
          <div style={{ width:p.size, height:p.size, borderRadius:"50%", background:p.color, opacity:0.6 }} />
        </div>
      ))}

      {/* Ambient glow */}
      <div style={{
        position:"absolute", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(245,200,66,0.055) 0%, transparent 70%)",
        top:"50%", left:"50%", transform:"translate(-50%,-58%)",
        pointerEvents:"none", zIndex:1,
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        zIndex:10, padding:"0 28px", textAlign:"center", width:"100%", maxWidth:440,
      }}>

        {/* ── EKG LOGO ── */}
        <div className="logo-in" style={{ marginBottom:20, position:"relative" }}>
          <div style={{
            position:"absolute", width:100, height:100, borderRadius:"50%",
            border:"1px solid rgba(245,200,66,0.25)",
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            animation:"pulseRing 2.6s ease-out 2s infinite",
          }} />
          <div style={{
            position:"absolute", width:100, height:100, borderRadius:"50%",
            border:"1px solid rgba(245,200,66,0.15)",
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            animation:"pulseRing 2.6s ease-out 3.2s infinite",
          }} />

          <div className="ekg-glow hb-loop">
            <svg width="290" height="76" viewBox="0 0 280 72" style={{ overflow:"visible" }}>
              <defs>
                <linearGradient id="ekgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5C842" stopOpacity="0.2"/>
                  <stop offset="25%" stopColor="#F5C842"/>
                  <stop offset="55%" stopColor="#FF9500"/>
                  <stop offset="100%" stopColor="#FF4500" stopOpacity="0.5"/>
                </linearGradient>
              </defs>
              {/* Glow track */}
              <polyline points={ekgPoints} fill="none"
                stroke="rgba(245,200,66,0.12)" strokeWidth="10"
                strokeLinecap="round" strokeLinejoin="round"
                transform="translate(10,6)"/>
              {/* Main line */}
              <polyline points={ekgPoints} fill="none"
                stroke="url(#ekgGrad)" strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={ekgDashTotal}
                strokeDashoffset={ekgDashOffset}
                transform="translate(10,6)"
                style={{ transition:"stroke-dashoffset 0.05s linear" }}/>
              {/* Leading dot */}
              {ekgProgress < 0.99 && (
                <circle
                  cx={10 + ekgProgress * EKG_W}
                  cy={36}
                  r={5}
                  fill="#fff"
                  opacity={0.9}/>
              )}
            </svg>
          </div>
        </div>

        {/* ── WORDMARK ── */}
        <div className="name-in" style={{ marginBottom:2 }}>
          <div style={{
            fontSize:80, fontWeight:900, lineHeight:0.9,
            background:"linear-gradient(135deg, #FFE070 0%, #F5C842 35%, #FF9500 65%, #FFE090 100%)",
            backgroundSize:"300% auto",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"shimmer 5s linear 1.5s infinite",
            fontFamily:"'Arial Black', system-ui, sans-serif",
            letterSpacing:"-4px",
          }}>
            sachi
          </div>
        </div>

        {/* TM + tagline pill */}
        <div className="f1" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginBottom:22 }}>
          <span style={{ fontSize:9, color:"rgba(245,200,66,0.4)", letterSpacing:5, fontWeight:700 }}>™</span>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(245,200,66,0.07)", border:"1px solid rgba(245,200,66,0.18)",
            borderRadius:40, padding:"6px 18px",
          }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:"#F5C842", animation:"dotBlink 1.2s ease-in-out infinite" }} />
            <span style={{ color:"rgba(245,200,66,0.85)", fontSize:10, fontWeight:800, letterSpacing:3.5, textTransform:"uppercase" }}>
              Sachi means truth
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="f2" style={{ fontSize:21, lineHeight:1.55, fontWeight:700, color:"rgba(255,255,255,0.85)", marginBottom:4, maxWidth:300 }}>
          Real moments. Real people.
        </div>
        <div className="f2" style={{ fontSize:21, lineHeight:1.55, fontWeight:600, color:"rgba(255,255,255,0.4)", marginBottom:26 }}>
          No filters. No fakes.
        </div>

        {/* Stats */}
        <div className="f3" style={{
          display:"flex", gap:0, marginBottom:26, width:"100%", maxWidth:320,
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
          borderRadius:16, overflow:"hidden",
        }}>
          {[
            { val:"50", label:"Founding spots" },
            { val:"14", label:"Joined" },
            { val:"36", label:"Remaining" },
          ].map((s,i) => (
            <div key={i} style={{
              flex:1, padding:"14px 8px", textAlign:"center",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ color:"#F5C842", fontWeight:900, fontSize:22 }}>{s.val}</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:9, fontWeight:700, marginTop:3, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="f4" style={{ fontSize:13, color:"rgba(255,255,255,0.3)", fontWeight:600, marginBottom:10, letterSpacing:0.3 }}>
          Tap anywhere to enter the app · or
        </div>
        <button className="f4"
          onClick={e => { e.stopPropagation(); window.location.href='/apply'; }}
          style={{
            background:"linear-gradient(135deg,#F5C842,#FF9500)",
            border:"none", borderRadius:50, padding:"14px 36px",
            color:"#000", fontWeight:900, fontSize:16,
            cursor:"pointer", letterSpacing:0.3, fontFamily:"inherit", marginBottom:28,
          }}>
          🌸 Apply as Founding Creator
        </button>

        {/* Dots */}
        <div className="f5" style={{ display:"flex", gap:8, alignItems:"center" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:6, height:6, borderRadius:"50%",
              background:`rgba(245,200,66,${0.7-i*0.15})`,
              animation:`dotBlink 1.3s ease-in-out ${i*0.25}s infinite`,
            }} />
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2 }}>
        <div style={{
          height:"100%",
          background:"linear-gradient(90deg,#7b2ff7,#F5C842,#FF9500,#FF4500)",
          backgroundSize:"300% 100%",
          animation:"borderFlow 3s ease infinite",
        }} />
      </div>

      {/* Corner accents */}
      {[
        { top:0, left:0, borderTop:"1.5px solid rgba(245,200,66,0.18)", borderLeft:"1.5px solid rgba(245,200,66,0.18)" },
        { top:0, right:0, borderTop:"1.5px solid rgba(245,200,66,0.18)", borderRight:"1.5px solid rgba(245,200,66,0.18)" },
        { bottom:0, left:0, borderBottom:"1.5px solid rgba(245,200,66,0.18)", borderLeft:"1.5px solid rgba(245,200,66,0.18)" },
        { bottom:0, right:0, borderBottom:"1.5px solid rgba(245,200,66,0.18)", borderRight:"1.5px solid rgba(245,200,66,0.18)" },
      ].map((s,i) => (
        <div key={i} style={{ position:"absolute", width:55, height:55, pointerEvents:"none", ...s }} />
      ))}

    </div>
  );
}
