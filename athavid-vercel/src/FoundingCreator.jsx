import React, { useState, useEffect, useMemo } from "react";
import { request } from "./api.js";

const CONTENT_TYPES = [
  "Short Videos","Podcasts","Live Streams","News & Commentary",
  "Music","Comedy","Sports","Fitness & Wellness","Food & Lifestyle",
  "Tech & Gaming","Education","Other"
];
const FOLLOWER_OPTIONS = ["Just starting out","Under 1K","1K–10K","10K–100K","100K+"];

const PERKS = [
  { icon:"🌸", title:"Founding Creator Badge", desc:"A permanent badge that shows you were here from day one — forever.", color:"#FF85A1" },
  { icon:"🎙️", title:"First Live Podcast Slot", desc:"Go live on Sachi before anyone else. Your show. Your audience.", color:"#c084fc" },
  { icon:"📣", title:"Featured in Every Feed", desc:"Your content gets promoted to every new user for the first 30 days.", color:"#fbbf24" },
  { icon:"🔓", title:"Zero Censorship — Ever", desc:"No shadowbanning. No suppression. We will never touch your reach.", color:"#4ade80" },
  { icon:"📊", title:"Creator Dashboard Early Access", desc:"Full analytics before it's released to the public.", color:"#60a5fa" },
  { icon:"💬", title:"Direct Line to the Founders", desc:"Your ideas shape the platform. We actually pick up the phone.", color:"#f97316" },
];

const TESTIMONIALS = [
  { name:"Content Creator, 250K followers", quote:"I finally have a platform where my voice reaches my audience — no games, no politics." },
  { name:"Independent podcaster", quote:"A platform that doesn't punish you for having an opinion? I'm in." },
  { name:"Sports commentator", quote:"Finally somewhere that values real content over viral garbage." },
];

const SPOTS_TOTAL = 50;
const ALREADY_TAKEN = 14; // existing beta testers already counted

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
    request("POST", `/apps/69b2ee18a8e6fb58c7f0261c/entities/FoundingCreator/filter`, {})
      .then(d => { if (Array.isArray(d)) setCount(d.length); })
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const spotsLeft = count !== null ? Math.max(0, SPOTS_TOTAL - ALREADY_TAKEN - count) : (SPOTS_TOTAL - ALREADY_TAKEN);
  const pctFilled = count !== null ? Math.min(100, ((count + ALREADY_TAKEN) / SPOTS_TOTAL) * 100) : Math.min(100, (ALREADY_TAKEN / SPOTS_TOTAL) * 100);

  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.content_type || !form.why_sachi.trim()) {
      setError("Please fill in all required fields marked *"); return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address."); return;
    }
    setError(""); setLoading(true);
    try {
      await request("POST", `/apps/69b2ee18a8e6fb58c7f0261c/entities/FoundingCreator`, { ...form, status:"Pending" });
      setStep(3);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const PETALS = useMemo(() => Array.from({length:16},(_,i)=>({
    id:i, left:`${4+Math.random()*92}%`, delay:`${Math.random()*8}s`,
    dur:`${6+Math.random()*5}s`, size:5+Math.random()*9, rot:Math.random()*360,
  })),[]);

  const css = `
    @keyframes petalFall {
      0%   { transform:translateY(-30px) rotate(0deg); opacity:0; }
      8%   { opacity:0.55; }
      92%  { opacity:0.2; }
      100% { transform:translateY(110vh) rotate(560deg); opacity:0; }
    }
    @keyframes float {
      0%,100%{ transform:translateY(0px) rotate(-1deg); }
      50%    { transform:translateY(-14px) rotate(1deg); }
    }
    @keyframes shimmerText {
      0%   { background-position:-300% center; }
      100% { background-position:300% center; }
    }
    @keyframes fadeSlide {
      0%   { opacity:0; transform:translateY(22px); }
      100% { opacity:1; transform:translateY(0); }
    }
    @keyframes glowPulse {
      0%,100%{ box-shadow:0 0 0 0 rgba(245,168,66,0.45), 0 8px 32px rgba(245,168,66,0.25); }
      50%    { box-shadow:0 0 0 10px rgba(245,168,66,0), 0 12px 48px rgba(245,168,66,0.45); }
    }
    @keyframes softBreathe {
      0%,100%{ opacity:0.55; }
      50%    { opacity:0.85; }
    }
    @keyframes ringOut {
      0%  { transform:scale(1); opacity:0.4; }
      100%{ transform:scale(2.8); opacity:0; }
    }
    @keyframes badgePop {
      0%   { transform:scale(0.7); opacity:0; }
      70%  { transform:scale(1.05); }
      100% { transform:scale(1); opacity:1; }
    }
    .float-logo { animation: float 5s ease-in-out infinite; }
    .shimmer-text {
      background: linear-gradient(120deg, #FFE082 0%, #F5A623 25%, #FFD060 50%, #F5A623 75%, #FFE082 100%);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerText 5s linear infinite;
    }
    .f1 { animation: fadeSlide 0.6s ease 0.05s both; }
    .f2 { animation: fadeSlide 0.6s ease 0.18s both; }
    .f3 { animation: fadeSlide 0.6s ease 0.31s both; }
    .f4 { animation: fadeSlide 0.6s ease 0.44s both; }
    .f5 { animation: fadeSlide 0.6s ease 0.57s both; }
    .f6 { animation: fadeSlide 0.6s ease 0.70s both; }
    .f7 { animation: fadeSlide 0.6s ease 0.83s both; }
    .f8 { animation: fadeSlide 0.6s ease 0.96s both; }
    .btn-gold {
      background: linear-gradient(135deg, #F5C842 0%, #F5A623 100%);
      color: #1a0f00;
      border: none;
      border-radius: 20px;
      padding: 20px 36px;
      font-size: 18px;
      font-weight: 800;
      cursor: pointer;
      width: 100%;
      letter-spacing: -0.3px;
      animation: glowPulse 2.8s ease-in-out infinite;
      transition: transform 0.15s ease, filter 0.15s ease;
      font-family: inherit;
    }
    .btn-gold:hover  { transform:translateY(-2px) scale(1.02); filter:brightness(1.07); }
    .btn-gold:active { transform:translateY(0) scale(0.98); }
    .perk-card {
      background: rgba(255,255,255,0.035);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 18px;
      padding: 22px 18px;
      transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
      cursor: default;
    }
    .perk-card:hover {
      transform: translateY(-5px);
      border-color: rgba(245,200,66,0.22);
      background: rgba(255,255,255,0.06);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
    .chip {
      display: inline-flex; align-items: center;
      padding: 9px 16px; border-radius: 99px;
      border: 1.5px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5);
      font-size: 13px; font-weight: 500;
      cursor: pointer;
      background: rgba(255,255,255,0.04);
      transition: all 0.15s ease;
      margin: 4px;
      font-family: inherit;
    }
    .chip:hover { border-color:rgba(245,200,66,0.4); color:#F5C842; background:rgba(245,200,66,0.07); }
    .chip.sel   { background:rgba(245,200,66,0.14); border-color:#F5C842; color:#F5C842; font-weight:700; }
    .input-f {
      width:100%; background:rgba(255,255,255,0.05);
      border:1.5px solid rgba(255,255,255,0.1);
      border-radius:14px; padding:14px 16px;
      color:#fff; font-size:15px; font-family:inherit;
      outline:none; transition:border-color 0.2s, background 0.2s;
    }
    .input-f:focus { border-color:rgba(245,200,66,0.5); background:rgba(255,255,255,0.08); }
    .input-f::placeholder { color:rgba(255,255,255,0.22); }
    .tcard {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 18px 18px;
    }
  `;

  // ── SUCCESS ──────────────────────────────────────────────────────────────────
  if (step === 3) return (
    <div style={{
      minHeight:"100dvh",
      background:"radial-gradient(ellipse at 50% 30%, #241830 0%, #0D0B1A 55%, #080910 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"40px 24px", textAlign:"center",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    }}>
      <style>{css}</style>
      <div style={{ fontSize:90, marginBottom:6, animation:"float 3.5s ease-in-out infinite" }}>🌸</div>
      <h1 style={{ color:"#fff", fontSize:38, fontWeight:900, marginBottom:12, letterSpacing:"-1px" }}>
        Welcome to <span className="shimmer-text">Sachi</span>
      </h1>
      <p style={{ color:"rgba(255,255,255,0.6)", fontSize:17, maxWidth:320, lineHeight:1.75, marginBottom:10 }}>
        Your application is in. We'll be in touch within <strong style={{color:"#F5C842"}}>48 hours</strong>.
      </p>
      <p style={{ color:"rgba(255,255,255,0.3)", fontSize:14, maxWidth:290, lineHeight:1.65, marginBottom:40 }}>
        You're one of the first people to stand for real, unfiltered content. That matters.
        <span style={{color:"#F5C842", display:"block", fontWeight:700, marginTop:8}}>Sachi means Truth 🌸</span>
      </p>
      <button onClick={onBack} className="btn-gold" style={{ maxWidth:290, animation:"none", padding:"16px 36px", fontSize:16 }}>
        Enter Sachi Stream →
      </button>
    </div>
  );

  // ── FORM ──────────────────────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(170deg,#0D0B1A 0%,#111228 100%)", paddingBottom:70, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <style>{css}</style>
      <div style={{ position:"sticky", top:0, background:"rgba(13,11,26,0.94)", backdropFilter:"blur(14px)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"14px 20px", display:"flex", alignItems:"center", gap:12, zIndex:50 }}>
        <button onClick={() => setStep(1)} style={{ background:"rgba(245,200,66,0.1)", border:"1px solid rgba(245,200,66,0.25)", color:"#F5C842", borderRadius:11, width:38, height:38, fontSize:19, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
        <div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>Founding Creator Application</div>
          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:12 }}>{spotsLeft} spots left · ~3 minutes</div>
        </div>
      </div>

      <div style={{ padding:"28px 20px", maxWidth:520, margin:"0 auto" }}>
        {/* Fill bar */}
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:5, marginBottom:30, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pctFilled}%`, background:"linear-gradient(90deg,#F5C842,#F5A623)", borderRadius:99, transition:"width 0.8s ease" }} />
        </div>

        {[
          { label:"Full Name *", key:"full_name", type:"text", ph:"Your full name" },
          { label:"Email Address *", key:"email", type:"email", ph:"you@example.com" },
          { label:"Phone (optional)", key:"phone", type:"tel", ph:"+1 555-000-0000" },
          { label:"Where are you based?", key:"location", type:"text", ph:"City, Country" },
          { label:"Social Media Links", key:"social_links", type:"text", ph:"Instagram, TikTok, YouTube..." },
        ].map(({label,key,type,ph}) => (
          <div key={key} style={{ marginBottom:20 }}>
            <label style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:8 }}>{label}</label>
            <input type={type} value={form[key]} placeholder={ph} onChange={e=>set(key,e.target.value)} className="input-f" />
          </div>
        ))}

        <div style={{ marginBottom:22 }}>
          <label style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:10 }}>Content Type *</label>
          <div style={{ display:"flex", flexWrap:"wrap", margin:"-4px" }}>
            {CONTENT_TYPES.map(ct => <div key={ct} className={`chip${form.content_type===ct?" sel":""}`} onClick={()=>set("content_type",ct)}>{ct}</div>)}
          </div>
        </div>

        <div style={{ marginBottom:22 }}>
          <label style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:10 }}>Your Audience Size</label>
          <div style={{ display:"flex", flexWrap:"wrap", margin:"-4px" }}>
            {FOLLOWER_OPTIONS.map(fo => <div key={fo} className={`chip${form.follower_count===fo?" sel":""}`} onClick={()=>set("follower_count",fo)}>{fo}</div>)}
          </div>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:8 }}>Why Sachi? *</label>
          <textarea value={form.why_sachi} placeholder="What drives your content? Why do you want to be a Sachi Founding Creator?" onChange={e=>set("why_sachi",e.target.value)} className="input-f" style={{ height:110, resize:"vertical", lineHeight:1.65 }} />
        </div>

        <div style={{ marginBottom:32 }}>
          <label style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, letterSpacing:0.8, textTransform:"uppercase", display:"block", marginBottom:8 }}>About your content</label>
          <textarea value={form.content_description} placeholder="What do you create? Your style, topics, vibe..." onChange={e=>set("content_description",e.target.value)} className="input-f" style={{ height:90, resize:"vertical", lineHeight:1.65 }} />
        </div>

        {error && <div style={{ background:"rgba(220,50,50,0.1)", border:"1px solid rgba(220,50,50,0.3)", borderRadius:12, padding:"12px 16px", color:"#ff8080", fontSize:14, marginBottom:20 }}>{error}</div>}

        <button onClick={submit} disabled={loading} className="btn-gold">
          {loading ? "Submitting..." : "🌸  Submit My Application"}
        </button>
        <div style={{ textAlign:"center", marginTop:14, color:"rgba(255,255,255,0.18)", fontSize:12 }}>We review every application personally · Reply within 48 hours</div>
      </div>
    </div>
  );

  // ── HERO LANDING ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:"100dvh",
      background:"radial-gradient(ellipse at 50% -10%, #2d1f60 0%, #1a1035 30%, #0D0B1A 65%, #080910 100%)",
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      overflowX:"hidden",
    }}>
      <style>{css}</style>

      {/* Floating petals */}
      {PETALS.map(p=>(
        <div key={p.id} style={{ position:"fixed",top:-30,left:p.left,pointerEvents:"none",zIndex:0,animation:`petalFall ${p.dur} ${p.delay} ease-in infinite` }}>
          <div style={{ width:p.size,height:p.size,background:"radial-gradient(circle at 35%,rgba(255,180,200,0.8),rgba(255,100,140,0.3))",borderRadius:"50% 12% 50% 12%",transform:`rotate(${p.rot}deg)` }} />
        </div>
      ))}

      {/* Soft gradient orbs */}
      <div style={{ position:"fixed", top:"-15%", left:"50%", transform:"translateX(-50%)", width:"900px", height:"500px", background:"radial-gradient(ellipse,rgba(120,60,220,0.18) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"10%", right:"-10%", width:"400px", height:"400px", background:"radial-gradient(circle,rgba(245,168,66,0.07) 0%,transparent 65%)", pointerEvents:"none", zIndex:0 }} />

      {/* Nav */}
      <nav style={{ position:"sticky",top:0,zIndex:100,background:"rgba(13,11,26,0.8)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }} onClick={onBack}>
          <img src="/sachi-icon-v4.png" alt="Sachi" style={{ width:34,height:34,borderRadius:10,filter:"drop-shadow(0 0 8px rgba(245,200,66,0.4))" }} />
          <span style={{ fontSize:21,fontWeight:900,background:"linear-gradient(135deg,#F5C842,#FFB020)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Sachi</span>
          <span style={{ fontSize:11,color:"rgba(245,200,66,0.7)",fontWeight:700 }}>™</span>
        </div>
        <button onClick={()=>setStep(2)} style={{ background:"linear-gradient(135deg,#F5C842,#F5A623)",color:"#1a0f00",border:"none",borderRadius:99,padding:"9px 20px",fontSize:14,fontWeight:800,cursor:"pointer" }}>
          Apply Now →
        </button>
      </nav>

      <div style={{ maxWidth:580,margin:"0 auto",padding:"0 22px",position:"relative",zIndex:1 }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section style={{ textAlign:"center",paddingTop:60,paddingBottom:52 }}>

          {/* Logo */}
          <div className="float-logo f1" style={{ display:"flex",alignItems:"center",justifyContent:"center",marginBottom:30,position:"relative" }}>
            <div style={{ position:"absolute",inset:"-18px",borderRadius:"50%",border:"1.5px solid rgba(245,200,66,0.18)",animation:"ringOut 3.5s ease-out 0.8s infinite" }} />
            <div style={{ position:"absolute",inset:"-18px",borderRadius:"50%",border:"1.5px solid rgba(245,200,66,0.12)",animation:"ringOut 3.5s ease-out 2.1s infinite" }} />
            <img src="/sachi-icon-v4.png" alt="Sachi" style={{ width:108,height:108,borderRadius:30,display:"block",filter:"drop-shadow(0 4px 24px rgba(245,200,66,0.45)) drop-shadow(0 0 60px rgba(120,60,200,0.3))" }} />
          </div>

          {/* Badge pill */}
          <div className="f2" style={{ display:"inline-flex",alignItems:"center",gap:7,background:"rgba(245,200,66,0.1)",border:"1px solid rgba(245,200,66,0.2)",borderRadius:99,padding:"6px 16px",marginBottom:24 }}>
            <span style={{ fontSize:12 }}>🌸</span>
            <span style={{ color:"#F5C842",fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" }}>Founding Creator Program</span>
          </div>

          {/* Headline */}
          <h1 className="f3" style={{ fontSize:"clamp(36px,8vw,58px)",fontWeight:900,lineHeight:1.08,letterSpacing:"-2px",color:"#fff",marginBottom:20 }}>
            The platform that<br/>
            <span className="shimmer-text">actually wants you</span>
          </h1>

          {/* Subheadline */}
          <p className="f4" style={{ color:"rgba(255,255,255,0.55)",fontSize:17,lineHeight:1.8,maxWidth:420,margin:"0 auto 34px" }}>
            Sachi is the platform built for creators who take their craft seriously. 
            We're inviting <strong style={{color:"rgba(255,255,255,0.85)"}}>50 founding creators</strong> to shape it with us.
          </p>

          {/* Urgency bar */}
          <div className="f5" style={{ display:"inline-flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:36,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"16px 28px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:"#ef4444",animation:"softBreathe 1.5s ease-in-out infinite",flexShrink:0 }} />
              <span style={{ color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:600 }}>Applications open now</span>
            </div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.35)" }}>
              <span style={{ color:"#F5C842",fontWeight:800,fontSize:26 }}>{spotsLeft}</span>
              <span> of 36 spots remaining</span>
            </div>
            <div style={{ width:"100%",background:"rgba(255,255,255,0.08)",borderRadius:99,height:5,overflow:"hidden" }}>
              <div style={{ height:"100%",width:`${pctFilled}%`,background:"linear-gradient(90deg,#F5C842,#F5A623)",borderRadius:99,transition:"width 1s ease" }} />
            </div>
          </div>

          {/* CTA */}
          <div className="f6" style={{ maxWidth:360,margin:"0 auto 14px" }}>
            <button className="btn-gold" onClick={()=>setStep(2)}>
              🌸  Apply for Founding Creator
            </button>
          </div>
          <div className="f7" style={{ color:"rgba(255,255,255,0.2)",fontSize:12 }}>
            Free · 3-minute application · We reply within 48 hours
          </div>
        </section>

        {/* ── SOCIAL PROOF ─────────────────────────────────── */}
        <section style={{ paddingBottom:44 }}>
          <div style={{ textAlign:"center",marginBottom:20 }}>
            <div style={{ color:"rgba(255,255,255,0.25)",fontSize:11,letterSpacing:3,textTransform:"uppercase" }}>What creators are saying</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="tcard">
                <div style={{ color:"rgba(255,255,255,0.65)",fontSize:15,lineHeight:1.65,fontStyle:"italic",marginBottom:10 }}>"{t.quote}"</div>
                <div style={{ color:"rgba(245,200,66,0.6)",fontSize:12,fontWeight:600 }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PERKS GRID ───────────────────────────────────── */}
        <section style={{ paddingBottom:48 }}>
          <div style={{ textAlign:"center",marginBottom:28 }}>
            <div style={{ color:"rgba(255,255,255,0.25)",fontSize:11,letterSpacing:3,textTransform:"uppercase",marginBottom:10 }}>What you unlock</div>
            <h2 style={{ color:"#fff",fontSize:28,fontWeight:800,letterSpacing:"-0.5px" }}>Founding Creator Perks</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {PERKS.map((p,i)=>(
              <div key={i} className="perk-card">
                <div style={{ fontSize:28,marginBottom:10 }}>{p.icon}</div>
                <div style={{ color:p.color,fontWeight:700,fontSize:13,marginBottom:6,lineHeight:1.3 }}>{p.title}</div>
                <div style={{ color:"rgba(255,255,255,0.38)",fontSize:12,lineHeight:1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MANIFESTO ────────────────────────────────────── */}
        <section style={{ marginBottom:48,background:"linear-gradient(135deg,rgba(120,60,200,0.1),rgba(245,168,66,0.05))",border:"1px solid rgba(245,200,66,0.12)",borderRadius:24,padding:"32px 24px",textAlign:"center" }}>
          <div style={{ fontSize:44,marginBottom:14 }}>🌸</div>
          <h2 style={{ color:"#F5C842",fontSize:24,fontWeight:900,marginBottom:14,letterSpacing:"-0.5px" }}>Sachi means Truth</h2>
          <p style={{ color:"rgba(255,255,255,0.5)",fontSize:15,lineHeight:1.85,maxWidth:380,margin:"0 auto 24px" }}>
            We built Sachi because creators deserve a platform that doesn't punish honesty. 
            No algorithm that buries your content. No arbitrary bans. 
            Just you, your story, and people who want to hear it.
          </p>
          <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
            {["🚫 No Shadowbanning","✅ Real Reach","🔒 Your Rules","🎙️ Every Voice Matters"].map(tag=>(
              <div key={tag} style={{ background:"rgba(245,200,66,0.08)",border:"1px solid rgba(245,200,66,0.15)",borderRadius:99,padding:"6px 14px",color:"rgba(255,255,255,0.55)",fontSize:12,fontWeight:600 }}>{tag}</div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section style={{ textAlign:"center",paddingBottom:72 }}>
          <h2 style={{ color:"#fff",fontSize:30,fontWeight:900,letterSpacing:"-1px",marginBottom:12 }}>
            Ready to join us?
          </h2>
          <p style={{ color:"rgba(255,255,255,0.35)",fontSize:15,marginBottom:30,lineHeight:1.65 }}>
            36 spots left. Lifetime perks. Zero cost.<br/>This offer won't last.
          </p>
          <div style={{ maxWidth:360,margin:"0 auto 18px" }}>
            <button className="btn-gold" onClick={()=>setStep(2)}>
              🌸  Apply for Founding Creator
            </button>
          </div>
          <div style={{ color:"rgba(255,255,255,0.15)",fontSize:12 }}>sachistream.com · © 2026 Sachi™</div>
        </section>

      </div>
    </div>
  );
}
