import { useState, useEffect } from "react";

export default function Landing({ onEnter }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const features = [
    { icon: "🎬", title: "Short Videos", desc: "Post 15–60 second clips and go viral instantly" },
    { icon: "🎵", title: "Music & Sound", desc: "Add trending audio to your videos effortlessly" },
    { icon: "❤️", title: "Real Community", desc: "Like, comment and connect with real people" },
    { icon: "🔒", title: "Safe Space", desc: "AI-powered content moderation keeps it clean" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a14", color: "#fff",
      fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: "hidden"
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .cta-btn:hover { transform: scale(1.04); }
        .cta-btn:active { transform: scale(0.97); }
        .feature-card:hover { transform: translateY(-4px); border-color: rgba(255,107,107,0.4) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"18px 24px", borderBottom:"1px solid rgba(255,255,255,0.05)",
        backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:100,
        background:"rgba(10,10,20,0.85)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10,
            background:"linear-gradient(135deg,#ff6b6b,#ff8e53)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎬</div>
          <span style={{ fontWeight:900, fontSize:22, letterSpacing:0.5,
            background:"linear-gradient(135deg,#ff6b6b,#ff8e53)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sachi</span>
        </div>
        <button onClick={onEnter} className="cta-btn"
          style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none",
            borderRadius:24, padding:"9px 22px", color:"#fff", fontWeight:800,
            fontSize:14, cursor:"pointer", transition:"transform 0.2s" }}>
          Open App
        </button>
      </nav>

      {/* Hero */}
      <div style={{ textAlign:"center", padding:"70px 24px 50px",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
        transition:"all 0.8s ease" }}>

        {/* Glowing orb behind logo */}
        <div style={{ position:"relative", display:"inline-block", marginBottom:28 }}>
          <div style={{ position:"absolute", inset:-30, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(255,107,107,0.25) 0%, transparent 70%)",
            animation:"pulse 3s ease-in-out infinite" }} />
          <div style={{ width:100, height:100, borderRadius:24,
            background:"linear-gradient(135deg,#ff6b6b,#ff8e53,#ff6b9d)",
            backgroundSize:"200% 200%", animation:"gradientShift 4s ease infinite, float 4s ease-in-out infinite",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:48, boxShadow:"0 20px 60px rgba(255,107,107,0.4)", position:"relative" }}>
            🎬
          </div>
        </div>

        <h1 style={{ fontSize:"clamp(40px,10vw,72px)", fontWeight:900, margin:"0 0 8px",
          lineHeight:1.1, letterSpacing:-1 }}>
          <span style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53,#ff6b9d)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundSize:"200% 200%", animation:"gradientShift 4s ease infinite" }}>
            Sachi
          </span>
        </h1>

        <p style={{ fontSize:"clamp(18px,5vw,26px)", fontWeight:700, color:"#fff",
          margin:"0 0 14px", letterSpacing:0.5 }}>
          Your Stage. Your Moment. 🔥
        </p>

        <p style={{ fontSize:"clamp(14px,3.5vw,18px)", color:"#888", maxWidth:480,
          margin:"0 auto 40px", lineHeight:1.7 }}>
          Share short videos, discover creators, and build your audience — all in one place.
        </p>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
          <button onClick={onEnter} className="cta-btn"
            style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none",
              borderRadius:30, padding:"16px 48px", color:"#fff", fontWeight:900,
              fontSize:18, cursor:"pointer", transition:"transform 0.2s",
              boxShadow:"0 12px 40px rgba(255,107,107,0.45)", letterSpacing:0.3 }}>
            🚀 Get Started — It's Free
          </button>
          <span style={{ color:"#555", fontSize:13 }}>No download needed · Works on any device</span>
        </div>
      </div>

      {/* Phone mockup preview */}
      <div style={{ display:"flex", justifyContent:"center", padding:"0 24px 60px",
        opacity: visible ? 1 : 0, transition:"all 1s ease 0.3s" }}>
        <div style={{ width:220, height:420, borderRadius:36, border:"3px solid rgba(255,107,107,0.3)",
          background:"linear-gradient(180deg,#1a0a14 0%,#0a0a1a 100%)",
          boxShadow:"0 30px 80px rgba(255,107,107,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
          position:"relative", overflow:"hidden", animation:"float 5s ease-in-out infinite" }}>
          {/* Phone screen content */}
          <div style={{ padding:"24px 12px 12px" }}>
            <div style={{ background:"rgba(255,107,107,0.15)", borderRadius:12, height:200,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              marginBottom:12, border:"1px solid rgba(255,107,107,0.2)" }}>
              <div style={{ fontSize:40, marginBottom:8 }}>🎬</div>
              <div style={{ color:"#ff6b6b", fontWeight:800, fontSize:14 }}>@creator</div>
              <div style={{ color:"#aaa", fontSize:11, textAlign:"center", padding:"0 12px", marginTop:4 }}>
                My first video on Sachi! 🔥
              </div>
            </div>
            {/* Fake action buttons */}
            <div style={{ display:"flex", justifyContent:"space-around" }}>
              {["❤️ 2.4K","💬 142","🔗 Share"].map((item,i) => (
                <div key={i} style={{ color:"#aaa", fontSize:11, textAlign:"center" }}>{item}</div>
              ))}
            </div>
          </div>
          {/* Bottom nav mock */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:55,
            background:"rgba(10,10,20,0.95)", borderTop:"1px solid rgba(255,255,255,0.06)",
            display:"flex", justifyContent:"space-around", alignItems:"center", padding:"0 12px" }}>
            {["🏠","🔍","➕","👤"].map((icon,i) => (
              <div key={i} style={{ fontSize:20, opacity: i===0 ? 1 : 0.4 }}>{icon}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding:"0 20px 60px", maxWidth:600, margin:"0 auto" }}>
        <h2 style={{ textAlign:"center", fontSize:24, fontWeight:800, marginBottom:24, color:"#fff" }}>
          Why Sachi? 🌟
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:18, padding:"20px 16px", transition:"transform 0.2s, border-color 0.2s",
                animation:`fadeUp 0.6s ease ${0.1 * i + 0.5}s both` }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{f.icon}</div>
              <div style={{ fontWeight:800, fontSize:14, marginBottom:6, color:"#fff" }}>{f.title}</div>
              <div style={{ color:"#666", fontSize:12, lineHeight:1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign:"center", padding:"40px 24px 60px",
        background:"linear-gradient(180deg, transparent, rgba(255,107,107,0.05))",
        borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <p style={{ color:"#888", fontSize:15, marginBottom:20 }}>
          Join thousands already on Sachi 🎉
        </p>
        <button onClick={onEnter} className="cta-btn"
          style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none",
            borderRadius:30, padding:"15px 44px", color:"#fff", fontWeight:900,
            fontSize:17, cursor:"pointer", transition:"transform 0.2s",
            boxShadow:"0 12px 40px rgba(255,107,107,0.35)" }}>
          ✨ Enter Sachi
        </button>
        <div style={{ marginTop:24, color:"#333", fontSize:12 }}>
          © 2026 Sachi · <a href="/privacy" style={{ color:"#555", textDecoration:"none" }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
