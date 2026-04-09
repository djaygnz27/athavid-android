import React, { useState, useEffect } from "react";
import { request } from "./api.js";

const CONTENT_TYPES = [
  "Short Videos","Podcasts","Live Streams","News & Commentary",
  "Music","Comedy","Sports","Fitness & Wellness","Food & Lifestyle",
  "Tech & Gaming","Education","Other"
];
const FOLLOWER_OPTIONS = ["Just starting out","Under 1K","1K–10K","10K–100K","100K+"];

const PERKS = [
  { icon:"🌸", title:"Founding Creator Badge", desc:"Permanent verified badge — shows you were here from day one.", color:"#FF6B9D" },
  { icon:"🎙️", title:"First Live Podcast Slot", desc:"Priority access to go live on Sachi before the public launch.", color:"#a78bfa" },
  { icon:"📣", title:"Featured in the Feed", desc:"Your content gets promoted to every new user for the first 30 days.", color:"#F5C842" },
  { icon:"🚫", title:"Zero Censorship — Ever", desc:"No shadowbanning. No suppression. No demonetisation risk.", color:"#4ade80" },
  { icon:"📊", title:"Early Analytics Access", desc:"Full creator dashboard before it's available to the public.", color:"#60a5fa" },
  { icon:"💬", title:"Direct Line to the Team", desc:"Your feedback shapes the platform. You talk to the founders.", color:"#fb923c" },
];

const SPOTS_LEFT = 50;

export default function FoundingCreatorPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(null);
  const [form, setForm] = useState({
    full_name:"", email:"", phone:"", location:"",
    content_type:"", social_links:"", follower_count:"",
    why_sachi:"", content_description:""
  });

  useEffect(() => {
    // Load current application count
    fetch("https://api.base44.app/apps/69b2ee18a8e6fb58c7f0261c/entities/FoundingCreator/filter", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({})
    }).then(r=>r.json()).then(d=> {
      if (Array.isArray(d)) setCount(d.length);
    }).catch(()=>{});
  }, []);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.content_type || !form.why_sachi.trim()) {
      setError("Please fill in all required fields marked *");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await request("POST", "/apps/69b2ee18a8e6fb58c7f0261c/entities/FoundingCreator", { ...form, status:"Pending" });
      setStep(3);
    } catch(e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const spotsLeft = count !== null ? Math.max(0, SPOTS_LEFT - count) : "50";
  const pctFilled = count !== null ? Math.min(100, (count / SPOTS_LEFT) * 100) : 0;

  // ── CSS ─────────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin:0; padding:0; }
    body { font-family:'Inter',-apple-system,sans-serif; }
    @keyframes petalFall {
      0%   { transform:translateY(-30px) rotate(0deg); opacity:0; }
      8%   { opacity:0.6; }
      92%  { opacity:0.25; }
      100% { transform:translateY(100vh) rotate(540deg); opacity:0; }
    }
    @keyframes float {
      0%,100%{ transform:translateY(0); }
      50%    { transform:translateY(-12px); }
    }
    @keyframes shimmer {
      0%   { background-position:-400% center; }
      100% { background-position:400% center; }
    }
    @keyframes fadeUp {
      0%   { opacity:0; transform:translateY(24px); }
      100% { opacity:1; transform:translateY(0); }
    }
    @keyframes pulse {
      0%,100%{ box-shadow:0 0 0 0 rgba(245,200,66,0.4); }
      50%    { box-shadow:0 0 0 14px rgba(245,200,66,0); }
    }
    @keyframes countUp {
      0%   { transform:scale(0.5); opacity:0; }
      100% { transform:scale(1);   opacity:1; }
    }
    @keyframes ringExpand {
      0%  { transform:scale(1); opacity:0.5; }
      100%{ transform:scale(2.5); opacity:0; }
    }
    .hero-logo { animation: float 4s ease-in-out infinite; }
    .fade-1 { animation: fadeUp 0.7s ease 0.1s both; }
    .fade-2 { animation: fadeUp 0.7s ease 0.25s both; }
    .fade-3 { animation: fadeUp 0.7s ease 0.4s both; }
    .fade-4 { animation: fadeUp 0.7s ease 0.55s both; }
    .fade-5 { animation: fadeUp 0.7s ease 0.7s both; }
    .fade-6 { animation: fadeUp 0.7s ease 0.85s both; }
    .cta-main {
      background: linear-gradient(135deg,#F5C842,#FFB020);
      color: #0B0C1A;
      border: none; border-radius: 18px;
      padding: 18px 40px;
      font-size: 17px; font-weight: 800;
      cursor: pointer; width: 100%;
      animation: pulse 2.5s ease-in-out infinite;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .cta-main:hover { transform:scale(1.03); filter:brightness(1.08); }
    .cta-main:active { transform:scale(0.97); }
    .perk-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 18px 16px;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }
    .perk-card:hover {
      transform: translateY(-3px);
      border-color: rgba(245,200,66,0.25);
      background: rgba(255,255,255,0.07);
    }
    .input-field {
      width: 100%;
      background: rgba(255,255,255,0.06);
      border: 1.5px solid rgba(245,200,66,0.15);
      border-radius: 14px;
      padding: 14px 16px;
      color: #fff;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .input-field:focus {
      border-color: rgba(245,200,66,0.5);
      background: rgba(255,255,255,0.09);
    }
    .input-field::placeholder { color: rgba(255,255,255,0.25); }
    .chip {
      display: inline-flex; align-items: center;
      padding: 8px 14px;
      border-radius: 99px;
      border: 1.5px solid rgba(245,200,66,0.2);
      color: rgba(255,255,255,0.55);
      font-size: 13px; font-weight: 500;
      cursor: pointer;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s ease;
      margin: 4px;
    }
    .chip:hover { border-color: rgba(245,200,66,0.5); color: #F5C842; background: rgba(245,200,66,0.08); }
    .chip.selected { background: rgba(245,200,66,0.15); border-color: #F5C842; color: #F5C842; font-weight: 600; }
  `;

  const PETALS = React.useMemo(() => Array.from({length:14}, (_,i) => ({
    id:i, left:`${5+Math.random()*90}%`,
    delay:`${Math.random()*7}s`, dur:`${6+Math.random()*5}s`,
    size:5+Math.random()*8, rot:Math.random()*360,
  })), []);

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (step === 3) return (
    <div style={{ minHeight:"100dvh", background:"radial-gradient(ellipse at 50% 20%,#1a1535,#0B0C1A 60%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center", fontFamily:"Inter,-apple-system,sans-serif" }}>
      <style>{css}</style>
      <div style={{ fontSize:88, marginBottom:8, animation:"float 3s ease-in-out infinite" }}>🌸</div>
      <div style={{ position:"relative", display:"inline-block", marginBottom:20 }}>
        <div style={{ position:"absolute", inset:"-20px", borderRadius:"50%", border:"2px solid rgba(245,200,66,0.3)", animation:"ringExpand 2s ease-out infinite" }} />
      </div>
      <h1 style={{ color:"#F5C842", fontSize:36, fontWeight:900, marginBottom:14, letterSpacing:-0.5 }}>You're In! 🎉</h1>
      <p style={{ color:"rgba(255,255,255,0.65)", fontSize:16, maxWidth:320, lineHeight:1.7, marginBottom:10 }}>
        Your application has been received. We'll review it within <strong style={{color:"#F5C842"}}>48 hours</strong>.
      </p>
      <p style={{ color:"rgba(255,255,255,0.35)", fontSize:14, maxWidth:300, lineHeight:1.6, marginBottom:40 }}>
        Welcome to the beginning of something real.<br/>
        <span style={{color:"#F5C842", fontWeight:700}}>Sachi means Truth</span> — and you're one of the first to stand for it.
      </p>
      <button onClick={onBack} className="cta-main" style={{ maxWidth:280, animation:"none" }}>
        → Enter Sachi Stream
      </button>
      <div style={{ marginTop:20, color:"rgba(255,255,255,0.2)", fontSize:12 }}>sachistream.com</div>
    </div>
  );

  // ── APPLICATION FORM ─────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(160deg,#0B0C1A 0%,#0e0f22 100%)", paddingBottom:60, fontFamily:"Inter,-apple-system,sans-serif" }}>
      <style>{css}</style>

      {/* Sticky header */}
      <div style={{ position:"sticky", top:0, background:"rgba(11,12,26,0.95)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(245,200,66,0.12)", padding:"14px 20px", display:"flex", alignItems:"center", gap:14, zIndex:50 }}>
        <button onClick={() => setStep(1)} style={{ background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.25)", color:"#F5C842", borderRadius:10, width:36, height:36, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:17 }}>Founding Creator Application</div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12 }}>~3 minutes · {spotsLeft} spots remaining</div>
        </div>
      </div>

      <div style={{ padding:"28px 20px", maxWidth:520, margin:"0 auto" }}>

        {/* Progress */}
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:5, marginBottom:28, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pctFilled}%`, background:"linear-gradient(90deg,#F5C842,#FFB020)", borderRadius:99, transition:"width 0.5s ease" }} />
        </div>

        {/* Fields */}
        {[
          { label:"Full Name *", key:"full_name", type:"text", ph:"Your full name" },
          { label:"Email Address *", key:"email", type:"email", ph:"you@example.com" },
          { label:"Phone (optional)", key:"phone", type:"tel", ph:"+1 555-000-0000" },
          { label:"Where are you based?", key:"location", type:"text", ph:"City, Country" },
          { label:"Social Media Links", key:"social_links", type:"text", ph:"Instagram, TikTok, YouTube URLs..." },
        ].map(({label,key,type,ph}) => (
          <div key={key} style={{ marginBottom:20 }}>
            <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600, letterSpacing:0.5, display:"block", marginBottom:8, textTransform:"uppercase" }}>{label}</label>
            <input type={type} value={form[key]} placeholder={ph} onChange={e => set(key, e.target.value)} className="input-field" />
          </div>
        ))}

        {/* Content type chips */}
        <div style={{ marginBottom:22 }}>
          <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600, letterSpacing:0.5, display:"block", marginBottom:10, textTransform:"uppercase" }}>Content Type *</label>
          <div style={{ display:"flex", flexWrap:"wrap", margin:"-4px" }}>
            {CONTENT_TYPES.map(ct => (
              <div key={ct} className={`chip${form.content_type===ct?" selected":""}`} onClick={() => set("content_type", ct)}>{ct}</div>
            ))}
          </div>
        </div>

        {/* Follower count chips */}
        <div style={{ marginBottom:22 }}>
          <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600, letterSpacing:0.5, display:"block", marginBottom:10, textTransform:"uppercase" }}>Current Audience Size</label>
          <div style={{ display:"flex", flexWrap:"wrap", margin:"-4px" }}>
            {FOLLOWER_OPTIONS.map(fo => (
              <div key={fo} className={`chip${form.follower_count===fo?" selected":""}`} onClick={() => set("follower_count", fo)}>{fo}</div>
            ))}
          </div>
        </div>

        {/* Text areas */}
        <div style={{ marginBottom:20 }}>
          <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600, letterSpacing:0.5, display:"block", marginBottom:8, textTransform:"uppercase" }}>Why Sachi? *</label>
          <textarea value={form.why_sachi} placeholder="What made you want to be a Founding Creator? What frustrates you about existing platforms?" onChange={e => set("why_sachi", e.target.value)}
            className="input-field" style={{ height:110, resize:"vertical", lineHeight:1.6 }} />
        </div>

        <div style={{ marginBottom:32 }}>
          <label style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600, letterSpacing:0.5, display:"block", marginBottom:8, textTransform:"uppercase" }}>Tell us about your content</label>
          <textarea value={form.content_description} placeholder="What kind of content do you create? What's your style? What topics do you cover?" onChange={e => set("content_description", e.target.value)}
            className="input-field" style={{ height:90, resize:"vertical", lineHeight:1.6 }} />
        </div>

        {error && (
          <div style={{ background:"rgba(229,57,53,0.12)", border:"1px solid rgba(229,57,53,0.3)", borderRadius:12, padding:"12px 16px", color:"#ff7070", fontSize:14, marginBottom:20 }}>
            {error}
          </div>
        )}

        <button onClick={submit} disabled={loading} className="cta-main">
          {loading ? "Submitting..." : "🌸 Submit Application"}
        </button>

        <div style={{ textAlign:"center", marginTop:16, color:"rgba(255,255,255,0.2)", fontSize:12 }}>
          We review every application personally within 48 hours.
        </div>
      </div>
    </div>
  );

  // ── LANDING / HERO ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100dvh", background:"radial-gradient(ellipse at 50% 0%,#1e1645 0%,#0B0C1A 55%,#07080f 100%)", fontFamily:"Inter,-apple-system,sans-serif", overflowX:"hidden" }}>
      <style>{css}</style>

      {/* Petals */}
      {PETALS.map(p => (
        <div key={p.id} style={{ position:"fixed", top:-20, left:p.left, pointerEvents:"none", zIndex:0, animation:`petalFall ${p.dur} ${p.delay} linear infinite` }}>
          <div style={{ width:p.size, height:p.size, background:"radial-gradient(circle at 35%,#FFB8CC,rgba(255,80,120,0.35))", borderRadius:"50% 10% 50% 10%", transform:`rotate(${p.rot}deg)` }} />
        </div>
      ))}

      {/* Nav */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(11,12,26,0.85)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={onBack}>
          <img src="/sachi-icon-v4.png" alt="Sachi" style={{ width:32, height:32, borderRadius:9 }} />
          <span style={{ fontSize:20, fontWeight:900, background:"linear-gradient(135deg,#F5C842,#FFB020)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sachi</span>
          <span style={{ fontSize:11, color:"#F5C842", fontWeight:700 }}>™</span>
        </div>
        <button onClick={() => setStep(2)} style={{ background:"rgba(245,200,66,0.12)", border:"1px solid rgba(245,200,66,0.3)", color:"#F5C842", borderRadius:99, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          Apply Now →
        </button>
      </div>

      <div style={{ maxWidth:540, margin:"0 auto", padding:"0 22px", position:"relative", zIndex:1 }}>

        {/* HERO */}
        <div style={{ textAlign:"center", paddingTop:56, paddingBottom:48 }}>

          {/* Floating logo */}
          <div className="hero-logo fade-1" style={{ marginBottom:28, display:"inline-block", position:"relative" }}>
            <div style={{ position:"absolute", inset:"-16px", borderRadius:"50%", border:"1.5px solid rgba(245,200,66,0.2)", animation:"ringExpand 3s ease-out 1s infinite" }} />
            <img src="/sachi-icon-v4.png" alt="Sachi" style={{ width:100, height:100, borderRadius:28, display:"block", filter:"drop-shadow(0 0 30px rgba(245,200,66,0.5))" }} />
          </div>

          {/* Eyebrow */}
          <div className="fade-2" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:99, padding:"5px 14px", marginBottom:22 }}>
            <span style={{ fontSize:10 }}>🌸</span>
            <span style={{ color:"#F5C842", fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}>Founding Creator Program</span>
          </div>

          {/* Headline */}
          <h1 className="fade-3" style={{
            fontSize:"clamp(34px,8vw,52px)", fontWeight:900, lineHeight:1.1,
            letterSpacing:"-1.5px", color:"#fff", marginBottom:18,
          }}>
            Be the First Voice<br/>
            <span style={{
              background:"linear-gradient(135deg,#F5C842 0%,#FFE090 50%,#FFB020 100%)",
              backgroundSize:"300% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              animation:"shimmer 4s linear 0.5s infinite",
            }}>on Sachi</span>
          </h1>

          {/* Sub */}
          <p className="fade-4" style={{ color:"rgba(255,255,255,0.5)", fontSize:16, lineHeight:1.75, maxWidth:400, margin:"0 auto 32px" }}>
            We're looking for <strong style={{color:"rgba(255,255,255,0.85)"}}>50 founding creators</strong> to launch the most authentic short-video platform on the internet. Zero censorship. Zero shadowbanning. 100% real.
          </p>

          {/* Spots counter */}
          <div className="fade-4" style={{ marginBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:10 }}>
              <div style={{ background:"rgba(229,57,53,0.15)", border:"1px solid rgba(229,57,53,0.3)", borderRadius:99, padding:"4px 12px", display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#e53935", animation:"pulse 1.5s ease-in-out infinite" }} />
                <span style={{ color:"#ff7070", fontSize:12, fontWeight:700 }}>LIVE APPLICATION</span>
              </div>
            </div>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>
              <span style={{ color:"#F5C842", fontWeight:800, fontSize:22 }}>{spotsLeft}</span> spots remaining out of 50
            </div>
            <div style={{ marginTop:10, background:"rgba(255,255,255,0.07)", borderRadius:99, height:6, maxWidth:220, margin:"10px auto 0", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pctFilled}%`, background:"linear-gradient(90deg,#F5C842,#FFB020)", borderRadius:99, transition:"width 1s ease" }} />
            </div>
          </div>

          <button className="cta-main fade-5" onClick={() => setStep(2)} style={{ maxWidth:340 }}>
            🌸 Apply for Founding Creator →
          </button>

          <div className="fade-6" style={{ marginTop:14, color:"rgba(255,255,255,0.2)", fontSize:12 }}>
            Free forever · 3-minute application · We reply within 48 hours
          </div>
        </div>

        {/* PERKS */}
        <div style={{ paddingBottom:24 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>What You Get</div>
            <h2 style={{ color:"#fff", fontSize:26, fontWeight:800, letterSpacing:"-0.5px" }}>Founding Creator Perks</h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {PERKS.map((p,i) => (
              <div key={i} className="perk-card fade-1">
                <div style={{ fontSize:26, marginBottom:10 }}>{p.icon}</div>
                <div style={{ color:p.color, fontWeight:700, fontSize:13, marginBottom:6 }}>{p.title}</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, lineHeight:1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WHY SACHI */}
        <div style={{ margin:"40px 0", padding:"28px 24px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(245,200,66,0.1)", borderRadius:20 }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🌸</div>
            <h2 style={{ color:"#F5C842", fontSize:22, fontWeight:800, marginBottom:10 }}>Sachi means Truth</h2>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.75, maxWidth:360, margin:"0 auto" }}>
              We built Sachi because creators deserve a platform that doesn't punish authenticity. No algorithm that buries your content. No arbitrary bans. Just you and your audience.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:24 }}>
            {[
              { val:"🚫", label:"No Shadowbanning" },
              { val:"✅", label:"Real Reach" },
              { val:"🔒", label:"Your Content, Your Rules" },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:"center", padding:"16px 8px", background:"rgba(245,200,66,0.05)", borderRadius:14, border:"1px solid rgba(245,200,66,0.1)" }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{s.val}</div>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:11, fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ textAlign:"center", paddingBottom:64 }}>
          <h2 style={{ color:"#fff", fontSize:26, fontWeight:800, marginBottom:12, letterSpacing:"-0.5px" }}>
            Ready to be part of<br/>
            <span style={{ color:"#F5C842" }}>something real?</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:14, marginBottom:28, lineHeight:1.6 }}>
            50 spots. Lifetime perks. Zero cost.
          </p>
          <button className="cta-main" onClick={() => setStep(2)}>
            🌸 Apply for Founding Creator →
          </button>
          <div style={{ marginTop:16, color:"rgba(255,255,255,0.2)", fontSize:12 }}>
            sachistream.com · &copy; 2026 Sachi™
          </div>
        </div>

      </div>
    </div>
  );
}
