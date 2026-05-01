# SACHI STREAM — Architecture Q&A
# The 15 questions you asked + the ones you should be asking
# Generated: May 1, 2026

---

## Q1. Do you have scheduled CRON jobs / automations and will they survive migration?

**Short answer: YES, and NO — they will NOT automatically migrate.**

The current Superagent has these active automations:
- Weekly Monday 9AM status email (JMUX dashboard)
- Gmail webhook monitoring (JMUX email alerts)
- Google Play verification check (every 3 hours — now retired)

**None of these belong in Sachi Stream.** They are superagent-specific workflows.

**What Sachi Stream needs but doesn't have yet:**
- No active CRON jobs exist for Sachi today
- Things you'll want to create manually in the new app:
  1. **Archive expired videos** — daily job, mark SachiVideos past archive_date as is_archived=true
  2. **Analytics snapshot** — weekly, aggregate stats into SachiAnalytics
  3. **Payout reminders** — monthly, flag hosts with pending_payout_usd > $5
  4. **Inactive stream cleanup** — daily, mark SachiLiveRooms/SachiPodcasts is_live=false if stream went dark

**Action required:** Manually recreate any automation logic in the Sachi Stream app after migration. They don't copy over.

---

## Q2. Full auth flow walkthrough — what breaks after migration?

**Current flow (Superagent):**
1. User hits sachistream.com
2. Google One Tap popup → Google OAuth → returns id_token
3. Frontend sends id_token to Base44 auth endpoint for THIS superagent app ID
4. Base44 validates token, creates/returns User record scoped to app `69b2ee18a8e6fb58c7f0261c`
5. Base44 returns session token tied to that app ID
6. All subsequent API calls use that session token

**What breaks on day 1 after migration:**
- Every session token is tied to the old app ID. **All logged-in users get logged out.**
- The User records in the new app have NEW IDs — even if you migrated the email, the session is invalid
- Google OAuth client ID is configured for the OLD app. You must add the new app's domain to the Google Cloud OAuth consent screen → Authorized JavaScript origins
- `passwordReset.ts` hardcodes the old app ID in the admin API call → password resets silently fail
- The `athaVidPasswordReset.ts` sends OTP emails branded "AthaVid" not "Sachi" → user confusion

**What doesn't break:**
- Google Sign-In itself (it's stateless OAuth, just needs correct client ID)
- User data (emails, profiles) — migrated by script
- Video/content data — migrated by script

**Auth migration sequence:**
1. Migrate all entities (script)
2. Add new app domain to Google Cloud OAuth authorized origins
3. Update `passwordReset.ts` APP_ID constant
4. Test sign-in with one account before announcing migration to users

---

## Q3. What is most likely to break, ranked by impact?

**🔴 CRITICAL — Will break immediately:**

1. **sachiCoins.ts APP_ID + BASE_URL** — Every coin purchase hits old app's API. Stripe webhooks point to old URL. Revenue flow is completely broken until updated. Fix: 2 constants + Stripe webhook URL update.

2. **Gmail OAuth re-authorization** — passwordReset.ts calls `base44.asServiceRole.connectors.getConnection("gmail")`. This connector is authorized on the OLD app. Will return 401 on first password reset attempt. Fix: re-authorize Gmail in new app settings.

3. **Google OAuth client ID** — If your new app is on a different domain/URL, Google will block sign-in with "origin not authorized." Fix: add new URL to Google Cloud Console before go-live.

**🟠 HIGH — Will break within first day:**

4. **sendFollowNotification.ts reads AthaVidUser for emails** — In new app, if AthaVidUser is empty/not migrated, zero follow notifications go out. Fix: change to read User entity.

5. **getAdminStats.ts reads AthaVidUser for user counts** — Admin dashboard shows 0 users until fixed. Fix: change to User entity.

6. **Cloudflare stream_key exposure** — SachiPodcast.stream_key and SachiLiveRoom.stream_key are stored in plain text in the database. Anyone with entity read access can steal stream keys. This is a pre-existing issue — flag it for the new app.

**🟡 MEDIUM — Will break within first week:**

7. **SachiComment.parent_id** — Threaded comments display flat (no nesting) until pass 2 of migration script completes. Pass 2 fixes this.

8. **Stripe webhook signature verification** — Production-hardened Stripe implementations verify webhook signatures. Current sachiCoins.ts does not. A bad actor could spoof a "payment successful" webhook and get free coins. Recommend adding signature check before go-live.

9. **Coin wallet double-credit** — If a user refreshes the Stripe success page, `verify_payment` is called twice. Current code checks `status === "completed"` but there's a race condition window. Low risk at beta scale, high risk at scale.

**🟢 LOW — Cosmetic or edge case:**

10. **podcastGoLiveNotify.ts hardcoded email list** — Has your personal emails + beta testers. Will email them every time anyone goes live. Clean up the fallback list.

---

## Q4. What about Row-Level Security (RLS)?

**This is one of the most important questions and you didn't ask it explicitly.**

RLS controls whether users can see each other's data. In Base44:
- RLS OFF → all users can read all records (current state for most Sachi entities)
- RLS ON → users only see records they created

**Current state in Superagent:**
- SachiVideo: RLS OFF (needed — public feed shows everyone's videos)
- SachiLike, SachiHype, Follow: RLS OFF (needed — social graph is public)
- SachiMessage: **should be RLS ON** — users should only see their own messages
- SachiCoinWallet, SachiHostEarning: **should be RLS ON** — financial data is private
- SachiCoinPurchase: **should be RLS ON** — purchase history is private
- PasswordReset: **should be RLS ON** — reset codes must be private

**What to do:** When creating entities in new app, explicitly set RLS to ON for: SachiMessage, SachiCoinWallet, SachiHostEarning, SachiCoinPurchase, SachiNotification (recipient only), PasswordReset.

For everything else (videos, comments, likes, follows) — RLS OFF is correct.

---

## Q5. Will the Cloudflare Stream video URLs still work after migration?

**YES — video URLs are absolute CDN URLs. They work forever regardless of which app they're stored in.**

The format is:
`https://customer-i1ij9522l179kiqc.cloudflarestream.com/{video_uid}/manifest/video.m3u8`

This URL is tied to your Cloudflare account, not to Base44. Migration doesn't affect it at all.

**However:** New uploads after migration use `cfStreamUpload.ts` which reads `CF_ACCOUNT_ID` and `CF_STREAM_API_TOKEN` from env vars. Make sure those secrets are copied to the new app or new uploads fail.

---

## Q6. What happens to Cloudflare Calls SFU sessions mid-migration?

Any active LIVE sessions will drop when you switch apps — the session IDs are in-memory on Cloudflare's side, not stored in your DB. This is expected. Plan migration during off-peak hours (2-4AM).

---

## Q7. Do the Stripe price IDs work in the new app?

**YES — Stripe price IDs are global to your Stripe account.** They don't care which app calls them.

What you need to update:
1. `STRIPE_SECRET_KEY` env var → copy to new app secrets
2. `APP_ID` in sachiCoins.ts → new app ID (for recording purchases)
3. `BASE_URL` in sachiCoins.ts → new app's base44.app URL
4. **Stripe webhook endpoint** → update in Stripe dashboard to point to new app's function URL

The webhook URL format will be:
`https://{new-app-id}.base44.app/functions/sachiCoins` (or similar)

---

## Q8. What about user passwords — do they migrate?

**No. And this is a real problem.**

Base44 manages auth. When you migrate User records, you're copying profile data (email, username, bio, avatar). The **password hash** is managed by Base44's auth system and is NOT accessible via the entity API.

**What this means:** After migration, users who signed up via Google One Tap → no problem, they sign in with Google again. But users who used email/password → their password doesn't exist in the new app. They'll need to use "Forgot Password" on first login.

**Recommendation:** Before migration, send an email to all users: "We're upgrading Sachi. On your first login after [date], use 'Sign in with Google' or click 'Forgot Password' if you use email/password."

---

## Q9. How do you handle the denormalized fields (username, avatar_url on every entity)?

**This is a design debt that migration makes visible.**

Right now, SachiVideo, SachiComment, SachiLike, etc. all store `username` and `avatar_url` directly. If a user changes their username or avatar, those fields on historical records become stale.

**Migration script behavior:** It migrates whatever is in the records — stale data and all. This is fine for now.

**Long-term:** Consider a background job that periodically re-syncs username/avatar on recent records. Not a migration blocker, but worth noting.

---

## Q10. What's the data volume — will the migration script time out?

Based on your current user count (beta, ~10-50 users) and video volume:
- **Expected total records:** < 5,000
- **Expected migration time:** 5-15 minutes
- **Risk of timeout:** Very low at current scale

At production scale (10K+ users, 100K+ videos), you'd need to batch this differently. You're safe for now.

---

## Q11. Will existing Cloudflare RTMP stream keys work in the new app?

**YES** — stream keys are stored in SachiPodcast records and are generated by Cloudflare. They're just strings. Migration copies them as-is. Hosts can keep using the same OBS settings.

**EXCEPT:** After migration, `setPodcastLive.ts` writes to the new app's SachiPodcast entity. If hosts have the old stream key saved in OBS and the new podcast record has a different ID, you need to make sure the podcast_id reference is correct. The migration script handles this via podcastIdMap.

---

## Q12. Are there any secrets currently hardcoded that pose a security risk?

**YES — three live secrets are hardcoded in production functions:**

1. `createLiveStream.ts` and `sachiLive.ts`: CF_ACCOUNT = `a346b1c78fc48549d2de3de99a789a2d` (hardcoded, not secret — it's a public account ID, low risk)

2. `sachiCoins.ts`: The Stripe price IDs are hardcoded. Not a secret — they're public-facing product IDs. Low risk.

3. `setPodcastLive.ts`: Admin emails `jaygnz27@gmail.com`, `lasanjaya@gmail.com` hardcoded in function body. This is a weak auth pattern. Anyone who reverse-engineers the API can spoof an email string. **Before scale, replace with a proper admin role check on the User entity.**

---

## Q13. What questions should you be asking that you're not?

**The ones that matter most:**

**"What is my rollback plan if migration fails halfway?"**
Answer: migration_state.json + migration_idmaps.json let you resume. But if you've already told users the app moved and it fails, you need the OLD app still running. Keep the superagent active for 72 hours post-migration as fallback. Don't delete it.

**"How do I keep both apps in sync during the cutover window?"**
Answer: You can't, easily. Plan a maintenance window. Put a "Sachi is upgrading — back in 30 min" banner on the site. Run migration. Flip DNS. Done. The window should be < 1 hour given your data volume.

**"Are there any Base44 API rate limits that will throttle the migration script?"**
Answer: Unknown — Base44 doesn't publish rate limits. The script does sequential inserts. If you hit a 429, add a 1-second delay between batches. The script can be modified to add: `await new Promise(r => setTimeout(r, 1000))` between records if needed.

**"What happens to the Sachi mobile app (Android) pointing at the old app ID?"**
Answer: Your Android app has the Base44 app ID baked into the API calls. If you migrate to a new app, the mobile app needs an update pointing to the new app ID. Check your Android repo — if app ID is in a config constant, it's a one-line change + new build. If it's deep in API calls, it's a bigger surgery.

**"Do I need to migrate or can I just build Sachi Stream as a fresh app from scratch?"**
Answer: If your user/video data is thin (beta stage), SERIOUSLY consider starting fresh. Copy function code, recreate schemas, let the 10 beta users re-onboard. Zero migration risk. The migration complexity only pays off if you have irreplaceable production data.

**"What is the actual Base44 API endpoint format for entity CRUD?"**
Answer: The migration script assumes `GET /v1/apps/{appId}/entities/{entityName}`. You should verify this against the Base44 API docs BEFORE running on production. A wrong endpoint means 404s on every insert.

**"How do I verify the API key has write access to the target app?"**
Answer: Run a test insert on a throwaway entity in the target app before migration. `node -e "fetch('https://api.base44.com/v1/apps/TARGET_ID/entities/BetaTester', {method:'POST', headers:{'x-api-key':'YOUR_KEY','Content-Type':'application/json'}, body: JSON.stringify({name:'test',email:'test@test.com'})}).then(r=>r.json()).then(console.log)"`

---

## Q14. What is the recommended cutover sequence?

```
Day before:
  □ Run migration script with DRY_RUN=true — verify counts
  □ Create all 27 entity schemas in new app
  □ Add new app domain to Google Cloud OAuth origins
  □ Copy all secrets to new app (CF tokens, Stripe key, etc.)
  □ Deploy all 13 active functions to new app
  □ Update APP_ID + BASE_URL constants in sachiCoins.ts
  □ Update APP_ID in passwordReset.ts + setArchiveDates.ts
  □ Test sign-in on new app with your personal account
  □ Test a coin purchase on new app (use Stripe test mode)
  □ Send user email: "Sachi upgrading [date], use Google sign-in"

Migration day:
  □ Put "Upgrading" banner on sachistream.com
  □ Set DRY_RUN=false, run migration script
  □ Run setArchiveDates.ts once on new app
  □ Verify record counts match preflight report
  □ Update Stripe webhook URL in Stripe dashboard
  □ Re-authorize Gmail OAuth connector in new app
  □ Test full flow end-to-end on new app (post video, like, comment, live)
  □ Update sachistream.com DNS / Vercel env vars to point to new app
  □ Remove "Upgrading" banner

72 hours post:
  □ Monitor error logs in new app
  □ Keep superagent active as fallback
  □ If all good → decommission old app functions (NOT entities — keep data)
```

---

## Q15. Is there anything in the migration script that's still wrong?

**Yes — one last thing.**

The migration script uses `GET /entities/{entityName}?limit=500&skip=0` to fetch records.

Base44's actual filter/list endpoint behavior may differ — some Base44 SDK versions return records wrapped in `{ records: [...], has_more: bool }` and others return a raw array. The `fetchAll()` function handles both, but the **count check in verification** uses `data.total` which may not exist.

**Safer verification approach:** After migration, manually spot-check 3-5 entities in the Base44 dashboard (new app → Data tab) and compare record counts visually. The script's verification is best-effort, not guaranteed accurate.

Also: The script doesn't handle **circular references** in SachiComment.replies (array field that can contain nested comment objects). If the frontend stores full comment objects in the `replies` array (not just IDs), those embedded IDs won't be remapped by pass 2. Inspect a few SachiComment records before migrating to see what's actually in that field.
