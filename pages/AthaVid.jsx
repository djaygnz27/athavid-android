import { useState, useEffect, useRef } from "react";

const sampleVideos = [
  {
    id: "demo1",
    username: "jaygnz27",
    display_name: "Jay G 🇱🇰",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=jay",
    caption: "Real moments from New Providence NJ 🌿 No filters, no AI, just life!",
    hashtags: ["reallife", "authentic", "athavid", "nj"],
    likes_count: 2841,
    comments_count: 134,
    views_count: 18420,
    shares_count: 89,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid1/500/880",
    is_ai_detected: false,
  },
  {
    id: "demo2",
    username: "melbourne_lisa",
    display_name: "Lisa M 🇦🇺",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    caption: "Morning coffee run in Melbourne CBD ☕ This is 100% real, no AI here!",
    hashtags: ["melbourne", "morning", "realvid", "coffee"],
    likes_count: 5621,
    comments_count: 287,
    views_count: 42100,
    shares_count: 312,
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid2/500/880",
    is_ai_detected: false,
  },
  {
    id: "demo3",
    username: "nj_foodie",
    display_name: "NJ Foodie 🍕",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodie",
    caption: "Best pizza in New Jersey — no cap! Filmed live, zero editing 🍕",
    hashtags: ["njfood", "pizza", "nofilter", "realeat"],
    likes_count: 9240,
    comments_count: 421,
    views_count: 87300,
    shares_count: 1020,
    created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid3/500/880",
    is_ai_detected: false,
  },
  {
    id: "demo4",
    username: "sydney_surfer",
    display_name: "Surf Sydney 🏄",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=surfer",
    caption: "Bondi Beach this morning — pure real footage 🌊 AthaVid keeps it 100% real!",
    hashtags: ["bondi", "surf", "athavid", "sydney"],
    likes_count: 14200,
    comments_count: 680,
    views_count: 124000,
    shares_count: 2100,
    created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid4/500/880",
    is_ai_detected: false,
  },
  {
    id: "demo5",
    username: "srilanka_vibes",
    display_name: "Lanka Vibes 🇱🇰",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=lanka",
    caption: "Sunset from Galle Fort — no editing, straight from my phone 🌅",
    hashtags: ["srilanka", "galle", "sunset", "athavid"],
    likes_count: 21800,
    comments_count: 940,
    views_count: 198000,
    shares_count: 3400,
    created_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid5/500/880",
    is_ai_detected: false,
  },
];

const sampleProducts = [
  { id: "p1", product_name: "Handmade Sri Lankan Batik Shirt", price: 45.00, seller_username: "jaygnz27", image_url: "https://picsum.photos/seed/prod1/400/400", category: "fashion", description: "Authentic handmade batik from Sri Lanka 🇱🇰", is_available: true, rating: 4.9, reviews: 128 },
  { id: "p2", product_name: "Melbourne Organic Coffee Blend", price: 28.00, seller_username: "melbourne_lisa", image_url: "https://picsum.photos/seed/prod2/400/400", category: "food", description: "Premium organic coffee from Melbourne roasters ☕", is_available: true, rating: 4.7, reviews: 86 },
  { id: "p3", product_name: "NJ Artisan Hot Sauce", price: 12.00, seller_username: "nj_foodie", image_url: "https://picsum.photos/seed/prod3/400/400", category: "food", description: "Homemade NJ style hot sauce 🌶️", is_available: true, rating: 4.8, reviews: 214 },
  { id: "p4", product_name: "Bondi Surf Wax Pack", price: 15.00, seller_username: "sydney_surfer", image_url: "https://picsum.photos/seed/prod4/400/400", category: "fitness", description: "Premium surf wax from Bondi Beach 🏄", is_available: true, rating: 4.6, reviews: 59 },
  { id: "p5", product_name: "Galle Fort Handcrafted Bracelet", price: 22.00, seller_username: "srilanka_vibes", image_url: "https://picsum.photos/seed/prod5/400/400", category: "fashion", description: "Handcrafted in the Galle Fort, Sri Lanka 🌺", is_available: true, rating: 5.0, reviews: 43 },
  { id: "p6", product_name: "AthaVid Creator Tee", price: 35.00, seller_username: "athavid_official", image_url: "https://picsum.photos/seed/prod6/400/400", category: "fashion", description: "Official AthaVid merch 🎬 Real people wear real threads.", is_available: true, rating: 4.9, reviews: 311 },
];

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  if (days >= 1) return `${days}d`;
  if (hours >= 1) return `${hours}h`;
  return `${mins}m`;
}

function daysLeft(dateStr) {
  const created = new Date(dateStr).getTime();
  const archiveAt = created + 30 * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((archiveAt - Date.now()) / (1000 * 60 * 60 * 24)));
}

// ─── SPLASH ──────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(160deg, #0d0015 0%, #05050f 50%, #001a0d 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @keyframes spinPop { 0%{transform:scale(0) rotate(-180deg);opacity:0} 60%{transform:scale(1.2) rotate(10deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes dot { 0%,80%,100%{transform:scale(0.5);opacity:0.3} 40%{transform:scale(1);opacity:1} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 40px rgba(108,99,255,0.3)} 50%{box-shadow:0 0 80px rgba(108,99,255,0.7),0 0 120px rgba(76,175,80,0.3)} }
      `}</style>
      <div style={{ animation: "spinPop 0.8s cubic-bezier(.175,.885,.32,1.275) forwards", fontSize: 90, marginBottom: 20 }}>🎬</div>
      <div style={{ animation: "fadeUp 0.6s 0.5s both", textAlign: "center" }}>
        <div style={{
          fontSize: 52, fontWeight: 900, letterSpacing: -1,
          background: "linear-gradient(135deg, #a78bfa 0%, #6c63ff 40%, #4caf50 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>AthaVid</div>
        <div style={{ color: "#555", fontSize: 13, letterSpacing: 4, marginTop: 6, textTransform: "uppercase" }}>
          Real · Authentic · Human
        </div>
      </div>
      <div style={{ animation: "fadeUp 0.6s 1s both", display: "flex", gap: 8, marginTop: 48 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i === 1 ? "#4caf50" : "#6c63ff",
            animation: `dot 1.2s ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── VIDEO REEL (TikTok-style full screen) ────────────────────────────────────
function VideoReel({ videos, likedVideos, onLike }) {
  const [current, setCurrent] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const startY = useRef(null);

  const handleTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (startY.current === null) return;
    const dy = startY.current - e.changedTouches[0].clientY;
    if (dy > 50 && current < videos.length - 1) setCurrent(c => c + 1);
    if (dy < -50 && current > 0) setCurrent(c => c - 1);
    startY.current = null;
  };

  const handleDoubleTap = (id) => {
    onLike(id);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const v = videos[current];
  const liked = likedVideos.has(v.id);
  const dl = daysLeft(v.created_date);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "calc(100vh - 56px)", overflow: "hidden", background: "#000" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={() => handleDoubleTap(v.id)}
    >
      <style>{`
        @keyframes heartPop { 0%{transform:translate(-50%,-50%) scale(0);opacity:1} 50%{transform:translate(-50%,-50%) scale(1.4);opacity:1} 100%{transform:translate(-50%,-50%) scale(1);opacity:0} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* Background video/image */}
      <img
        src={v.thumbnail_url}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Gradient overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 100%)" }} />

      {/* Double-tap heart */}
      {showHeart && (
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          fontSize: 100, animation: "heartPop 0.8s forwards", pointerEvents: "none",
          filter: "drop-shadow(0 0 20px rgba(255,68,102,0.8))"
        }}>❤️</div>
      )}

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
          borderRadius: 20, padding: "6px 14px", border: "1px solid rgba(108,99,255,0.3)"
        }}>
          <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 700 }}>AthaVid</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 20, padding: "5px 12px", border: "1px solid rgba(76,175,80,0.4)" }}>
            <span style={{ color: "#4caf50", fontSize: 11, fontWeight: 600 }}>✅ AI-FREE</span>
          </div>
          <div style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", borderRadius: 20, padding: "5px 12px", border: "1px solid rgba(108,99,255,0.4)" }}>
            <span style={{ color: "#a78bfa", fontSize: 11, fontWeight: 600 }}>🔞 18+</span>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
        {videos.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            height: 2, width: i === current ? 24 : 8,
            borderRadius: 2, cursor: "pointer",
            background: i === current ? "#a78bfa" : "rgba(255,255,255,0.3)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      {/* Right action bar */}
      <div style={{
        position: "absolute", right: 12, bottom: 120,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20
      }}>
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <img src={v.avatar_url} alt="" style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "2px solid #a78bfa",
            boxShadow: "0 0 15px rgba(108,99,255,0.5)"
          }} />
          <div style={{
            position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
            background: "#a78bfa", borderRadius: "50%", width: 18, height: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, border: "2px solid #000"
          }}>+</div>
        </div>

        {/* Like */}
        <button onClick={() => onLike(v.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: liked ? "rgba(255,68,102,0.2)" : "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${liked ? "rgba(255,68,102,0.5)" : "rgba(255,255,255,0.2)"}`,
            fontSize: 22, transition: "all 0.2s",
            boxShadow: liked ? "0 0 15px rgba(255,68,102,0.4)" : "none"
          }}>
            {liked ? "❤️" : "🤍"}
          </div>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{formatCount(v.likes_count + (liked ? 1 : 0))}</span>
        </button>

        {/* Comment */}
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)", fontSize: 22
          }}>💬</div>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{formatCount(v.comments_count)}</span>
        </button>

        {/* Share */}
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.2)", fontSize: 22
          }}>↗️</div>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{formatCount(v.shares_count)}</span>
        </button>

        {/* Archive countdown */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${dl <= 5 ? "rgba(255,68,68,0.5)" : "rgba(255,255,255,0.2)"}`,
            fontSize: 18,
            color: dl <= 5 ? "#ff4444" : dl <= 10 ? "#ffa500" : "#fff"
          }}>🗄️</div>
          <span style={{ color: dl <= 5 ? "#ff4444" : "#aaa", fontSize: 10, fontWeight: 700 }}>{dl}d</span>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ position: "absolute", bottom: 20, left: 16, right: 76, animation: "slideUp 0.4s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>@{v.username}</span>
          <span style={{ background: "rgba(108,99,255,0.3)", border: "1px solid rgba(108,99,255,0.5)", borderRadius: 10, padding: "2px 8px", color: "#a78bfa", fontSize: 10 }}>REAL</span>
          <span style={{ color: "#888", fontSize: 12 }}>{timeAgo(v.created_date)}</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.5 }}>{v.caption}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {v.hashtags.map(tag => (
            <span key={tag} style={{
              color: "#a78bfa", fontSize: 13, fontWeight: 600,
              textShadow: "0 0 10px rgba(108,99,255,0.5)"
            }}>#{tag}</span>
          ))}
        </div>
        {/* Date stamp */}
        <div style={{
          marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
          borderRadius: 20, padding: "5px 12px", border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <span style={{ fontSize: 12 }}>📅</span>
          <span style={{ color: "#aaa", fontSize: 11 }}>
            {new Date(v.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span style={{ color: "#555", fontSize: 11 }}>·</span>
          <span style={{ color: "#888", fontSize: 11 }}>👁 {formatCount(v.views_count)}</span>
        </div>
      </div>

      {/* Swipe hint */}
      <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>swipe up for next</span>
      </div>
    </div>
  );
}

// ─── SEARCH ──────────────────────────────────────────────────────────────────
function SearchPage({ videos }) {
  const [query, setQuery] = useState("");
  const results = query.length > 1
    ? videos.filter(v =>
        v.caption?.toLowerCase().includes(query.toLowerCase()) ||
        v.username?.toLowerCase().includes(query.toLowerCase()) ||
        (v.hashtags || []).some(h => h.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const trending = [
    { tag: "athavid", count: "2.1M" }, { tag: "reallife", count: "890K" },
    { tag: "nofilter", count: "1.4M" }, { tag: "bondi", count: "540K" },
    { tag: "srilanka", count: "720K" }, { tag: "njfood", count: "210K" },
  ];

  return (
    <div style={{ padding: "16px", minHeight: "100%", background: "#050510" }}>
      <div style={{ position: "relative", marginBottom: 24 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search videos, users, hashtags..."
          style={{
            width: "100%", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(108,99,255,0.4)", borderRadius: 30,
            padding: "14px 20px 14px 48px", color: "#fff", fontSize: 15,
            outline: "none", boxSizing: "border-box",
            backdropFilter: "blur(10px)",
          }}
        />
      </div>

      {!query && (
        <>
          <div style={{ color: "#666", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>🔥 Trending</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {trending.map((t, i) => (
              <button key={t.tag} onClick={() => setQuery(t.tag)} style={{
                background: `linear-gradient(135deg, ${i % 2 === 0 ? "rgba(108,99,255,0.15)" : "rgba(76,175,80,0.1)"}, rgba(255,255,255,0.02))`,
                border: `1px solid ${i % 2 === 0 ? "rgba(108,99,255,0.3)" : "rgba(76,175,80,0.3)"}`,
                borderRadius: 16, padding: "14px 16px", cursor: "pointer", textAlign: "left"
              }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>#{t.tag}</div>
                <div style={{ color: "#666", fontSize: 12, marginTop: 3 }}>{t.count} videos</div>
              </button>
            ))}
          </div>

          <div style={{ color: "#666", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>👥 Suggested</div>
          {[
            { username: "sydney_surfer", display_name: "Surf Sydney 🏄", seed: "surfer", followers: "14.2K", verified: true },
            { username: "melbourne_lisa", display_name: "Lisa M 🇦🇺", seed: "lisa", followers: "8.1K", verified: true },
            { username: "srilanka_vibes", display_name: "Lanka Vibes 🇱🇰", seed: "lanka", followers: "31K", verified: true },
          ].map(u => (
            <div key={u.username} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: "rgba(255,255,255,0.03)", borderRadius: 16,
              padding: "12px 16px", marginBottom: 10,
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}`} alt="" style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "2px solid rgba(108,99,255,0.5)",
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{u.display_name}</div>
                <div style={{ color: "#555", fontSize: 12 }}>@{u.username} · {u.followers} followers</div>
              </div>
              <button style={{
                background: "rgba(108,99,255,0.2)", border: "1px solid rgba(108,99,255,0.5)",
                borderRadius: 20, padding: "7px 16px", color: "#a78bfa",
                cursor: "pointer", fontSize: 13, fontWeight: 600
              }}>Follow</button>
            </div>
          ))}
        </>
      )}

      {query.length > 1 && results.length === 0 && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>🔍</div>
          <div style={{ color: "#555" }}>No results for "{query}"</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {(query.length > 1 ? results : videos).map(v => (
          <div key={v.id} style={{
            position: "relative", paddingTop: "150%",
            borderRadius: 12, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <img src={v.thumbnail_url} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>@{v.username}</div>
              <div style={{ color: "#aaa", fontSize: 10 }}>👁 {formatCount(v.views_count)}</div>
            </div>
            <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(76,175,80,0.8)", borderRadius: 8, padding: "2px 6px" }}>
              <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✅ REAL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UPLOAD ──────────────────────────────────────────────────────────────────
function UploadPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ caption: "", hashtags: "", dob: "", agreed: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.agreed) { alert("Please agree to the community standards."); return; }
    if (!form.dob) { alert("Please enter your date of birth."); return; }
    const age = (Date.now() - new Date(form.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 18) { alert("You must be 18 or older to post on AthaVid."); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ minHeight: "100%", background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <style>{`@keyframes checkPop { 0%{transform:scale(0) rotate(-45deg);opacity:0} 70%{transform:scale(1.2) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }`}</style>
      <div style={{ fontSize: 80, animation: "checkPop 0.6s cubic-bezier(.175,.885,.32,1.275) forwards", marginBottom: 24 }}>🎉</div>
      <div style={{ color: "#a78bfa", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Video Submitted!</div>
      <div style={{ color: "#555", fontSize: 14, textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
        Your video is being scanned for AI content.<br/>It'll go live in minutes if it passes. 🔍
      </div>
      <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: 16, padding: 16, width: "100%", marginBottom: 28 }}>
        <div style={{ color: "#4caf50", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>✅ Auto-archive in 30 days</div>
        <div style={{ color: "#555", fontSize: 12 }}>Your video will be visible for exactly 30 days from upload. No exceptions.</div>
      </div>
      <button onClick={() => { setSubmitted(false); setStep(1); setForm({ caption: "", hashtags: "", dob: "", agreed: false }); }} style={{
        background: "linear-gradient(135deg, #6c63ff, #a78bfa)", border: "none",
        borderRadius: 30, padding: "14px 40px", color: "#fff", fontSize: 16,
        cursor: "pointer", fontWeight: 700, boxShadow: "0 8px 30px rgba(108,99,255,0.4)"
      }}>
        Upload Another 🎬
      </button>
    </div>
  );

  return (
    <div style={{ padding: 20, background: "#050510", minHeight: "100%" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {[1, 2].map(s => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: step >= s ? "linear-gradient(90deg, #6c63ff, #a78bfa)" : "rgba(255,255,255,0.1)",
            transition: "background 0.3s"
          }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎬</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>Post to AthaVid</div>
            <div style={{ color: "#555", fontSize: 14, marginTop: 6 }}>Real humans only. No AI. No fakes.</div>
          </div>

          {/* Drop zone */}
          <div style={{
            border: "2px dashed rgba(108,99,255,0.4)", borderRadius: 24,
            padding: "48px 24px", textAlign: "center", cursor: "pointer",
            background: "rgba(108,99,255,0.04)", marginBottom: 24,
            position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              background: "radial-gradient(circle at center, #6c63ff, transparent)"
            }} />
            <div style={{ fontSize: 52, marginBottom: 12 }}>📹</div>
            <div style={{ color: "#a78bfa", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Tap to select your video</div>
            <div style={{ color: "#555", fontSize: 13 }}>MP4 · MOV · AVI · Max 500MB · Max 10 min</div>
          </div>

          {/* Rules */}
          <div style={{ background: "rgba(255,100,0,0.05)", border: "1px solid rgba(255,100,0,0.2)", borderRadius: 16, padding: 18, marginBottom: 24 }}>
            <div style={{ color: "#ffa040", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>⚠️ Community Standards</div>
            <div style={{ color: "#555", fontSize: 13, lineHeight: 1.9 }}>
              ❌ No AI-generated or deepfake content<br/>
              ❌ No sexual content<br/>
              ❌ No hate speech or harassment<br/>
              ✅ Must be filmed by a real human<br/>
              ✅ 18+ users only · Original content only
            </div>
          </div>

          <button onClick={() => setStep(2)} style={{
            width: "100%", background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            border: "none", borderRadius: 30, padding: 16, color: "#fff",
            fontSize: 16, cursor: "pointer", fontWeight: 700,
            boxShadow: "0 8px 30px rgba(108,99,255,0.4)"
          }}>Continue →</button>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: "#666", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Caption</label>
            <textarea
              value={form.caption}
              onChange={e => setForm({ ...form, caption: e.target.value })}
              placeholder="Tell the world what's happening..."
              rows={3}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
                padding: 16, color: "#fff", fontSize: 14,
                outline: "none", resize: "none", boxSizing: "border-box",
                lineHeight: 1.6
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: "#666", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Hashtags</label>
            <input
              value={form.hashtags}
              onChange={e => setForm({ ...form, hashtags: e.target.value })}
              placeholder="reallife, authentic, athavid"
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
                padding: 16, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: "#666", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Date of Birth (18+ Verification)</label>
            <input
              type="date"
              value={form.dob}
              onChange={e => setForm({ ...form, dob: e.target.value })}
              style={{
                width: "100%", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
                padding: 16, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: 16, padding: 16, marginBottom: 24
          }}>
            <input type="checkbox" checked={form.agreed} onChange={e => setForm({ ...form, agreed: e.target.checked })}
              style={{ marginTop: 2, accentColor: "#6c63ff", width: 18, height: 18, flexShrink: 0 }} />
            <div style={{ color: "#777", fontSize: 13, lineHeight: 1.6 }}>
              I confirm this video is 100% real, filmed by a human, contains no AI-generated content, no sexual content, and I am 18 or older.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{
              flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 30, padding: 14, color: "#666", fontSize: 15, cursor: "pointer"
            }}>← Back</button>
            <button onClick={handleSubmit} style={{
              flex: 2, background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              border: "none", borderRadius: 30, padding: 14,
              color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700,
              boxShadow: "0 8px 30px rgba(108,99,255,0.4)"
            }}>🚀 Post Video</button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── SHOP ─────────────────────────────────────────────────────────────────────
function ShopPage() {
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [added, setAdded] = useState(null);

  const addToCart = (p) => {
    setCart(c => [...c, p]);
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1500);
    setSelected(null);
  };

  return (
    <div style={{ background: "#050510", minHeight: "100%", padding: 16 }}>
      <style>{`@keyframes addedPop { 0%{transform:scale(0)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>Shop 🛒</div>
          <div style={{ color: "#555", fontSize: 13 }}>Real products from real creators</div>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
          borderRadius: 20, padding: "8px 18px", color: "#fff",
          fontSize: 14, fontWeight: 700,
          boxShadow: cart.length > 0 ? "0 0 20px rgba(108,99,255,0.5)" : "none"
        }}>
          🛒 {cart.length}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {sampleProducts.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer",
            position: "relative"
          }}>
            {added === p.id && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(76,175,80,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 2, borderRadius: 20, animation: "addedPop 0.3s"
              }}>
                <span style={{ fontSize: 40 }}>✅</span>
              </div>
            )}
            <div style={{ position: "relative" }}>
              <img src={p.image_url} alt="" style={{ width: "100%", height: 140, objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", borderRadius: 10, padding: "3px 8px" }}>
                <span style={{ color: "#ffd700", fontSize: 11 }}>★ {p.rating}</span>
              </div>
            </div>
            <div style={{ padding: "10px 12px 14px" }}>
              <div style={{ color: "#ddd", fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{p.product_name}</div>
              <div style={{ color: "#a78bfa", fontSize: 16, fontWeight: 800 }}>${p.price.toFixed(2)}</div>
              <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>@{p.seller_username}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Product detail sheet */}
      {selected && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "flex-end", zIndex: 1000,
          backdropFilter: "blur(8px)"
        }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "linear-gradient(180deg, #0f0f20 0%, #050510 100%)",
            borderRadius: "28px 28px 0 0", padding: 24,
            width: "100%", maxHeight: "85vh", overflowY: "auto",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 20px" }} />
            <img src={selected.image_url} alt="" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 20, marginBottom: 20 }} />
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{selected.product_name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ color: "#ffd700", fontSize: 14 }}>{"★".repeat(Math.round(selected.rating))}</div>
              <div style={{ color: "#555", fontSize: 13 }}>{selected.rating} · {selected.reviews} reviews</div>
            </div>
            <div style={{ color: "#666", fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>{selected.description}</div>
            <div style={{ color: "#a78bfa", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>${selected.price.toFixed(2)}</div>
            <div style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>Sold by <span style={{ color: "#a78bfa" }}>@{selected.seller_username}</span></div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setSelected(null)} style={{
                flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 25, padding: 14, color: "#666", fontSize: 15, cursor: "pointer"
              }}>Cancel</button>
              <button onClick={() => addToCart(selected)} style={{
                flex: 2, background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                border: "none", borderRadius: 25, padding: 14,
                color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700,
                boxShadow: "0 8px 30px rgba(108,99,255,0.4)"
              }}>🛒 Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfilePage() {
  const [tab, setTab] = useState("videos");

  return (
    <div style={{ background: "#050510", minHeight: "100%" }}>
      {/* Cover gradient */}
      <div style={{ height: 120, background: "linear-gradient(135deg, #1a0a3e 0%, #0a1a0a 100%)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.3), transparent)" }} />
      </div>

      <div style={{ padding: "0 20px 20px", marginTop: -44 }}>
        {/* Avatar */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile" alt="" style={{
            width: 88, height: 88, borderRadius: "50%",
            border: "3px solid #050510",
            boxShadow: "0 0 30px rgba(108,99,255,0.5)"
          }} />
          <div style={{
            position: "absolute", bottom: 2, right: 2,
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            borderRadius: "50%", width: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #050510", fontSize: 12
          }}>✅</div>
        </div>

        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 2 }}>@jaygnz27</div>
        <div style={{ color: "#555", fontSize: 14, marginBottom: 12 }}>Jay G · New Providence, NJ 🇱🇰</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(76,175,80,0.12)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ color: "#4caf50", fontSize: 12, fontWeight: 600 }}>✅ AI-Free Verified</span>
          </div>
          <div style={{ background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600 }}>🔞 18+ Verified</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {[{ label: "Videos", val: "24" }, { label: "Followers", val: "2.8K" }, { label: "Following", val: "142" }, { label: "Views", val: "188K" }].map(s => (
            <div key={s.label} style={{
              flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "10px 4px", textAlign: "center"
            }}>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{s.val}</div>
              <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button style={{
            flex: 1, background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            border: "none", borderRadius: 25, padding: 12, color: "#fff",
            fontSize: 14, cursor: "pointer", fontWeight: 700,
            boxShadow: "0 6px 20px rgba(108,99,255,0.35)"
          }}>Edit Profile</button>
          <button style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 25, padding: 12, color: "#888", fontSize: 14, cursor: "pointer"
          }}>Share Profile</button>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 4 }}>
          {[{ key: "videos", label: "🎬 Videos" }, { key: "liked", label: "❤️ Liked" }, { key: "archived", label: "🗄️ Archive" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, border: "none", borderRadius: 12, padding: "10px 8px",
              background: tab === t.key ? "rgba(108,99,255,0.3)" : "transparent",
              color: tab === t.key ? "#a78bfa" : "#555",
              fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* Video grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
          {[1,2,3,4,5,6,7,8,9].map(i => (
            <div key={i} style={{ position: "relative", paddingTop: "133%", borderRadius: 10, overflow: "hidden" }}>
              <img src={`https://picsum.photos/seed/myv${i}${tab}/200/300`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 5, left: 5, color: "#fff", fontSize: 10, fontWeight: 600 }}>
                ▶ {((i * 3.7) % 20 + 0.5).toFixed(1)}K
              </div>
              {tab === "archived" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 20 }}>🗄️</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AthaVid() {
  const [activeTab, setActiveTab] = useState("feed");
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const handleLike = (id) => {
    setLikedVideos(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const tabs = [
    { key: "feed", icon: "🏠", label: "Home" },
    { key: "search", icon: "🔍", label: "Explore" },
    { key: "upload", icon: "➕", label: "Post" },
    { key: "shop", icon: "🛒", label: "Shop" },
    { key: "profile", icon: "👤", label: "Me" },
  ];

  return (
    <div style={{ background: "#050510", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Inter', -apple-system, sans-serif", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        body { background: #050510; margin: 0; }
        input, textarea, button { font-family: inherit; }
      `}</style>

      {showSplash && <Splash />}

      {/* Content area */}
      <div style={{ height: "calc(100vh - 56px)", overflowY: activeTab === "feed" ? "hidden" : "auto" }}>
        {activeTab === "feed" && <VideoReel videos={sampleVideos} likedVideos={likedVideos} onLike={handleLike} />}
        {activeTab === "search" && <SearchPage videos={sampleVideos} />}
        {activeTab === "upload" && <UploadPage />}
        {activeTab === "shop" && <ShopPage />}
        {activeTab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(5,5,16,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-around",
        padding: "4px 0 8px", zIndex: 200,
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            background: t.key === "upload"
              ? "linear-gradient(135deg, #6c63ff, #a78bfa)"
              : "none",
            border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: t.key === "upload" ? "10px 18px" : "8px 16px",
            borderRadius: t.key === "upload" ? 20 : 10,
            transform: t.key === "upload" ? "translateY(-12px)" : "none",
            boxShadow: t.key === "upload" ? "0 8px 25px rgba(108,99,255,0.5)" : "none",
            transition: "all 0.2s",
          }}>
            <span style={{
              fontSize: t.key === "upload" ? 24 : 22,
              filter: activeTab === t.key && t.key !== "upload" ? "drop-shadow(0 0 8px rgba(108,99,255,0.8))" : "none",
              transition: "filter 0.2s"
            }}>{t.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: t.key === "upload" ? "#fff" : activeTab === t.key ? "#a78bfa" : "#333",
              transition: "color 0.2s"
            }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
