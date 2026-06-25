// ⛔ LOCKED — UploadModal.jsx
// This component handles all video and photo post creation.
// DO NOT MODIFY unless fixing an upload-specific bug.
// Last verified working: 2026-05-23
// Test: post a video, verify it appears in feed immediately

import React, { useState, useEffect, useRef } from "react";
import { videos, request, uploadFile } from "./post/upload.js";
import { getStateAbbr, getPostLocation } from "./utils.jsx";
import VideoEditor from "./VideoEditor.jsx";
import MusicPicker from "./MusicPicker.jsx";

function UploadModal({ currentUser, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [editedFile, setEditedFile] = useState(null); // trimmed/cropped version
  const [showEditor, setShowEditor] = useState(false);
  const [uploadTab, setUploadTab] = useState("video");
  const [photos, setPhotos] = useState([]);
  const [dragPhotoIdx, setDragPhotoIdx] = useState(null);
  const photoRef = useRef();
  const [caption, setCaption] = useState("");
  const [isMature, setIsMature] = useState(false);
  const [matureReason, setMatureReason] = useState("other");
  const [maxDuration, setMaxDuration] = useState(60);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [musicGenreFilter, setMusicGenreFilter] = useState("All");
  const [previewTrack, setPreviewTrack] = useState(null);
  const previewAudioRef = useRef(null);
  const [musicTracks, setMusicTracks] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const fileRef = useRef();

  const [notAiConfirmed, setNotAiConfirmed] = useState(false);
  const [aiBlocked, setAiBlocked] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // Text post states
  const [textPostContent, setTextPostContent] = useState("");
  const [textPostTemplate, setTextPostTemplate] = useState(0);
  const [textFontScale, setTextFontScale] = useState(1.0); // 0.7=S, 1.0=M, 1.3=L, 1.6=XL

  // Post details step
  const [showPostDetails, setShowPostDetails] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postVisibility, setPostVisibility] = useState("everyone"); // everyone | followers | only_me
  const [postLocation, setPostLocation] = useState(null); // { name, city }
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);

  const checkForExplicitContent = (f, cap) => {
    const explicit = ["nude", "naked", "nsfw", "xxx", "porn", "sex", "explicit", "adult only", "18+", "onlyfans", "erotic"];
    const name = f.name.toLowerCase();
    const capLower = (cap||"").toLowerCase();
    return explicit.some(kw => name.includes(kw) || capLower.includes(kw));
  };

  const checkForAiSignatures = (f, cap) => {
    const name = f.name.toLowerCase();
    const capLower = (cap || "").toLowerCase();
    const combined = name + " " + capLower;

    const aiKeywords = [
      // ── Top AI video generators ──
      "sora", "runway", "runwayml", "pika", "pikaart", "kling", "luma", "lumalabs",
      "gen2", "gen3", "gen4", "gen-2", "gen-3", "synthesia", "deepfake", "deep fake",
      "invideo", "heygen", "he-gen", "d-id", "did_video", "veed", "capcut_ai",
      "dreamina", "pixverse", "pixart", "haiper", "morph", "kaiber", "moonvalley",
      "stablevideo", "stable video", "stablediffusion", "stable diffusion",
      "animatediff", "animate diff", "modelscope", "zeroscope", "cogvideo",
      "text2video", "text to video", "img2video", "image to video",
      "openai video", "dalle video", "gemini video",
      "vidnoz", "fliki", "pictory", "flexclip_ai", "elai", "colossyan",
      "movio", "windsor", "tavus", "argil", "captions_ai", "captions.ai",
      "nova ai", "novaai", "steve ai", "steveai", "rawshorts",
      "wisecut", "descript_ai", "opus_ai", "munch_ai",

      // ── AI image generators used in video ──
      "midjourney", "midjrny", "dalle", "dall-e", "dall_e",
      "firefly", "adobe_ai", "ideogram", "leonardo_ai", "leonardoai",
      "nightcafe", "artbreeder", "civitai", "civit_ai",
      "playground_ai", "playgroundai", "tensor_art", "tensorart",
      "novelai", "novel_ai", "nijijourney",

      // ── Generic AI tags ──
      "ai_generated", "ai-generated", "aigenerated", "aigc", "ai_made",
      "ai_video", "aivideo", "made_by_ai", "created_by_ai", "generated_by_ai",
      "synthetic_media", "synthetic media", "deepfake", "deep_fake",
      "neural_render", "neural render", "gan_video", "diffusion_video",
      "aiart", "ai art", "ai content", "aicontent",
      "virtual human", "virtual_human", "digital human", "digital_human",
      "avatar video", "avatar_video", "ai avatar", "ai_avatar",
      "face swap", "faceswap", "face_swap", "voice clone", "voice_clone",
      "lip sync", "lipsync", "lip_sync",

      // ── Caption/hashtag signals ──
      "#ai", "#aiart", "#aivideo", "#aigc", "#artificialintelligence",
      "#aigenerated", "#deepfake", "#synthetic", "#notreal", "#virtualinfluencer",
      "#aiinfluencer", "#digitalavatar"
    ];

    return aiKeywords.some(kw => combined.includes(kw));
  };

  const [explicitBlocked, setExplicitBlocked] = useState(false);

  const handleFileSelect = (f) => {
    if (!f) return;
    setFile(f);
    setEditedFile(null);
    setAiBlocked(false);
    setExplicitBlocked(false);
    if (checkForAiSignatures(f, caption)) { setAiBlocked(true); return; }
    if (checkForExplicitContent(f, caption)) { setExplicitBlocked(true); return; }
    // Show editor for video AND image files
    if (f.type.startsWith("video/") || f.type.startsWith("image/")) setShowEditor(true);
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setPhotos(prev => {
      const combined = [...prev, ...files];
      return combined.slice(0, 6);
    });
  };

  const removePhoto = (idx) => setPhotos(p => p.filter((_,i) => i !== idx));

  const uploadPhotos = async () => {
    if (!photos.length) return;
    // ⛔ POSTING GUARD — never remove this check
    if (typeof uploadFile !== "function") {
      alert("Upload failed: uploadFile is not available. Please refresh the page and try again.");
      console.error("CRITICAL: uploadFile is not defined — check api.js import in UploadModal.jsx");
      return;
    }
    setUploading(true); setProgress(10);
    try {
      setStep("Uploading photos...");
      const urls = [];
      for (let i = 0; i < photos.length; i++) {
        const result = await uploadFile(photos[i], (pct) => {
          setProgress(10 + Math.round(((i + pct/100)/photos.length)*70));
        });
        // uploadFile returns {file_url} for images
        urls.push(result.file_url || result);
        setProgress(10 + Math.round(((i+1)/photos.length)*70));
      }
      setProgress(85); setStep("Saving to feed...");
      const photoGeo = await getPostLocation();
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url: urls[0],
        thumbnail_url: urls[0],
        photo_urls: urls,
        is_photo: true,
        caption: (postTitle ? postTitle + "\n" : "") + caption.trim(),
        hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: !isAiGenerated && postVisibility !== "only_me",
        is_archived: false, is_ai_detected: isAiGenerated,
        is_mature: isMature, mature_reason: isMature ? matureReason : null,
        post_visibility: postVisibility,
        post_location_name: postLocation?.name || null,
        post_city: postLocation?.city || photoGeo.post_city || null,
        ...photoGeo,
      });
      setProgress(100);
      if (isAiGenerated) {
        setStep("🤖 Bruh, AI has been flagged! Sent to MOD for review.");
        setTimeout(() => { onClose(); }, 2500);
      } else {
        setStep("Posted! 🎉");
        // Notify followers
        /* sendFollowNotification — removed old Daminie app dependency */
        setTimeout(() => { onUploaded(createdPost); onClose(); }, 1000);
      }
    } catch(e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  const upload = async () => {
    if (!file) return;
    if (checkForExplicitContent(file, caption)) { alert("🔞 Sexual or explicit content is not allowed on Sachi."); return; }
    if (aiBlocked || checkForAiSignatures(file, caption)) {
      alert("🚫 This video appears to be AI-generated and cannot be posted on Sachi.");
      return;
    }
    if (!notAiConfirmed && !isAiGenerated) {
      alert("⚠️ Please confirm your video is NOT AI-generated before posting.");
      return;
    }
    // Check video duration
    try {
      const dur = await new Promise((res, rej) => {
        const v = document.createElement("video");
        v.preload = "metadata";
        v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); };
        v.onerror = rej;
        v.src = URL.createObjectURL(file);
      });
      if (dur > maxDuration) {
        alert(`⚠️ Your video is ${Math.round(dur)}s long. The limit for this format is ${maxDuration === 600 ? "10 minutes" : maxDuration === 120 ? "2 minutes" : maxDuration + " seconds"}. Please trim it and try again.`);
        return;
      }
    } catch {}
    setUploading(true); setProgress(10);
    try {
      setStep("Uploading video to Cloudflare...");
      const uploadResult = await uploadFile(editedFile || file, (pct) => {
        setProgress(10 + Math.round(pct * 0.5)); // 10-60%
      });
      // uploadFile returns {file_url (HLS url), thumbnail_url, stream_uid} for videos
      const video_url = uploadResult.file_url || uploadResult;
      const cfThumbnail = uploadResult.thumbnail_url || null;
      setProgress(60);
      setStep("Generating thumbnail...");
      let thumbnail_url = cfThumbnail; // use Cloudflare's auto-thumbnail first
      try { thumbnail_url = await Promise.race([captureThumbnail(file), new Promise(r => setTimeout(() => r(null), 5000))]); } catch {}
      // For .mov files (iPhone), try play-based capture if seek failed
      if (!thumbnail_url && (file.type === "video/quicktime" || /\.mov$/i.test(file.name))) {
        try {
          thumbnail_url = await new Promise((resolve) => {
            const v2 = document.createElement("video");
            v2.muted = true; v2.playsInline = true; v2.autoplay = true;
            const u2 = URL.createObjectURL(file);
            v2.src = u2;
            const canvas2 = document.createElement("canvas");
            canvas2.width = 500; canvas2.height = 888;
            const bail = setTimeout(() => { URL.revokeObjectURL(u2); resolve(null); }, 6000);
            v2.ontimeupdate = async () => {
              if (v2.currentTime < 0.5) return;
              v2.pause();
              clearTimeout(bail);
              try {
                const ctx2 = canvas2.getContext("2d");
                const vw = v2.videoWidth, vh = v2.videoHeight;
                if (!vw || !vh) { URL.revokeObjectURL(u2); return resolve(null); }
                const targetRatio = 500/888, srcRatio = vw/vh;
                let sx=0,sy=0,sw=vw,sh=vh;
                if (srcRatio > targetRatio) { sw=vh*targetRatio; sx=(vw-sw)/2; }
                else { sh=vw/targetRatio; sy=(vh-sh)/2; }
                ctx2.drawImage(v2,sx,sy,sw,sh,0,0,500,888);
                URL.revokeObjectURL(u2);
                canvas2.toBlob(async (blob) => {
                  if (!blob || blob.size < 1000) return resolve(null);
                  const tf = new File([blob],"thumbnail.jpg",{type:"image/jpeg"});
                  try { const r = await uploadFile(tf); resolve(r.file_url || r); } catch { resolve(null); }
                }, "image/jpeg", 0.85);
              } catch { URL.revokeObjectURL(u2); resolve(null); }
            };
            v2.onerror = () => { clearTimeout(bail); URL.revokeObjectURL(u2); resolve(null); };
          });
        } catch { thumbnail_url = null; }
      }
      if (!thumbnail_url) thumbnail_url = null; // no fallback — never use video URL as thumbnail
      setProgress(80);
      setStep("Saving to feed...");
      const videoGeo = await getPostLocation();
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      const tags = (caption.match(/#\w+/g) || []).map(t => t.toLowerCase());
      const createdPost = await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url, thumbnail_url,
        caption: (postTitle ? postTitle + "\n" : "") + caption.trim(),
        hashtags: tags,
        likes_count: 0, comments_count: 0, views_count: 0, shares_count: 0,
        is_approved: !isAiGenerated && postVisibility !== "only_me",
        is_archived: false, is_ai_detected: isAiGenerated,
        is_mature: isMature, mature_reason: isMature ? matureReason : null,
        post_visibility: postVisibility,
        post_location_name: postLocation?.name || null,
        post_city: postLocation?.city || null,
        sound_title: selectedTrack?.sound_title || selectedTrack?.title || null,
        sound_artist: selectedTrack?.sound_artist || selectedTrack?.artist || null,
        sound_url: selectedTrack?.sound_url || selectedTrack?.url || null,
        ...videoGeo,
      });
      setProgress(100);
      if (isAiGenerated) {
        setStep("🤖 Bruh, AI has been flagged! Sent to MOD for review.");
        setTimeout(() => { onClose(); }, 2500);
      } else {
        setStep("Posted! 🎉");
        // Notify followers
        /* sendFollowNotification — removed old Daminie app dependency */
        setTimeout(() => { onUploaded(createdPost); onClose(); }, 1000);
      }
    } catch(e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  const JAMENDO_CLIENT_ID = "c9f4d87f";
  const GENRE_TAG_MAP = {
    "All":"","Lo-Fi":"lounge","Hip-Hop":"hiphop","Electronic":"electronic",
    "R&B":"rnb","Pop":"pop","Chill":"relaxation","Afrobeats":"afrobeats",
    "Jazz":"jazz","Rock":"rock","Acoustic":"acoustic","Classical":"classical"
  };
  const GENRE_EMOJI = {
    "lounge":"🌆","hiphop":"🔥","electronic":"⚡","rnb":"❤️","pop":"🌈",
    "relaxation":"🌊","afrobeats":"🌍","jazz":"🎷","rock":"🎸","acoustic":"🎸","classical":"🎻"
  };

  const fetchMusicTracks = async (genre = "All", search = "") => {
    setMusicLoading(true);
    setMusicTracks([]);
    try {
      const tag = GENRE_TAG_MAP[genre] || "";
      // Use Base44 backend as proxy to avoid mobile CORS/SSL issues
      let apiUrl = `https://app.base44.com/api/apps/69e79122bcc8fb5a04cfb834/entities/SachiMusic?genre=${encodeURIComponent(genre)}&limit=30`;
      if (search) apiUrl += `&search=${encodeURIComponent(search)}`;
      console.log("[Sachi Music] Fetching via proxy:", apiUrl);
      let tracks = [];
      try {
        const resp = await fetch(apiUrl);
        if (resp.ok) {
          const data = await resp.json();
          tracks = data.tracks || [];
          console.log("[Sachi Music] Proxy results:", tracks.length);
        }
      } catch(proxyErr) {
        console.warn("[Sachi Music] Proxy failed, trying direct:", proxyErr);
      }
      // If proxy failed or returned nothing, try direct Jamendo
      if (tracks.length === 0) {
        let directUrl = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=30&order=popularity_week&include=musicinfo&audioformat=mp31&imagesize=100`;
        if (tag)    directUrl += `&tags=${encodeURIComponent(tag)}`;
        if (search) directUrl += `&namesearch=${encodeURIComponent(search)}`;
        console.log("[Sachi Music] Trying direct:", directUrl);
        const resp2 = await fetch(directUrl);
        if (resp2.ok) {
          const data2 = await resp2.json();
          tracks = (data2.results || []).map(t => ({
            id:       `j_${t.id}`,
            title:    t.name,
            artist:   t.artist_name,
            url:      t.audio || t.audiodownload,
            genre:    genre === "All" ? (t.musicinfo?.tags?.genres?.[0] || "Music") : genre,
            emoji:    GENRE_EMOJI[tag] || "🎵",
            duration: t.duration,
            image:    t.image,
          })).filter(t => t.url);
          console.log("[Sachi Music] Direct results:", tracks.length);
        }
      }
      if (tracks.length > 0) {
        setMusicTracks(tracks);
      } else {
        throw new Error("No tracks from any source");
      }
    } catch(e) {
      console.error("[Sachi Music] All sources failed:", e);
      // Final fallback: curated local tracks
      const fallback = MUSIC_TRACKS.filter(t => genre === "All" || t.genre === genre);
      setMusicTracks(fallback.length > 0 ? fallback : MUSIC_TRACKS);
    }
    setMusicLoading(false);
  };

  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout:8000 }));
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
      const data = await resp.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || "";
      const state = addr.state || addr.region || "";
      const country_code = addr.country_code ? addr.country_code.toUpperCase() : "";
      // Save to localStorage for future posts
      if (city) localStorage.setItem('sachi_city', city);
      if (state) localStorage.setItem('sachi_region', state);
      if (country_code) localStorage.setItem('sachi_country_code', country_code);
      // Build display label: "New Providence, NJ" or "Auckland, New Zealand"
      const stateAbbr = getStateAbbr(state, country_code);
      const label = [city, stateAbbr || state].filter(Boolean).join(', ');
      setPostLocation({ name: label, city, state, country_code });
    } catch {
      // Fallback: try IP-based
      try {
        const r = await fetch('https://ipapi.co/json/');
        const d = await r.json();
        const city = d.city || '';
        const state = d.region || '';
        const country_code = d.country_code || '';
        if (city) localStorage.setItem('sachi_city', city);
        if (state) localStorage.setItem('sachi_region', state);
        if (country_code) localStorage.setItem('sachi_country_code', country_code);
        const stateAbbr = getStateAbbr(state, country_code);
        const label = [city, stateAbbr || state].filter(Boolean).join(', ');
        setPostLocation({ name: label, city, state, country_code });
      } catch { setPostLocation(null); }
    }
    setDetectingLocation(false);
  };

  // Intercept post buttons — go to details step first
  const goToPostDetails = () => {
    // Always re-detect location on each post (mandatory)
    detectLocation();
    setShowPostDetails(true);
  };

  const uploadTextPost = async () => {
    // ⛔ POSTING GUARD — never remove this check
    if (typeof uploadFile !== "function") {
      alert("Upload failed: uploadFile is not available. Please refresh the page and try again.");
      console.error("CRITICAL: uploadFile is not defined — check api.js import in UploadModal.jsx");
      return;
    }
    if (!textPostContent.trim()) { alert("Please write something first!"); return; }
    setUploading(true); setProgress(10);
    try {
      setStep("Creating text post...");
      // Canvas render — matches each template style
      const UPLOAD_TPLS = [
        { bg:["#f8b4cb","#f8b4cb"], style:"highlight", hlColor:"#e91e8c", textColor:"#111", emoji:"😊", emojiTop:true },
        { bg:["#b8d4f0","#d6e8ff"], style:"highlight", hlColor:"#F5C842", textColor:"#222", emoji:"", emojiTop:false },
        { bg:["#0B0C1A","#1a1040"], style:"plain", textColor:"#F5C842", emoji:"🌸", emojiTop:true },
        { bg:["#d8e8f5","#eaf2ff"], style:"plain", textColor:"#4a6fa5", emoji:"", emojiTop:false },
        { bg:["#111111","#111111"], style:"plain", textColor:"#ffffff", emoji:"🌙", emojiTop:true },
        { bg:["#FF416C","#FF9500"], style:"plain", textColor:"#ffffff", emoji:"🌅", emojiTop:true },
        { bg:["#0F2027","#2C5364"], style:"plain", textColor:"#00E5FF", emoji:"🌊", emojiTop:true },
        { bg:["#1a1a1a","#2d1a00"], style:"plain", textColor:"#F5C842", emoji:"✨", emojiTop:true },
      ];
      const tpl = UPLOAD_TPLS[textPostTemplate] || UPLOAD_TPLS[0];

      const canvas = document.createElement("canvas");
      canvas.width = 540; canvas.height = 960;
      const ctx = canvas.getContext("2d");

      // Background
      const grad = ctx.createLinearGradient(0, 0, 540, 960);
      grad.addColorStop(0, tpl.bg[0]); grad.addColorStop(1, tpl.bg[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 540, 960);

      // Dynamic font size based on text length + user scale choice
      const textLen = textPostContent.trim().length;
      const baseFontSize = textLen <= 40 ? 58
        : textLen <= 80  ? 48
        : textLen <= 140 ? 38
        : textLen <= 220 ? 30
        : 24;
      const fontSize = Math.max(10, Math.floor(baseFontSize * textFontScale));
      const lineH = fontSize * 1.5;
      const maxW = 460;
      ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
      ctx.textBaseline = "top";

      // Word-wrap into lines
      const allWords = textPostContent.trim().split(" ");
      const lines = []; let curLine = "";
      for (const w of allWords) {
        const test = curLine ? curLine + " " + w : w;
        if (ctx.measureText(test).width > maxW && curLine) { lines.push(curLine); curLine = w; }
        else curLine = test;
      }
      if (curLine) lines.push(curLine);

      const totalTextH = lines.length * lineH;
      const emojiH = tpl.emoji ? 90 : 0;
      const emojiGap = tpl.emoji ? 24 : 0;
      const blockH = emojiH + emojiGap + totalTextH;
      let startY = (960 - blockH) / 2;

      // Emoji
      if (tpl.emoji) {
        ctx.font = "80px Arial"; ctx.textAlign = "left"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
        ctx.fillText(tpl.emoji, 40, startY);
        startY += emojiH + emojiGap;
      }

      ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;

      if (tpl.style === "highlight") {
        // Draw highlight block behind each line (left aligned)
        const padX = 14, padY = 8;
        lines.forEach((l, i) => {
          const tw = ctx.measureText(l).width;
          const rx = 36, ry = startY + i * lineH - padY;
          // rounded rect fill
          ctx.fillStyle = tpl.hlColor;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(rx, ry, tw + padX*2, fontSize + padY*2, 6) :
            ctx.rect(rx, ry, tw + padX*2, fontSize + padY*2);
          ctx.fill();
          ctx.fillStyle = tpl.textColor;
          ctx.textAlign = "left";
          ctx.fillText(l, rx + padX, startY + i * lineH);
        });
      } else {
        // Plain centered text
        ctx.textAlign = "center";
        ctx.shadowColor = tpl.bg[0] === "#ffffff" ? "transparent" : "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        lines.forEach((l, i) => {
          ctx.fillStyle = tpl.textColor;
          ctx.fillText(l, 270, startY + i * lineH);
        });
      }

      // Watermark
      ctx.font = "700 18px Arial"; ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.textAlign = "right"; ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
      ctx.fillText("sachi™", 520, 930);

      setProgress(30);
      const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.92));
      const imgFile = new File([blob], `textpost_${Date.now()}.jpg`, { type:"image/jpeg" });
      setStep("Uploading...");
      const imgResult = await uploadFile(imgFile, (pct) => setProgress(10 + Math.round(pct * 0.7)));
      const img_url = imgResult.file_url || imgResult;
      setProgress(75); setStep("Posting...");
      const textGeo = await getPostLocation();
      const username = currentUser.full_name || currentUser.email?.split("@")[0] || "user";
      await videos.create({
        user_id: currentUser.id, username,
        display_name: currentUser.full_name || username,
        avatar_url: localStorage.getItem(`avatar_${currentUser.id}`) || localStorage.getItem("avatar_last") ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&bold=true&format=png`,
        video_url: img_url, thumbnail_url: img_url,
        photo_urls: [img_url], is_photo: true,
        caption: (postTitle ? postTitle + "\n" : "") + textPostContent.trim(),
        hashtags: (textPostContent.match(/#\w+/g) || []).map(t => t.toLowerCase()),
        likes_count:0, comments_count:0, views_count:0, shares_count:0,
        is_approved: postVisibility !== "only_me", is_archived: false, is_ai_detected: false, is_mature: false,
        sound_title: "Text Post", sound_artist: "sachi",
        post_visibility: postVisibility,
        post_location_name: postLocation?.name || null,
        post_city: postLocation?.city || null,
        ...textGeo,
      });
      setProgress(100); setStep("Posted! 🎉");
      setTimeout(() => { onUploaded(); onClose(); }, 1000);
    } catch(e) {
      alert("Upload failed: " + (e.message || JSON.stringify(e)));
      setUploading(false); setProgress(0); setStep("");
    }
  };

  return (
    <>
    {showEditor && (
      <VideoEditor
        file={file}
        onDone={(processed, overlays) => {
          setEditedFile(processed);
          // Append text overlays to caption
          if (overlays && overlays.length > 0) {
            const overlayText = overlays.map(o => o.text).join(" · ");
            setCaption(prev => prev ? prev + "\n" + overlayText : overlayText);
          }
          setShowEditor(false);
        }}
        onSkip={() => { setEditedFile(null); setShowEditor(false); }}
      />
    )}
    {/* ── POST DETAILS STEP ── */}
    {showPostDetails && (
      <div style={{ position:"fixed", inset:0, zIndex:3500, background:"#0B0C1A", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setShowPostDetails(false)}
            style={{ background:"none", border:"none", color:"#fff", fontSize:22, cursor:"pointer", lineHeight:1 }}>‹</button>
          <div style={{ color:"#fff", fontWeight:800, fontSize:17 }}>Post details</div>
          <div style={{ width:32 }} />
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 40px" }}>

          {/* Title field */}
          <div style={{ marginBottom:20 }}>
            <input
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              placeholder="Add a catchy title..."
              style={{ width:"100%", background:"transparent", border:"none", borderBottom:"1.5px solid rgba(255,255,255,0.15)",
                padding:"10px 0", color:"#fff", fontSize:18, fontWeight:700, outline:"none",
                boxSizing:"border-box" }}
            />
            <div style={{ color:"#555", fontSize:12, marginTop:6 }}>Writing a title helps get 3× more views on average</div>
          </div>

          {/* Caption */}
          <div style={{ marginBottom:20 }}>
            <textarea
              value={uploadTab === "text" ? textPostContent : caption}
              onChange={e => uploadTab === "text" ? setTextPostContent(e.target.value) : setCaption(e.target.value)}
              placeholder="Write a caption... #hashtags"
              rows={3}
              style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12, padding:"12px 14px", color:"#fff", fontSize:14, resize:"none", outline:"none",
                boxSizing:"border-box" }}
            />
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:20 }} />

          {/* Location row - MANDATORY */}
          <div style={{ marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", cursor:"pointer" }}
              onClick={detectLocation}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>📍</span>
                <div>
                  <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Location</span>
                  <span style={{ marginLeft:8, background:"rgba(245,200,66,0.15)", color:"#F5C842", fontSize:10, fontWeight:800, borderRadius:6, padding:"2px 6px", letterSpacing:0.5 }}>REQUIRED</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {detectingLocation && <span style={{ color:"#F5C842", fontSize:12, fontWeight:600 }}>📡 Detecting...</span>}
                {postLocation && !detectingLocation && (
                  <span style={{ color:"#8BC34A", fontSize:13, fontWeight:600 }}>
                    ✓ {postLocation.name}
                  </span>
                )}
                {!postLocation && !detectingLocation && (
                  <span style={{ color:"#ff6b6b", fontSize:12, fontWeight:600 }}>Not set — tap to detect</span>
                )}
              </div>
            </div>
            {postLocation && !detectingLocation && (
              <div style={{ display:"flex", gap:8, paddingBottom:12, flexWrap:"wrap" }}>
                <div style={{ background:"rgba(139,195,74,0.12)", border:"1px solid rgba(139,195,74,0.25)", borderRadius:20, padding:"5px 14px", fontSize:13, color:"#8BC34A", display:"flex", alignItems:"center", gap:6 }}>
                  📍 {postLocation.name}
                  <span onClick={detectLocation} style={{ cursor:"pointer", color:"#666", fontSize:11, marginLeft:4 }}>↺ refresh</span>
                </div>
              </div>
            )}
            {!postLocation && !detectingLocation && (
              <div style={{ paddingBottom:12 }}>
                <div style={{ color:"#ff6b6b", fontSize:11, opacity:0.8 }}>📍 Location is required to post on Sachi. Tap above to detect automatically.</div>
              </div>
            )}
          </div>

          <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:4 }} />

          {/* Who can view row */}
          <div style={{ padding:"14px 0", cursor:"pointer" }} onClick={() => setShowVisibilityPicker(v => !v)}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>🌐</span>
                <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Who can view</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:"#aaa", fontSize:13 }}>
                  {postVisibility === "everyone" ? "Everyone" : postVisibility === "followers" ? "Followers only" : "Only me"}
                </span>
                <span style={{ color:"#555", fontSize:18 }}>{showVisibilityPicker ? "▾" : "›"}</span>
              </div>
            </div>
            {showVisibilityPicker && (
              <div style={{ marginTop:12, background:"rgba(255,255,255,0.04)", borderRadius:14, overflow:"hidden" }}>
                {[
                  { val:"everyone", icon:"🌐", label:"Everyone", sub:"Anyone on Sachi can see this" },
                  { val:"followers", icon:"👥", label:"Followers only", sub:"Only people who follow you" },
                  { val:"only_me", icon:"🔒", label:"Only me", sub:"Saved privately, not shown in feed" },
                ].map(v => (
                  <div key={v.val}
                    onClick={e => { e.stopPropagation(); setPostVisibility(v.val); setShowVisibilityPicker(false); }}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px",
                      borderBottom:"1px solid rgba(255,255,255,0.05)", cursor:"pointer",
                      background: postVisibility===v.val ? "rgba(245,200,66,0.07)" : "transparent" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontSize:20 }}>{v.icon}</span>
                      <div>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{v.label}</div>
                        <div style={{ color:"#666", fontSize:11 }}>{v.sub}</div>
                      </div>
                    </div>
                    {postVisibility===v.val && <span style={{ color:"#F5C842", fontSize:18 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:24 }} />

          {/* Mature content toggle */}
          {uploadTab !== "text" && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 0", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:20 }}>🔞</span>
                <div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Mature content</div>
                  <div style={{ color:"#555", fontSize:11 }}>18+ viewers only</div>
                </div>
              </div>
              <div onClick={() => setIsMature(m => !m)}
                style={{ width:48, height:26, borderRadius:13,
                  background: isMature ? "#ff6b6b" : "rgba(255,255,255,0.12)",
                  position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                <div style={{ position:"absolute", top:3, left: isMature ? 25 : 3, width:20, height:20,
                  borderRadius:"50%", background:"#fff", transition:"left 0.2s",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div style={{ marginBottom:20 }}>
              <div style={{ color:"#aaa", fontSize:13, marginBottom:8 }}>{step}</div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.4s ease" }} />
              </div>
            </div>
          )}
        </div>

        {/* Bottom buttons */}
        <div style={{ padding:"12px 20px 40px", display:"flex", gap:12, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={() => setShowPostDetails(false)} disabled={uploading}
            style={{ flex:1, padding:"14px 0", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:14, color:"#aaa", fontWeight:700, fontSize:15, cursor:"pointer" }}>
            ← Back
          </button>
          <button
            onClick={() => {
              if (!postLocation) { alert('📍 Please allow location access to post on Sachi.'); detectLocation(); return; }
              if (uploadTab === "text") uploadTextPost();
              else if (uploadTab === "photo") uploadPhotos();
              else upload();
            }}
            disabled={uploading || detectingLocation}
            style={{ flex:2.5, padding:"14px 0",
              background: uploading ? "#333" : (!postLocation || detectingLocation) ? "rgba(255,107,107,0.25)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)",
              border: (!postLocation && !uploading) ? "1.5px solid rgba(255,107,107,0.4)" : "none",
              borderRadius:14, color: (!postLocation && !uploading) ? "rgba(255,255,255,0.4)" : "#fff",
              fontWeight:900, fontSize:16, cursor: (uploading || detectingLocation) ? "default" : "pointer",
              boxShadow: postLocation && !uploading ? "0 4px 20px rgba(255,107,107,0.35)" : "none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {uploading ? step : detectingLocation ? "📡 Detecting location..." : !postLocation ? "📍 Location required" : <><span style={{ fontSize:18 }}>⬆</span> Post</>}
          </button>
        </div>
      </div>
    )}

    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.85)" }} />
      <div style={{ position:"relative", width:"100%", maxWidth:480, margin:"0 auto", background:"#0f0f1a", borderRadius:"24px 24px 0 0", zIndex:2001,
        maxHeight:"92vh", display:"flex", flexDirection:"column",
        paddingBottom:"env(safe-area-inset-bottom, 24px)" }}>
        {/* Scrollable inner content */}
        <div style={{ overflowY:"auto", flex:1, padding:"24px 24px 32px", WebkitOverflowScrolling:"touch" }}>
        <div style={{ width:40, height:4, background:"#444", borderRadius:99, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>{uploadTab==="video" ? "📹 Post a Video" : uploadTab==="photo" ? "🖼️ Post Photos" : "✏️ Text Post"}</div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:"50%", width:32, height:32, color:"#fff", cursor:"pointer" }}>✕</button>
        </div>
        {/* Tab switcher */}
        <div style={{ display:"flex", gap:8, marginBottom:18, background:"rgba(255,255,255,0.05)", borderRadius:14, padding:4 }}>
          {[{id:"video",label:"🎬 Video"},{id:"photo",label:"🖼️ Photos"},{id:"text",label:"✏️ Text"}].map(t => (
            <button key={t.id} onClick={() => { setUploadTab(t.id); setFile(null); setPhotos([]); }}
              style={{ flex:1, padding:"10px 0", borderRadius:11, border:"none",
                background: uploadTab===t.id ? (t.id==="text" ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "linear-gradient(135deg,#ff6b6b,#ff8e53)") : "transparent",
                color: uploadTab===t.id ? "#fff" : "#888", fontWeight:800, fontSize:13, cursor:"pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {uploadTab !== "text" && (<>
        {/* Duration Selector */}
        <div style={{ marginBottom:16 }}>
          <div style={{ color:"#aaa", fontSize:12, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Video Length</div>
          <div style={{ display:"flex", gap:8 }}>
            {[
              { label:"15s", val:15, icon:"⚡" },
              { label:"60s", val:60, icon:"🎬" },
              { label:"2 min", val:120, icon:"📹" },
              { label:"10 min", val:600, icon:"🎥" },
            ].map(opt => (
              <button key={opt.val} onClick={() => setMaxDuration(opt.val)}
                style={{
                  flex:1, padding:"10px 0", borderRadius:12, border: maxDuration === opt.val ? "2px solid #ff6b6b" : "1px solid rgba(255,255,255,0.1)",
                  background: maxDuration === opt.val ? "rgba(255,107,107,0.18)" : "rgba(255,255,255,0.05)",
                  color: maxDuration === opt.val ? "#ff6b6b" : "#aaa",
                  fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3
                }}>
                <span style={{ fontSize:18 }}>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {uploadTab === "photo" ? (
          <div style={{ marginBottom:16 }}>
            {/* Photo grid preview — drag to reorder */}
            {photos.length > 0 && (
              <>
                <div style={{ color:"#F5C842", fontSize:11, textAlign:"center", marginBottom:6, fontWeight:600, letterSpacing:0.3 }}>
                  ☰ Drag photos to reorder · First photo is the cover
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:12 }}>
                  {photos.map((p,i) => (
                    <div key={i}
                      draggable
                      onDragStart={() => setDragPhotoIdx(i)}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => {
                        if (dragPhotoIdx === null || dragPhotoIdx === i) return;
                        const newPhotos = [...photos];
                        const [moved] = newPhotos.splice(dragPhotoIdx, 1);
                        newPhotos.splice(i, 0, moved);
                        setPhotos(newPhotos);
                        setDragPhotoIdx(null);
                      }}
                      onDragEnd={() => setDragPhotoIdx(null)}
                      style={{
                        position:"relative", aspectRatio:"1", borderRadius:10, overflow:"hidden",
                        border: dragPhotoIdx === i ? "2px solid #F5C842" : i===0 ? "2px solid rgba(255,107,107,0.8)" : "2px solid rgba(255,107,107,0.3)",
                        cursor:"grab", opacity: dragPhotoIdx === i ? 0.5 : 1,
                        transition:"opacity 0.15s, border 0.15s"
                      }}>
                      <img src={URL.createObjectURL(p)} style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none" }} />
                      <button onClick={() => removePhoto(i)}
                        style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.7)", border:"none",
                          borderRadius:"50%", width:22, height:22, color:"#fff", fontSize:13, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1, zIndex:2 }}>✕</button>
                      {i===0 && <div style={{ position:"absolute", bottom:4, left:4, background:"rgba(255,107,107,0.85)", borderRadius:6, padding:"1px 6px", fontSize:10, color:"#fff", fontWeight:700, zIndex:2 }}>Cover</div>}
                      <div style={{ position:"absolute", top:4, left:4, background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"1px 5px", fontSize:10, color:"#aaa", fontWeight:600, zIndex:2 }}>{i+1}</div>
                    </div>
                  ))}
                  {photos.length < 6 && (
                    <div onClick={() => photoRef.current?.click()}
                      style={{ aspectRatio:"1", borderRadius:10, border:"2px dashed rgba(255,255,255,0.2)",
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                        cursor:"pointer", color:"#888", fontSize:12, gap:4 }}>
                      <span style={{ fontSize:24 }}>＋</span>
                      <span>Add more</span>
                    </div>
                  )}
                </div>
              </>
            )}
            {photos.length === 0 && (
              <div onClick={() => photoRef.current?.click()}
                style={{ border:"2px dashed rgba(255,107,107,0.4)", borderRadius:16, padding:40, textAlign:"center", cursor:"pointer" }}>
                <div style={{ fontSize:48, marginBottom:10 }}>🖼️</div>
                <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:6 }}>Tap to select photos</div>
                <div style={{ color:"#666", fontSize:13 }}>Up to 6 photos · JPG, PNG, HEIC</div>
              </div>
            )}
            <input ref={photoRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handlePhotoSelect} />
            {photos.length > 0 && <div style={{ color:"#888", fontSize:12, textAlign:"center", marginTop:4 }}>{photos.length}/6 photos selected · Tap ✕ to remove</div>}
          </div>
        ) : (
        <>
        {!file ? (
          <div onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(255,107,107,0.9)"; e.currentTarget.style.background = "rgba(255,107,107,0.08)"; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = "rgba(255,107,107,0.4)"; e.currentTarget.style.background = "transparent"; }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "rgba(255,107,107,0.4)";
              e.currentTarget.style.background = "transparent";
              const f = e.dataTransfer.files[0];
              if (!f || !f.type.startsWith("video/")) return;
              if (f.size > 500 * 1024 * 1024) { alert("Video must be under 500MB."); return; }
              handleFileSelect(f);
            }}
            style={{ border:"2px dashed rgba(255,107,107,0.4)", borderRadius:16, padding:48, textAlign:"center", cursor:"pointer", marginBottom:16, transition:"border-color 0.2s, background 0.2s" }}>
            <div style={{ fontSize:48, marginBottom:10 }}>🎬</div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16, marginBottom:6 }}>Tap or drag video here</div>
            <div style={{ color:"#666", fontSize:13 }}>MP4, MOV, WebM · Max 500MB</div>
            <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e => {
              const f = e.target.files[0];
              if (!f) return;
              if (f.size > 500 * 1024 * 1024) {
                alert("Video must be under 500MB. Please trim or compress your video before uploading.");
                e.target.value = "";
                return;
              }
              handleFileSelect(f);
            }} />
          </div>
        ) : (
          <div style={{ background:"rgba(255,107,107,0.08)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:12, padding:14, marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:32 }}>🎥</div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{file.name}</div>
              <div style={{ color:"#888", fontSize:12 }}>{(file.size/1024/1024).toFixed(1)} MB</div>
            </div>
            <button onClick={() => setFile(null)} style={{ background:"none", border:"none", color:"#ff6b6b", cursor:"pointer", fontSize:18 }}>✕</button>
          </div>
        )}
        </>
        )}
        {uploadTab !== "text" && (
          <div style={{ position:"relative", marginBottom:16 }}>
            <textarea value={caption} onChange={e => setCaption(e.target.value.slice(0,500))} placeholder="Write a caption... #hashtags" rows={3}
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${caption.length > 480 ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius:12, padding:12, color:"#fff", fontSize:14, resize:"none", outline:"none", boxSizing:"border-box", paddingBottom:28 }} />
            <div style={{ position:"absolute", bottom:8, right:12, fontSize:11, color: caption.length > 480 ? "#ff6b6b" : "#555" }}>{caption.length}/500</div>
          </div>
        )}



        </>)}

        {/* ── TEXT POST MODE ── */}
        {uploadTab === "text" && (() => {
          // Dynamic font size — shrinks as text gets longer
          const calcFs = (text, mini, base) => {
            if (mini) return base > 10 ? Math.floor(base * 0.28) : base;
            const len = (text || "").length;
            let auto;
            if (len <= 40)  auto = base;
            else if (len <= 80)  auto = Math.max(20, Math.floor(base * 0.82));
            else if (len <= 140) auto = Math.max(16, Math.floor(base * 0.65));
            else if (len <= 220) auto = Math.max(14, Math.floor(base * 0.52));
            else auto = Math.max(12, Math.floor(base * 0.42));
            return Math.max(10, Math.floor(auto * textFontScale));
          };

          // Template definitions — each has a render function for the preview
          const TEXT_TEMPLATES = [
            {
              name:"Blush", id:0,
              // Pink bg, black text, pink HIGHLIGHT block behind each line, emoji top-left
              bgStyle:"#f8b4cb",
              render:(text, mini) => {
                const lines = text ? text.split(" ").reduce((acc,w) => {
                  const last = acc[acc.length-1];
                  if (last && (last + " " + w).length <= 12) { acc[acc.length-1] = last + " " + w; }
                  else acc.push(w);
                  return acc;
                }, []) : ["Hey","happy","Monday"];
                const fs = calcFs(text, mini, 38);
                const pad = mini ? "2px 5px" : "6px 14px";
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap: mini?3:8, padding: mini?"8px":"20px", width:"100%" }}>
                    {!mini && <div style={{ fontSize:36, marginBottom:4 }}>😊</div>}
                    {mini && <div style={{ fontSize:14, marginBottom:2 }}>😊</div>}
                    {lines.map((l,i) => (
                      <div key={i} style={{ background:"#e91e8c", display:"inline-block", padding:pad, borderRadius:4 }}>
                        <span style={{ fontSize:fs, fontWeight:900, color:"#111", fontFamily:"'Arial Black',sans-serif", lineHeight:1.1 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                );
              }
            },
            {
              name:"Note", id:1,
              bgStyle:"linear-gradient(160deg,#b8d4f0,#d6e8ff)",
              render:(text, mini) => {
                const lines = text ? text.split(" ").reduce((acc,w) => {
                  const last = acc[acc.length-1];
                  if (last && (last + " " + w).length <= 12) { acc[acc.length-1] = last + " " + w; }
                  else acc.push(w);
                  return acc;
                }, []) : ["Hey","happy","Monday"];
                const fs = calcFs(text, mini, 34);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:mini?2:6, padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {lines.map((l,i) => (
                      <div key={i} style={{ background:"#F5C842", display:"inline-block", padding:mini?"1px 5px":"4px 12px", borderRadius:3, transform:`rotate(${i%2===0?-1:1}deg)` }}>
                        <span style={{ fontSize:fs, fontWeight:900, color:"#222", fontFamily:"'Arial Black',sans-serif", lineHeight:1.1 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                );
              }
            },
            {
              name:"Sakura", id:2,
              bgStyle:"linear-gradient(135deg,#0B0C1A,#1a1040)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = calcFs(text, mini, 34);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:mini?3:10, padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:4 }}>🌸</div>}
                    {mini && <div style={{ fontSize:12 }}>🌸</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#F5C842", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Misty", id:3,
              bgStyle:"linear-gradient(160deg,#d8e8f5,#eaf2ff)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = calcFs(text, mini, 30);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    <span style={{ fontSize:fs, fontWeight:700, color:"#4a6fa5", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.4, wordBreak:"break-word", opacity:0.85 }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Midnight", id:4,
              bgStyle:"#111111",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = calcFs(text, mini, 34);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {mini && <div style={{ fontSize:12 }}>🌙</div>}
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>🌙</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#fff", fontFamily:"'Arial Black',sans-serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Sunset", id:5,
              bgStyle:"linear-gradient(135deg,#FF416C,#FF9500)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = calcFs(text, mini, 34);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>🌅</div>}
                    {mini && <div style={{ fontSize:12 }}>🌅</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#fff", fontFamily:"'Arial Black',sans-serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word", textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Ocean", id:6,
              bgStyle:"linear-gradient(160deg,#0F2027,#2C5364)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = calcFs(text, mini, 32);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>🌊</div>}
                    {mini && <div style={{ fontSize:12 }}>🌊</div>}
                    <span style={{ fontSize:fs, fontWeight:800, color:"#00E5FF", fontFamily:"Arial,sans-serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word" }}>{words}</span>
                  </div>
                );
              }
            },
            {
              name:"Gold", id:7,
              bgStyle:"linear-gradient(135deg,#1a1a1a,#2d1a00)",
              render:(text, mini) => {
                const words = text || "Hey happy Monday";
                const fs = calcFs(text, mini, 34);
                return (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:mini?"8px":"24px", width:"100%", height:"100%" }}>
                    {!mini && <div style={{ fontSize:32, marginBottom:8 }}>✨</div>}
                    {mini && <div style={{ fontSize:12 }}>✨</div>}
                    <span style={{ fontSize:fs, fontWeight:900, color:"#F5C842", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.3, wordBreak:"break-word", textShadow:"0 0 20px rgba(245,200,66,0.4)" }}>{words}</span>
                  </div>
                );
              }
            },
          ];

          const tpl = TEXT_TEMPLATES[textPostTemplate] || TEXT_TEMPLATES[0];
          const displayText = textPostContent || "";

          return (
            <div style={{ marginBottom:16 }}>
              {/* ── Big preview card ── */}
              <div style={{
                borderRadius:20, overflow:"hidden", marginBottom:14,
                aspectRatio:"4/5", maxHeight:420,
                display:"flex", flexDirection:"column", alignItems:"stretch",
                position:"relative",
                background: tpl.bgStyle,
                boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
              }}>
                {tpl.render(displayText, false)}
                <div style={{ position:"absolute", bottom:10, right:14,
                  color:"rgba(0,0,0,0.18)", fontSize:10, fontWeight:700, letterSpacing:1 }}>sachi™</div>
              </div>

              {/* ── Text input ── */}
              <textarea
                autoFocus
                value={textPostContent}
                onChange={e => setTextPostContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={2}
                style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:"2px solid rgba(255,255,255,0.12)",
                  borderRadius:14, padding:"12px 14px", color:"#fff", fontSize:16, resize:"none", outline:"none",
                  boxSizing:"border-box", marginBottom:14, fontWeight:600, lineHeight:1.5 }}
              />

              {/* ── Font Size Toggle ── */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ color:"#aaa", fontSize:12, fontWeight:600, marginRight:4 }}>Size:</span>
                {[{label:"S", val:0.7},{label:"M", val:1.0},{label:"L", val:1.3},{label:"XL", val:1.6}].map(({label,val}) => (
                  <button key={label} onClick={() => setTextFontScale(val)}
                    style={{
                      padding:"5px 14px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:700,
                      fontSize: label==="S" ? 11 : label==="M" ? 13 : label==="L" ? 15 : 17,
                      background: textFontScale===val ? "#F5C842" : "rgba(255,255,255,0.1)",
                      color: textFontScale===val ? "#111" : "#fff",
                      transition:"all 0.15s",
                    }}>{label}</button>
                ))}
              </div>

              {/* ── "Select a style" label ── */}
              <div style={{ color:"#aaa", fontSize:13, fontWeight:600, marginBottom:10 }}>Select a style</div>

              {/* ── Template thumbnail strip ── */}
              <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none", WebkitOverflowScrolling:"touch" }}>
                {TEXT_TEMPLATES.map((t, i) => (
                  <div key={i} onClick={() => setTextPostTemplate(i)}
                    style={{
                      flexShrink:0, width:76, height:104, borderRadius:12,
                      background: t.bgStyle,
                      border: textPostTemplate===i ? "3px solid #F5C842" : "2px solid rgba(255,255,255,0.08)",
                      display:"flex", alignItems:"stretch",
                      cursor:"pointer", overflow:"hidden", position:"relative",
                      boxShadow: textPostTemplate===i ? "0 0 16px rgba(245,200,66,0.5)" : "0 2px 8px rgba(0,0,0,0.4)",
                      transition:"all 0.15s",
                      transform: textPostTemplate===i ? "scale(1.06)" : "scale(1)",
                    }}>
                    {t.render(displayText || "Hey happy Monday", true)}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {uploadTab !== "text" && <>
        {/* Music Picker Button */}
        <div onClick={() => setShowMusicPicker(true)}
          style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.06)", border:`1px solid ${selectedTrack ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius:12, padding:"12px 14px", marginBottom:12, cursor:"pointer" }}>
          <div style={{ fontSize:22 }}>🎵</div>
          <div style={{ flex:1 }}>
            <div style={{ color: selectedTrack ? "#F5C842" : "#fff", fontWeight:700, fontSize:14 }}>{selectedTrack ? selectedTrack.sound_title || selectedTrack.title : "Add Sound"}</div>
            <div style={{ color:"#888", fontSize:12 }}>{selectedTrack ? (selectedTrack.sound_artist || selectedTrack.artist) : "Pick from trending, search, or Sachi creators"}</div>
          </div>
          {selectedTrack && <button onClick={e => { e.stopPropagation(); setSelectedTrack(null); }} style={{ background:"none", border:"none", color:"#ff6b6b", fontSize:16, cursor:"pointer", padding:0 }}>✕</button>}
          <div style={{ color:"#888", fontSize:18 }}>▶</div>
        </div>

        {showMusicPicker && (
          <MusicPicker
            currentSound={selectedTrack}
            onSelect={track => { setSelectedTrack(track); setShowMusicPicker(false); }}
            onClose={() => setShowMusicPicker(false)}
          />
        )}
        {/* Explicit Content Block Warning */}
        {explicitBlocked && (
          <div style={{ background:"rgba(255,50,50,0.12)", border:"1px solid rgba(255,50,50,0.4)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:22, flexShrink:0 }}>🔞</div>
            <div>
              <div style={{ color:"#ff4444", fontWeight:700, fontSize:14, marginBottom:4 }}>Explicit Content Not Allowed</div>
              <div style={{ color:"#cc6666", fontSize:13, lineHeight:1.5 }}>Sachi does not allow sexual or explicit content. Please upload appropriate videos only.</div>
            </div>
          </div>
        )}

        {/* AI Block Warning */}
        {aiBlocked && (
          <div style={{ background:"rgba(255,50,50,0.12)", border:"1px solid rgba(255,50,50,0.4)", borderRadius:12, padding:"14px 16px", marginBottom:12, display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:22, flexShrink:0 }}>🚫</div>
            <div>
              <div style={{ color:"#ff4444", fontWeight:700, fontSize:16, marginBottom:4 }}>Bruh. 💀</div>
              <div style={{ color:"#cc6666", fontSize:14, lineHeight:1.6 }}>You can't upload AI videos on this site. 🚫🤖<br/>Keep it real — post your own original content.</div>
            </div>
          </div>
        )}

        {/* Mature Content Toggle */}
        {!aiBlocked && !explicitBlocked && file && (
          <div style={{ marginBottom:14 }}>
            <div onClick={() => setIsMature(p => !p)}
              style={{ display:"flex", gap:10, alignItems:"center", cursor:"pointer", padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:10, border:`1px solid ${isMature ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.1)"}` }}>
              <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${isMature ? "#ff6b6b" : "#555"}`, background: isMature ? "#ff6b6b" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                {isMature && <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>✓</span>}
              </div>
              <div style={{ color: isMature ? "#ff6b6b" : "#888", fontSize:13, lineHeight:1.4 }}>
                🔞 This video contains <strong>mature content</strong> (violence, fighting, adult themes)
              </div>
            </div>
            {isMature && (
              <select value={matureReason} onChange={e => setMatureReason(e.target.value)}
                style={{ marginTop:8, width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:10, color:"#fff", fontSize:13, outline:"none" }}>
                <option value="violence">⚔️ Violence</option>
                <option value="fighting">🥊 Fighting / Combat</option>
                <option value="adult_themes">🔞 Adult Themes</option>
                <option value="strong_language">🤬 Strong Language</option>
                <option value="other">⚠️ Other Mature Content</option>
              </select>
            )}
          </div>
        )}

        {/* AI Generated Disclosure Toggle */}
        {!aiBlocked && !explicitBlocked && (
          <div style={{ marginBottom:14 }}>
            <div onClick={() => setIsAiGenerated(p => !p)}
              style={{ display:"flex", gap:10, alignItems:"center", cursor:"pointer", padding:"10px 14px",
                background: isAiGenerated ? "rgba(255,149,0,0.08)" : "rgba(255,255,255,0.04)",
                borderRadius:10, border:`1px solid ${isAiGenerated ? "rgba(255,149,0,0.5)" : "rgba(255,255,255,0.1)"}` }}>
              <div style={{ width:20, height:20, borderRadius:5,
                border:`2px solid ${isAiGenerated ? "#FF9500" : "#555"}`,
                background: isAiGenerated ? "#FF9500" : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s",
                boxShadow: isAiGenerated ? "0 0 10px 3px rgba(255,149,0,0.7), 0 0 20px 6px rgba(255,149,0,0.3)" : "none" }}>
                {isAiGenerated && <span style={{ color:"#fff", fontSize:13, fontWeight:900 }}>✓</span>}
              </div>
              <div style={{ color: isAiGenerated ? "#FF9500" : "#888", fontSize:13, lineHeight:1.4 }}>
                🤖 <strong>Flag as AI</strong> — let your viewers know this content was AI generated
              </div>
            </div>
            {isAiGenerated && (
              <div style={{ marginTop:8, padding:"10px 14px", background:"rgba(255,149,0,0.07)", borderRadius:10, border:"1px solid rgba(255,149,0,0.2)" }}>
                <div style={{ color:"#FF9500", fontSize:12, lineHeight:1.5 }}>
                  ⚠️ Your post will be <strong>held for MOD review</strong> before going live. If approved, it will show an <strong>🤖 AI Generated</strong> badge. Sachi values truth — thanks for being honest.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Not AI Confirmation Checkbox */}
        {!aiBlocked && !explicitBlocked && !isAiGenerated && file && (
          <div onClick={() => setNotAiConfirmed(p => !p)}
            style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14, cursor:"pointer", padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:10, border:`1px solid ${notAiConfirmed ? "rgba(107,255,154,0.4)" : "rgba(255,255,255,0.1)"}` }}>
            <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${notAiConfirmed ? "#6bff9a" : "#555"}`, background: notAiConfirmed ? "#6bff9a" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
              {notAiConfirmed && <span style={{ color:"#0a0a14", fontSize:13, fontWeight:900 }}>✓</span>}
            </div>
            <div style={{ color: notAiConfirmed ? "#6bff9a" : "#888", fontSize:13, lineHeight:1.4 }}>
              I confirm this is <strong>my original video</strong> and is <strong>NOT AI-generated</strong>
            </div>
          </div>
        )}

        </>}

        {uploading && (
          <div style={{ marginBottom:16 }}>
            <div style={{ color:"#aaa", fontSize:13, marginBottom:6 }}>{step}</div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#ff6b6b,#ff8e53)", borderRadius:99, transition:"width 0.4s ease" }} />
            </div>
          </div>
        )}
        {uploadTab === "text" ? (
          <button onClick={() => textPostContent.trim() && !uploading && goToPostDetails()}
            disabled={!textPostContent.trim() || uploading}
            style={{ width:"100%", padding:14, background: textPostContent.trim() && !uploading ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: textPostContent.trim() && !uploading ? "pointer" : "not-allowed", opacity: textPostContent.trim() && !uploading ? 1 : 0.5 }}>
            {uploading ? step : "Next →"}
          </button>
        ) : uploadTab === "photo" ? (
          <button onClick={() => photos.length && !uploading && goToPostDetails()}
            disabled={!photos.length || uploading}
            style={{ width:"100%", padding:14, background: photos.length && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: photos.length && !uploading ? "pointer" : "not-allowed", opacity: photos.length && !uploading ? 1 : 0.5 }}>
            {uploading ? step : "Next →"}
          </button>
        ) : (
          <button onClick={() => file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) && goToPostDetails()}
            disabled={!file || uploading || aiBlocked || explicitBlocked || (!notAiConfirmed && !isAiGenerated)}
            style={{ width:"100%", padding:14, background: file && !uploading ? "linear-gradient(135deg,#ff6b6b,#ff8e53)" : "rgba(255,255,255,0.08)", border:"none", borderRadius:14, color:"#fff", fontWeight:800, fontSize:16, cursor: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? "pointer" : "not-allowed", opacity: file && !uploading && !aiBlocked && !explicitBlocked && (notAiConfirmed || isAiGenerated) ? 1 : 0.5 }}>
            {uploading ? step : "Next →"}
          </button>
        )}
        </div>{/* end scrollable inner */}
      </div>
    </div>
    {/* Audio preview player - always mounted */}
    <audio ref={previewAudioRef} onEnded={() => setPreviewTrack(null)} style={{ display:"none" }} />
    </>
  );
}

// ── Video Card ────────────────────────────────────────────────────────────────
// ─── Age Gate Helper ──────────────────────────────────────────────────────────

export default UploadModal;
