# 🌸 Sachi Stream — Development Journal
> The full story of building sachistream.com — the wins, the losses, the lessons.
> Maintained by Daminie | Started: March 2026

---

## 🌱 THE ORIGIN STORY — "How AthaVid Became Sachi"

---

## 📅 March 27–28, 2026 — The Idea Sparks

### 💡 AthaVid is Born
- Jay had an idea: build a TikTok-style short video platform
- Named it **AthaVid** — a place for authentic short-form video
- Started building inside Base44's mini-app builder as a quick prototype
- First version: basic video feed, upload button, like/comment

### 😤 Struggle #1 — Video Upload Didn't Work At All
- Every time a user tried to post a video it said "Something went wrong"
- The upload was fake — it was creating a temporary browser URL that disappeared on refresh
- Videos weren't actually saving anywhere
- Tried base64 encoding — too large for the database
- Tried backend functions for signed upload URLs — still failing
- Hours spent debugging before finding the root cause

### 😤 Struggle #2 — The Auth Wall
- Base44's platform was forcing its own login screen before our custom app could even load
- Users would see a Base44 login page, not AthaVid
- Tried setting app to "Public" — still blocked
- Tried removing custom auth code — didn't help
- Tried building our own login system — it conflicted with Base44's system
- Considered Twilio SMS verification — couldn't get credentials fast enough
- Spent over an hour in circles before accepting the platform limitation

### 💡 Key Decision — Move Off Base44 Mini Apps
- Realized Base44 mini apps weren't the right home for a public social platform
- Decided to build a **standalone Vercel-hosted web app** instead
- Full creative control, no platform auth walls, real URL

---

## 📅 March 29–30, 2026 — The Migration

### 🔄 AthaVid Moves to Vercel
- Ported the entire AthaVid codebase out of Base44 into a standalone React/Vite app
- New repo: `athavid-vercel` on GitHub under `djaygnz27`
- Deployed to Vercel at `athavid-vercel.vercel.app`
- Custom video feed, upload, profiles — all rebuilt from scratch

### 😤 Struggle #3 — Auth Wall (Again, Different Kind)
- The standalone app had no login system at all now
- Users could browse but not post — needed authentication
- Built a custom email/OTP (one-time password) flow from scratch
- Email verification codes sent via Gmail API
- Stored OTP codes in a `PasswordReset` entity in Base44 database

### 🎬 Video Upload FINALLY Working
- Used Base44's file storage API (`uploadFile`) from the standalone app
- Videos uploaded to CDN, URL stored in `AthaVidVideo` entity
- First successful end-to-end video post milestone 🎉

### 🖥️ UI Polished
- TikTok-style vertical scroll feed
- Like/comment/share on videos
- Follow/unfollow users
- Profile pages with video grid
- Dark theme with navy/gold palette locked in

---

## 📅 March 30–31, 2026 — Google Play Prep Begins

### 📱 Android App Build Starts
- Decided to also get AthaVid on the Google Play Store
- Wrapped the web app in Capacitor (converts web app to Android APK/AAB)
- Created GitHub Actions CI/CD workflow to automate the build
- Named the package: `com.ldna.sachi`

### 😤 Struggle #4 — Android Build Kept Failing
- First attempt: "android platform has not been added yet" error
- Second attempt: Kotlin duplicate class conflicts — two versions of Kotlin fighting each other
- Third attempt: Java version mismatch — needed Java 21 specifically
- Fourth attempt: Keystore file path wrong — build couldn't find the signing key
- Each failure meant waiting ~10 minutes for GitHub Actions to run before seeing the next error
- Created multiple workflow files trying to isolate the issue: `build-aab-v2.yml`, `build-signed-aab.yml`

### 😤 Struggle #5 — Google Play Account Verification
- Registered Google Play Developer account under `lasanjaya@gmail.com`
- Paid the $25 registration fee
- Google required **identity verification** — took multiple days to process
- Had to verify through ID.me — completed April 3, 2026
- Meanwhile, couldn't upload anything to the console

### 📸 Play Store Assets Created
- Generated screenshots for every device type: phone, 8" tablet, 10" tablet, Chromebook, Android XR
- Used Browserbase to automate screenshot capture
- Generated app icon (512x512), feature graphic (1024x500)
- Prepared Store listing: title, short description, full description

---

## 📅 April 1, 2026 — The Rebrand: AthaVid → Sachi Stream

### 🌸 The Name Change
- **"AthaVid" → "Sachi Stream"**
- "Sachi" = Japanese word for **truth** and also happiness
- Perfectly captures the platform philosophy: authentic, unfiltered content
- Domain registered: **sachistream.com**
- Brand colors confirmed: deep space navy (#0B0C1A), gold (#F5C842), coral (#FF6B6B)
- Platform positioned as **the anti-TikTok** — real people, real content, no AI slop

### 🚀 sachistream.com Goes Live
- Full platform deployed to Vercel, connected to custom domain
- Core features live: video feed, podcast tab, profiles, follow system
- Database entities: SachiVideo, SachiComment, AthaVidUser, Follow, SachiPodcast

### 🎙️ Podcast Section Added
- Added podcast tab featuring 4 shows: Diary of a CEO, Joe Rogan, My First Million, Redacted
- Live stream embeds via Rumble iframes
- Podcast episodes stored in database with title, description, embed URLs

### 📦 AAB Build — More Signing Key Pain
- Finally got the Android build working via GitHub Actions
- **But:** Google Play rejected the AAB — signed with the wrong key
- SHA1 fingerprint mismatch between what Google expected and what the build produced
- Root cause: workflow was **generating a brand new keystore on every build** 😩
- Fix: created a permanent `sachi-upload-key.jks`, stored it as a base64 GitHub secret
- Password confirmed: `Sachi2026!`

### 😤 Struggle #6 — The Keystore Saga
- First upload attempt → wrong key fingerprint
- Reset upload key in Google Play Console
- Generated new keystore, updated GitHub secrets
- Second build failed — path to keystore was wrong inside the nested directory structure
- Third build failed — `app/build.gradle` syntax got corrupted during edits
- Needed a GitHub personal access token to push fixes via API
- Finally got a clean, correctly signed AAB after 6+ build attempts

---

## 📅 April 2, 2026 — Algorithm & UX Polish

### 🧠 Recommendation Algorithm
- Built TikTok-style recommendation engine
- Videos scored by: user watch history, hashtag affinity, engagement rate, recency
- `UserInterest` entity tracks per-user content preferences
- Feed personalizes over time as users interact

### 🎨 UI Improvements
- Modern avatar system added (DiceBear API with multiple styles)
- "Follow" button: green when not following, red when following
- "Home" button resets and refreshes the feed
- Share-to-Sachi feature for Android (share from other apps directly into Sachi)

---

## 📅 April 5, 2026 — MOD Panel + Branding

### 🛡️ Admin / MOD Panel Built
- Full moderation panel accessible ONLY to `jaygnz27@gmail.com` and `lasanjaya@gmail.com`
- Features: flag/unflag mature content, delete videos, search, filter tabs
- Stats bar: total videos, mature flagged, clean count
- Nobody else can see the MOD tab

### 🌸 Crystal Sakura Logo — Designed & Deployed
- Tried ~12 different AI-generated logo concepts
- Options explored: Golden S Stream, Rising Phoenix, Chrome S Burst, Golden Orb, Crown of Light
- Jay picked: Crystal Sakura with a burning "S" in the center
- Iterated on S size — made it smaller so the flower dominates
- Deployed as: site header, favicon, Apple Touch Icon
- 512x512 PNG saved for Google Play

### 🐛 Tester Bug Fixes
- Photo carousels: implemented horizontal swipe (TikTok-style)
- Fixed video playback stalling
- Fixed audio preview bugs on podcast tab

---

## 📅 April 6, 2026 — Google Auth Replaces OTP

### 😤 Struggle #7 — OTP Auth Was Breaking on Mobile
- The email OTP login system we built worked on desktop but was unreliable on mobile browsers
- Users weren't receiving codes, or codes were expiring too fast
- Conversion was terrible — people gave up before getting into the app

### ✅ Google One Tap Sign-In Implemented
- Removed the entire custom OTP/email auth system
- Replaced with **Google One Tap** — single button, instant login
- All new users now authenticated via Google
- Massive improvement in signup conversion

### 🎙️ Podcast Full-Screen Overlay
- Podcast was opening external Rumble links and taking users off sachistream.com
- Built a full-screen in-app overlay for podcast playback
- Users stay on Sachi while listening

### 🏗️ Infrastructure Planning
- Discussed Cloudflare Stream migration for when user base grows
- Current: Vercel + Base44 storage handles small scale fine
- Plan documented for future reference

---

## 📅 April 7, 2026 — Users Tab + OAuth Fix + Trademark

### 👥 MOD Panel — Users Tab
- Added dedicated "Users" section to MOD panel
- Cards showing: Total Registered | Today | This Week
- Full scrollable user list with avatar, username, email, join date, status

### 🔑 Google OAuth Client ID Fix
- Initial Google One Tap wasn't working due to wrong OAuth Client ID
- Located correct ID in Google Cloud Console
- Updated in codebase, redeployed — Google auth now fully functional

### 📧 Gmail Monitor for Google Play
- Set up automation monitoring `lasanjaya@gmail.com` for Play Console emails
- Runs every 2 hours
- Sends alert to `jaygnz27@gmail.com` if any Google Play status updates arrive

### ™️ Trademark Filing
- **SACHI** word mark (Class 41) submitted to USPTO
- Effective date: April 1, 2026
- Design mark (crystal sakura logo) planned: May 4, 2026
- Site displays ™ until approved, then switches to ®

---

## 📅 April 8, 2026 — Location, Avatar Fix, Outreach

### 📍 Mandatory Location for Posts
- Posts now require location before submitting
- Auto-detects city/state/country via IP geolocation
- Post button is disabled until location confirmed
- Registration form: city input + country dropdown, IP auto-populated

### 🗺️ MOD Panel — Location Analytics
- User list shows "City, Country" + country flag per registered user
- Summary breakdown by country added

### 👤 Avatar Upload Bug Fixed (Google Users)
- **Bug:** When Google-auth users picked a photo, it never saved
- Root Cause 1: CDN upload was gated behind `sachi_token` check (email login only — Google users don't have this)
- Root Cause 2: localStorage cache was overriding DB value on every page load
- Root Cause 3: User record lookup used wrong field (`created_by` ID instead of `email`)
- **Fix:** CDN upload now always attempted regardless of login type
- **Fix:** DB value takes priority over localStorage
- **Fix:** User matched by email for all Google auth users
- **Fix:** Stale localStorage cleared after successful CDN save

### 📺 Redacted Episode Fixed
- "Trump: Total obliteration coming to Iran" episode had a dead Rumble embed URL
- Found correct Rumble video ID via search: `v785dsq`
- Updated in database — episode plays correctly now

### 📬 Podcast Outreach — 4 Emails Sent
- **Clayton Morris (Redacted)** → `claytonmorris06@gmail.com`
  - Invited as the FIRST live podcast on Sachi Stream
- **Steven Bartlett (Diary of a CEO)** → `bookings@stevenbartlett.com`
- **Lex Fridman** → `lex.podcast.pitch@lexfridman.com`
- **Sam Parr & Shaan Puri (My First Million)** → `contact@mfmpod.com`
- All sent from `jaygnz27@gmail.com`, CC'd to Jay

### 📖 Dev Journal Created
- This document started — full history of Sachi development captured
- Will be updated after every session going forward

---

## 🗓️ Upcoming / In Progress

### 🤖 Google Play — Closed Testing (Active)
- 12 testers confirmed: US, Australia, Sri Lanka
- App submitted to Google Play for review
- Awaiting approval for Closed Testing track
- After 14 days → Production submission

### 🚀 Public Launch — May 2026 Target
- Recruit 50-60 beta creators before opening to public
- Solve content cold-start problem first
- Cloudflare Stream migration planned when traffic scales up

### ™️ Logo Trademark
- SACHI design mark (crystal sakura) filing: May 4, 2026
- Update ™ → ® on site once word mark approved

### 🎙️ Podcast Partner Response
- Waiting on replies from Clayton Morris, Steven Bartlett, Lex Fridman, MFM
- Follow up in 1 week if no response

---

## 📊 Stats Snapshot (as of April 8, 2026)
- Platform: sachistream.com ✅ Live
- Android: Google Play Closed Testing — under review
- Registered Users: Beta testers only (12 confirmed)
- Podcast shows: 5 (Redacted, Diary of a CEO, Joe Rogan, My First Million, Money & Muscle)
- Total dev time: ~2 weeks from first line of code to Google Play submission

---
*Last updated: April 8, 2026 by Daminie*
*"Sachi means Truth — and building it was anything but easy."*
