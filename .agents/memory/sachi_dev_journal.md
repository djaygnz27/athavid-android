# 🌸 Sachi Stream — Development Journal
> A running log of everything built, fixed, and shipped on sachistream.com
> Maintained by Daminie | Updated automatically after each session

---

## 📅 April 1, 2026

### 🚀 Platform Launch — Core App Built
- Built Sachi Stream from scratch as a TikTok-style short video platform
- Core features: video feed, infinite scroll, like/comment/share, user profiles
- Design: deep space navy (#0B0C1A), gold (#F5C842), soft coral (#FF6B6B)
- Brand philosophy established: **"Sachi means Truth"** — the anti-TikTok
- Deployed to Vercel at sachistream.com

### 🎙️ Podcast Section Added
- Added podcast tab with sample shows: Diary of a CEO, Joe Rogan, My First Million
- Redacted (Clayton & Natali Morris) added as first news podcast
- Live stream embed via Rumble iframes

### 📊 Sample Data Seeded
- Populated database with initial podcast entries and test videos

---

## 📅 April 2, 2026

### 🧠 Recommendation Algorithm
- Implemented TikTok-style recommendation engine
- Videos weighted by: user interactions, engagement score, recency, hashtag match
- UserInterest entity created to track per-user content preferences
- Feed now personalizes as users interact

### 🎨 UI Refresh
- Updated user avatars across the feed
- "Follow" button redesigned: red (following) → green (follow back)
- "Home" button now resets and refreshes the feed on tap

### 🔑 Google Play — Signing Key Reset
- Resolved signing key mismatch for Google Play upload
- Reset upload key, generated new keystore `sachi-upload-key.jks`
- Scheduled fresh AAB build for April 4, 2026

---

## 📅 April 5, 2026

### 🛡️ Admin / MOD Panel Launched
- Built full MOD panel accessible only to jaygnz27@gmail.com and lasanjaya@gmail.com
- Features: video list, flag/unflag mature content, delete videos
- Stats bar: total videos, flagged mature count, clean count
- Search by caption or username
- Filter tabs: All / Mature / Clean

### 🌸 Crystal Sakura Logo Designed & Deployed
- AI-generated crystal sakura with burning "S" at center
- Deployed as: site header logo, favicon, Apple Touch Icon
- 512x512 PNG saved for Google Play Store icon
- Replaced old plain-text wordmark in header

### 🐛 Bug Fixes (from tester reports)
- Photo carousels: implemented TikTok-style horizontal swipe
- Fixed video playback issues
- Fixed audio preview bugs

---

## 📅 April 6, 2026

### 🔐 Google OAuth — Replaced OTP Flow
- Removed old email/OTP registration system
- Integrated Google One Tap sign-in for all new users
- Improved mobile browser compatibility and conversion rate

### 🎙️ Podcast — Full-Screen Overlay
- Podcast playback updated to use full-screen overlay modal
- Users stay within sachistream.com while listening to live streams
- Prevents page navigation loss during podcast sessions

### 🏗️ Infrastructure Planning
- Discussed migration path to Cloudflare Stream as user base scales
- Documented scalability roadmap for future planning

---

## 📅 April 7, 2026

### 👥 MOD Panel — Users Tab Added
- New "Users" tab in MOD panel
- Cards: Total Registered | Today | This Week
- Full scrollable user list: avatar, username, email, join date, status
- All users now authenticated via Google only

### 🔄 Google OAuth Client ID Updated
- Integrated correct Google OAuth Client ID (ending in 'clptp32gosdt')
- Redeployed to Vercel with updated credentials
- Google One Tap fully functional on sachistream.com

### 📧 Gmail Monitor — Google Play Notifications
- Set up automation to monitor lasanjaya@gmail.com for Google Play updates
- Checks every 2 hours for developer console emails
- Alerts forwarded to jaygnz27@gmail.com

### 🌸 Trademark Filed
- SACHI word mark (Class 41) submitted to USPTO
- Effective date: April 1, 2026
- Design mark (crystal sakura logo) planned for May 4, 2026
- Site currently shows ™ symbol

---

## 📅 April 8, 2026

### 📍 Location Data — Posts & Registration
- Post workflow now **requires location** before submitting
- Auto-detects city/state/country via IP geolocation
- Post button disabled until location confirmed
- Registration form: city input + country dropdown, auto-populated by IP

### 🗺️ MOD Panel — Location Analytics
- User list now shows "City, Country" + country flag per user
- Summary breakdown of registered users by country added to MOD panel

### 👤 Profile — Avatar Upload Fixed (Google Users)
- **Bug:** Google-authenticated users' avatar picks weren't saving
  - Root cause 1: CDN upload was gated on `sachi_token` (email login only)
  - Root cause 2: localStorage was overriding DB on page load
  - Root cause 3: User lookup used wrong field (created_by vs email)
- **Fix:** Upload always attempts CDN regardless of login type
- **Fix:** DB avatar_url now takes priority over localStorage on load
- **Fix:** User record matched by email instead of created_by ID
- **Fix:** Stale localStorage cleared after successful avatar save
- Avatar now persists across page reloads for all users ✅

### 📺 Redacted Podcast — Episode URL Fixed
- "Trump: Total obliteration coming to Iran on Tuesday" episode had a dead Rumble embed
- Updated to correct Rumble video ID: `v785dsq`
- Episode now plays correctly in the podcast viewer

### 📬 Podcast Outreach Emails Sent
- **Clayton Morris (Redacted)** → claytonmorris06@gmail.com
  - Invited as first-ever live podcast on Sachi Stream
- **Steven Bartlett (Diary of a CEO)** → bookings@stevenbartlett.com
  - Highlighted long-form authentic conversation angle
- **Lex Fridman (Lex Fridman Podcast)** → lex.podcast.pitch@lexfridman.com
  - Philosophical truth/authenticity angle
- **Sam Parr & Shaan Puri (My First Million)** → contact@mfmpod.com
  - Short punchy pitch matching their style
- All emails sent from jaygnz27@gmail.com, CC'd to jaygnz27@gmail.com

### 🔔 Following & Followers UI
- Follower/Following counts now tappable on profile
- Opens a bottom sheet with full list of connections
- Resolved disconnected profile metadata across auth systems

### 📰 News Viewer — Podcast Page
- Dedicated full-screen news viewer modal implemented
- Bottom-nav channel switcher: CNN / BBC / Al Jazeera

### 👥 User Deduplication
- Legacy OTP/email accounts and Google OAuth accounts merged by email
- MOD panel, analytics, and ME profile now show unified user data
- Video history and stats aggregated across both auth systems

---

## 📅 Upcoming / In Progress

### 🤖 Google Play — Closed Testing (14-day period)
- 12 testers confirmed across US, Australia, Sri Lanka
- App submitted to Google Play for review
- Awaiting approval for Closed Testing track
- After 14 days → Production submission

### 🚀 Public Launch — May 2026
- Target: 50-60 beta creators recruited before public launch
- Solve content cold-start problem before opening to public
- Cloudflare Stream migration planned for scale

### ™️ Trademark
- SACHI design mark (crystal sakura logo) filing: May 4, 2026
- Update site from ™ to ® once word mark approved

---
*Last updated: April 8, 2026 by Daminie*
