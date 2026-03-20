import { useState } from "react";

const POSTER = "https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/348149788_generated_image.png";
const SCREENPLAY_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/1e225556f_THE_WATCHERS_Screenplay.pdf";
const PITCHDECK_URL = "https://base44.app/api/apps/69b2ee18a8e6fb58c7f0261c/files/mp/public/69b2ee18a8e6fb58c7f0261c/ba585c812_THE_WATCHERS_PitchDeck.pdf";

const characters = [
  {
    name: "DR. ELENA VASQUEZ",
    role: "American NASA Astrophysicist",
    desc: "Has tracked alien signals from the moon for 3 years while everyone dismissed her. Tonight she becomes the bridge between humanity and the visitors.",
    side: "american",
  },
  {
    name: "PRESIDENT DIANE HARRIS",
    role: "U.S. President",
    desc: "First female President. Tough, grieving, and being pushed toward a decision she knows is wrong. Her humanity becomes her greatest strength.",
    side: "american",
  },
  {
    name: "DR. CYRUS AMIRI",
    role: "Iranian Nuclear Physicist",
    desc: "Father of a 12-year-old daughter. Secretly in contact with Vasquez for 6 months, trying to stop the war from inside Tehran.",
    side: "iranian",
  },
  {
    name: "KAEL",
    role: "Alien Elder",
    desc: "Ancient. Calm. Has watched Earth for 4,000 years. Tonight he breaks a sacred covenant — not to rule humanity, but to offer it one last chance.",
    side: "alien",
  },
  {
    name: "GENERAL MARCUS COLE",
    role: "Four-Star General",
    desc: "The hawk. Pushing hardest for Protocol Seven — full nuclear authorization. Not evil. Dangerously certain he's right.",
    side: "american",
  },
  {
    name: "SERA",
    role: "Young Alien",
    desc: "Fascinated by human culture, art, and music. Believes in humanity more than any of the Elders. The first to flag tonight's crisis to Kael.",
    side: "alien",
  },
];

const sideColor = {
  american: { bg: "rgba(30,77,183,0.15)", border: "#1E4DB7", label: "🇺🇸 American" },
  iranian:  { bg: "rgba(22,120,60,0.15)",  border: "#16784C", label: "🇮🇷 Iranian" },
  alien:    { bg: "rgba(120,50,200,0.15)", border: "#7832C8", label: "👽 Alien" },
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
      {/* Stars background */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 50% 80%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
          radial-gradient(1px 1px at 35% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 65% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
          radial-gradient(1px 1px at 75% 70%, rgba(255,255,255,0.4) 0%, transparent 100%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* HERO */}
        <div style={{
          position: "relative", overflow: "hidden",
          minHeight: "90vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <img src={POSTER} alt="The Watchers" style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            width: "100%", height: "100%", objectFit: "cover", opacity: 0.35,
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(transparent, #050C1F)",
          }} />
          <div style={{ position: "relative", textAlign: "center", padding: "0 24px", maxWidth: 800 }}>
            <div style={{
              fontSize: 11, letterSpacing: 6, color: "#C9A84C",
              marginBottom: 16, fontFamily: "sans-serif", fontWeight: 600,
            }}>
              AN ORIGINAL SHORT FILM
            </div>
            <h1 style={{
              fontSize: "clamp(52px, 10vw, 96px)", fontWeight: 700, margin: "0 0 8px",
              letterSpacing: 8, color: "#FFFFFF",
              textShadow: "0 0 60px rgba(100,140,255,0.5), 0 4px 30px rgba(0,0,0,0.8)",
            }}>
              THE WATCHERS
            </h1>
            <div style={{
              width: 80, height: 2, background: "#C9A84C",
              margin: "0 auto 24px", borderRadius: 2,
            }} />
            <p style={{
              fontSize: "clamp(15px, 2.5vw, 20px)", lineHeight: 1.6,
              color: "#C9A84C", fontStyle: "italic", marginBottom: 32,
            }}>
              "They have been watching us for 4,000 years.<br />Tonight, they step in."
            </p>
            <div style={{
              display: "flex", gap: 12, justifyContent: "center",
              flexWrap: "wrap", marginBottom: 32,
            }}>
              {["Science Fiction", "Political Thriller", "25 Minutes"].map(tag => (
                <span key={tag} style={{
                  padding: "6px 16px", borderRadius: 20,
                  border: "1px solid rgba(201,168,76,0.4)",
                  color: "#C9A84C", fontSize: 12, letterSpacing: 2,
                  fontFamily: "sans-serif", fontWeight: 600,
                }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{
                padding: "14px 32px", background: "#1E4DB7",
                color: "white", textDecoration: "none", borderRadius: 4,
                fontFamily: "sans-serif", fontWeight: 700, fontSize: 14,
                letterSpacing: 2, transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(30,77,183,0.5)",
              }}>
                📄 READ THE SCREENPLAY
              </a>
              <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{
                padding: "14px 32px", background: "transparent",
                color: "#C9A84C", textDecoration: "none", borderRadius: 4,
                fontFamily: "sans-serif", fontWeight: 700, fontSize: 14,
                letterSpacing: 2, border: "2px solid #C9A84C",
              }}>
                🎬 PITCH DECK
              </a>
            </div>
          </div>
        </div>

        {/* LOGLINE */}
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "60px 24px 40px",
          textAlign: "center",
        }}>
          <p style={{
            fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.8,
            color: "#B8C4D8", fontStyle: "italic",
          }}>
            When America and Iran push the world to the brink of nuclear war, an alien civilization 
            watching from the moon faces its greatest dilemma: break a 4,000-year covenant of 
            non-interference — or watch humanity tear a hole in the fabric of the universe itself.
          </p>
        </div>

        {/* TABS */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{
            display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 40, gap: 0,
          }}>
            {[
              { id: "story", label: "THE STORY" },
              { id: "characters", label: "CHARACTERS" },
              { id: "themes", label: "THEMES" },
              { id: "contact", label: "CONTACT" },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "14px 24px", background: "transparent", border: "none",
                cursor: "pointer", fontFamily: "sans-serif", fontSize: 12,
                fontWeight: 700, letterSpacing: 2,
                color: activeTab === tab.id ? "#C9A84C" : "rgba(255,255,255,0.4)",
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
                  act: "ACT ONE", title: "THE WARNING NOBODY HEARD", time: "~7 Minutes", color: "#1E4DB7",
                  beats: [
                    "Iran strikes a US military base. 43 American soldiers killed.",
                    "President Harris convenes the war council. Nuclear option is on the table.",
                    "Dr. Elena Vasquez — NASA astrophysicist — arrives at the White House with 3 years of classified lunar signal data.",
                    "She reveals the aliens have already responded to her signal: \"We are coming. Do not launch.\"",
                    "On the moon, Kael watches. The alien Council is convened. The vote: 5-2 to intervene.",
                  ]
                },
                {
                  act: "ACT TWO", title: "TWO SCIENTISTS, ONE CHANNEL", time: "~10 Minutes", color: "#0F2460",
                  beats: [
                    "Vasquez maintains a live satellite text exchange with the alien base.",
                    "The aliens reveal the truth: nuclear weapons don't just destroy life — they tear the fabric of space and time.",
                    "Dr. Cyrus Amiri — Iranian nuclear physicist — calls Vasquez on an encrypted line from Tehran.",
                    "President Harris and Amiri speak directly — two enemies finding common ground.",
                    "Cole escalates. The carrier group is hit again. Harris reaches for the authorization case.",
                    "The alien ships depart the moon. They are already moving.",
                  ]
                },
                {
                  act: "ACT THREE", title: "THE INTERVENTION", time: "~8 Minutes", color: "#16784C",
                  beats: [
                    "Every screen in the Situation Room goes dark. The hum begins.",
                    "Three alien ships appear simultaneously over Washington D.C., Tehran, and Moscow.",
                    "Kael descends on the White House lawn. Harris walks out alone.",
                    "Kael shows Harris a sphere — inside it, Earth's nuclear scars are visible as fractures in space-time itself.",
                    "\"We are what you will become — if you survive yourselves.\"",
                    "The ships depart. Every weapon comes back online. Nobody fires.",
                    "Harris calls Farzan. It is time to talk.",
                  ]
                },
              ].map(({ act, title, time, color, beats }) => (
                <div key={act} style={{ marginBottom: 32 }}>
                  <div style={{
                    background: color, padding: "14px 20px", borderRadius: "4px 4px 0 0",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>{act} — </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "white", fontFamily: "sans-serif", letterSpacing: 1 }}>{title}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif" }}>{time}</span>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderTop: "none", borderRadius: "0 0 4px 4px", padding: "20px 24px",
                  }}>
                    {beats.map((beat, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                        <span style={{ color: "#C9A84C", marginTop: 2, flexShrink: 0 }}>▸</span>
                        <p style={{ margin: 0, color: "#B8C4D8", lineHeight: 1.7, fontSize: 15 }}>{beat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CHARACTERS TAB */}
          {activeTab === "characters" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {characters.map(char => {
                const s = sideColor[char.side];
                return (
                  <div key={char.name} style={{
                    background: s.bg,
                    border: `1px solid ${s.border}40`,
                    borderLeft: `3px solid ${s.border}`,
                    borderRadius: 6, padding: 20,
                  }}>
                    <div style={{ fontSize: 10, color: s.border, letterSpacing: 2, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 6 }}>
                      {s.label}
                    </div>
                    <h3 style={{ margin: "0 0 4px", fontSize: 15, color: "white", fontFamily: "sans-serif", letterSpacing: 1 }}>
                      {char.name}
                    </h3>
                    <div style={{ fontSize: 12, color: "#C9A84C", fontStyle: "italic", marginBottom: 12, fontFamily: "sans-serif" }}>
                      {char.role}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#B8C4D8" }}>{char.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* THEMES TAB */}
          {activeTab === "themes" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
                {[
                  { icon: "💥", title: "Nuclear Weapons as a Cosmic Threat", desc: "Not just a human problem — every detonation since 1945 has torn the fabric of space-time, affecting civilizations across the universe." },
                  { icon: "👁️", title: "Non-Interference vs. Moral Responsibility", desc: "4,000 years of watching without acting. What does it take to break that covenant? What are the consequences either way?" },
                  { icon: "🔭", title: "Science as the Bridge", desc: "Two scientists — American and Iranian — working across enemy lines to save the world their governments are trying to destroy." },
                  { icon: "🌍", title: "Perspective", desc: "What does a border dispute look like from 240,000 miles away? What does humanity look like to a civilization that has watched us for four millennia?" },
                  { icon: "🤝", title: "The Cost of Pride", desc: "Two nations so locked into their positions that it takes an alien intervention to remind them what they're actually fighting for." },
                  { icon: "✨", title: "First Contact as a Mirror", desc: "The aliens don't come to conquer. They come to show us ourselves — and ask if what we see is who we want to be." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6, padding: 24,
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                    <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#C9A84C", fontFamily: "sans-serif", letterSpacing: 1 }}>{title}</h3>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#B8C4D8" }}>{desc}</p>
                  </div>
                ))}
              </div>
              <div style={{
                background: "rgba(30,77,183,0.15)", border: "1px solid rgba(30,77,183,0.3)",
                borderRadius: 6, padding: 32, textAlign: "center",
              }}>
                <p style={{ fontSize: 18, lineHeight: 1.8, fontStyle: "italic", color: "#C9A84C", margin: "0 0 12px" }}>
                  "The universe is infinite. There is room enough for all of you.<br />
                  But only if you survive long enough to reach it."
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", letterSpacing: 2 }}>
                  — KAEL, THE WATCHERS
                </p>
              </div>
            </div>
          )}

          {/* CONTACT TAB */}
          {activeTab === "contact" && (
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: 40, textAlign: "center", marginBottom: 32,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
                <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "white", fontFamily: "sans-serif", letterSpacing: 2 }}>
                  JAY GUNARATNE
                </h2>
                <p style={{ margin: "0 0 24px", color: "#C9A84C", fontStyle: "italic", fontSize: 14 }}>
                  Writer & Creator — The Watchers
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                  <a href="mailto:jaygnz27@gmail.com" style={{
                    color: "#B8C4D8", textDecoration: "none", fontSize: 15,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    📧 jaygnz27@gmail.com
                  </a>
                  <span style={{ color: "#B8C4D8", fontSize: 15 }}>📱 908-255-2195</span>
                  <span style={{ color: "#B8C4D8", fontSize: 15 }}>📍 New Providence, NJ</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href={SCREENPLAY_URL} target="_blank" rel="noreferrer" style={{
                  display: "block", padding: "16px 24px",
                  background: "#1E4DB7", color: "white",
                  textDecoration: "none", borderRadius: 4,
                  fontFamily: "sans-serif", fontWeight: 700,
                  fontSize: 14, letterSpacing: 2, textAlign: "center",
                  boxShadow: "0 4px 20px rgba(30,77,183,0.4)",
                }}>
                  📄 DOWNLOAD FULL SCREENPLAY (PDF)
                </a>
                <a href={PITCHDECK_URL} target="_blank" rel="noreferrer" style={{
                  display: "block", padding: "16px 24px",
                  background: "transparent", color: "#C9A84C",
                  textDecoration: "none", borderRadius: 4,
                  fontFamily: "sans-serif", fontWeight: 700,
                  fontSize: 14, letterSpacing: 2, textAlign: "center",
                  border: "2px solid #C9A84C",
                }}>
                  🎬 DOWNLOAD PITCH DECK (PDF)
                </a>
              </div>

              <div style={{
                marginTop: 32, padding: 24,
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 6, textAlign: "center",
              }}>
                <p style={{ margin: "0 0 8px", color: "#C9A84C", fontSize: 13, fontFamily: "sans-serif", letterSpacing: 1, fontWeight: 700 }}>
                  FOR PRODUCERS & INDUSTRY PROFESSIONALS
                </p>
                <p style={{ margin: 0, color: "#B8C4D8", fontSize: 13, lineHeight: 1.7 }}>
                  The Watchers is available for option, co-production, and development discussions.
                  The short film format is ready for production. Feature adaptation available upon request.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "24px", textAlign: "center",
        }}>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "sans-serif", letterSpacing: 1 }}>
            © 2026 Jay Gunaratne · All Rights Reserved · THE WATCHERS · Confidential — For Industry Review Only
          </p>
        </div>
      </div>
    </div>
  );
}
