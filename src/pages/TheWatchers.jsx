import { useState } from "react";

const POSTER = "https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/348149788_generated_image.png";
const SCREENPLAY_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/dbbc08c23_THE_WATCHERS_Feature_v3.pdf";
const PITCHDECK_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/ba585c812_THE_WATCHERS_PitchDeck.pdf";

const FIVE = [
  { emoji:"🎙️", name:"DEVONTE JAMES", age:"17", role:"The Leader", color:"#1E4DB7",
    desc:"Black. Runs the school radio station. Fast-talking, magnetic, naturally funny — it's how he copes. His older brother just got deployed to the Middle East. He can't sleep anyway. When things get scary, Devonte gets funnier. When things get real, he gets steady." },
  { emoji:"🔬", name:"PRIYA NAIR", age:"17", role:"The Prodigy", color:"#7832C8",
    desc:"Indian-American. Physics genius. Skipped two grades. Got into MIT three months ago — hasn't told her parents yet (they want her to be a doctor). Deciphers the alien signal structure and produces the mathematical proof that forces a room full of generals to listen." },
  { emoji:"🔧", name:"SAMANTHA 'SAM' KOWALSKI", age:"16", role:"The Builder", color:"#16784C",
    desc:"The girl. Grew up having to be twice as loud to be heard. Built the antenna array herself — actual hands, actual tools. Walks into the White House Situation Room like she owns it. Tells a four-star general off in under thirty seconds. Has no regrets." },
  { emoji:"🍔", name:"CARLOS 'CHUCK' REYES", age:"17", role:"The Heart", color:"#C9A84C",
    desc:"Chubby. Big laugh. Bigger heart. Stress-eats through the entire film — three granola bars, a sandwich, and someone's emergency M&Ms. Deeply funny without trying. When Kael lands on the White House lawn, Chuck is the first one to wave." },
  { emoji:"📡", name:"MARCUS BELL", age:"17", role:"The Nerd", color:"#C81E1E",
    desc:"The one who started it all. Slight, pale, NASA hoodie, glasses too big for his face. Has been trying to contact alien life since he was eleven. Everyone thought it was adorable and slightly pathetic. Tonight he is the most important person on Earth." },
];

const sideColor = {
  american:{ bg:"rgba(30,77,183,.1)",  border:"#1E4DB7", label:"🇺🇸 AMERICAN" },
  iranian: { bg:"rgba(22,120,60,.1)",  border:"#16784C", label:"🇮🇷 IRANIAN" },
  alien:   { bg:"rgba(120,50,200,.1)", border:"#7832C8", label:"👽 ALIEN" },
};

const supporting = [
  { name:"DR. ELENA VASQUEZ", role:"NASA Astrophysicist", side:"american",
    desc:"Been tracking the same lunar signals for 3 years with $7M of equipment. Marcus did it on a rooftop with Christmas lights. She will never fully admit how much that bothers her." },
  { name:"PRESIDENT DIANE HARRIS", role:"U.S. President", side:"american",
    desc:"First female President. Being pushed toward nuclear authorization by a four-star general. Five teenagers and an alien Elder change her mind in one night." },
  { name:"GENERAL MARCUS COLE", role:"Four-Star General", side:"american",
    desc:"Pushing hardest for Protocol Seven — full nuclear authorization. Gets told off by a 16-year-old girl with grease on her hands. Has no response." },
  { name:"KAEL", role:"Alien Elder", side:"alien",
    desc:"Ancient. Calm. 4,000 years of watching without acting. Chose five kids because they never stopped looking up. Gives the sphere of light not to the President — but to Marcus." },
  { name:"SERA", role:"Young Alien", side:"alien",
    desc:"She's the one who decided to answer Marcus's first signal six months ago. Has been watching the rooftop ever since." },
  { name:"ZEN", role:"Alien Technician", side:"alien",
    desc:"Dry wit. Manages the moon base. Notes that a teenager on a rooftop decoded their signal before every government on Earth did. Calls it 'humbling.'" },
  { name:"DR. CYRUS AMIRI", role:"Iranian Nuclear Physicist", side:"iranian",
    desc:"Father. Scientist. Secretly in contact with Vasquez for months. Trying to stop the war from inside Tehran." },
  { name:"AGENT DEREK SHAW", role:"Secret Service", side:"american",
    desc:"Did not train for this. 'I went to Quantico for this.' Says it twice." },
];

export default function TheWatchers() {
  const [tab, setTab] = useState("story");

  const tabBtn = (id, label) => (
    <button key={id} onClick={()=>setTab(id)} style={{
      padding:"13px 20px", background:"transparent", border:"none", cursor:"pointer",
      fontFamily:"sans-serif", fontSize:11, fontWeight:700, letterSpacing:2,
      color:tab===id?"#C9A84C":"rgba(255,255,255,.35)",
      borderBottom:tab===id?"2px solid #C9A84C":"2px solid transparent",
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#050C1F 0%,#0A1535 40%,#060E20 100%)", color:"#E8EDF8", fontFamily:"Georgia,serif" }}>
      {/* Stars */}
      <div style={{ position:"fixed",top:0,left:0,right:0,bottom:0, backgroundImage:"radial-gradient(1px 1px at 12% 22%,rgba(255,255,255,.7) 0%,transparent 100%),radial-gradient(1px 1px at 78% 9%,rgba(255,255,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 44% 77%,rgba(255,255,255,.6) 0%,transparent 100%),radial-gradient(1px 1px at 89% 44%,rgba(255,255,255,.4) 0%,transparent 100%),radial-gradient(1px 1px at 32% 62%,rgba(255,255,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 61% 18%,rgba(255,255,255,.6) 0%,transparent 100%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ position:"relative", zIndex:1 }}>

        {/* HERO */}
        <div style={{ position:"relative", overflow:"hidden", minHeight:"90vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <img src={POSTER} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:.3 }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"55%", background:"linear-gradient(transparent,#050C1F)" }} />
          <div style={{ position:"relative", textAlign:"center", padding:"0 24px", maxWidth:880 }}>
            <div style={{ fontSize:11, letterSpacing:6, color:"#C9A84C", marginBottom:16, fontFamily:"sans-serif", fontWeight:700 }}>AN ORIGINAL FEATURE FILM · 90 MINUTES</div>
            <h1 style={{ fontSize:"clamp(52px,11vw,100px)", fontWeight:700, margin:"0 0 6px", letterSpacing:8, color:"#FFF", textShadow:"0 0 80px rgba(100,140,255,.5),0 4px 40px rgba(0,0,0,.9)" }}>THE WATCHERS</h1>
            <div style={{ width:80, height:2, background:"#C9A84C", margin:"0 auto 18px", borderRadius:2 }} />
            <p style={{ fontSize:"clamp(15px,2.4vw,19px)", lineHeight:1.7, color:"#C9A84C", fontStyle:"italic", marginBottom:10 }}>
              "They have been watching us for 4,000 years.<br/>Tonight, they step in."
            </p>
            <p style={{ fontSize:13, color:"rgba(201,168,76,.75)", fontFamily:"sans-serif", marginBottom:28 }}>
              Five high school kids from New Jersey heard the signal first. Nobody believed them. 🎒📡
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:30 }}>
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
        <div style={{ maxWidth:860, margin:"0 auto", padding:"52px 24px 16px", textAlign:"center" }}>
          <p style={{ fontSize:"clamp(15px,2.3vw,19px)", lineHeight:1.9, color:"#B8C4D8", fontStyle:"italic" }}>
            When America and Iran push the world to the brink of nuclear war, five high school kids from New Jersey — who've been secretly communicating with an alien civilization on the moon — must convince the President, a four-star general, and a room full of skeptics that the visitors are real, they're coming, and they're the only thing standing between humanity and a catastrophe that won't just destroy a country. It will tear the fabric of the universe.
          </p>
        </div>

        {/* LAKEVIEW FIVE CARDS */}
        <div style={{ maxWidth:960, margin:"32px auto 16px", padding:"0 24px" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ fontSize:10, letterSpacing:4, color:"#C9A84C", fontFamily:"sans-serif", fontWeight:700, marginBottom:6 }}>INTRODUCING</div>
            <h2 style={{ margin:0, fontSize:24, color:"white", fontFamily:"sans-serif", letterSpacing:4 }}>THE LAKEVIEW FIVE</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
            {FIVE.map(k=>(
              <div key={k.name} style={{ background:`${k.color}18`, border:`1px solid ${k.color}40`, borderTop:`3px solid ${k.color}`, borderRadius:6, padding:16, textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>{k.emoji}</div>
                <div style={{ fontSize:9, letterSpacing:2, color:k.color, fontFamily:"sans-serif", fontWeight:700, marginBottom:4 }}>{k.role} · {k.age}</div>
                <div style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:"sans-serif", marginBottom:8 }}>{k.name}</div>
                <p style={{ margin:0, fontSize:11, lineHeight:1.7, color:"#B8C4D8" }}>{k.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:20, background:"rgba(201,168,76,.07)", border:"1px solid rgba(201,168,76,.2)", borderRadius:6, textAlign:"center" }}>
            <p style={{ margin:0, color:"#C9A84C", fontSize:13, fontStyle:"italic", lineHeight:1.8 }}>
              "On page 47 of his logbook, Marcus wrote: <strong>'What if they're already listening?'</strong><br/>They were."
            </p>
          </div>
        </div>

        {/* TABS */}
        <div style={{ maxWidth:960, margin:"32px auto 0", padding:"0 24px 80px" }}>
          <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,.1)", marginBottom:36, flexWrap:"wrap" }}>
            {[["story","THE STORY"],["characters","CHARACTERS"],["themes","THEMES"],["contact","CONTACT"]].map(([id,lbl])=>tabBtn(id,lbl))}
          </div>

          {tab==="story" && (
            <div>
              {[
                { act:"ACT ONE", title:"THE KIDS WHO HEARD IT FIRST", time:"~30 min", color:"#1E4DB7",
                  beats:[
                    "The moon base. Kael and ZEN watch Iran strike a US base — 43 dead. ZEN notes the pattern. 'The usual suspects. These usually work themselves out.' Ticker scrolls. ZEN: '...Or not.'",
                    "Marcus's rooftop. Five kids under Christmas lights. His antenna picks up a signal from the lunar surface — prime numbers, repeating, unmistakably intelligent.",
                    "Marcus answers with the Fibonacci sequence. On the moon: 'He answered.' ZEN: 'Four thousand years and a teenager cracks it. That's humbling.'",
                    "The aliens' response: 'YOUR GOVERNMENTS ARE ABOUT TO MAKE A MISTAKE THAT CANNOT BE UNDONE. WE NEED YOU TO STOP THEM.' Five kids stare at a screen.",
                    "Devonte: 'Why us? Out of eight billion people?' Priya, quietly: 'Because we listened. We were the only ones listening.'",
                    "Chuck: 'White House?' Devonte: 'White House.' Chuck, reaching for a granola bar: 'I'm gonna need snacks for this.'",
                  ]
                },
                { act:"ACT TWO", title:"NOBODY BELIEVES HIGH SCHOOL KIDS", time:"~45 min", color:"#0F2460",
                  beats:[
                    "Devonte tells them his brother just got deployed to the Middle East. He can't sleep anyway. 'So we're doing this. That's not a question.' Nobody argues.",
                    "They track down Dr. Vasquez at NASA JPL. Chuck: 'Email her. People forget email works.' She reads their signal analysis. Her coffee goes cold. 'I'm getting on a plane.'",
                    "Vasquez's garage session with the five. The full alien exchange — temporal fractures, three lost civilizations, the approaching point of no return.",
                    "Road trip to Washington. Shaw at the gate stares at the group: a Black kid in a letterman jacket, an Indian girl with a laptop, a girl with tool grease on her hands, a chubby kid mid-sandwich, a nerd in a NASA hoodie. 'I went to Quantico for this.'",
                    "In the Situation Room, Cole dismisses them. Sam, dead calm: 'I built the antenna array that intercepted the signal your seven-million-dollar program missed. So.' Silence.",
                    "Devonte stands up to Cole: 'My brother is on a carrier group right now. Whatever you're about to say about national security — you say it knowing there's a nineteen-year-old from Lakeview, New Jersey in the middle of it.' Cole goes quiet.",
                  ]
                },
                { act:"ACT THREE", title:"THE INTERVENTION", time:"~30 min", color:"#16784C",
                  beats:[
                    "Screens go dark. Chuck looks up from his granola bar: '...They're here.' Three ships appear over Washington, Tehran, and Moscow simultaneously.",
                    "Kael descends on the White House lawn. The five kids walk out behind Harris. Shaw tries to stop them. Vasquez: 'They were invited.' Shaw: 'By who?' She points at the ship.",
                    "Kael looks past Harris. Past Vasquez. His eyes settle on Marcus. 'You were the first to answer. Six months ago. You sent a single prime number.' Marcus: 'Forty-one.' Kael: 'We had almost given up.'",
                    "Devonte steps forward: 'My brother is out there on a ship. Is he going to be okay?' Kael: 'That depends on what happens in the next ten minutes.' Devonte turns to Harris: 'You heard him.'",
                    "The sphere of light. The nuclear scars. Kael offers the sphere to Marcus. He holds it out so all four of his friends can see. Chuck: 'Guys. Look at that.'",
                    "The ships depart. Cole closes the case. Harris calls Farzan: 'It's time we talked.' Final title card: 'Devonte James's brother Terrell came home.'",
                  ]
                },
              ].map(({act,title,time,color,beats})=>(
                <div key={act} style={{ marginBottom:26 }}>
                  <div style={{ background:color, padding:"12px 18px", borderRadius:"4px 4px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ fontSize:9, letterSpacing:3, color:"rgba(255,255,255,.5)", fontFamily:"sans-serif" }}>{act} — </span>
                      <span style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:"sans-serif", letterSpacing:1 }}>{title}</span>
                    </div>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.5)", fontFamily:"sans-serif" }}>{time}</span>
                  </div>
                  <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderTop:"none", borderRadius:"0 0 4px 4px", padding:"16px 20px" }}>
                    {beats.map((b,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, marginBottom:10 }}>
                        <span style={{ color:"#C9A84C", marginTop:3, flexShrink:0 }}>▸</span>
                        <p style={{ margin:0, color:"#B8C4D8", lineHeight:1.75, fontSize:14 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="characters" && (
            <div>
              <div style={{ marginBottom:20, fontSize:11, color:"#C9A84C", fontFamily:"sans-serif", letterSpacing:2, fontWeight:700 }}>SUPPORTING CAST</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
                {supporting.map(c=>{
                  const s=sideColor[c.side];
                  return (
                    <div key={c.name} style={{ background:s.bg, border:`1px solid ${s.border}35`, borderLeft:`3px solid ${s.border}`, borderRadius:6, padding:16 }}>
                      <div style={{ fontSize:9, color:s.border, letterSpacing:2, fontFamily:"sans-serif", fontWeight:700, marginBottom:5 }}>{s.label}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:"sans-serif", marginBottom:3 }}>{c.name}</div>
                      <div style={{ fontSize:11, color:s.border, fontStyle:"italic", marginBottom:8, fontFamily:"sans-serif" }}>{c.role}</div>
                      <p style={{ margin:0, fontSize:12, lineHeight:1.75, color:"#B8C4D8" }}>{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab==="themes" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:32 }}>
                {[
                  {icon:"📡",title:"Curiosity as Heroism",desc:"Five kids with a rooftop antenna beat every government and space agency on Earth. The signal was always there. Most people stopped listening. They never did."},
                  {icon:"🌍",title:"Diversity is Strength",desc:"A Black kid, an Indian girl, a tough girl, a chubby kid, and a nerd walk into the White House Situation Room. Between them they have every skill the world needed tonight."},
                  {icon:"💥",title:"Nuclear Weapons as a Cosmic Threat",desc:"Not just a human problem. Every detonation since 1945 has torn the fabric of space-time. Three civilizations already lost. The kids are the ones who finally make the adults listen."},
                  {icon:"👨‍👦",title:"Adults Who Stopped Believing",desc:"Kael: 'They are the ones who still believe the universe has answers. Adults on your planet stopped believing that somewhere between bills and borders.'"},
                  {icon:"🤝",title:"Devonte's Brother",desc:"The story's emotional anchor. Devonte can't sleep because Terrell just shipped out. When Kael says the outcome depends on the next ten minutes — Devonte turns to the President and says: 'You heard him.'"},
                  {icon:"✨",title:"First Contact as a Mirror",desc:"The aliens don't come to conquer or save. They come to hold up a mirror. The sphere of light goes to Marcus — the kid who kept a logbook for six months just in case someone answered."},
                ].map(({icon,title,desc})=>(
                  <div key={title} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:6, padding:20 }}>
                    <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
                    <h3 style={{ margin:"0 0 8px", fontSize:13, color:"#C9A84C", fontFamily:"sans-serif", letterSpacing:1 }}>{title}</h3>
                    <p style={{ margin:0, fontSize:13, lineHeight:1.75, color:"#B8C4D8" }}>{desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(30,77,183,.12)", border:"1px solid rgba(30,77,183,.25)", borderRadius:6, padding:28, textAlign:"center" }}>
                <p style={{ fontSize:18, lineHeight:1.9, fontStyle:"italic", color:"#C9A84C", margin:"0 0 12px" }}>
                  "Keep looking up, Marcus Bell.<br/>We never left."
                </p>
                <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,.3)", fontFamily:"sans-serif", letterSpacing:2 }}>— KAEL, THE WATCHERS</p>
              </div>
            </div>
          )}

          {tab==="contact" && (
            <div style={{ maxWidth:560, margin:"0 auto" }}>
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, padding:36, textAlign:"center", marginBottom:24 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🎬</div>
                <h2 style={{ margin:"0 0 6px", fontSize:22, color:"white", fontFamily:"sans-serif", letterSpacing:3 }}>JAY GUNARATNE</h2>
                <p style={{ margin:"0 0 20px", color:"#C9A84C", fontStyle:"italic", fontSize:13 }}>Writer & Creator — The Watchers</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
                  <a href="mailto:jaygnz27@gmail.com" style={{ color:"#B8C4D8", textDecoration:"none", fontSize:14 }}>📧 jaygnz27@gmail.com</a>
                  <span style={{ color:"#B8C4D8", fontSize:14 }}>📱 908-255-2195</span>
                  <span style={{ color:"#B8C4D8", fontSize:14 }}>📍 New Providence, NJ</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
                <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{ display:"block", padding:"15px 24px", background:"#1E4DB7", color:"white", textDecoration:"none", borderRadius:4, fontFamily:"sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, textAlign:"center", boxShadow:"0 4px 20px rgba(30,77,183,.4)" }}>📄 DOWNLOAD FULL SCREENPLAY — 90 MIN</a>
                <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{ display:"block", padding:"15px 24px", background:"transparent", color:"#C9A84C", textDecoration:"none", borderRadius:4, fontFamily:"sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, textAlign:"center", border:"2px solid #C9A84C" }}>🎬 DOWNLOAD PITCH DECK</a>
              </div>
              <div style={{ padding:22, background:"rgba(201,168,76,.07)", border:"1px solid rgba(201,168,76,.2)", borderRadius:6, textAlign:"center" }}>
                <p style={{ margin:"0 0 8px", color:"#C9A84C", fontSize:12, fontFamily:"sans-serif", letterSpacing:1, fontWeight:700 }}>FOR PRODUCERS & INDUSTRY PROFESSIONALS</p>
                <p style={{ margin:0, color:"#B8C4D8", fontSize:13, lineHeight:1.75 }}>Available for option, co-production, and development. Feature screenplay complete. Series bible and short film adaptation available upon request.</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)", padding:20, textAlign:"center" }}>
          <p style={{ margin:0, color:"rgba(255,255,255,.18)", fontSize:10, fontFamily:"sans-serif", letterSpacing:1 }}>© 2026 Jay Gunaratne · All Rights Reserved · THE WATCHERS · Confidential — For Industry Review Only</p>
        </div>
      </div>
    </div>
  );
}
