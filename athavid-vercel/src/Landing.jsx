import React, { useState, useEffect, useRef } from "react";

const PETALS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${3 + Math.random() * 94}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${7 + Math.random() * 6}s`,
  size: 6 + Math.random() * 10,
  rotation: Math.random() * 360,
  drift: (Math.random() - 0.5) * 40,
}));

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.8 + Math.random() * 1.8,
  dur: 1.8 + Math.random() * 3.5,
  delay: Math.random() * 5,
}));

export default function Landing({ onEnter }) {
  const [phase, setPhase] = useState("idle");
  const [leaving, setLeaving] = useState(false);
  const leavingRef = React.useRef(false);

  const handleEnter = React.useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    setTimeout(() => onEnter(), 700);
  }, [onEnter]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("in"), 60);
    const t2 = setTimeout(() => handleEnter(), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [handleEnter]);

  return (
    <div onClick={handleEnter} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "radial-gradient(ellipse at 50% 20%, #3b1f6e 0%, #1e0d45 35%, #120830 65%, #0a0518 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", cursor: "pointer",
      opacity: leaving ? 0 : 1,
      transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-40px) rotate(0deg) translateX(0); opacity:0; }
          6%   { opacity:0.7; }
          90%  { opacity:0.3; }
          100% { transform: translateY(108vh) rotate(720deg) translateX(var(--drift)); opacity:0; }
        }
        @keyframes twinkle {
          0%,100%{ opacity:0.08; transform:scale(0.8); }
          50%    { opacity:0.7;  transform:scale(1.3); }
        }
        @keyframes logoBloom {
          0%   { transform:scale(0.1) rotate(-30deg); opacity:0; filter:drop-shadow(0 0 0 #F5C842); }
          50%  { transform:scale(1.2) rotate(5deg);  opacity:1; filter:drop-shadow(0 0 60px rgba(245,200,66,1)); }
          70%  { transform:scale(0.93) rotate(-2deg); }
          85%  { transform:scale(1.04); }
          100% { transform:scale(1) rotate(0deg); opacity:1; filter:drop-shadow(0 0 28px rgba(245,200,66,0.6)); }
        }
        @keyframes goldPulse {
          0%,100%{ filter:drop-shadow(0 0 20px rgba(245,200,66,0.35)); }
          50%    { filter:drop-shadow(0 0 55px rgba(245,200,66,0.75)); }
        }
        @keyframes nameIn {
          0%   { opacity:0; transform:translateY(30px) scaleX(0.85); letter-spacing:18px; }
          100% { opacity:1; transform:translateY(0)    scaleX(1);    letter-spacing:-2px; }
        }
        @keyframes shimmer {
          0%   { background-position:-400% center; }
          100% { background-position:400% center; }
        }
        @keyframes fadeSlideUp {
          0%   { opacity:0; transform:translateY(18px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes ringPulse {
          0%   { transform:scale(0.7); opacity:0.6; }
          100% { transform:scale(2.2); opacity:0; }
        }
        @keyframes dotBlink {
          0%,100%{ opacity:0.2; transform:scale(0.75); }
          50%    { opacity:1;   transform:scale(1.3); }
        }
        @keyframes purpleGlow {
          0%,100%{ opacity:0.4; transform:scale(1); }
          50%    { opacity:0.7; transform:scale(1.08); }
        }
        .logo-bloom {
          animation: logoBloom 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.1s both,
                     goldPulse 3.5s ease-in-out 1.5s infinite;
        }
        .name-in    { animation: nameIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .f1 { animation: fadeSlideUp 0.7s ease 1.15s both; }
        .f2 { animation: fadeSlideUp 0.7s ease 1.45s both; }
        .f3 { animation: fadeSlideUp 0.7s ease 1.75s both; }
        .f4 { animation: fadeSlideUp 0.7s ease 2.05s both; }
        .f5 { animation: fadeSlideUp 0.7s ease 2.35s both; }
        .ring-pulse {
          position:absolute; border-radius:50%;
          border:1.5px solid rgba(245,200,66,0.35);
          animation: ringPulse 2.2s ease-out 1.3s infinite;
        }
      `}</style>

      {/* Apply button — top right */}
      <div style={{
        position:"absolute", top:20, right:20, zIndex:20,
      }}>
        <button
          onClick={e => { e.stopPropagation(); window.location.href='/apply'; }}
          style={{
            background:"linear-gradient(135deg,#F5C842 0%,#F5A623 100%)",
            color:"#1a0f00", border:"none", borderRadius:50,
            padding:"10px 20px", fontWeight:800, fontSize:13,
            cursor:"pointer", letterSpacing:0.3,
            boxShadow:"0 4px 20px rgba(245,168,66,0.45)",
            fontFamily:"inherit",
            display:"flex", alignItems:"center", gap:6,
            whiteSpace:"nowrap",
          }}
        >
          🌸 Apply — 36/50 Spots Left
        </button>
      </div>


      {/* Purple ambient glow blobs */}
      <div style={{
        position:"absolute", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(120,60,200,0.18) 0%, transparent 70%)",
        top:"-80px", left:"50%", transform:"translateX(-50%)",
        animation:"purpleGlow 5s ease-in-out infinite",
        pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", width:350, height:350, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(160,40,220,0.12) 0%, transparent 70%)",
        bottom:"10%", right:"5%",
        animation:"purpleGlow 6s ease-in-out 1.5s infinite",
        pointerEvents:"none",
      }} />

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} style={{
          position:"absolute", borderRadius:"50%", background:"#fff",
          width:s.size, height:s.size,
          left:`${s.x}%`, top:`${s.y}%`,
          animation:`twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          pointerEvents:"none",
        }} />
      ))}

      {/* Petals */}
      {PETALS.map(p => (
        <div key={p.id} style={{
          position:"absolute", top:-30, left:p.left, pointerEvents:"none",
          "--drift": `${p.drift}px`,
          animation:`petalFall ${p.duration} ${p.delay} ease-in infinite`,
        }}>
          <div style={{
            width:p.size, height:p.size,
            background:"radial-gradient(circle at 35% 30%, #e0aaff, rgba(180,80,220,0.4))",
            borderRadius:"50% 12% 50% 12%",
            transform:`rotate(${p.rotation}deg)`,
            boxShadow:`0 0 ${p.size/2}px rgba(180,100,255,0.35)`,
          }} />
        </div>
      ))}

      {/* Deep gold glow bg */}
      <div style={{
        position:"absolute", width:700, height:700, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(245,200,66,0.05) 0%, transparent 65%)",
        pointerEvents:"none",
      }} />

      {/* Content */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", zIndex:10, padding:"0 28px", textAlign:"center", width:"100%", maxWidth:400 }}>

        {/* Logo with pulse rings */}
        <div style={{ position:"relative", marginBottom:26 }}>
          <div className="ring-pulse" style={{ width:130, height:130, top:"-10px", left:"-10px" }} />
          <div className="ring-pulse" style={{ width:130, height:130, top:"-10px", left:"-10px", animationDelay:"3.3s" }} />
          <img
            className="logo-bloom"
            src="/sachi-icon-v4.png"
            alt="Sachi"
            style={{
              width:110, height:110, borderRadius:30,
              display:"block",
              animation:"logoBloom 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.1s both, goldPulse 3.5s ease-in-out 1.5s infinite",
            }}
          />
        </div>

        {/* Name */}
        <div className="name-in">
          <div style={{
            fontSize:72, fontWeight:900, lineHeight:1,
            background:"linear-gradient(135deg,#FFE070 0%,#F5C842 40%,#FFB020 70%,#FFE090 100%)",
            backgroundSize:"400% auto",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            animation:"shimmer 4.5s linear 1.5s infinite",
            fontFamily:"system-ui, -apple-system, sans-serif",
          }}>
            sachi
          </div>
        </div>

        {/* TM badge */}
        <div className="f1" style={{ fontSize:9, color:"rgba(245,200,66,0.45)", letterSpacing:5, fontWeight:700, marginTop:3, textTransform:"uppercase" }}>™</div>

        {/* Tagline */}
        <div className="f2" style={{
          marginTop:16, fontSize:24, letterSpacing:3.5,
          textTransform:"uppercase", fontWeight:600,
          color:"rgba(220,180,255,0.6)",
        }}>
          Sachi means Truth
        </div>

        {/* Divider */}
        <div className="f3" style={{
          marginTop:20, width:60, height:1.5,
          background:"linear-gradient(90deg,transparent,rgba(245,200,66,0.6),transparent)",
        }} />

        {/* Sub tagline */}
        <div className="f3" style={{
          marginTop:16, fontSize:26, lineHeight:1.6,
          color:"rgba(220,180,255,0.7)", maxWidth:320, fontWeight:600,
          textAlign:"center",
        }}>
          Real moments. Real people. No filters.
        </div>

        {/* Founding creator sentence */}
        <div className="f4" style={{
          marginTop:20, fontSize:18, lineHeight:1.8,
          color:"#F5C842", maxWidth:340, letterSpacing:0.3,
          fontWeight:700, textAlign:"center",
        }}>
          We're looking for <strong>50 Founding Creators</strong><br/>
          to shape Sachi and help test<br/>
          before we go LIVE.
        </div>

        {/* CTA hint */}
        <div className="f4" style={{
          marginTop:14, fontSize:22, lineHeight:1.6,
          color:"rgba(220,180,255,0.9)", maxWidth:300, letterSpacing:0.3,
          fontWeight:600, textAlign:"center",
        }}>
          Tap top right to apply!
        </div>


        {/* Pulsing dots loader */}
        <div className="f4" style={{ marginTop:36, display:"flex", gap:9, alignItems:"center" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:7, height:7, borderRadius:"50%",
              background:`rgba(245,200,66,${0.6 - i*0.1})`,
              animation:`dotBlink 1.3s ease-in-out ${i*0.28}s infinite`,
            }} />
          ))}
        </div>

      </div>

      {/* Bottom progress bar */}
      <div className="f5" style={{ position:"absolute", bottom:0, left:0, right:0, height:3 }}>
        <div style={{
          height:"100%",
          background:"linear-gradient(90deg,#7b2ff7,#F5C842,#FFB020)",
          animation:"shimmer 5.2s linear forwards",
          backgroundSize:"200% 100%",
        }} />
      </div>

    </div>
  );
}
/* purple splash */
