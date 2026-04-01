# Sachi — Google Play Submission Guide
## Complete checklist for when developer account is verified

---

## STEP 1 — Create App in Play Console
- App name: **Sachi**
- Default language: **English (United States)**
- App or game: **App**
- Free or paid: **Free**
- Click "Create app"

---

## STEP 2 — Store Listing

**App name:** Sachi
**Short description:** Your stage. Share short videos, go viral, and connect with the world. 🎬
**Full description:** *(copy from Sachi_PlayStore_Listing.md)*

**Graphics to upload:**
| Asset | File | Size |
|-------|------|------|
| App icon | sachi_icon_512.png | 512x512 |
| Feature graphic | sachi_feature_1024x500.png | 1024x500 |
| Phone screenshots | phone_ss1-4.png | min 2, max 8 |
| Tablet 7" | tab_ss1-4.png | optional but recommended |

**Category:** Social
**Tags:** short video, video sharing, social media, creator platform
**Contact email:** lasanjaya@gmail.com
**Website:** https://sachistream.com
**Privacy Policy:** https://sachistream.com/privacy

---

## STEP 3 — Content Rating Questionnaire
*(Fill this out in Play Console → Policy → App content → Content rating)*

| Question | Answer |
|----------|--------|
| Does your app contain user-generated content? | **YES** |
| Does your app allow users to interact with each other? | **YES** |
| Does your app contain violence? | No |
| Does your app contain sexual content? | No |
| Does your app contain profanity? | No |
| Does your app contain references to drugs/alcohol? | No |
| Is your app primarily directed at children under 13? | **NO** |

**Expected rating:** Teen (T) or Mature 17+
*(Since signup requires 18+ age confirmation, Mature 17+ is appropriate)*

---

## STEP 4 — Data Safety Form
*(Fill this out in Play Console → Policy → App content → Data safety)*

### Does your app collect or share user data?
**YES**

### Data types collected:
| Data Type | Collected | Shared | Required | Purpose |
|-----------|-----------|--------|----------|---------|
| Name | ✅ Yes | ❌ No | Optional | Account management |
| Email address | ✅ Yes | ❌ No | Required | Account management, security |
| User ID | ✅ Yes | ❌ No | Required | App functionality |
| Videos | ✅ Yes | ✅ Yes (public feed) | Optional | App functionality |
| Profile photos/avatars | ✅ Yes | ✅ Yes (public profile) | Optional | App functionality |
| App interactions (likes, comments, follows) | ✅ Yes | ❌ No | Required | App functionality |

### Security practices:
- ✅ Data is encrypted in transit (HTTPS)
- ✅ You can request data deletion (email lasanjaya@gmail.com)
- ❌ Does NOT sell user data to third parties

---

## STEP 5 — App Access
*(Play Console → Testing → App access)*
- Select: **All functionality is available without special access**

---

## STEP 6 — Target Audience & Content
*(Play Console → Policy → App content → Target audience)*
- Target age group: **18 and over**
- App appeals to children: **No**

---

## STEP 7 — Upload AAB
*(Play Console → Production → Create new release)*
1. Build AAB via GitHub Actions (trigger `Build Sachi Release AAB` workflow)
2. Download `Sachi-release-aab` artifact
3. Upload `app-release.aab` to Play Console
4. Set release name: **1.0.0**
5. Release notes: "Sachi v1.0 — Initial release. Share short videos, follow creators, and go viral."

---

## STEP 8 — Pricing & Distribution
- Price: **Free**
- Countries: **All countries** (or start with United States)
- Contains ads: **No**

---

## STEP 9 — Review & Submit
- Review all sections — all must show green checkmarks ✅
- Click **"Send for review"**
- Google review typically takes **3-7 business days** for new apps

---

## IMPORTANT — GitHub Secret Needed
Before building the AAB, set this secret in your GitHub repo:

1. Go to: https://github.com/jaygnz27/athavid-vercel (or your repo URL)
2. Settings → Secrets and variables → Actions → New repository secret
3. Name: `KEYSTORE_PASSWORD`
4. Value: Choose a strong password (save it somewhere safe!)

Then trigger the workflow:
- Go to Actions → "Build Sachi Release AAB" → Run workflow

---

## Status Tracker
- [x] Store listing text ✅
- [x] App icon (512x512) ✅
- [x] Feature graphic (1024x500) ✅
- [x] Screenshots (phone + tablet) ✅
- [x] Privacy Policy live at sachistream.com/privacy ✅
- [x] AAB build workflow ready ✅
- [x] Data Safety answers prepared ✅
- [x] Content Rating answers prepared ✅
- [ ] Developer account verified (pending Google support ticket)
- [ ] KEYSTORE_PASSWORD secret set in GitHub
- [ ] AAB built and downloaded
- [ ] Submitted to Play Console
