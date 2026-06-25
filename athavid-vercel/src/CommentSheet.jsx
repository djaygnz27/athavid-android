// ╔════════════════════════════════════════════════════════════════════╗
// ║ ⛔ LOCKED — CommentSheet.jsx                                      ║
// ║ SEGREGATED SECTION — DO NOT MODIFY                               ║
// ║ Owns: comment display, post, reply, emoji reactions               ║
// ║ Owns: email notification to video owner on new comment            ║
// ║ Test: post comment → count updates, owner gets email              ║
// ╚════════════════════════════════════════════════════════════════════╝

import React, { useState, useEffect, useRef } from "react";
import { comments, likes, videos, request } from "./api.js";
import { createNotif } from "./utils.jsx";

function CommentSheet({ video, currentUser, onClose, onCommentPosted, onNeedAuth }) {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // { id, username }
  const [expandedReplies, setExpandedReplies] = useState({});
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(null); // comment id
  const sheetRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const headerRef = useRef(null);

  useEffect(() => {
    if (!video) return;
    comments.list(video.id)
      .then(r => {
        // api.js now normalizes — r should already be an array
        const arr = Array.isArray(r) ? r : (r?.items || r?.records || r?.data || []);
        setList(arr);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [video?.id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [list]);

  const startReply = (c) => {
    if (!currentUser) { onNeedAuth(); return; }
    setReplyingTo({ id: c.id, username: c.username });
    setText(`@${c.username} `);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const cancelReply = () => { setReplyingTo(null); setText(""); };

  const post = async () => {
    if (!currentUser) { onNeedAuth(); return; }
    if (!text.trim()) return;
    setPosting(true);
    try {
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      if (replyingTo) {
        // Post as a reply stored locally under the parent comment
        const reply = { id: Date.now().toString(), username, avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`, comment_text: text.trim(), thumbs_up:0, hearts:0, thumbs_down:0 };
        setList(prev => prev.map(x => x.id === replyingTo.id ? {...x, replies: [...(x.replies||[]), reply]} : x));
        setExpandedReplies(prev => ({...prev, [replyingTo.id]: true}));
        setReplyingTo(null);
        setText("");
      } else {
        const c = await comments.create({
          video_id: video.id,
          user_id: currentUser.id,
          content: text.trim(),
          username,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
          comment_text: text.trim(), likes_count: 0,
        });
        // Optimistic UI — show comment immediately
        setList(prev => [...prev, c]);
        setText("");
        // ⛔ LOCKED — verify-then-write: query actual DB count, never use list.length delta
        try {
          const freshList = await comments.list(video.id);
          const verifiedCount = Array.isArray(freshList) ? freshList.length : (list.length + 1);
          await videos.update(video.id, { comments_count: verifiedCount, comment_count: verifiedCount });
          if (onCommentPosted) onCommentPosted(video.id, verifiedCount);
        } catch(e) {
          // Fallback: use optimistic count rather than zeroing
          const optimisticCount = list.length + 1;
          await videos.update(video.id, { comments_count: optimisticCount, comment_count: optimisticCount }).catch(() => {});
          if (onCommentPosted) onCommentPosted(video.id, optimisticCount);
        }
        // notify video owner
        if (video.user_id && video.user_id !== currentUser?.id) {
          createNotif({
            recipient_id: video.user_id,
            sender_id: currentUser.id,
            sender_username: currentUser.username || currentUser.email?.split("@")[0] || "user",
            sender_avatar: currentUser.avatar_url || currentUser.picture || "",
            type: "comment",
            video_id: video.id,
            video_thumbnail: video.thumbnail_url || "",
            text: `commented: "${text.trim().substring(0, 50)}"`
          });
          // ⛔ LOCKED — send email notification to video owner
          const ownerEmail = video.owner_email || video.created_by || null;
          if (ownerEmail && ownerEmail.includes("@")) {
            fetch("/api/sendEngagementEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "comment",
                actor_username: currentUser.username || currentUser.email?.split("@")[0] || "user",
                video_id: video.id,
                video_caption: video.caption || video.description || "",
                video_thumbnail: video.thumbnail_url || "",
                owner_id: video.user_id,
                owner_email: ownerEmail,
                comment_text: text.trim().substring(0, 200),
              }),
            }).catch(() => {}); // fire-and-forget
          }
        }
        // Stay open so user sees their comment — don't auto-close
      }
    } catch(e) { alert("Error: " + e.message); }
    finally { setPosting(false); }
  };

  const reactToComment = async (id, reaction, isReply, parentId, emoji=null) => {
    // Find the target comment
    const findComment = (lst, cid) => lst.find(x => x.id === cid);
    const targetId = id;

    if (reaction === "emoji_reactions" && emoji) {
      // Update local state first for instant feedback
      const updateItem = (item) => {
        const existing = item.emoji_reactions || {};
        return { ...item, emoji_reactions: { ...existing, [emoji]: (existing[emoji] || 0) + 1 } };
      };
      if (isReply) {
        setList(prev => prev.map(x =>
          x.id === parentId
            ? { ...x, replies: (x.replies||[]).map(r => r.id === id ? updateItem(r) : r) }
            : x
        ));
      } else {
        setList(prev => prev.map(x => x.id === id ? updateItem(x) : x));
      }
      // Persist to DB
      try {
        const current = list.find(x => isReply ? x.id === parentId : x.id === id);
        const commentToUpdate = isReply
          ? (current?.replies||[]).find(r => r.id === id)
          : current;
        if (commentToUpdate) {
          const existing = commentToUpdate.emoji_reactions || {};
          await comments.update(id, { emoji_reactions: { ...existing, [emoji]: (existing[emoji]||0)+1 } });
        }
      } catch(e) { console.error("Emoji reaction save failed:", e); }
      return;
    }

    // thumbs_up / hearts / thumbs_down
    if (isReply) {
      setList(prev => prev.map(x => x.id === parentId ? {
        ...x, replies: (x.replies||[]).map(r => r.id === id ? {...r, [reaction]: (r[reaction]||0)+1} : r)
      } : x));
    } else {
      setList(prev => prev.map(x => x.id === id ? {...x, [reaction]: (x[reaction]||0)+1} : x));
    }
    // Persist to DB
    try {
      const current = list.find(x => isReply ? x.id === parentId : x.id === id);
      const commentToUpdate = isReply ? (current?.replies||[]).find(r => r.id === id) : current;
      if (commentToUpdate) {
        await comments.update(id, { [reaction]: (commentToUpdate[reaction]||0)+1 });
      }
    } catch(e) { console.error("Reaction save failed:", e); }
  };

  const QUICK_EMOJIS = ["😂","🤣","😭","💀","🔥","🤯","😍","🥰","😎","🙌","💯","🫡","😤","🫣","👀","🤌","💪","🥹","😅","🤦","🤷","🙏","💥","✨","🎉","👏","😬","😱","🥲","😏","LOL","LMAO"];

  const CommentRow = ({ c, isReply=false, parentId=null }) => {
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [editing, setEditing] = React.useState(false);
    const [editText, setEditText] = React.useState(c.comment_text || c.content);
    const [saving, setSaving] = React.useState(false);

    const currentUsername = currentUser ? (currentUser.full_name || currentUser.email?.split("@")[0] || "user") : null;
    const isOwner = currentUsername && c.username === currentUsername;

    const saveEdit = async () => {
      if (!editText.trim()) return;
      setSaving(true);
      try {
        await comments.update(c.id, { comment_text: editText.trim() });
        setList(prev => prev.map(x => x.id === c.id ? { ...x, comment_text: editText.trim() } : x));
        setEditing(false);
      } catch(e) { alert("Could not save edit."); }
      finally { setSaving(false); }
    };

    return (
    <div style={{ display:"flex", gap:10, marginBottom:12, paddingLeft: isReply ? 44 : 0 }}>
      <img src={c.avatar_url} style={{ width: isReply?28:36, height: isReply?28:36, borderRadius:"50%", border:`2px solid rgba(108,99,255,${isReply?0.2:0.3})`, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ color:"#ff6b6b", fontWeight:700, fontSize: isReply?12:13 }}>@{c.username}</div>
        {editing ? (
          <div style={{ marginBottom:6 }}>
            <input value={editText} onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if(e.key==="Enter") saveEdit(); if(e.key==="Escape") setEditing(false); }}
              autoFocus
              style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(108,99,255,0.5)", borderRadius:10, padding:"6px 10px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:8, marginTop:6 }}>
              <button onClick={saveEdit} disabled={saving}
                style={{ background:"linear-gradient(135deg,#6c63ff,#ff6b6b)", border:"none", borderRadius:8, padding:"4px 14px", color:"#fff", fontSize:12, cursor:"pointer", fontWeight:600 }}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)}
                style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, padding:"4px 12px", color:"#aaa", fontSize:12, cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <div style={{ color:"#ccc", fontSize: isReply?13:14 }}>{c.comment_text || c.content}</div>
            {isOwner && !isReply && (
              <button onClick={() => { setEditing(true); setEditText(c.comment_text); }}
                style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:12, padding:0, flexShrink:0 }} title="Edit">✏️</button>
            )}
          </div>
        )}
        {/* Emoji reaction bubbles */}
        {c.emoji_reactions && Object.keys(c.emoji_reactions).length > 0 && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
            {Object.entries(c.emoji_reactions).map(([em, count]) => count > 0 && (
              <span key={em} onClick={() => reactToComment(c.id, "emoji_reactions", isReply, parentId, em)}
                style={{ background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"2px 8px", fontSize:14, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:3, lineHeight:1.6 }}>
                <span style={{ fontFamily:"Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif" }}>{em}</span>
                <span style={{ fontSize:10, color:"#aaa" }}>{count}</span>
              </span>
            ))}
          </div>
        )}
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", position:"relative" }}>
          <button onClick={() => reactToComment(c.id, "thumbs_up", isReply, parentId)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:2, color: c.thumbs_up ? "#6bff9a" : "#666", fontSize:12, padding:0 }}>
            👍 <span style={{ fontSize:10 }}>{c.thumbs_up || 0}</span>
          </button>
          <button onClick={() => reactToComment(c.id, "hearts", isReply, parentId)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:2, color: c.hearts ? "#ff6b6b" : "#666", fontSize:12, padding:0 }}>
            ❤️ <span style={{ fontSize:10 }}>{c.hearts || 0}</span>
          </button>
          <button onClick={() => reactToComment(c.id, "thumbs_down", isReply, parentId)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:2, color: c.thumbs_down ? "#ff8e53" : "#666", fontSize:12, padding:0 }}>
            👎 <span style={{ fontSize:10 }}>{c.thumbs_down || 0}</span>
          </button>
          {/* Emoji picker button */}
          <button onClick={() => setPickerOpen(p => !p)}
            style={{ background:"rgba(255,255,255,0.08)", border:"none", cursor:"pointer", fontSize:10, padding:"2px 7px", lineHeight:1.6, borderRadius:10, color: pickerOpen ? "#F5C842" : "#aaa", fontWeight:600, letterSpacing:0.3 }}>
            {pickerOpen ? "✕" : "+ React"}
          </button>
          {!isReply && (
            <button onClick={() => { startReply(c); setPickerOpen(false); }}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#888", fontSize:12, padding:0, marginLeft:2 }}>
              💬 Reply
            </button>
          )}
          {!isReply && c.replies?.length > 0 && (
            <button onClick={() => setExpandedReplies(prev => ({...prev, [c.id]: !prev[c.id]}))}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#6c63ff", fontSize:12, padding:0 }}>
              {expandedReplies[c.id] ? "▲ Hide" : `▼ ${c.replies.length} repl${c.replies.length===1?"y":"ies"}`}
            </button>
          )}
          {/* Emoji picker popup - rendered inline below buttons to avoid clipping */}
          {pickerOpen && (
            <div style={{ position:"fixed", bottom: 80, left:"50%", transform:"translateX(-50%)", background:"#1a1a2e", border:"1px solid rgba(245,200,66,0.3)", borderRadius:18, padding:"14px", zIndex:99999, boxShadow:"0 -4px 40px rgba(0,0,0,0.8)", width:260 }} onClick={e => e.stopPropagation()}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:1 }}>Pick a reaction</span>
                <button onClick={() => setPickerOpen(false)} style={{ background:"none", border:"none", color:"#aaa", cursor:"pointer", fontSize:14, padding:0 }}>✕</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:6 }}>
                {QUICK_EMOJIS.map(em => {
                  const isText = em === "LOL" || em === "LMAO";
                  return (
                  <button key={em}
                    onClick={() => { reactToComment(c.id, "emoji_reactions", isReply, parentId, em); setPickerOpen(false); }}
                    style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:10, padding: isText ? "6px 4px" : "8px 4px", fontSize: isText ? 10 : 22, fontWeight: isText ? 700 : "normal", cursor:"pointer", fontFamily: isText ? "sans-serif" : "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif", lineHeight:1, textAlign:"center", color: isText ? "#F5C842" : "inherit" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(245,200,66,0.2)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
                    {em}
                  </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {!isReply && expandedReplies[c.id] && (c.replies||[]).map(r => (
          <CommentRow key={r.id} c={r} isReply={true} parentId={c.id} />
        ))}
      </div>
    </div>
    );
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)" }} />
      <div
        ref={sheetRef}
        style={{ position:"relative", background:"#1a1a2e", borderRadius:"24px 24px 0 0", maxHeight:"75vh", display:"flex", flexDirection:"column", zIndex:1001, willChange:"transform" }}>
        <div ref={headerRef} style={{ padding:"16px 16px 12px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
            <div onClick={onClose} style={{ width:48, height:5, background:"rgba(255,255,255,0.3)", borderRadius:99, cursor:"pointer" }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>💬 Comments {list.length > 0 && `(${list.length})`}</div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"0 16px 8px" }}>
          {loading && <div style={{ color:"#666", textAlign:"center", padding:32 }}>Loading...</div>}
          {!loading && list.length === 0 && (
            <div style={{ color:"#555", textAlign:"center", padding:40 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>💬</div>
              <div>No comments yet. Be first!</div>
            </div>
          )}
          {list.map(c => <CommentRow key={c.id} c={c} />)}
          <div ref={bottomRef} />
          <div style={{ display:"flex", justifyContent:"center", padding:"16px 0 8px" }}>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:24, padding:"10px 40px", color:"#aaa", fontSize:14, cursor:"pointer", letterSpacing:0.5 }}>
              Close
            </button>
          </div>
        </div>
        <div style={{ padding:"8px 16px 32px", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
          {replyingTo && (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, padding:"4px 10px", background:"rgba(108,99,255,0.15)", borderRadius:8 }}>
              <span style={{ color:"#aaa", fontSize:12 }}>Replying to <span style={{ color:"#ff6b6b" }}>@{replyingTo.username}</span></span>
              <button onClick={cancelReply} style={{ background:"none", border:"none", color:"#666", cursor:"pointer", fontSize:14 }}>✕</button>
            </div>
          )}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input ref={inputRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && post()}
              placeholder={currentUser ? (replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment...") : "Log in to comment..."}
              style={{ flex:1, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:14, outline:"none" }} />
            <button onClick={post} disabled={posting}
              style={{ background:"linear-gradient(135deg,#ff6b6b,#ff8e53)", border:"none", borderRadius:"50%", width:36, height:36, color:"#fff", cursor:"pointer", fontSize:16 }}>➤</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Music Library ─────────────────────────────────────────────────────────────
const MUSIC_LIBRARY = [
  // Lo-Fi Hip-Hop
  { id:"lo1", genre:"Lo-Fi", title:"City Lights",          artist:"Lukrembo",        url:"https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",  emoji:"🌃" },
  { id:"lo2", genre:"Lo-Fi", title:"Sunset Boulevard",     artist:"Lukrembo",        url:"https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",  emoji:"🌅" },
  { id:"lo3", genre:"Lo-Fi", title:"Chill Lounge",         artist:"Chill Music Lab", url:"https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749ef8e.mp3",  emoji:"☕" },
  { id:"lo4", genre:"Lo-Fi", title:"Late Night Drive",     artist:"Mubert",          url:"https://cdn.pixabay.com/audio/2022/10/25/audio_fc4e2ab87f.mp3",  emoji:"🚗" },
  { id:"lo5", genre:"Lo-Fi", title:"Rainy Window",         artist:"Lo-Fi Cafe",      url:"https://cdn.pixabay.com/audio/2023/01/25/audio_27788ce40e.mp3",  emoji:"🌧️" },

  // Hip-Hop / Trap
  { id:"hh1", genre:"Hip-Hop", title:"Dark Trap",          artist:"SoundGuy",        url:"https://cdn.pixabay.com/audio/2022/09/07/audio_51e01a5b75.mp3",  emoji:"🔥" },
  { id:"hh2", genre:"Hip-Hop", title:"Street Anthem",      artist:"Beat Factory",    url:"https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",  emoji:"🏙️" },
  { id:"hh3", genre:"Hip-Hop", title:"Hustle Hard",        artist:"Rap Beats Lab",   url:"https://cdn.pixabay.com/audio/2022/06/08/audio_c8e134dc61.mp3",  emoji:"💪" },
  { id:"hh4", genre:"Hip-Hop", title:"Midnight Flex",      artist:"Urban Beats",     url:"https://cdn.pixabay.com/audio/2023/02/08/audio_d1718ab358.mp3",  emoji:"🌙" },

  // Electronic / EDM
  { id:"el1", genre:"Electronic", title:"Bass Rush",       artist:"EDM Factory",     url:"https://cdn.pixabay.com/audio/2022/07/25/audio_124bbbcb24.mp3",  emoji:"⚡" },
  { id:"el2", genre:"Electronic", title:"Neon Club",       artist:"Synth Lab",       url:"https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3",  emoji:"🎛️" },
  { id:"el3", genre:"Electronic", title:"Future Drop",     artist:"Synth Lab",       url:"https://cdn.pixabay.com/audio/2021/11/13/audio_cb31b3a2ee.mp3",  emoji:"🚀" },
  { id:"el4", genre:"Electronic", title:"Cyber Pulse",     artist:"Digital Wave",    url:"https://cdn.pixabay.com/audio/2022/10/16/audio_99e31cb11f.mp3",  emoji:"🤖" },

  // R&B / Soul
  { id:"rb1", genre:"R&B", title:"Smooth Feelings",        artist:"Soul Kitchen",    url:"https://cdn.pixabay.com/audio/2022/05/16/audio_8c7760a56c.mp3",  emoji:"❤️" },
  { id:"rb2", genre:"R&B", title:"Late Night Feels",       artist:"Velvet Groove",   url:"https://cdn.pixabay.com/audio/2023/03/09/audio_c8690f4a79.mp3",  emoji:"🌙" },
  { id:"rb3", genre:"R&B", title:"Golden Hour",            artist:"Soul Kitchen",    url:"https://cdn.pixabay.com/audio/2022/11/09/audio_b9f8252784.mp3",  emoji:"✨" },

  // Pop
  { id:"pp1", genre:"Pop", title:"Good Vibes Only",        artist:"Pop Studio",      url:"https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",  emoji:"🌈" },
  { id:"pp2", genre:"Pop", title:"Summer Heat",            artist:"Pop Studio",      url:"https://cdn.pixabay.com/audio/2023/02/28/audio_7b006e5e1b.mp3",  emoji:"☀️" },
  { id:"pp3", genre:"Pop", title:"Dance Floor",            artist:"Feel Good Music", url:"https://cdn.pixabay.com/audio/2022/10/10/audio_4a7ad08048.mp3",  emoji:"💃" },

  // Chill / Ambient
  { id:"ch1", genre:"Chill", title:"Deep Breathe",         artist:"Ambient Lab",     url:"https://cdn.pixabay.com/audio/2022/03/10/audio_2da3e03e6c.mp3",  emoji:"🌊" },
  { id:"ch2", genre:"Chill", title:"Floating",             artist:"Ambient Lab",     url:"https://cdn.pixabay.com/audio/2021/10/19/audio_b0d94b61c8.mp3",  emoji:"☁️" },
  { id:"ch3", genre:"Chill", title:"Mountain Air",         artist:"Nature Sounds",   url:"https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3",  emoji:"🏔️" },

  // Afrobeats
  { id:"af1", genre:"Afrobeats", title:"Lagos Nights",     artist:"Afro Vibes",      url:"https://cdn.pixabay.com/audio/2022/12/06/audio_a2dc6bff25.mp3",  emoji:"🌍" },
  { id:"af2", genre:"Afrobeats", title:"Move Your Body",   artist:"Afro Vibes",      url:"https://cdn.pixabay.com/audio/2023/01/11/audio_9b03e2b205.mp3",  emoji:"🥁" },

  // Jazz
  { id:"jz1", genre:"Jazz", title:"Smooth Jazz Cafe",      artist:"Jazz Collective",  url:"https://cdn.pixabay.com/audio/2022/09/22/audio_d64adfa5d2.mp3",  emoji:"🎷" },
  { id:"jz2", genre:"Jazz", title:"Late Night Jazz",       artist:"Blue Note Studio", url:"https://cdn.pixabay.com/audio/2021/09/06/audio_6ef08cb620.mp3",  emoji:"🎺" },
  { id:"jz3", genre:"Jazz", title:"Midnight Sax",          artist:"Blue Note Studio", url:"https://cdn.pixabay.com/audio/2022/04/27/audio_12b0e6e3fb.mp3",  emoji:"🎶" },
];

const MUSIC_GENRES = ["All", "Lo-Fi", "Hip-Hop", "Electronic", "R&B", "Pop", "Chill", "Afrobeats", "Jazz"];


// ── Upload Modal ──────────────────────────────────────────────────────────────

// ─── GO LIVE MODAL ────────────────────────────────────────────────

export default CommentSheet;
