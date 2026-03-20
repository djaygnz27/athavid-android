import { useState } from "react";

const POSTER = "https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/348149788_generated_image.png";
const SCREENPLAY_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/a85ec42fb_THE_WATCHERS_Feature_v2.pdf";
const PITCHDECK_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/ba585c812_THE_WATCHERS_PitchDeck.pdf";

const characters = [
  { name: "MARCUS BELL", role: "17 — The Brains", desc: "Amateur radio operator and astronomy obsessive. Has been picking up alien signals from the moon for six months on his rooftop antenna. Everyone thought it was a hobby. Tonight it's everything.", side: "kids", emoji: "📡" },
  { name: "PRIYA NAIR", role: "17 — The Prodigy", desc: "Physics genius. Skipped two grades. MIT-bound (her parents don't know yet). Deciphers the alien signal structure and produces the mathematical proof that forces the White House to listen.", side: "kids", emoji: "🔬" },
  { name: "DANNY ORTEGA", role: "18 — The Heart", desc: "Class clown. Failed physics twice. Somehow the most emotionally intelligent person in every room. His job tonight: keep everyone from panicking. Including himself.", side: "kids", emoji: "😄" },
  { name: "JORDAN LEE", role: "16 — The Sophomore", desc: "The youngest. Fearless. Zero filter. Says the things adults are too scared to say out loud. Walks into the Situation Room and tells a four-star general to reconsider who he's talking down to.", side: "kids", emoji: "⚡" },
  { name: "AIDEN CROSS", role: "17 — The Hacker", desc: "Quiet. Runs their encrypted comms and taps into NASA's monitoring feeds. Doesn't talk much. When he does, it matters. First to say 'They're here' when the screens go dark.", side: "kids", emoji: "💻" },
  { name: "DR. ELENA VASQUEZ", role: "NASA Astrophysicist", desc: "Has been tracking the same lunar signals for 3 years with million-dollar equipment. The kids figured it out first with a rooftop antenna. She will never fully admit how much that bothers her.", side: "american", emoji: "🔭" },
  { name: "PRESIDENT DIANE HARRIS", role: "U.S. President", desc: "First female President. Being pushed toward nuclear authorization. Five teenagers and an alien Elder change her mind in one night.", side: "american", emoji: "🇺🇸" },
  { name: "KAEL", role: "Alien Elder", desc: "Ancient. Calm. 4,000 years of watching without acting. He chose the kids because they never stopped looking up. Gives the sphere of light not to the President — but to Marcus.", side: "alien", emoji: "👽" },
  { name: "SERA", role: "Young Alien", desc: "Fascinated by human youth culture. She's the one who decided to answer Marcus's signal six months ago. She's been watching the rooftop ever since.", side: "alien", emoji: "✨" },
  { name: "ZEN", role: "Alien Technician", desc: "Dry wit. Manages the moon base. Notes that a teenager decoded their signal before any government did. Finds this 'humbling.'", side: "alien", emoji: "🖥️" },
  { name: "DR. CYRUS AMIRI", role: "Iranian Nuclear Physicist", desc: "Father. Scientist. Secretly in contact with Vasquez for months. Trying to stop the war from inside Tehran.", side: "iranian", emoji: "🇮🇷" },
  { name: "GENERAL MARCUS COLE", role: "Four-Star General", desc: "The hawk. Pushing hardest for Protocol Seven. Gets told off by a 16-year-old sophomore. Has no response.", side: "american", emoji: "⭐" },
];

const sideColor = {
  kids:     { bg: "rgba(201,168,76,0.12)",  border: "#C9A84C", label: "🎒 THE LAKEVIEW FIVE" },
  american: { bg: "rgba(30,77,183,0.12)",   border: "#1E4DB7", label: "🇺🇸 AMERICAN" },
  iranian:  { bg: "rgba(22,120,60,0.12)",   border: "#16784C", label: "🇮🇷 IRANIAN" },
  alien:    { bg: "rgba(120,50,200,0.12)",  border: "#7832C8", label: "👽 ALIEN" },
};

export default function TheWatchers() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#050C1F 0%,#0A1535 40%,#060E20 100%)", color: "#E8EDF8", fontFamily: "'Georgia',serif" }}>
      <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, backgroundImage:`radial-gradient(1px 1px at 15% 25%,rgba(255,255,255,.7) 0%,transparent 100%),radial-gradient(1px 1px at 75% 8%,rgba(255,255,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 45% 75%,rgba(255,255,255,.6) 0%,transparent 100%),radial-gradient(1px 1px at 88% 42%,rgba(255,255,255,.4) 0%,transparent 100%),radial-gradient(1px 1px at 30% 60%,rgba(255,255,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 60% 20%,rgba(255,255,255,.6) 0%,transparent 100%)`, pointerEvents:"none", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1 }}>

        {/* HERO */}
        <div style={{ position:"relative", overflow:"hidden", minHeight:"92vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <img src={POSTER} alt="The Watchers" style={{ position:"absolute", top:0, left:0, right:0, bottom:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.32 }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"55%", background:"linear-gradient(transparent,#050C1F)" }} />
          <div style={{ position:"relative", textAlign:"center", padding:"0 24px", maxWidth:860 }}>
            <div style={{ fontSize:11, letterSpacing:6, color:"#C9A84C", marginBottom:18, fontFamily:"sans-serif", fontWeight:700 }}>AN ORIGINAL FEATURE FILM · 90 MINUTES</div>
            <h1 style={{ fontSize:"clamp(52px,11vw,100px)", fontWeight:700, margin:"0 0 6px", letterSpacing:8, color:"#FFFFFF", textShadow:"0 0 80px rgba(100,140,255,.5),0 4px 40px rgba(0,0,0,.9)" }}>THE WATCHERS</h1>
            <div style={{ width:80, height:2, background:"#C9A84C", margin:"0 auto 20px", borderRadius:2 }} />
            <p style={{ fontSize:"clamp(15px,2.4vw,19px)", lineHeight:1.7, color:"#C9A84C", fontStyle:"italic", marginBottom:12 }}>
              "They have been watching us for 4,000 years.<br/>Tonight, they step in."
            </p>
            <p style={{ fontSize:13, color:"rgba(201,168,76,.7)", fontFamily:"sans-serif", letterSpacing:1, marginBottom:28 }}>
              Five high school kids from New Jersey heard the signal first. Nobody believed them. 🎒📡
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:32 }}>
              {["Science Fiction","Political Thriller","Coming-of-Age","Feature Film"].map(t=>(
                <span key={t} style={{ padding:"5px 14px", borderRadius:20, border:"1px solid rgba(201,168,76,.35)", color:"#C9A84C", fontSize:11, letterSpacing:2, fontFamily:"sans-serif", fontWeight:600 }}>{t}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{ padding:"14px 32px", background:"#1E4DB7", color:"white", textDecoration:"none", borderRadius:4, fontFamily:"sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, boxShadow:"0 4px 24px rgba(30,77,183,.5)" }}>📄 READ THE SCREENPLAY</a>
              <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{ padding:"14px 32px", background:"transparent", color:"#C9A84C", textDecoration:"none", borderRadius:4, fontFamily:"sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, border:"2px solid #C9A84C" }}>🎬 PITCH DECK</a>
            </div>
          </div>
        </div>

        {/* LOGLINE */}
        <div style={{ maxWidth:840, margin:"0 auto", padding:"56px 24px 16px", textAlign:"center" }}>
          <p style={{ fontSize:"clamp(15px,2.3vw,19px)", lineHeight:1.85, color:"#B8C4D8", fontStyle:"italic" }}>
            When America and Iran push the world to the brink of nuclear war, five high school kids from New Jersey — who've been secretly communicating with an alien civilization on the moon for six months — must convince the President, a four-star general, and a room full of skeptics that the visitors are coming. Not to conquer. Not to destroy. Just to stop us from tearing a hole in the fabric of the universe.
          </p>
        </div>

        {/* LAKEVIEW FIVE SPOTLIGHT */}
        <div style={{ maxWidth:840, margin:"24px auto 40px", padding:"0 24px" }}>
          <div style={{ background:"rgba(201,168,76,.07)", border:"1px solid rgba(201,168,76,.25)", borderLeft:"4px solid #C9A84C", borderRadius:8, padding:28 }}>
            <div style={{ fontSize:10, letterSpacing:3, color:"#C9A84C", fontFamily:"sans-serif", fontWeight:700, marginBottom:10 }}>INTRODUCING</div>
            <h2 style={{ margin:"0 0 12px", fontSize:22, color:"#C9A84C", fontFamily:"sans-serif", letterSpacing:3 }}>THE LAKEVIEW FIVE</h2>
            <p style={{ margin:"0 0 12px", color:"#E8EDF8", fontSize:14, lineHeight:1.8 }}>
              <em>Five high school students from Lakeview, New Jersey. One rooftop. One antenna array. Six months of signals nobody else was paying attention to.</em>
            </p>
            <p style={{ margin:"0 0 12px", color:"#B8C4D8", fontSize:13, lineHeight:1.8 }}>
              Marcus Bell heard it first. Priya decoded it. Danny kept everyone sane. Jordan said what nobody else would. Aiden got them into NASA's monitoring system on a school night.
            </p>
            <p style={{ margin:0, color:"#B8C4D8", fontSize:13, lineHeight:1.8, fontStyle:"italic" }}>
              On page 47 of Marcus's logbook, he wrote: <span style={{ color:"#C9A84C" }}>"What if they're already listening?"</span><br/>They were.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div style={{ maxWidth:940, margin:"0 auto", padding:"0 24px 80px" }}>
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,.1)", marginBottom:40, flexWrap:"wrap" }}>
            {[{id:"story",label:"THE STORY"},{id:"characters",label:"CHARACTERS"},{id:"themes",label:"THEMES"},{id:"contact",label:"CONTACT"}].map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{ padding:"13px 22px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"sans-serif", fontSize:11, fontWeight:700, letterSpacing:2, color:activeTab===tab.id?"#C9A84C":"rgba(255,255,255,.35)", borderBottom:activeTab===tab.id?"2px solid #C9A84C":"2px solid transparent", transition:"all .2s" }}>{tab.label}</button>
            ))}
          </div>

          {activeTab==="story" && (
            <div>
              {[
                { act:"ACT ONE", title:"THE KIDS WHO HEARD IT FIRST", time:"~30 min · Pages 1–30", color:"#1E4DB7",
                  beats:[
                    "The moon base. Kael and ZEN watch Iran strike a US base — 43 dead. ZEN: 'The usual suspects. We've seen this pattern before.' Then the news ticker scrolls. ZEN: '...Or not.'",
                    "MARCUS BELL's rooftop in New Jersey. Five kids under Christmas lights. His antenna picks up a signal from the lunar surface — prime numbers, repeating, unmistakably intelligent.",
                    "Marcus answers with the Fibonacci sequence. On the moon, Sera tells Kael: 'He answered.' ZEN: 'Four thousand years and a teenager cracks it. That's humbling.'",
                    "The aliens send back four words: 'YOUR GOVERNMENTS ARE ABOUT TO MAKE A MISTAKE THAT CANNOT BE UNDONE. WE NEED YOU TO STOP THEM.'",
                    "Jordan: 'Us?' Marcus: 'Us.' Danny: 'Why us? We're in eleventh grade.' Priya, quietly: 'Because we listened. We were the only ones who listened.'",
                  ]
                },
                { act:"ACT TWO", title:"NOBODY BELIEVES HIGH SCHOOL KIDS", time:"~45 min · Pages 31–75", color:"#0F2460",
                  beats:[
                    "The kids track down Dr. Vasquez at NASA JPL. She's been trying to decode the same signals for 3 years with million-dollar equipment. Marcus did it on a rooftop. She gets on a plane.",
                    "Vasquez's garage session with the five kids. The full signal exchange — the aliens explain temporal fractures, three lost civilizations, the approaching point of no return.",
                    "Road trip to Washington. Danny lies to his mom. They arrive at the White House. Agent Shaw stares at five teenagers. 'I went to Quantico for this.'",
                    "In the Situation Room, Cole dismisses them. Jordan: 'And you're about to nuke a country. So maybe reconsider who you're talking down to.' Dead silence.",
                    "The aliens make contact through Marcus's laptop in the Situation Room: 'WE CAME TO YOU FIRST BECAUSE YOU LISTENED. BECAUSE YOU WERE NOT AFRAID TO LOOK UP.'",
                    "Cole pushes for launch. Marcus, steady: 'General, I've been talking to them for 48 hours. You've been trying to bomb your way out of this for 48 years. How's that working?'",
                  ]
                },
                { act:"ACT THREE", title:"THE INTERVENTION", time:"~30 min · Pages 76–105", color:"#16784C",
                  beats:[
                    "Every screen goes dark. Aiden, quietly from his corner: 'They're here.' Three ships appear simultaneously over Washington, Tehran, and Moscow.",
                    "Kael descends on the White House lawn. The kids walk out behind Harris and Vasquez. Shaw tries to stop them. Vasquez: 'They were invited.' Shaw: 'By who?' Vasquez points at the ship.",
                    "Kael looks past Harris. Past Vasquez. His eyes settle on Marcus. 'Marcus Bell. You were the first to answer. Six months ago. You sent a single prime number.' Marcus: 'Forty-one.'",
                    "Kael: 'We had almost given up.' Jordan steps forward: 'Why us specifically?' Kael: 'Most humans stopped asking questions. You never did.'",
                    "The sphere of light. The nuclear scars. Three lost civilizations. Kael offers the sphere not to the President — but to Marcus.",
                    "The ships depart. Cole closes the authorization case. Harris calls Farzan: 'It's time we talked.'",
                    "On the moon: ZEN: 'The boy kept a logbook for six months. Every night. Just in case.' Kael: 'On this planet, that's either optimism or stubbornness.' ZEN: 'Which?' Kael: 'Usually both.'",
                  ]
                },
              ].map(({act,title,time,color,beats})=>(
                <div key={act} style={{ marginBottom:28 }}>
                  <div style={{ background:color, padding:"13px 20px", borderRadius:"4px 4px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ fontSize:9, letterSpacing:3, color:"rgba(255,255,255,.55)", fontFamily:"sans-serif" }}>{act} — </span>
                      <span style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:"sans-serif", letterSpacing:1 }}>{title}</span>
                    </div>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.55)", fontFamily:"sans-serif" }}>{time}</span>
                  </div>
                  <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderTop:"none", borderRadius:"0 0 4px 4px", padding:"18px 22px" }}>
                    {beats.map((b,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
                        <span style={{ color:"#C9A84C", marginTop:3, flexShrink:0 }}>▸</span>
                        <p style={{ margin:0, color:"#B8C4D8", lineHeight:1.75, fontSize:14 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop:32, padding:28, background:"rgba(15,36,96,.4)", border:"1px solid rgba(30,77,183,.3)", borderRadius:8, textAlign:"center" }}>
                <p style={{ margin:"0 0 6px", color:"#B8C4D8", fontSize:13, fontStyle:"italic", lineHeight:1.9 }}>
                  "Marcus Bell kept a logbook for six months. Every night. Just in case.<br/>On page 47, he wrote: 'What if they're already listening?'<br/>They were."
                </p>
                <p style={{ margin:0, color:"rgba(255,255,255,.3)", fontSize:11, fontFamily:"sans-serif", letterSpacing:2 }}>— FINAL TITLE CARD, THE WATCHERS</p>
              </div>
            </div>
          )}

          {activeTab==="characters" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:16 }}>
              {characters.map(c=>{
                const s=sideColor[c.side];
                return (
                  <div key={c.name} style={{ background:s.bg, border:`1px solid ${s.border}35`, borderLeft:`3px solid ${s.border}`, borderRadius:6, padding:18 }}>
                    <div style={{ fontSize:9, color:s.border, letterSpacing:2, fontFamily:"sans-serif", fontWeight:700, marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontSize:24, marginBottom:6 }}>{c.emoji}</div>
                    <h3 style={{ margin:"0 0 3px", fontSize:13, color:"white", fontFamily:"sans-serif", letterSpacing:1 }}>{c.name}</h3>
                    <div style={{ fontSize:11, color:s.border, fontStyle:"italic", marginBottom:8, fontFamily:"sans-serif" }}>{c.role}</div>
                    <p style={{ margin:0, fontSize:12, lineHeight:1.75, color:"#B8C4D8" }}>{c.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab==="themes" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:18, marginBottom:36 }}>
                {[
                  {icon:"📡",title:"The Power of Curiosity",desc:"Five teenagers with a rooftop antenna beat every government and space agency on Earth. The signal was always there. Most people stopped listening. They never did."},
                  {icon:"💥",title:"Nuclear Weapons as a Cosmic Threat",desc:"Not just a human problem. Every detonation since 1945 has torn the fabric of space-time. Three civilizations already lost to the cascading effect."},
                  {icon:"👁️",title:"Non-Interference vs. Responsibility",desc:"4,000 years of watching without acting. What finally tips the vote is not the politics. It's five kids on a rooftop who never stopped asking questions."},
                  {icon:"🌍",title:"Perspective",desc:"What does a border dispute look like from 240,000 miles away? Kael: 'You are fighting over a strip of desert on a planet you will outgrow in two hundred years.'"},
                  {icon:"🤝",title:"Adults Who Stopped Believing",desc:"Kael: 'They are not children. They are the ones who still believe the universe has answers. Adults on your planet stopped believing that somewhere between bills and borders.'"},
                  {icon:"✨",title:"First Contact as a Mirror",desc:"The aliens don't come to conquer or save. They come to hold up a mirror — and give the sphere of light not to the President, but to the kid who kept the logbook."},
                ].map(({icon,title,desc})=>(
                  <div key={title} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:6, padding:22 }}>
                    <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
                    <h3 style={{ margin:"0 0 10px", fontSize:13, color:"#C9A84C", fontFamily:"sans-serif", letterSpacing:1 }}>{title}</h3>
                    <p style={{ margin:0, fontSize:13, lineHeight:1.75, color:"#B8C4D8" }}>{desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(30,77,183,.12)", border:"1px solid rgba(30,77,183,.25)", borderRadius:6, padding:32, textAlign:"center" }}>
                <p style={{ fontSize:18, lineHeight:1.9, fontStyle:"italic", color:"#C9A84C", margin:"0 0 14px" }}>
                  "Keep looking up, Marcus Bell.<br/>We never left."
                </p>
                <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,.35)", fontFamily:"sans-serif", letterSpacing:2 }}>— KAEL, THE WATCHERS</p>
              </div>
            </div>
          )}

          {activeTab==="contact" && (
            <div style={{ maxWidth:580, margin:"0 auto" }}>
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:40, textAlign:"center", marginBottom:28 }}>
                <div style={{ fontSize:48, marginBottom:14 }}>🎬</div>
                <h2 style={{ margin:"0 0 6px", fontSize:22, color:"white", fontFamily:"sans-serif", letterSpacing:3 }}>JAY GUNARATNE</h2>
                <p style={{ margin:"0 0 24px", color:"#C9A84C", fontStyle:"italic", fontSize:13 }}>Writer & Creator — The Watchers</p>
                <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
                  <a href="mailto:jaygnz27@gmail.com" style={{ color:"#B8C4D8", textDecoration:"none", fontSize:14 }}>📧 jaygnz27@gmail.com</a>
                  <span style={{ color:"#B8C4D8", fontSize:14 }}>📱 908-255-2195</span>
                  <span style={{ color:"#B8C4D8", fontSize:14 }}>📍 New Providence, NJ</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
                <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{ display:"block", padding:"15px 24px", background:"#1E4DB7", color:"white", textDecoration:"none", borderRadius:4, fontFamily:"sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, textAlign:"center", boxShadow:"0 4px 20px rgba(30,77,183,.4)" }}>📄 DOWNLOAD FULL SCREENPLAY (PDF) — 90 MIN</a>
                <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{ display:"block", padding:"15px 24px", background:"transparent", color:"#C9A84C", textDecoration:"none", borderRadius:4, fontFamily:"sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, textAlign:"center", border:"2px solid #C9A84C" }}>🎬 DOWNLOAD PITCH DECK (PDF)</a>
              </div>
              <div style={{ padding:24, background:"rgba(201,168,76,.07)", border:"1px solid rgba(201,168,76,.2)", borderRadius:6, textAlign:"center" }}>
                <p style={{ margin:"0 0 8px", color:"#C9A84C", fontSize:12, fontFamily:"sans-serif", letterSpacing:1, fontWeight:700 }}>FOR PRODUCERS & INDUSTRY PROFESSIONALS</p>
                <p style={{ margin:0, color:"#B8C4D8", fontSize:13, lineHeight:1.75 }}>The Watchers is available for option, co-production, and development discussions. The feature screenplay is complete. Series bible and short film adaptation available upon request.</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)", padding:"20px", textAlign:"center" }}>
          <p style={{ margin:0, color:"rgba(255,255,255,.2)", fontSize:10, fontFamily:"sans-serif", letterSpacing:1 }}>© 2026 Jay Gunaratne · All Rights Reserved · THE WATCHERS · Confidential — For Industry Review Only</p>
        </div>
      </div>
    </div>
  );
}
