# METHOD OF PROCEDURE (MOP)
## Sachi Stream — Podcast Go-Live Process
**Document:** MOP-SACHI-POD-001  
**Version:** 1.0  
**Date:** April 6, 2026  
**Platform:** sachistream.com  
**Prepared by:** Daminie (Sachi AI Operations)

---

## 1. PURPOSE

This MOP defines the step-by-step procedure for a podcast host to go live on the Sachi Stream platform, from pre-broadcast preparation through post-broadcast close-out. It also defines the listener experience and system behavior at each stage.

---

## 2. ROLES & RESPONSIBILITIES

| Role | Person / System | Responsibility |
|------|----------------|----------------|
| **Platform Admin** | Jay (jaygnz27@gmail.com) | Approves podcast registrations |
| **Podcast Host** | Registered Sachi user | Initiates and ends live sessions |
| **Listeners** | All Sachi registered users | Tune in via Sachi Podcasts tab |
| **Backend System** | sachistream.com + Base44 | Manages state, sends notifications |

---

## 3. PREREQUISITES (Before Going Live)

The following must be completed BEFORE executing this MOP:

- [ ] **PRE-1:** Host has a registered Sachi account (email verified)
- [ ] **PRE-2:** Host has submitted a Podcast Registration via the Podcasts tab
- [ ] **PRE-3:** Admin has approved the podcast (status = **Active**)
- [ ] **PRE-4:** Host has an external streaming URL ready (YouTube Live, Twitch, Zoom, etc.) OR is prepared to use sachistream.com as the landing point
- [ ] **PRE-5:** Host has tested audio/video on their streaming platform independently

---

## 4. METHOD OF PROCEDURE — STEP BY STEP

### PHASE 1 — PRE-BROADCAST SETUP (T-30 min)

**Step 1.1 — Start your external stream**
- Start your stream on YouTube Live, Twitch, Spotify Live, or any RTMP-compatible platform
- Copy the public stream URL
- Confirm the stream is publicly accessible (test in incognito browser)

**Step 1.2 — Update your Sachi podcast stream URL (if applicable)**
- Log in to sachistream.com
- Go to **Podcasts** tab → tap your show
- If you have an external stream URL, ensure it's saved in your show settings
- *(Feature note: Full URL edit UI coming — for now, contact admin to update stream URL in DB)*

**Step 1.3 — Notify admin (optional)**
- Ping Jay at jaygnz27@gmail.com with your planned go-live time
- This ensures admin is available to handle any moderation issues

---

### PHASE 2 — GOING LIVE (T-0)

**Step 2.1 — Navigate to your Podcast**
- Log in to sachistream.com
- Tap **Podcasts** tab in the bottom navigation
- Scroll to your show and tap it

**Step 2.2 — Initiate Live Session**
- Tap the red **"🔴 Go Live Now"** button
  - *(This button is ONLY visible to you as the registered host)*
- A confirmation dialog will appear: *"Go live now? All Sachi users will be notified instantly!"*
- Tap **OK / Confirm**

**Step 2.3 — System Actions (Automatic)**
The following happens automatically within ~2 seconds:
- ✅ Your podcast `is_live` flag is set to `true` in the database
- ✅ Your show now displays a pulsing **🔴 LIVE** badge visible to all Sachi users
- ✅ The `podcastGoLiveNotify` backend function fires
- ✅ Email notification sent to all **12 registered Sachi users** with:
  - Subject: *"🔴 LIVE NOW on Sachi: [Your Show Name]"*
  - Host name, show name, and **"🎧 Tune In Now"** button
  - Links directly to sachistream.com

**Step 2.4 — Confirm Live Status**
- You should see your show now shows **LIVE** badge
- Your alert popup confirms: *"🔴 You are LIVE! Notifications sent to all Sachi users."*
- Check your email — you'll receive the same notification as all other users (confirm delivery)

---

### PHASE 3 — ACTIVE BROADCAST

**Step 3.1 — Monitor listener count**
- Stay on your podcast page — listener count is visible
- *(Count increments as users click "Tune In Now" — not yet real-time websocket)*

**Step 3.2 — Interact with audience**
- Direct listeners to interact via the stream platform's chat (YouTube, Twitch, etc.)
- Sachi in-app comments for live episodes: planned feature (not yet live)

**Step 3.3 — Check for issues**
| Issue | Action |
|-------|--------|
| Stream drops | Restart external stream; Sachi LIVE badge remains until you manually end it |
| Wrong stream URL | Contact admin to update the URL in DB; end and restart live session |
| Abusive listeners | Contact admin (jaygnz27@gmail.com) for moderation |

---

### PHASE 4 — END OF BROADCAST

**Step 4.1 — End live session on external platform**
- End your stream on YouTube/Twitch/Zoom first
- Let your audience know on-stream that the session is ending

**Step 4.2 — End live session on Sachi**
- Go to sachistream.com → Podcasts → your show
- Tap **"⏹️ End Live Session"**
- Confirmation dialog: *"End your live session?"*
- Tap **OK / Confirm**

**Step 4.3 — System Actions (Automatic)**
- ✅ `is_live` flag set to `false`
- ✅ `listener_count` reset to 0
- ✅ 🔴 LIVE badge removed from your show immediately
- ✅ Show returns to standard "Active" state in the directory

---

### PHASE 5 — POST-BROADCAST (Optional)

**Step 5.1 — Post a recorded episode**
- If your stream was recorded, upload the episode via Podcasts → your show → Add Episode
- Fill in: Title, description, audio/video URL, episode number, thumbnail
- Listeners can replay anytime

**Step 5.2 — Share your content**
- Share your episode to your social channels
- Episode will appear in your show's episode list on Sachi permanently

---

## 5. ROLLBACK / ABORT PROCEDURE

If anything goes wrong during the Go Live step:

| Scenario | Action |
|----------|--------|
| Accidentally tapped Go Live | Immediately tap "End Live Session" — this resets all flags |
| System showed LIVE but notifications failed | Email admin (jaygnz27@gmail.com) — admin can manually re-trigger notification |
| Show not found in Podcasts tab | Show may still be in "Pending" status — contact admin to approve |
| Podcast tab not loading | Hard refresh sachistream.com — check internet connection |

---

## 6. NOTIFICATION SYSTEM DETAILS

When Go Live is triggered, the `podcastGoLiveNotify` function sends to:

| Recipient | Status |
|-----------|--------|
| jaygnz27@gmail.com | ✅ Active |
| lasanjaya@gmail.com | ✅ Active |
| djaygnz27@gmail.com | ✅ Active |
| acegun39@gmail.com | ✅ Active |
| lasanjaya172@gmail.com | ✅ Active |
| gunzboi56@gmail.com | ✅ Active |
| workplayhard785@gmail.com | ✅ Active |
| mary.manj@gmail.com | ✅ Active |
| amnyc86@gmail.com | ✅ Active |
| jcnet2626@outlook.com | ✅ Active |
| testcheck999@gmail.com | ✅ Active |
| dharshienie2002@gmail.com | ⚠️ Excluded (email not matched in app) |

**Current delivery rate: 11/12 (91.7%)**

---

## 7. KNOWN LIMITATIONS (As of April 2026)

| Limitation | Impact | Target Fix |
|-----------|--------|-----------|
| No in-app audio player | Listeners redirect to external URL | May 2026 |
| Listener count not real-time | Manual refresh needed | May 2026 |
| Stream URL must be set by admin | Host cannot self-edit URL yet | April 2026 |
| No push notifications | Email only | May 2026 |
| No live comments on Sachi | External platform chat only | May 2026 |

---

## 8. SIGN-OFF

| Role | Name | Date |
|------|------|------|
| Platform Admin | Jay Gunaratne | ___________ |
| Tested By | ________________ | ___________ |

---
*Document owner: LDNA Consulting / Sachi Stream Operations*  
*Next review: May 1, 2026*
