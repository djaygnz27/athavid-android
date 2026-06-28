// ⛔ LOCKED — VideoManageGrid.jsx
// DO NOT MODIFY unless fixing a VideoManageGrid-specific bug.
// Last verified working: 2026-06-28 (honeycomb circle grid with edit/delete)

import React from "react";
import { videos } from "./api.js";
import { resolveMediaUrl } from "./utils.jsx";

// ── Honeycomb Circle Grid ──────────────────────────────────────────────────
function VideoManageGrid({ videos: vids, onRefresh }) {
  const [menuVideo, setMenuVideo] = React.useState(null);
  const [editVideo, setEditVideo] = React.useState(null);
  const [editCaption, setEditCaption] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const handleDelete = async () => {
    try {
      setSaving(true);
      await videos.delete(confirmDelete.id);
      setConfirmDelete(null);
      onRefresh();
    } catch(e) { alert("Delete failed: " + e.message); }
    finally { setSaving(false); }
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await videos.update(editVideo.id, { caption: editCaption });
      setEditVideo(null);
      onRefresh();
    } catch(e) { alert("Save failed: " + e.message); }
    finally { setSaving(false); }
  };

  if (!vids || vids.length === 0) return (
    <div style={{ textAlign:"center", padding:40, color:"#555" }}>
      <div style={{ fontSize:40, marginBottom:8 }}>📹</div>
      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>No videos yet</div>
    </div>
  );

  // ── Honeycomb layout constants ──
  const CELL = 109; // circle diameter
  const GAP = 6;
  const ROW_H = CELL * 0.82;
  const PER_ROW = 3;
  const OFFSET = (CELL + GAP) / 2;

  const rows = [];
  for (let i = 0; i < vids.length; i += PER_ROW) {
    rows.push(vids.slice(i, i + PER_ROW));
  }

  return (
    <>
      {/* Honeycomb grid */}
      <div style={{ paddingBottom: 12 }}>
        {rows.map((row, ri) => {
          const isOffset = ri % 2 === 1;
          return (
            <div key={ri} style={{
              display:"flex",
              justifyContent: isOffset ? "flex-start" : "center",
              marginTop: ri === 0 ? 12 : -(CELL - ROW_H) - 2,
              gap: GAP,
              paddingLeft: isOffset ? OFFSET + 8 : 8,
              paddingRight: 8,
            }}>
              {row.map((v, ci) => {
                const thumb = v.thumbnail_url ? resolveMediaUrl(v.thumbnail_url) : null;
                return (
                  <div key={v.id} onClick={() => setMenuVideo(v)}
                    style={{
                      width: CELL, height: CELL, borderRadius:"50%", overflow:"hidden",
                      cursor:"pointer", position:"relative", flexShrink:0,
                      border:"2px solid rgba(245,200,66,0.35)",
                      boxShadow:"0 4px 18px rgba(0,0,0,0.5)",
                      background:"#111",
                    }}>
                    {thumb ? (
                      <img src={thumb} onError={e => { e.target.style.display="none"; }}
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    ) : (
                      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🎬</div>
                    )}
                    {/* Dark overlay */}
                    <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 60% 70%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%)" }} />
                    {/* Like count */}
                    {(v.likes_count || 0) > 0 && (
                      <div style={{ position:"absolute", bottom:14, left:0, right:0, textAlign:"center",
                        color:"#fff", fontSize:10, fontWeight:800, textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>
                        ❤️ {v.likes_count}
                      </div>
                    )}
                    {/* Edit dot */}
                    <div style={{ position:"absolute", top:10, right:12,
                      width:18, height:18, borderRadius:"50%", background:"rgba(0,0,0,0.55)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, color:"#fff", lineHeight:1 }}>⋮</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Action Menu Sheet */}
      {menuVideo && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}
          onClick={() => setMenuVideo(null)}>
          <div style={{ background:"#1a1a2e", borderRadius:"20px 20px 0 0", padding:20, maxWidth:480, width:"100%", margin:"0 auto" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
              <div style={{ width:54, height:54, background:"#111", borderRadius:"50%", overflow:"hidden", flexShrink:0,
                border:"2px solid rgba(245,200,66,0.4)" }}>
                {menuVideo.thumbnail_url
                  ? <img src={resolveMediaUrl(menuVideo.thumbnail_url)} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎬</div>}
              </div>
              <div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{menuVideo.caption || "(no caption)"}</div>
                <div style={{ color:"#888", fontSize:12, marginTop:4 }}>👁 {menuVideo.views_count || 0}  ❤️ {menuVideo.likes_count || 0}  💬 {menuVideo.comments_count || 0}</div>
              </div>
            </div>
            <button onClick={() => { setEditCaption(menuVideo.caption || ""); setEditVideo(menuVideo); setMenuVideo(null); }}
              style={{ width:"100%", padding:"14px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:12, color:"#fff", fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:10,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              ✏️ Edit Caption
            </button>
            <button onClick={() => { setConfirmDelete(menuVideo); setMenuVideo(null); }}
              style={{ width:"100%", padding:"14px 0", background:"rgba(229,57,53,0.15)", border:"1px solid rgba(229,57,53,0.4)",
                borderRadius:12, color:"#ff6b6b", fontSize:15, fontWeight:600, cursor:"pointer", marginBottom:10,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              🗑️ Delete Video
            </button>
            <button onClick={() => setMenuVideo(null)}
              style={{ width:"100%", padding:"12px 0", background:"none", border:"none", color:"#888", fontSize:14, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {editVideo && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={() => setEditVideo(null)}>
          <div style={{ background:"#1a1a2e", borderRadius:20, padding:24, width:"100%", maxWidth:420 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:17, marginBottom:16 }}>✏️ Edit Caption</div>
            <textarea value={editCaption} onChange={e => setEditCaption(e.target.value)}
              placeholder="Write a caption..." rows={4}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:12, color:"#fff", padding:12, fontSize:14, resize:"none", outline:"none",
                fontFamily:"inherit", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={() => setEditVideo(null)}
                style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, color:"#aaa", fontSize:14, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving}
                style={{ flex:2, padding:"12px 0", background:"linear-gradient(135deg,#F5C842,#FF9500)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1 }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div style={{ position:"fixed", inset:0, zIndex:8000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#1a1a2e", borderRadius:20, padding:24, width:"100%", maxWidth:380, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:17, marginBottom:8 }}>Delete this video?</div>
            <div style={{ color:"#888", fontSize:13, marginBottom:24 }}>This can't be undone.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:12, color:"#aaa", fontSize:14, cursor:"pointer" }}>Keep it</button>
              <button onClick={handleDelete} disabled={saving}
                style={{ flex:1, padding:"12px 0", background:"rgba(229,57,53,0.9)",
                  border:"none", borderRadius:12, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:saving?"not-allowed":"pointer" }}>
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoManageGrid;
// circle build 1782663267
// force-1782663352
