import { useState } from "react";

const POSTER = "https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/348149788_generated_image.png";
const SCREENPLAY_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/15a0251d7_THE_WATCHERS_Feature_v1.pdf";
const PITCHDECK_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/ba585c812_THE_WATCHERS_PitchDeck.pdf";

const characters = [
  {
    name: "DR. ELENA VASQUEZ",
    role: "American NASA Astrophysicist — The Bridge",
    desc: "40s. Has tracked alien signals from the moon for 3 years while everyone dismissed her. Tonight she becomes the bridge between humanity and the visitors. Driven. Sleepless. Brilliant.",
    side: "american",
  },
  {
    name: "BISCUIT",
    role: "Basset Hound / Poodle Mix — The Heart",
    desc: "4 years old. Ears too long. Legs too short. Fur that can't decide what it wants to be. Accidentally ends up in the White House Situation Room during a nuclear crisis — and becomes the most important being in the room. The only one not afraid. The only one an alien Elder has ever sat beside.",
    side: "biscuit",
    emoji: "🐾",
  },
  {
    name: "PRESIDENT DIANE HARRIS",
    role: "U.S. President — The Decision Maker",
    desc: "50s. First female President. Tough, grieving, pushed toward a decision she knows is wrong. Her humanity — and one very unusual dog — becomes her greatest strength.",
    side: "american",
  },
  {
    name: "DR. CYRUS AMIRI",
    role: "Iranian Nuclear Physicist — The Mirror",
    desc: "40s. Father of a 12-year-old daughter who wants to be an engineer. Secretly in contact with Vasquez for 6 months. Trying to stop the war from inside Tehran.",
    side: "iranian",
  },
  {
    name: "KAEL",
    role: "Alien Elder — The Intervener",
    desc: "Ancient. Calm. 4,000 years of watching without acting. Tonight he breaks the covenant. The first being in the universe to have a dog sit on his foot.",
    side: "alien",
  },
  {
    name: "ZEN",
    role: "Alien Technician — The Comic Relief",
    desc: "Compact, wiry, perpetually sleep-deprived. Manages the moon base screens. Becomes inexplicably fascinated by Biscuit. Votes to intervene — quote — \"for the dog.\"",
    side: "alien",
  },
  {
    name: "GENERAL MARCUS COLE",
    role: "Four-Star General — The Hawk",
    desc: "Pushing hardest for Protocol Seven — full nuclear authorization. Not evil. Dangerously certain he's right. Deeply undignified by the end of act one.",
    side: "american",
  },
  {
    name: "SERA",
    role: "Young Alien — The Believer",
    desc: "Fascinated by human culture, art, music. Believes in humanity more than any Elder. Develops a strong opinion about Biscuit by the end of act two.",
    side: "alien",
  },
];

const sideColor = {
  american: { bg: "rgba(30,77,183,0.12)", border: "#1E4DB7", label: "🇺🇸 AMERICAN" },
  iranian:  { bg: "rgba(22,120,60,0.12)",  border: "#16784C", label: "🇮🇷 IRANIAN" },
  alien:    { bg: "rgba(120,50,200,0.12)", border: "#7832C8", label: "👽 ALIEN" },
  biscuit:  { bg: "rgba(201,168,76,0.15)", border: "#C9A84C", label: "🐾 THE STAR" },
};

export default function TheWatchers() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #050C1F 0%, #0A1535 40%, #060E20 100%)",
      color: "#E8EDF8",
      fontFamily: "'Georgia', serif",
    }}>
      {/* Stars */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 75% 8%,  rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 45% 75%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 88% 42%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 92% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 5%  90%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 55% 50%, rgba(255,255,255,0.3) 0%, transparent 100%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "92vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <img src={POSTER} alt="The Watchers" style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            width: "100%", height: "100%", objectFit: "cover", opacity: 0.32,
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
            background: "linear-gradient(transparent, #050C1F)",
          }} />
          <div style={{ position: "relative", textAlign: "center", padding: "0 24px", maxWidth: 820 }}>
            <div style={{ fontSize: 11, letterSpacing: 6, color: "#C9A84C", marginBottom: 18,
              fontFamily: "sans-serif", fontWeight: 700 }}>
              AN ORIGINAL FEATURE FILM · 90 MINUTES
            </div>
            <h1 style={{
              fontSize: "clamp(56px, 11vw, 104px)", fontWeight: 700, margin: "0 0 6px",
              letterSpacing: 8, color: "#FFFFFF",
              textShadow: "0 0 80px rgba(100,140,255,0.5), 0 4px 40px rgba(0,0,0,0.9)",
            }}>THE WATCHERS</h1>
            <div style={{ width: 80, height: 2, background: "#C9A84C", margin: "0 auto 20px", borderRadius: 2 }} />
            <p style={{ fontSize: "clamp(15px, 2.4vw, 19px)", lineHeight: 1.7,
              color: "#C9A84C", fontStyle: "italic", marginBottom: 12 }}>
              "They have been watching us for 4,000 years.<br />Tonight, they step in."
            </p>
            <p style={{ fontSize: 13, color: "rgba(201,168,76,0.7)", fontFamily: "sans-serif",
              letterSpacing: 1, marginBottom: 28 }}>
              Featuring BISCUIT 🐾 — the dog who accidentally saved the world
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              {["Science Fiction", "Political Thriller", "Comedy-Drama", "Feature Film"].map(tag => (
                <span key={tag} style={{
                  padding: "5px 14px", borderRadius: 20,
                  border: "1px solid rgba(201,168,76,0.35)",
                  color: "#C9A84C", fontSize: 11, letterSpacing: 2,
                  fontFamily: "sans-serif", fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{
                padding: "14px 32px", background: "#1E4DB7", color: "white",
                textDecoration: "none", borderRadius: 4, fontFamily: "sans-serif",
                fontWeight: 700, fontSize: 13, letterSpacing: 2,
                boxShadow: "0 4px 24px rgba(30,77,183,0.5)",
              }}>📄 READ THE SCREENPLAY</a>
              <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{
                padding: "14px 32px", background: "transparent", color: "#C9A84C",
                textDecoration: "none", borderRadius: 4, fontFamily: "sans-serif",
                fontWeight: 700, fontSize: 13, letterSpacing: 2,
                border: "2px solid #C9A84C",
              }}>🎬 PITCH DECK</a>
            </div>
          </div>
        </div>

        {/* LOGLINE */}
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px 36px", textAlign: "center" }}>
          <p style={{ fontSize: "clamp(15px, 2.3vw, 19px)", lineHeight: 1.85, color: "#B8C4D8", fontStyle: "italic" }}>
            When America and Iran push the world to the brink of nuclear war, a NASA astrophysicist, 
            her deeply impractical dog, and an alien civilization watching from the moon must somehow 
            stop a catastrophe that will not just destroy a country — but tear the fabric of the universe itself.
          </p>
        </div>

        {/* BISCUIT SPOTLIGHT */}
        <div style={{ maxWidth: 820, margin: "0 auto 48px", padding: "0 24px" }}>
          <div style={{
            background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)",
            borderLeft: "4px solid #C9A84C", borderRadius: 8, padding: 28,
            display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap",
          }}>
            <div style={{ fontSize: 64, flexShrink: 0 }}>🐶</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#C9A84C",
                fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>INTRODUCING</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 24, color: "#C9A84C",
                fontFamily: "sans-serif", letterSpacing: 2 }}>BISCUIT</h2>
              <p style={{ margin: "0 0 8px", color: "#E8EDF8", fontSize: 14, lineHeight: 1.7 }}>
                <em>Basset Hound / Poodle mix. 4 years old. Ears that drag on the floor. Legs that are frankly too short for 
                his body. Eyes that suggest deep philosophical thought — brain that is mostly thinking about snacks.</em>
              </p>
              <p style={{ margin: 0, color: "#B8C4D8", fontSize: 13, lineHeight: 1.7 }}>
                Biscuit ends up in the White House Situation Room during a nuclear crisis. He sleeps through most of it. 
                He licks an alien Elder's hand. He sits on the Elder's foot. He receives several treats at the end. 
                He feels this is fair. The alien council votes to intervene — one vote cast specifically <em>"for the dog."</em>
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 40 }}>
            {[
              { id: "story", label: "THE STORY" },
              { id: "characters", label: "CHARACTERS" },
              { id: "themes", label: "THEMES" },
              { id: "contact", label: "CONTACT" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "13px 22px", background: "transparent", border: "none",
                cursor: "pointer", fontFamily: "sans-serif", fontSize: 11,
                fontWeight: 700, letterSpacing: 2,
                color: activeTab === tab.id ? "#C9A84C" : "rgba(255,255,255,0.35)",
                borderBottom: activeTab === tab.id ? "2px solid #C9A84C" : "2px solid transparent",
                transition: "all 0.2s",
              }}>{tab.label}</button>
            ))}
          </div>

          {/* STORY TAB */}
          {activeTab === "story" && (
            <div>
              {[
                {
                  act: "ACT ONE", title: "THE WARNING NOBODY HEARD", time: "~30 min · Pages 1–30", color: "#1E4DB7",
                  beats: [
                    "The moon base wakes up. Kael and ZEN watch Iran strike a US base — 43 dead. Alien technician ZEN notes they've seen this pattern before. Usually works itself out. Usually.",
                    "Dr. Vasquez is called to the White House. She brings Biscuit — her Basset Hound / Poodle mix of deeply questionable proportions. Agent Shaw is not pleased.",
                    "Biscuit enters the Situation Room and immediately falls asleep under the table. A general trips over his shoelace. Biscuit licks his shoe.",
                    "Vasquez presents 3 years of lunar signal data. The room is skeptical — until she reveals the aliens already responded: \"We are coming. Do not launch.\"",
                    "President Harris finds Biscuit in her private study. He climbs into the chair beside her. She scratches his ears and — for the first time — considers not reaching for the case.",
                  ]
                },
                {
                  act: "ACT TWO", title: "TWO SCIENTISTS, ONE CHANNEL", time: "~45 min · Pages 31–75", color: "#0F2460",
                  beats: [
                    "Live satellite text exchange with the alien base. The room reads the message: nuclear weapons are not weapons — they are tears in the universe. Three civilizations already lost to the cascading effect.",
                    "The aliens ask about the creature under the table. Vasquez explains Biscuit. The aliens respond: \"We have observed this species for 4,000 years. We have never understood its purpose.\"",
                    "On the moon, ZEN becomes inexplicably obsessed with Biscuit footage. Sera has never seen a dog before. Neither has Kael. ZEN describes him as \"bred for absolutely nothing useful whatsoever.\"",
                    "Dr. Amiri calls from Tehran. He and Harris speak directly — two enemies finding common ground. Vasquez, watching Biscuit sleep: \"Maybe it's that simple.\"",
                    "The alien Council votes. Five to two — then ZEN raises his hand. \"For the dog.\" Kael allows it. Ships are prepared.",
                    "Cole escalates. The carrier group is hit again. Harris reaches for the authorization case. Every screen goes dark.",
                  ]
                },
                {
                  act: "ACT THREE", title: "THE INTERVENTION", time: "~30 min · Pages 76–105", color: "#16784C",
                  beats: [
                    "The hum begins. Biscuit — who has been asleep — sits bolt upright. His ears perk. He walks to the door and sits in front of it, waiting.",
                    "Three ships appear simultaneously over Washington, Tehran, and Moscow. The world stops.",
                    "Kael descends on the White House lawn. Harris walks out. Vasquez behind her. Biscuit trots past both of them — straight to Kael. Sniffs his hand. Licks it. Sits on his foot.",
                    "Kael crouches and looks at Biscuit for a long moment: \"You are not afraid.\" His tail wags. Kael: \"There is more wisdom in this creature than in every war council on your planet tonight.\"",
                    "The sphere of light. The nuclear scars. Three lost civilizations. \"We are what you will become — if you survive yourselves.\"",
                    "The ships depart. Cole closes the authorization case. Harris calls Farzan. It is time to talk.",
                    "On the moon, ZEN asks to check on the dog. Kael finds Biscuit on screen — upside down, fast asleep, pen next to him. \"He's fine.\" ZEN, satisfied, returns to his station.",
                  ]
                },
              ].map(({ act, title, time, color, beats }) => (
                <div key={act} style={{ marginBottom: 28 }}>
                  <div style={{
                    background: color, padding: "13px 20px", borderRadius: "4px 4px 0 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
                  }}>
                    <div>
                      <span style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif" }}>{act} — </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "white", fontFamily: "sans-serif", letterSpacing: 1 }}>{title}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif" }}>{time}</span>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    borderTop: "none", borderRadius: "0 0 4px 4px", padding: "18px 22px",
                  }}>
                    {beats.map((beat, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                        <span style={{ color: "#C9A84C", marginTop: 3, flexShrink: 0 }}>▸</span>
                        <p style={{ margin: 0, color: "#B8C4D8", lineHeight: 1.75, fontSize: 14 }}>{beat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Final title cards */}
              <div style={{
                marginTop: 32, padding: 28, background: "rgba(15,36,96,0.4)",
                border: "1px solid rgba(30,77,183,0.3)", borderRadius: 8, textAlign: "center",
              }}>
                <p style={{ margin: "0 0 6px", color: "#B8C4D8", fontSize: 13, fontStyle: "italic", lineHeight: 1.8 }}>
                  "BISCUIT received no awards for his performance tonight.<br />
                  He did, however, receive several treats.<br />
                  He felt this was fair."
                </p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "sans-serif", letterSpacing: 2 }}>
                  — FINAL TITLE CARD, THE WATCHERS
                </p>
              </div>
            </div>
          )}

          {/* CHARACTERS TAB */}
          {activeTab === "characters" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {characters.map(char => {
                const s = sideColor[char.side];
                return (
                  <div key={char.name} style={{
                    background: s.bg, border: `1px solid ${s.border}35`,
                    borderLeft: `3px solid ${s.border}`, borderRadius: 6, padding: 20,
                  }}>
                    <div style={{ fontSize: 9, color: s.border, letterSpacing: 2,
                      fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>
                      {s.label}
                    </div>
                    {char.emoji && <div style={{ fontSize: 28, marginBottom: 8 }}>{char.emoji}</div>}
                    <h3 style={{ margin: "0 0 4px", fontSize: 14, color: "white",
                      fontFamily: "sans-serif", letterSpacing: 1 }}>{char.name}</h3>
                    <div style={{ fontSize: 11, color: s.border, fontStyle: "italic",
                      marginBottom: 10, fontFamily: "sans-serif" }}>{char.role}</div>
                    <p style={{ margin: 0, fontSize: 12, lineHeight: 1.75, color: "#B8C4D8" }}>{char.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* THEMES TAB */}
          {activeTab === "themes" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, marginBottom: 36 }}>
                {[
                  { icon: "💥", title: "Nuclear Weapons as a Cosmic Threat", desc: "Not just a human problem. Every detonation since 1945 has torn the fabric of space-time, affecting civilizations across the universe that we will never meet." },
                  { icon: "👁️", title: "Non-Interference vs. Moral Responsibility", desc: "4,000 years of watching without acting. One dog sleeping through a nuclear crisis is what finally tips the vote." },
                  { icon: "🔭", title: "Science as the Bridge", desc: "Two scientists — American and Iranian — working across enemy lines to save the world their governments are trying to destroy." },
                  { icon: "🐾", title: "Uncomplicated Love", desc: "Biscuit doesn't know there's a crisis. He trusts the humans around him to figure it out. That trust — irrational, unconditional — is the emotional spine of the film." },
                  { icon: "🌍", title: "Perspective", desc: "What does a border dispute look like from 240,000 miles away? What does humanity look like to those who have watched us for four thousand years?" },
                  { icon: "✨", title: "First Contact as a Mirror", desc: "The aliens don't come to conquer or save. They come to hold up a mirror and ask: is what you see who you want to be?" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 6, padding: 22,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                    <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#C9A84C",
                      fontFamily: "sans-serif", letterSpacing: 1 }}>{title}</h3>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.75, color: "#B8C4D8" }}>{desc}</p>
                  </div>
                ))}
              </div>
              <div style={{
                background: "rgba(30,77,183,0.12)", border: "1px solid rgba(30,77,183,0.25)",
                borderRadius: 6, padding: 32, textAlign: "center",
              }}>
                <p style={{ fontSize: 18, lineHeight: 1.9, fontStyle: "italic", color: "#C9A84C", margin: "0 0 14px" }}>
                  "The universe is infinite. There is room enough for all of you.<br />
                  But only if you survive long enough to reach it."
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)",
                  fontFamily: "sans-serif", letterSpacing: 2 }}>— KAEL, THE WATCHERS</p>
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === "contact" && (
            <div style={{ maxWidth: 580, margin: "0 auto" }}>
              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 40, textAlign: "center", marginBottom: 28,
              }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🎬</div>
                <h2 style={{ margin: "0 0 6px", fontSize: 22, color: "white",
                  fontFamily: "sans-serif", letterSpacing: 3 }}>JAY GUNARATNE</h2>
                <p style={{ margin: "0 0 24px", color: "#C9A84C", fontStyle: "italic", fontSize: 13 }}>
                  Writer & Creator — The Watchers
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                  <a href="mailto:jaygnz27@gmail.com" style={{ color: "#B8C4D8",
                    textDecoration: "none", fontSize: 14 }}>📧 jaygnz27@gmail.com</a>
                  <span style={{ color: "#B8C4D8", fontSize: 14 }}>📱 908-255-2195</span>
                  <span style={{ color: "#B8C4D8", fontSize: 14 }}>📍 New Providence, NJ</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{
                  display: "block", padding: "15px 24px", background: "#1E4DB7",
                  color: "white", textDecoration: "none", borderRadius: 4,
                  fontFamily: "sans-serif", fontWeight: 700, fontSize: 13,
                  letterSpacing: 2, textAlign: "center",
                  boxShadow: "0 4px 20px rgba(30,77,183,0.4)",
                }}>📄 DOWNLOAD FULL SCREENPLAY (PDF) — 90 MIN</a>
                <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{
                  display: "block", padding: "15px 24px", background: "transparent",
                  color: "#C9A84C", textDecoration: "none", borderRadius: 4,
                  fontFamily: "sans-serif", fontWeight: 700, fontSize: 13,
                  letterSpacing: 2, textAlign: "center", border: "2px solid #C9A84C",
                }}>🎬 DOWNLOAD PITCH DECK (PDF)</a>
              </div>

              <div style={{
                padding: 24, background: "rgba(201,168,76,0.07)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 6, textAlign: "center",
              }}>
                <p style={{ margin: "0 0 8px", color: "#C9A84C", fontSize: 12,
                  fontFamily: "sans-serif", letterSpacing: 1, fontWeight: 700 }}>
                  FOR PRODUCERS & INDUSTRY PROFESSIONALS
                </p>
                <p style={{ margin: 0, color: "#B8C4D8", fontSize: 13, lineHeight: 1.75 }}>
                  The Watchers is available for option, co-production, and development discussions.
                  The feature screenplay is complete. Short film adaptation and series bible available upon request.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px", textAlign: "center" }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.2)", fontSize: 10,
            fontFamily: "sans-serif", letterSpacing: 1 }}>
            © 2026 Jay Gunaratne · All Rights Reserved · THE WATCHERS · Confidential — For Industry Review Only
          </p>
        </div>
      </div>
    </div>
  );
}
