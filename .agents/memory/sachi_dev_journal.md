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
- **Steven Bartlett (Diary of a CEO)** → `bookings@stevenbartlett.com`
- **Lex Fridman** → `lex.podcast.pitch@lexfridman.com`
- **Sam Parr & Shaan Puri (My First Million)** → `contact@mfmpod.com`
- All sent from `jaygnz27@gmail.com`

### 📖 Dev Journal Created
- This document started — full history of Sachi development captured

### 🌸 Founding Creator Application Page Launched
- Created `FoundingCreatorPage` component — full 3-step flow: Landing → Form → Success
- New `FoundingCreator` database entity created to store all applications
- Fields captured: name, email, phone, location, content type, audience size, social links, content description, why Sachi
- Status field: Pending / Approved / Rejected / Waitlisted
- Accessible at: `sachistream.com/founding-creator` and `sachistream.com/apply`
- "Apply to be a Founding Creator" button added to ME tab profile page
- Target: 50 founding creator spots before public May 2026 launch

---

## 📅 April 9, 2026 — Music, Live Streaming, Business Email

### 🎵 Music Feature — Audius Integration
- Built `MusicPicker.jsx` — full music selection UI with 3 tabs:
  - 🔥 Trending (Audius live API, genre filters)
  - 🔍 Search (live search across Audius catalog)
  - 🎤 Sachi Sounds (original creator-uploaded audio reuse)
- Stream URL format: `https://api.audius.co/v1/tracks/{id}/stream?app_name=SachiStream`
- Plan: upgrade to Epidemic Sound Partner API at 500+ users
- Music plays during video recording and is saved with the post

### 📡 Cloudflare Stream — Live Streaming Infrastructure
- Integrated Cloudflare Stream for native RTMP live streaming
- Account ID: `a346b1c78fc48549d2de3de99a789a2d`
- Backend function deployed: `createLiveStream` — generates RTMP URL + stream key per host
- Deployed at: `https://sachi-c7f0261c.base44.app/functions/createLiveStream`
- `SachiLiveRoom` entity created to manage active streams
- Live rooms grid added under the LIVE hub tab
- News tab: 7 channels (Democracy Now, BBC, Al Jazeera, CTV, Sky News, DW, France 24)
- OBS setup guide PDF created and linked in podcast host dashboard

### 🎙️ Podcast Host Dashboard Upgraded
- Hosts can now self-generate RTMP stream keys from `sachistream.com/podcast-host`
- OBS guide PDF downloadable from the dashboard
- Stream key generation calls the backend function directly

### 📧 Zoho Mail — Custom Business Email
- Registered Zoho Mail (Mail Lite plan, 3 licenses)
- Business emails created:
  - `jayagunaratne@sachistream.com`
  - `podcasts@sachistream.com`
  - `support@sachistream.com` (alias of jayagunaratne@)
- Configured in Outlook: IMAP `imappro.zoho.com:993`, SMTP `smtppro.zoho.com:465`
- App password required (not regular password) for Outlook connection
- Settings stored in `.agents/memory/zoho_mail_config.md`

### 💬 Comment Reaction System
- Emoji reactions added to comments: 👍 ❤️ 👎 😂
- Fixed-position popup overlay prevents UI clipping on mobile
- `SachiComment` schema updated: `thumbs_up`, `hearts`, `thumbs_down`, `emoji_reactions`

---

## 📅 April 10, 2026 — DMs, Notifications, LIVE Hub, Gifts

### 💬 Direct Messaging System Built
- Full two-way DM inbox: `SachiMessage` entity with thread-based architecture
- Inbox tab added to main navigation
- "Send Message" button on every user profile
- "New Message" button with live user search in inbox
- Smart back-navigation: returns to profile or inbox depending on entry point
- Thread view shows full conversation history between two users

### 🔔 Notification Center Built
- Activity feed tab showing: likes, comments, new followers, DMs, live alerts
- `SachiNotification` entity stores all notification records
- Individual toggles for each notification type (stored in localStorage)
- Notification badge count on nav icon

### 📺 LIVE Hub — Full TikTok-Style System
- `SachiLive.jsx` built with complete live streaming architecture:
  - Creator Rooms grid (browse live hosts)
  - News tab (7 channels)
  - Go Live button (any user can stream)
  - Host view: camera/mic controls, real-time chat
  - Guest Request system: 🙋 "Request to Join" → Accept/Decline queue for host
  - WebRTC peer connection between host and guest (Google STUN servers)
  - Live chat: 3-second polling
- Signaling via `SachiGuestRequest.notes` field (JSON SDP exchange)
- New entities: `SachiLiveRoom`, `SachiLiveComment`, `SachiGuestRequest`

### 🎁 Virtual Gifts & Monetization
- `SachiGifts.jsx` built — full aurora/cosmos gift UI aesthetic
- Gift catalog: emoji gifts with coin values
- `SachiCoinWallet` entity: tracks user coin balance
- `SachiGift` entity: records each gift sent during a live
- `SachiHostEarning` entity: tracks host earnings, payout status
- `SachiCoinPurchase` entity: Stripe checkout sessions for buying coins
- Host payout: 80% of gift value, minimum $5 via PayPal
- `SachiCoinPurchase` links to Stripe payment intents

### ⚖️ Legal Pages — ToS & Privacy Policy
- Terms of Service drafted under LDNA Consulting LLC (NJ law, April 1 2026 effective)
- Privacy Policy drafted with GDPR/CCPA/COPPA compliance
- Both pages live as standalone HTML: `sachistream.com/terms` and `sachistream.com/privacy`
- Mandatory ToS checkbox added to signup flow — users must explicitly agree
- Footer links added to main app for Google crawlability

### 📝 Text Posts — Dynamic Font Scaling
- Text-only posts now supported (`is_text_post: true`)
- Font size auto-scales based on character count: 58px → 24px
- Manual toggle: S / M / L / XL size selector
- Preview updates live as user types

---

## 📅 April 11, 2026 — Bug Fixes, Sign-Up Polish, Live Review

### 🐛 Sign-Up Age Verification Fix
- **Bug:** iOS Safari default date picker was showing future dates, causing users to fail age gate
- **Fix 1:** Replaced date picker with dropdown menus (Day / Month / Year) — no native picker
- **Fix 2:** Age gate minimum raised to 13 years
- **Fix 3:** Year dropdown restricted to valid range (1900 – 13 years ago)
- **Fix 4:** Improved UX labels ("Date of Birth" instead of vague text)
- UI color palette standardized to Sachi gold throughout the signup flow

### 🎥 Live Stream Review Screen
- After recording a live session, users now see a **Review** screen
- Can: Watch back recording, Post to feed, or Discard
- Camera fitment fixed: switched from `cover` to `contain` to prevent cropping on all phone sizes

### 📬 Notification Strategy Confirmed
- Push notifications > SMS for Sachi's use case
- Google Sign-In (inherent email validation) negates need for secondary email verification
- No Zoho/email OTP flow needed — simplified auth confirmed as correct architecture

### 🔧 MOD Panel Bug
- MOD panel was failing to load after recent App.jsx update
- Root cause: incorrect template literal syntax (`${}` used outside backtick strings)
- Fixed: all string interpolation converted to proper template literals

---

## 📅 April 12, 2026 — Video Quality, Branding Overlay, Code Audit

### 🎬 Thumbnail Generation Engine Rebuilt
- **Problem:** Mobile-uploaded `.mov` files were showing as black screens in the feed
- New pipeline:
  - 3-point seek strategy (10%, 25%, 50% of duration)
  - Black frame detection (pixel brightness threshold check)
  - 8-second timeout with automated fallback play-based capture for iOS `.mov` files
- Database cleaned: retroactively fixed broken thumbnails for James Rivera, K Smith, Alpheus Anderson

### 📸 Photo Post Black Screen Fix
- Two "Training Log" photo posts were being incorrectly processed by the video player
- Root cause: `is_photo: true` records missing `photo_urls` array in database
- Fixed: populated `photo_urls` field for affected records
- Codebase updated: photo posts with `is_photo: true` now always bypass the video player

### 🔄 Auto Version Check + Cache Busting
- App now checks its own version on load (`v2.2.0`)
- If browser-cached version differs from live version → auto page reload
- Cache-busting query params applied to existing media URLs
- Prevents black screens caused by stale JS bundles

### 🎨 Branding Overlay — TikTok Watermark Masking
- Sachi logo + domain name overlay added to bottom-left of all videos
- Covers imported TikTok watermarks from re-posted content
- Dark gradient strip behind overlay for readability
- Responsive: covers watermark logos AND usernames across all aspect ratios

### 🔍 Full Code Audit
- All core files audited by AI code review (Claude):
  - `App.jsx`, `api.js`, `AuthModal.jsx`, `Landing.jsx`
  - `SachiLive.jsx`, `PodcastHost.jsx`, `SachiGifts.jsx`, `MusicPicker.jsx`
- Bugs fixed: error handling gaps, stale state, unhandled promise rejections
- Video player upgraded: persistent thumbnail background fades out only on `onPlay` event
  - Eliminates black flash between poster image and video decode

### 🌐 Google OAuth Verification — In Progress
- Google OAuth consent screen being completed for production verification
- Requirements gathered:
  - Privacy Policy URL: `sachistream.com/privacy.html` ✅
  - Terms of Service URL: `sachistream.com/terms.html` ✅
  - App logo 120x120 PNG: generated and available for upload ✅
  - Homepage footer links (Privacy + Terms): added ✅
  - Google site verification file: `google3261faac314730e8.html` deployed ✅
  - Domain: `www.sachistream.com` confirmed as authorized domain

---

## 📊 Stats Snapshot (as of April 12, 2026)
| Metric | Status |
|---|---|
| Platform | sachistream.com ✅ Live |
| Android | Google Play — Closed Testing track |
| Registered Users | Beta testers (targeting 20 for closed test) |
| Tester opt-in URL | play.google.com/apps/testing/com.ldna.sachi |
| Podcast shows | 5 active |
| Founding Creator spots | 50 total, 14 filled, 36 open |
| Trademark | SACHI word mark filed (Class 41) ✅ |
| Business emails | jayagunaratne / podcasts / support @sachistream.com ✅ |
| Total dev time | ~3 weeks from first line of code |

---

## 🗓️ Next Up
- [ ] Complete Google OAuth verification submission
- [ ] Reach 20 testers for Google Play Closed Testing (currently ~12)
- [ ] Apple Developer Program enrollment (targeting May launch)
- [ ] Epidemic Sound partnership inquiry at 500+ users
- [ ] SACHI design mark filing: May 4, 2026
- [ ] Podcast partner follow-ups (Clayton Morris, Steven Bartlett, Lex, MFM)
- [ ] Public beta launch: May 2026

---
*Last updated: April 12, 2026 by Daminie*
*"Sachi means Truth — and building it was anything but easy."*
