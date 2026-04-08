import React, { useState } from "react";
import { request } from "./api.js";

const CONTENT_TYPES = [
  "Short Videos","Podcasts","Live Streams","News & Commentary",
  "Music","Comedy","Sports","Fitness & Wellness","Food & Lifestyle",
  "Tech & Gaming","Education","Other"
];
const FOLLOWER_OPTIONS = [
  "Just starting out","Under 1K","1K–10K","10K–100K","100K+"
];
const PERKS = [
  { icon: "🌸", title: "Founding Creator Badge", desc: "Permanent verified badge on your profile — shows you were here from day one." },
  { icon: "🎙️", title: "First Live Podcast Slot", desc: "Priority access to go live on Sachi Stream before the public launch." },
  { icon: "📣", title: "Featured in the Feed", desc: "Your content gets promoted to every new user during the first 30 days." },
  { icon: "🚫", title: "Zero Censorship — Ever", desc: "No shadowbanning. No algorithm suppression. No demonetisation risk." },
  { icon: "📊", title: "Early Analytics Access", desc: "Full creator dashboard before it's available to the public." },
  { icon: "💬", title: "Direct Line to the Team", desc: "Your feedback goes straight to the founders. You help shape this platform." },
];

export default function FoundingCreatorPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", location: "",
    content_type: "", social_links: "", follower_count: "",
    why_sachi: "", content_description: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.content_type || !form.why_sachi.trim()) {
      setError("Please fill in all required fields marked with *");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await request("POST", "/apps/69b2ee18a8e6fb58c7f0261c/entities/FoundingCreator", { ...form, status: "Pending" });
      setStep(3);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.06)",
    border:"1px solid rgba(245,200,66,0.2)", borderRadius:12,
    padding:"12px 14px", color:"#fff", fontSize:15, outline:"none", boxSizing:"border-box"
  };

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (step === 3) return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(160deg,#0B0C1A 0%,#12132B 60%,#1a0f2e 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:16 }}>🌸</div>
      <h1 style={{ color:"#F5C842", fontSize:28, fontWeight:800, margin:"0 0 12px" }}>You're In!</h1>
      <p style={{ color:"#ccc", fontSize:16, maxWidth:320, lineHeight:1.6, margin:"0 0 8px" }}>
        Your application has been received. We'll review it and get back to you within 48 hours.
      </p>
      <p style={{ color:"#888", fontSize:14, maxWidth:300, lineHeight:1.5, margin:"0 0 32px" }}>
        Welcome to the beginning of something real. <span style={{ color:"#F5C842" }}>Sachi means Truth</span> — and you're one of the first to stand for it.
      </p>
      <button onClick={onBack}
        style={{ background:"#F5C842", color:"#0B0C1A", border:"none", borderRadius:14, padding:"14px 36px", fontSize:16, fontWeight:700, cursor:"pointer" }}>
        Back to Sachi Stream
      </button>
    </div>
  );

  // ── FORM ───────────────────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(160deg,#0B0C1A 0%,#12132B 100%)", paddingBottom:40 }}>
      <div style={{ display:"flex", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid rgba(245,200,66,0.15)", position:"sticky", top:0, background:"#0B0C1A", zIndex:10 }}>
        <button onClick={() => setStep(1)} style={{ background:"none", border:"none", color:"#F5C842", fontSize:22, cursor:"pointer", marginRight:12, padding:0 }}>←</button>
        <div>
          <div style={{ color:"#F5C842", fontWeight:800, fontSize:17 }}>Founding Creator Application</div>
          <div style={{ color:"#888", fontSize:12 }}>Takes about 3 minutes · 50 spots available</div>
        </div>
      </div>

      <div style={{ padding:"24px 20px", maxWidth:480, margin:"0 auto" }}>
        {[
          { label:"Full Name *", key:"full_name", type:"text", placeholder:"Your full name" },
          { label:"Email Address *", key:"email", type:"email", placeholder:"you@example.com" },
          { label:"Phone (optional)", key:"phone", type:"tel", placeholder:"+1 555-000-0000" },
          { label:"Location (City, Country)", key:"location", type:"text", placeholder:"e.g. New York, USA" },
          { label:"Your Social Media Links", key:"social_links", type:"text", placeholder:"Instagram, TikTok, YouTube, etc." },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom:18 }}>
            <label style={{ color:"#ccc", fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>{label}</label>
            <input type={type} value={form[key]} placeholder={placeholder}
              onChange={e => set(key, e.target.value)} style={inputStyle} />
          </div>
        ))}

        <div style={{ marginBottom:18 }}>
          <label style={{ color:"#ccc", fontSize:13, fontWeight:600, display:"block", marginBottom:8 }}>What type of content do you make? *</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {CONTENT_TYPES.map(t => (
              <button key={t} onClick={() => set("content_type", t)} style={{
                background: form.content_type === t ? "#F5C842" : "rgba(255,255,255,0.07)",
                color: form.content_type === t ? "#0B0C1A" : "#ccc",
                border: form.content_type === t ? "none" : "1px solid rgba(255,255,255,0.12)",
                borderRadius:20, padding:"7px 14px", fontSize:13,
                fontWeight: form.content_type === t ? 700 : 400, cursor:"pointer"
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={{ color:"#ccc", fontSize:13, fontWeight:600, display:"block", marginBottom:8 }}>Current audience size (all platforms)</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {FOLLOWER_OPTIONS.map(f => (
              <button key={f} onClick={() => set("follower_count", f)} style={{
                background: form.follower_count === f ? "#F5C842" : "rgba(255,255,255,0.07)",
                color: form.follower_count === f ? "#0B0C1A" : "#ccc",
                border: form.follower_count === f ? "none" : "1px solid rgba(255,255,255,0.12)",
                borderRadius:20, padding:"7px 14px", fontSize:13,
                fontWeight: form.follower_count === f ? 700 : 400, cursor:"pointer"
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <label style={{ color:"#ccc", fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Tell us about your content</label>
          <textarea value={form.content_description} rows={3}
            placeholder="What do you create? Who's your audience? What's your style?"
            onChange={e => set("content_description", e.target.value)}
            style={{ ...inputStyle, resize:"none", fontFamily:"inherit" }} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ color:"#ccc", fontSize:13, fontWeight:600, display:"block", marginBottom:6 }}>Why do you want to join Sachi? *</label>
          <textarea value={form.why_sachi} rows={4}
            placeholder="What brought you here? What does 'truth in content' mean to you?"
            onChange={e => set("why_sachi", e.target.value)}
            style={{ ...inputStyle, resize:"none", fontFamily:"inherit" }} />
        </div>

        {error && (
          <div style={{ color:"#FF6B6B", fontSize:14, marginBottom:16, padding:"10px 14px", background:"rgba(255,107,107,0.1)", borderRadius:10 }}>
            {error}
          </div>
        )}

        <button onClick={submit} disabled={loading} style={{
          width:"100%", background: loading ? "#555" : "linear-gradient(135deg,#F5C842,#e6a800)",
          color:"#0B0C1A", border:"none", borderRadius:16, padding:"16px",
          fontSize:17, fontWeight:800, cursor: loading ? "not-allowed" : "pointer"
        }}>
          {loading ? "Submitting..." : "🌸 Submit My Application"}
        </button>
      </div>
    </div>
  );

  // ── LANDING ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100dvh", background:"linear-gradient(160deg,#0B0C1A 0%,#12132B 60%,#1a0f2e 100%)", overflowY:"auto" }}>
      <div style={{ padding:"16px 20px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#F5C842", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:6, padding:0 }}>
          ← Back to Sachi
        </button>
      </div>

      <div style={{ textAlign:"center", padding:"20px 24px 32px" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>🌸</div>
        <div style={{ display:"inline-block", background:"rgba(245,200,66,0.12)", border:"1px solid rgba(245,200,66,0.3)", borderRadius:20, padding:"5px 16px", color:"#F5C842", fontSize:11, fontWeight:800, letterSpacing:1.5, marginBottom:18, textTransform:"uppercase" }}>
          Limited — 50 Founding Spots
        </div>
        <h1 style={{ color:"#fff", fontSize:30, fontWeight:900, margin:"0 0 14px", lineHeight:1.2 }}>
          Be the Voice of<br /><span style={{ color:"#F5C842" }}>Something Real</span>
        </h1>
        <p style={{ color:"#aaa", fontSize:16, lineHeight:1.65, maxWidth:340, margin:"0 auto 28px" }}>
          Sachi Stream launches <strong style={{ color:"#fff" }}>May 2026</strong>. We're the anti-TikTok — built for authentic creators who are done being censored, suppressed, and replaced by AI. We're looking for <strong style={{ color:"#fff" }}>50 founding creators</strong> to shape what this platform becomes.
        </p>
        <button onClick={() => setStep(2)} style={{
          background:"linear-gradient(135deg,#F5C842,#e6a800)", color:"#0B0C1A",
          border:"none", borderRadius:16, padding:"16px 40px", fontSize:17,
          fontWeight:800, cursor:"pointer", boxShadow:"0 4px 24px rgba(245,200,66,0.35)"
        }}>
          Apply Now — It's Free
        </button>
        <div style={{ color:"#555", fontSize:12, marginTop:10 }}>No charge. No obligation. Just your story.</div>
      </div>

      <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(245,200,66,0.2),transparent)", margin:"0 24px 32px" }} />

      <div style={{ padding:"0 20px 32px" }}>
        <h2 style={{ color:"#fff", fontSize:20, fontWeight:800, textAlign:"center", marginBottom:20 }}>What Founding Creators Get</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {PERKS.map(p => (
            <div key={p.title} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(245,200,66,0.12)", borderRadius:16, padding:"16px 18px", display:"flex", gap:14, alignItems:"flex-start" }}>
              <span style={{ fontSize:28, flexShrink:0 }}>{p.icon}</span>
              <div>
                <div style={{ color:"#F5C842", fontWeight:700, fontSize:15, marginBottom:4 }}>{p.title}</div>
                <div style={{ color:"#999", fontSize:13, lineHeight:1.5 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin:"0 20px 32px", background:"rgba(245,200,66,0.06)", border:"1px solid rgba(245,200,66,0.2)", borderRadius:20, padding:"24px 20px", textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>📣</div>
        <p style={{ color:"#ddd", fontSize:15, lineHeight:1.7, margin:0 }}>
          <em>"The biggest platforms reward performance over reality. Sachi was built for creators who are done performing — and ready to just be <strong style={{ color:"#F5C842" }}>real</strong>."</em>
        </p>
        <div style={{ color:"#666", fontSize:12, marginTop:12 }}>— Jaya Gunaratne, Founder of Sachi Stream</div>
      </div>

      <div style={{ padding:"0 20px 60px", textAlign:"center" }}>
        <button onClick={() => setStep(2)} style={{
          width:"100%", maxWidth:400, background:"linear-gradient(135deg,#F5C842,#e6a800)",
          color:"#0B0C1A", border:"none", borderRadius:16, padding:"16px",
          fontSize:17, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 24px rgba(245,200,66,0.3)"
        }}>
          🌸 Apply to Be a Founding Creator
        </button>
        <div style={{ color:"#555", fontSize:12, marginTop:10 }}>Launching May 2026 · 50 spots · sachistream.com</div>
      </div>
    </div>
  );
}
