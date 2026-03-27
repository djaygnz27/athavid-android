import { useState, useEffect, useRef } from "react";
import { AthaVidVideo, AthaVidUser, AthaVidComment, AthaVidProduct } from "../api/entities";

const TABS = ["feed", "search", "upload", "shop", "profile"];

const sampleVideos = [
  {
    id: "demo1",
    username: "jaygnz27",
    display_name: "Jay G 🇱🇰",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=jay",
    caption: "Real moments from New Providence NJ 🌿 No filters, no AI, just life! #reallife #authentic #athavid",
    hashtags: ["reallife", "authentic", "athavid"],
    likes_count: 2841,
    comments_count: 134,
    views_count: 18420,
    shares_count: 89,
    created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid1/400/700",
    is_archived: false,
    is_ai_detected: false,
  },
  {
    id: "demo2",
    username: "melbourne_lisa",
    display_name: "Lisa M 🇦🇺",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    caption: "Morning coffee run in Melbourne CBD ☕ This is 100% real, no AI here! #melbourne #morning #realvid",
    hashtags: ["melbourne", "morning", "realvid"],
    likes_count: 5621,
    comments_count: 287,
    views_count: 42100,
    shares_count: 312,
    created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid2/400/700",
    is_archived: false,
    is_ai_detected: false,
  },
  {
    id: "demo3",
    username: "nj_foodie",
    display_name: "NJ Foodie 🍕",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodie",
    caption: "Best pizza in New Jersey — no cap! Filmed live, zero editing 🍕 #njfood #pizza #nofilter",
    hashtags: ["njfood", "pizza", "nofilter"],
    likes_count: 9240,
    comments_count: 421,
    views_count: 87300,
    shares_count: 1020,
    created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid3/400/700",
    is_archived: false,
    is_ai_detected: false,
  },
  {
    id: "demo4",
    username: "sydney_surfer",
    display_name: "Surf Sydney 🏄",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=surfer",
    caption: "Bondi Beach this morning — pure real footage 🌊 AthaVid keeps it 100% real! #bondi #surf #athavid",
    hashtags: ["bondi", "surf", "athavid"],
    likes_count: 14200,
    comments_count: 680,
    views_count: 124000,
    shares_count: 2100,
    created_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    thumbnail_url: "https://picsum.photos/seed/vid4/400/700",
    is_archived: false,
    is_ai_detected: false,
  },
];

const sampleProducts = [
  { id: "p1", product_name: "Handmade Sri Lankan Batik Shirt", price: 45.00, currency: "USD", seller_username: "jaygnz27", image_url: "https://picsum.photos/seed/prod1/300/300", category: "fashion", description: "Authentic handmade batik from Sri Lanka 🇱🇰", is_available: true },
  { id: "p2", product_name: "Melbourne Organic Coffee Blend", price: 28.00, currency: "USD", seller_username: "melbourne_lisa", image_url: "https://picsum.photos/seed/prod2/300/300", category: "food", description: "Premium organic coffee from Melbourne roasters ☕", is_available: true },
  { id: "p3", product_name: "NJ Artisan Hot Sauce", price: 12.00, currency: "USD", seller_username: "nj_foodie", image_url: "https://picsum.photos/seed/prod3/300/300", category: "food", description: "Homemade NJ style hot sauce 🌶️", is_available: true },
  { id: "p4", product_name: "Bondi Surf Wax", price: 15.00, currency: "USD", seller_username: "sydney_surfer", image_url: "https://picsum.photos/seed/prod4/300/300", category: "fitness", description: "Premium surf wax from Bondi Beach 🏄", is_available: true },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor(diff / (1000 * 60));
  if (days >= 1) return `${days}d ago`;
  if (hours >= 1) return `${hours}h ago`;
  return `${mins}m ago`;
}

function daysUntilArchive(dateStr) {
  const created = new Date(dateStr).getTime();
  const archiveAt = created + 30 * 24 * 60 * 60 * 1000;
  const remaining = Math.ceil((archiveAt - Date.now()) / (1000 * 60 * 60 * 24));
  return remaining;
}

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
}

function VideoCard({ video, onLike, liked }) {
  const [showComments, setShowComments] = useState(false);
  const daysLeft = daysUntilArchive(video.created_date);

  return (
    <div style={{
      background: "#0a0a0a",
      borderRadius: "16px",
      overflow: "hidden",
      marginBottom: "16px",
      border: "1px solid #1a1a2e",
      position: "relative",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: "10px" }}>
        <img src={video.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid #6c63ff" }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>@{video.username}</div>
          <div style={{ color: "#888", fontSize: 12 }}>{video.display_name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#888", fontSize: 11 }}>{timeAgo(video.created_date)}</div>
          <div style={{
            fontSize: 10,
            color: daysLeft <= 5 ? "#ff4444" : daysLeft <= 10 ? "#ffa500" : "#6c63ff",
            fontWeight: 600,
          }}>
            🗄️ {daysLeft}d to archive
          </div>
        </div>
      </div>

      {/* Verified badge */}
      <div style={{ paddingLeft: 16, paddingBottom: 8, display: "flex", gap: 6 }}>
        <span style={{ background: "#1a2a1a", color: "#4caf50", fontSize: 11, padding: "2px 8px", borderRadius: 20, border: "1px solid #4caf50" }}>
          ✅ AI-Free Verified
        </span>
        <span style={{ background: "#1a1a2e", color: "#6c63ff", fontSize: 11, padding: "2px 8px", borderRadius: 20, border: "1px solid #6c63ff" }}>
          🔞 18+
        </span>
      </div>

      {/* Video Thumbnail */}
      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#111", overflow: "hidden" }}>
        <img
          src={video.thumbnail_url}
          alt="video thumbnail"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        />
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 60, height: 60, borderRadius: "50%", background: "rgba(108,99,255,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 0 20px rgba(108,99,255,0.5)"
        }}>
          <span style={{ fontSize: 24, marginLeft: 4 }}>▶</span>
        </div>
        {/* Date stamp */}
        <div style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11,
          padding: "3px 8px", borderRadius: 6, backdropFilter: "blur(4px)"
        }}>
          📅 {new Date(video.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          background: "rgba(0,0,0,0.7)", color: "#aaa", fontSize: 11,
          padding: "3px 8px", borderRadius: 6
        }}>
          👁 {formatCount(video.views_count)}
        </div>
      </div>

      {/* Caption */}
      <div style={{ padding: "12px 16px 8px" }}>
        <p style={{ color: "#ddd", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{video.caption}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {(video.hashtags || []).map(tag => (
            <span key={tag} style={{ color: "#6c63ff", fontSize: 13, cursor: "pointer" }}>#{tag}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", padding: "8px 16px 16px", gap: 20 }}>
        <button onClick={() => onLike(video.id)} style={{
          background: "none", border: "none", color: liked ? "#ff4466" : "#888",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14
        }}>
          {liked ? "❤️" : "🤍"} {formatCount(video.likes_count + (liked ? 1 : 0))}
        </button>
        <button onClick={() => setShowComments(!showComments)} style={{
          background: "none", border: "none", color: "#888",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14
        }}>
          💬 {formatCount(video.comments_count)}
        </button>
        <button style={{
          background: "none", border: "none", color: "#888",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14
        }}>
          📤 {formatCount(video.shares_count)}
        </button>
      </div>

      {showComments && (
        <div style={{ background: "#111", padding: "12px 16px", borderTop: "1px solid #1a1a2e" }}>
          <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>Top comments</div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=commenter1" alt="" style={{ width: 30, height: 30, borderRadius: "50%" }} />
            <div>
              <span style={{ color: "#6c63ff", fontSize: 13, fontWeight: 600 }}>@realuser_nj </span>
              <span style={{ color: "#ccc", fontSize: 13 }}>Love this! 100% real content 🔥</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=commenter2" alt="" style={{ width: 30, height: 30, borderRadius: "50%" }} />
            <div>
              <span style={{ color: "#6c63ff", fontSize: 13, fontWeight: 600 }}>@aussie_mike </span>
              <span style={{ color: "#ccc", fontSize: 13 }}>Finally an app with no AI fake stuff!</span>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 12, gap: 8 }}>
            <input placeholder="Add a comment..." style={{
              flex: 1, background: "#1a1a2e", border: "1px solid #333",
              borderRadius: 20, padding: "8px 14px", color: "#fff", fontSize: 13, outline: "none"
            }} />
            <button style={{
              background: "#6c63ff", border: "none", borderRadius: 20,
              padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13
            }}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Feed({ videos, likedVideos, onLike }) {
  return (
    <div>
      {videos.filter(v => !v.is_archived).map(video => (
        <VideoCard
          key={video.id}
          video={video}
          onLike={onLike}
          liked={likedVideos.has(video.id)}
        />
      ))}
    </div>
  );
}

function SearchPage({ videos }) {
  const [query, setQuery] = useState("");
  const results = query.length > 1
    ? videos.filter(v =>
        v.caption?.toLowerCase().includes(query.toLowerCase()) ||
        v.username?.toLowerCase().includes(query.toLowerCase()) ||
        (v.hashtags || []).some(h => h.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const trendingTags = ["#athavid", "#reallife", "#nofilter", "#authentic", "#melbourne", "#bondi", "#njfood"];

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search videos, users, hashtags..."
          style={{
            width: "100%", background: "#1a1a2e", border: "2px solid #6c63ff",
            borderRadius: 25, padding: "12px 16px 12px 44px", color: "#fff",
            fontSize: 15, outline: "none", boxSizing: "border-box"
          }}
        />
      </div>

      {query.length === 0 && (
        <div>
          <div style={{ color: "#aaa", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>🔥 Trending Hashtags</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {trendingTags.map(tag => (
              <button key={tag} onClick={() => setQuery(tag.replace("#", ""))} style={{
                background: "#1a1a2e", border: "1px solid #6c63ff", borderRadius: 20,
                padding: "8px 16px", color: "#6c63ff", cursor: "pointer", fontSize: 14
              }}>{tag}</button>
            ))}
          </div>
          <div style={{ color: "#aaa", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>👥 Suggested Users</div>
          {[
            { username: "sydney_surfer", display_name: "Surf Sydney 🏄", avatar: "surfer", followers: "14.2K" },
            { username: "melbourne_lisa", display_name: "Lisa M 🇦🇺", avatar: "lisa", followers: "8.1K" },
            { username: "nj_foodie", display_name: "NJ Foodie 🍕", avatar: "foodie", followers: "22K" },
          ].map(u => (
            <div key={u.username} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#0a0a0a", borderRadius: 12, padding: "12px 16px", marginBottom: 10,
              border: "1px solid #1a1a2e"
            }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.avatar}`} alt="" style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid #6c63ff" }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700 }}>{u.display_name}</div>
                <div style={{ color: "#888", fontSize: 12 }}>@{u.username} · {u.followers} followers</div>
              </div>
              <button style={{ background: "#6c63ff", border: "none", borderRadius: 20, padding: "6px 16px", color: "#fff", cursor: "pointer", fontSize: 13 }}>Follow</button>
            </div>
          ))}
        </div>
      )}

      {query.length > 1 && results.length === 0 && (
        <div style={{ textAlign: "center", color: "#888", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div>No results for "{query}"</div>
        </div>
      )}

      {results.map(video => (
        <div key={video.id} style={{
          background: "#0a0a0a", borderRadius: 12, padding: 12,
          marginBottom: 10, border: "1px solid #1a1a2e", display: "flex", gap: 12
        }}>
          <img src={video.thumbnail_url} alt="" style={{ width: 80, height: 60, borderRadius: 8, objectFit: "cover" }} />
          <div>
            <div style={{ color: "#6c63ff", fontSize: 13 }}>@{video.username}</div>
            <div style={{ color: "#ddd", fontSize: 13, marginTop: 4 }}>{video.caption?.slice(0, 80)}...</div>
            <div style={{ color: "#888", fontSize: 11, marginTop: 4 }}>👁 {formatCount(video.views_count)} · {timeAgo(video.created_date)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UploadPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ caption: "", hashtags: "", dob: "", agreed: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!form.agreed) { alert("You must agree to the community guidelines."); return; }
    const dob = new Date(form.dob);
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 18) { alert("You must be 18 or older to post on AthaVid."); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
      <div style={{ color: "#6c63ff", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Video Submitted!</div>
      <div style={{ color: "#aaa", fontSize: 15 }}>Your video is being reviewed for AI content. It will go live within minutes if it passes our authenticity check.</div>
      <div style={{ marginTop: 20, background: "#1a2a1a", borderRadius: 12, padding: 16, border: "1px solid #4caf50" }}>
        <div style={{ color: "#4caf50", fontSize: 14, fontWeight: 600 }}>✅ Auto-archive in 30 days from upload</div>
        <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Viewers will always see the exact date your video was posted.</div>
      </div>
      <button onClick={() => { setSubmitted(false); setStep(1); setForm({ caption: "", hashtags: "", dob: "", agreed: false }); }}
        style={{ marginTop: 24, background: "#6c63ff", border: "none", borderRadius: 25, padding: "12px 32px", color: "#fff", fontSize: 15, cursor: "pointer" }}>
        Upload Another
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 40 }}>🎬</div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Upload to AthaVid</div>
        <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Real people. Real video. No AI. No fakes.</div>
      </div>

      {step === 1 && (
        <div>
          <div style={{
            border: "2px dashed #6c63ff", borderRadius: 16, padding: 40,
            textAlign: "center", cursor: "pointer", background: "#0a0a1a", marginBottom: 20
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📹</div>
            <div style={{ color: "#6c63ff", fontSize: 16, fontWeight: 600 }}>Tap to select your video</div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>MP4, MOV, AVI · Max 500MB · Max 10 minutes</div>
          </div>

          <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid #333" }}>
            <div style={{ color: "#ffa500", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>⚠️ AthaVid Content Rules</div>
            <div style={{ color: "#888", fontSize: 12, lineHeight: 1.7 }}>
              ❌ No AI-generated or deepfake content<br/>
              ❌ No sexual content of any kind<br/>
              ❌ No hate speech or harassment<br/>
              ✅ Must be filmed by a real human<br/>
              ✅ Must be original content<br/>
              ✅ 18+ users only
            </div>
          </div>

          <button onClick={() => setStep(2)} style={{
            width: "100%", background: "#6c63ff", border: "none", borderRadius: 25,
            padding: "14px", color: "#fff", fontSize: 16, cursor: "pointer", fontWeight: 700
          }}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#aaa", fontSize: 13, display: "block", marginBottom: 6 }}>Caption</label>
            <textarea
              value={form.caption}
              onChange={e => setForm({ ...form, caption: e.target.value })}
              placeholder="Tell the world what's happening..."
              rows={3}
              style={{
                width: "100%", background: "#1a1a2e", border: "1px solid #333",
                borderRadius: 12, padding: "12px", color: "#fff", fontSize: 14,
                outline: "none", resize: "none", boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#aaa", fontSize: 13, display: "block", marginBottom: 6 }}>Hashtags (comma separated)</label>
            <input
              value={form.hashtags}
              onChange={e => setForm({ ...form, hashtags: e.target.value })}
              placeholder="reallife, authentic, athavid"
              style={{
                width: "100%", background: "#1a1a2e", border: "1px solid #333",
                borderRadius: 12, padding: "12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "#aaa", fontSize: 13, display: "block", marginBottom: 6 }}>Date of Birth (18+ verification)</label>
            <input
              type="date"
              value={form.dob}
              onChange={e => setForm({ ...form, dob: e.target.value })}
              style={{
                width: "100%", background: "#1a1a2e", border: "1px solid #333",
                borderRadius: 12, padding: "12px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20, background: "#1a1a2e", borderRadius: 12, padding: 14 }}>
            <input type="checkbox" checked={form.agreed} onChange={e => setForm({ ...form, agreed: e.target.checked })}
              style={{ marginTop: 2, accentColor: "#6c63ff", width: 18, height: 18 }} />
            <div style={{ color: "#aaa", fontSize: 13, lineHeight: 1.5 }}>
              I confirm this video is 100% real, filmed by a human, contains no AI-generated content, no sexual content, and I am 18 years or older.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{
              flex: 1, background: "#1a1a2e", border: "1px solid #333", borderRadius: 25,
              padding: "14px", color: "#aaa", fontSize: 15, cursor: "pointer"
            }}>← Back</button>
            <button onClick={handleSubmit} style={{
              flex: 2, background: "#6c63ff", border: "none", borderRadius: 25,
              padding: "14px", color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700
            }}>🚀 Upload Video</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopPage({ products }) {
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>🛒 AthaVid Shop</div>
          <div style={{ color: "#888", fontSize: 13 }}>Real products from real creators</div>
        </div>
        <div style={{ background: "#6c63ff", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 14 }}>
          Cart: {cart.length}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {products.map(product => (
          <div key={product.id} onClick={() => setSelected(product)} style={{
            background: "#0a0a0a", borderRadius: 16, overflow: "hidden",
            border: "1px solid #1a1a2e", cursor: "pointer",
            transition: "border-color 0.2s",
          }}>
            <img src={product.image_url} alt="" style={{ width: "100%", height: 150, objectFit: "cover" }} />
            <div style={{ padding: "10px 12px" }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{product.product_name}</div>
              <div style={{ color: "#6c63ff", fontSize: 15, fontWeight: 700 }}>${product.price.toFixed(2)}</div>
              <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>@{product.seller_username}</div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end",
          zIndex: 1000, backdropFilter: "blur(4px)"
        }} onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#0f0f1a", borderRadius: "24px 24px 0 0", padding: 24,
            width: "100%", maxHeight: "80vh", overflowY: "auto"
          }}>
            <img src={selected.image_url} alt="" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16, marginBottom: 16 }} />
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{selected.product_name}</div>
            <div style={{ color: "#888", fontSize: 14, marginBottom: 12 }}>{selected.description}</div>
            <div style={{ color: "#6c63ff", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>${selected.price.toFixed(2)} USD</div>
            <div style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>Sold by @{selected.seller_username}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setSelected(null)} style={{
                flex: 1, background: "#1a1a2e", border: "1px solid #333", borderRadius: 25,
                padding: 14, color: "#aaa", fontSize: 15, cursor: "pointer"
              }}>Cancel</button>
              <button onClick={() => { setCart([...cart, selected]); setSelected(null); }} style={{
                flex: 2, background: "#6c63ff", border: "none", borderRadius: 25,
                padding: 14, color: "#fff", fontSize: 15, cursor: "pointer", fontWeight: 700
              }}>🛒 Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfilePage() {
  const stats = [
    { label: "Videos", value: "24" },
    { label: "Followers", value: "2.8K" },
    { label: "Following", value: "142" },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=myprofile" alt="" style={{
            width: 90, height: 90, borderRadius: "50%",
            border: "3px solid #6c63ff", display: "block"
          }} />
          <div style={{
            position: "absolute", bottom: 0, right: 0,
            background: "#4caf50", borderRadius: "50%", width: 22, height: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #000", fontSize: 12
          }}>✅</div>
        </div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>@myusername</div>
        <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>My Display Name</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
          <span style={{ background: "#1a2a1a", color: "#4caf50", fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "1px solid #4caf50" }}>✅ AI-Free Verified</span>
          <span style={{ background: "#1a1a2e", color: "#6c63ff", fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "1px solid #6c63ff" }}>🔞 18+ Verified</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24, background: "#0a0a0a", borderRadius: 16, padding: "16px 0", border: "1px solid #1a1a2e" }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: "#888", fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button style={{ flex: 1, background: "#6c63ff", border: "none", borderRadius: 25, padding: "12px", color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Edit Profile</button>
        <button style={{ flex: 1, background: "#1a1a2e", border: "1px solid #333", borderRadius: 25, padding: "12px", color: "#aaa", fontSize: 14, cursor: "pointer" }}>Share Profile</button>
      </div>

      <div style={{ color: "#aaa", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>🎬 My Videos</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ position: "relative", paddingTop: "100%", background: "#1a1a2e", borderRadius: 8, overflow: "hidden" }}>
            <img src={`https://picsum.photos/seed/myv${i}/200/200`} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.7)", borderRadius: 4, padding: "2px 6px", color: "#fff", fontSize: 10 }}>
              ▶ {(Math.random() * 10 + 1).toFixed(1)}K
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: "#0a0a0a", borderRadius: 16, padding: 16, border: "1px solid #1a1a2e" }}>
        <div style={{ color: "#ff4444", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>⚠️ Account Settings</div>
        <button style={{ width: "100%", background: "transparent", border: "1px solid #333", borderRadius: 12, padding: "12px", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>🔔 Notifications</button>
        <button style={{ width: "100%", background: "transparent", border: "1px solid #333", borderRadius: 12, padding: "12px", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>🔒 Privacy Settings</button>
        <button style={{ width: "100%", background: "transparent", border: "1px solid #ff4444", borderRadius: 12, padding: "12px", color: "#ff4444", fontSize: 14, cursor: "pointer", textAlign: "left" }}>🚪 Sign Out</button>
      </div>
    </div>
  );
}

export default function AthaVid() {
  const [activeTab, setActiveTab] = useState("feed");
  const [videos, setVideos] = useState(sampleVideos);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id) => {
    setLikedVideos(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (showSplash) return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a0a 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ fontSize: 80, marginBottom: 20, animation: "pulse 1s infinite" }}>🎬</div>
      <div style={{ fontSize: 42, fontWeight: 900, background: "linear-gradient(90deg, #6c63ff, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        AthaVid
      </div>
      <div style={{ color: "#888", fontSize: 16, marginTop: 12, letterSpacing: 2 }}>REAL VIDEO. REAL PEOPLE.</div>
      <div style={{ marginTop: 40, display: "flex", gap: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%", background: "#6c63ff",
            animation: `bounce 0.6s ${i * 0.2}s infinite alternate`
          }} />
        ))}
      </div>
      <style>{`
        @keyframes bounce { from { transform: translateY(0); opacity: 0.4; } to { transform: translateY(-10px); opacity: 1; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      `}</style>
    </div>
  );

  const tabIcons = { feed: "🏠", search: "🔍", upload: "➕", shop: "🛒", profile: "👤" };
  const tabLabels = { feed: "Home", search: "Search", upload: "Post", shop: "Shop", profile: "Me" };

  return (
    <div style={{
      minHeight: "100vh", background: "#050510",
      fontFamily: "'Inter', -apple-system, sans-serif",
      maxWidth: 480, margin: "0 auto", position: "relative",
      paddingBottom: 80
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(5,5,16,0.95)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid #1a1a2e", padding: "12px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>🎬</span>
          <span style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(90deg, #6c63ff, #4caf50)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AthaVid
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ background: "#1a2a1a", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#4caf50", fontSize: 11 }}>✅ AI-Free</span>
          </div>
          <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#6c63ff", fontSize: 11 }}>🔞 18+</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 0" }}>
        {activeTab === "feed" && <Feed videos={videos} likedVideos={likedVideos} onLike={handleLike} />}
        {activeTab === "search" && <SearchPage videos={videos} />}
        {activeTab === "upload" && <UploadPage />}
        {activeTab === "shop" && <ShopPage products={sampleProducts} />}
        {activeTab === "profile" && <ProfilePage />}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "rgba(5,5,16,0.97)", backdropFilter: "blur(10px)",
        borderTop: "1px solid #1a1a2e",
        display: "flex", justifyContent: "space-around", padding: "8px 0",
        zIndex: 100
      }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: tab === "upload" ? "#6c63ff" : "none",
            border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: tab === "upload" ? "10px 20px" : "8px 12px",
            borderRadius: tab === "upload" ? "50%" : 8,
            transform: tab === "upload" ? "translateY(-10px)" : "none",
            boxShadow: tab === "upload" ? "0 4px 20px rgba(108,99,255,0.5)" : "none",
          }}>
            <span style={{ fontSize: tab === "upload" ? 22 : 20 }}>{tabIcons[tab]}</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: activeTab === tab ? "#6c63ff" : tab === "upload" ? "#fff" : "#666"
            }}>{tabLabels[tab]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
