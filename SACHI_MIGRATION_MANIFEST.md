# SACHI STREAM — Function Migration Manifest
# Generated: May 1, 2026
# Total functions: 58
# Classification: ACTIVE (migrate) | LEGACY (investigate) | DEAD (skip)

---

## ✅ ACTIVE — Migrate These (14 functions)

### 1. `getPublicFeed.ts`
- **Purpose:** Returns paginated public SachiVideo feed
- **Reads:** SachiVideo
- **Writes:** None
- **External:** None
- **Env vars:** None (uses createClientFromRequest)
- **Notes:** Simple, clean. Limit default 200. No hashtag filter in prod.

### 2. `cfStreamUpload.ts`
- **Purpose:** Mints Cloudflare Stream direct upload URL for authenticated users
- **Reads:** User (auth check)
- **Writes:** None (returns upload URL to client)
- **External:** Cloudflare Stream API
- **Env vars:** `CF_ACCOUNT_ID`, `CF_STREAM_API_TOKEN`, `CF_STREAM_MAX_SECONDS`
- **Hardcoded:** allowedOrigins includes sachistream.com, base44.app, localhost
- **Notes:** Auth-required by design. DO NOT make optional — mints paid CF resources.

### 3. `createLiveStream.ts`
- **Purpose:** Creates Cloudflare Stream RTMP live input for podcast host, saves to SachiPodcast
- **Reads:** None
- **Writes:** SachiPodcast (stream_key, cf_input_id, rtmp_url, live_stream_url)
- **External:** Cloudflare Stream API
- **Env vars:** `CLOUDFLARE_API_TOKEN`
- **Hardcoded:** CF_ACCOUNT = `a346b1c78fc48549d2de3de99a789a2d`, customer stream URL prefix
- **Notes:** Writes to SachiPodcast NOT SachiLiveRoom. Template was WRONG.

### 4. `sachiLive.ts`
- **Purpose:** Cloudflare Calls SFU proxy — WebRTC for Sachi LIVE guest system
- **Reads:** None
- **Writes:** None (proxy only)
- **External:** Cloudflare Calls API
- **Env vars:** `CLOUDFLARE_API_TOKEN`, `CF_CALLS_APP_ID`
- **Hardcoded:** CF_ACCOUNT = `a346b1c78fc48549d2de3de99a789a2d`
- **Actions:** new_session, push_tracks, pull_tracks, renegotiate, get_app_id, list_apps
- **Notes:** Not in template at all. Critical for LIVE feature.

### 5. `sachiCoins.ts`
- **Purpose:** Stripe checkout for coin purchases + gift sending logic
- **Reads:** SachiCoinWallet, SachiHostEarning
- **Writes:** SachiCoinWallet, SachiCoinPurchase, SachiGift, SachiHostEarning
- **External:** Stripe API
- **Env vars:** `STRIPE_SECRET_KEY`
- **Hardcoded:** 
  - APP_ID: `69b2ee18a8e6fb58c7f0261c` ← MUST update to new app ID
  - BASE_URL: `https://sachi-c7f0261c.base44.app/api` ← MUST update
  - Stripe price IDs: p100=`price_1TKVSjKB9bqKOOJ0Njg8IwVw`, p500=`price_1TKVSkKB9bqKOOJ02I2vMaHF`, p1200=`price_1TKVSlKB9bqKOOJ0DultXMlu`, p3500=`price_1TKVSlKB9bqKOOJ0Ew1CcIQ7`, p10000=`price_1TKVSmKB9bqKOOJ0fOjNzyQy`
  - Host cut: **50%** (template said 80% — template was WRONG)
- **Coin packages:** 100/$0.99, 500/$3.99, 1200/$7.99, 3500/$19.99, 10000/$49.99
- **Notes:** Stripe price IDs are already created — reuse same Stripe account. Only update APP_ID + BASE_URL.

### 6. `podcastGoLiveNotify.ts`
- **Purpose:** Emails all Sachi users when a podcast goes live
- **Reads:** User (email list)
- **Writes:** None
- **External:** Base44 SendEmail integration
- **Env vars:** None (uses createClientFromRequest)
- **Hardcoded:** Fallback email list of 12 beta tester emails
- **Notes:** Fallback list includes personal emails — update or remove before production scale.

### 7. `setPodcastLive.ts`
- **Purpose:** Admin toggle for podcast is_live status
- **Reads:** None
- **Writes:** SachiPodcast (is_live, listener_count)
- **External:** None
- **Env vars:** None
- **Hardcoded:** Admin emails: `jaygnz27@gmail.com`, `lasanjaya@gmail.com`
- **Notes:** Simple admin guard. Works as-is.

### 8. `getAdminStats.ts`
- **Purpose:** Returns platform analytics — users, videos, comments, daily trends, top creators
- **Reads:** AthaVidUser, SachiVideo, SachiComment
- **Writes:** None
- **External:** None
- **Env vars:** None
- **Notes:** Reads AthaVidUser for user counts (legacy). In Sachi Stream app, change to User entity.

### 9. `passwordReset.ts`
- **Purpose:** OTP-based password reset via Gmail — request code + reset password
- **Reads:** User, PasswordReset
- **Writes:** PasswordReset (create/delete)
- **External:** Gmail API (send OTP email)
- **Env vars:** `BASE44_APP_ID`, `BASE44_SERVICE_TOKEN`, Gmail connector (via base44.asServiceRole.connectors.getConnection)
- **Notes:** Uses Base44 connector pattern for Gmail. Requires Gmail OAuth re-auth in new app.

### 10. `uploadAvatar.ts`
- **Purpose:** Uploads avatar image to Base44 public storage, returns URL
- **Reads:** None
- **Writes:** Storage (public)
- **External:** Base44 Storage
- **Env vars:** None
- **Notes:** Active — called from profile edit flow.

### 11. `athaVidUpload.ts`
- **Purpose:** Dual function — GET returns SachiVideo feed, POST uploads file to storage
- **Reads:** SachiVideo
- **Writes:** Storage (public)
- **External:** Base44 Storage
- **Env vars:** None
- **Notes:** Confusingly named "athaVid" but writes to SachiVideo. ACTIVE for Sachi.

### 12. `setArchiveDates.ts`
- **Purpose:** One-time backfill — sets archive_date on SachiVideos missing it (created_date + 60 days)
- **Reads:** SachiVideo
- **Writes:** SachiVideo (archive_date)
- **External:** None
- **Env vars:** `BASE44_APP_ID`, `BASE44_SERVICE_TOKEN`
- **Notes:** One-time utility. Run once after migration, then can retire.

### 13. `sendFollowNotification.ts`
- **Purpose:** Sends email to all followers when a creator posts a new video
- **Reads:** Follow, AthaVidUser
- **Writes:** None
- **External:** Base44 email API
- **Env vars:** `BASE44_API_KEY`
- **Notes:** Reads AthaVidUser for emails — change to User entity in Sachi Stream app.

### 14. `athaVidPasswordReset.ts`
- **Purpose:** Legacy OTP password reset — AthaVid-branded, uses Gmail directly
- **Reads:** User, PasswordReset
- **Writes:** PasswordReset
- **External:** Gmail API
- **Env vars:** `GMAIL_ACCESS_TOKEN`, `BASE44_API_KEY`
- **Notes:** SUPERSEDED by passwordReset.ts (newer, cleaner version). Can skip migration — use passwordReset.ts instead.

---

## ⚠️ LEGACY — Investigate Before Migrating (5 functions)

### 15. `athaVidApi.ts`
- **Purpose:** CRUD API for AthaVidVideo + AthaVidComment
- **Reads:** AthaVidVideo, AthaVidComment
- **Writes:** AthaVidVideo, AthaVidComment
- **Notes:** AthaVid legacy entities. If app fully migrates to SachiVideo, this is dead. Investigate if any client still calls it.

### 16. `uploadAthaVid.ts`
- **Purpose:** File upload to Base44 storage — old AthaVid version
- **Reads:** None
- **Writes:** Storage
- **Notes:** Duplicate of athaVidUpload.ts / uploadAvatar.ts. Likely dead — verify no client calls it.

### 17. `uploadAthaVidVideo.ts`
- **Purpose:** Video file upload — AthaVid version
- **Reads:** None
- **Writes:** Storage
- **Notes:** Likely superseded by cfStreamUpload.ts. Verify no client calls.

### 18. `checkPlayStoreVerification.ts`
- **Purpose:** Polls Gmail for Google Play developer account approval email
- **Reads:** Gmail (via access token)
- **Writes:** None
- **External:** Gmail API
- **Notes:** One-time use automation. Google Play account approved April 2026. RETIRE.

### 19. `createVideo.ts`
- **Purpose:** Creates AthaVidVideo record
- **Hardcoded:** App ID `69bafc2c944948084350efb0` (DIFFERENT app — old AthaVid app)
- **Notes:** Points to a completely different app. DEAD for Sachi migration.

---

## 🗑️ DEAD CODE — Skip Migration (39 functions)

All JMUX, Gmail monitoring, and broadcast/notify functions are superagent-specific workflows — they have no place in the Sachi Stream app.

| Function | Reason Dead |
|----------|-------------|
| `broadcastCioPresentation.ts` | JMUX CIO presentation one-off |
| `broadcastJayaMessage.ts` | Personal broadcast utility |
| `broadcastJmuxAlert.ts` | JMUX project alert |
| `broadcastJmuxCheckMar24.ts` | JMUX one-off Mar 24 |
| `broadcastJmuxGmailAlert.ts` | JMUX Gmail alert |
| `broadcastJmuxGmailNotificationMar25.ts` | JMUX one-off Mar 25 |
| `broadcastJmuxMar25.ts` | JMUX one-off Mar 25 |
| `broadcastJmuxUpdate.ts` | JMUX one-off |
| `broadcastMessage.ts` | Generic broadcast utility |
| `debugJmux.ts` | Debug only |
| `debugJmux2.ts` | Debug only |
| `directBroadcast.ts` | Generic broadcast |
| `gmailAlertNotify.ts` | Gmail monitoring |
| `gmailAutomationNotify.ts` | Gmail monitoring |
| `gmailHistoryFetch.ts` | Gmail monitoring |
| `gmailMonitorAlert.ts` | Gmail monitoring |
| `gmailMonitoringAlert.ts` | Gmail monitoring |
| `gmailNotify.ts` | Gmail monitoring |
| `gmailWebhook.ts` | Gmail monitoring |
| `gmail_project_monitor_task.ts` | Gmail monitoring |
| `jmuxAlertBroadcast.ts` | JMUX alert |
| `jmuxAutomationNotify.ts` | JMUX automation |
| `jmuxOnePageAlert.ts` | JMUX one-off |
| `jmuxStatusMar25_1151.ts` | JMUX one-off |
| `jmuxStatusNotificationMar25.ts` | JMUX one-off |
| `jmuxUpdateMar24.ts` | JMUX one-off |
| `notifyJaya.ts` | Personal notification |
| `notifyJayaSimplified.ts` | Personal notification |
| `notifyUser.ts` | Generic notification |
| `sendAutomationMessage.ts` | Automation utility |
| `sendGmailMonitorNotification.ts` | Gmail monitor |
| `sendJmuxGmailCheckMar25.ts` | JMUX one-off |
| `sendJmuxNotification.ts` | JMUX notification |
| `sendJmuxStatusMar25.ts` | JMUX one-off |
| `sendJmuxUpdate.ts` | JMUX one-off |
| `sendJmuxWhatsAppNotification.ts` | JMUX WhatsApp |
| `sendWhatsApp.ts` | WhatsApp utility |
| `saveVideo.ts` | Writes to AthaVidVideo — legacy |
| `uploadVideo.ts` | Returns base64 data URL — superseded by cfStreamUpload |

---

## 🔑 CREDENTIALS AUDIT

### Cloudflare
| Credential | Value | Reusable in Sachi Stream? |
|------------|-------|--------------------------|
| Account ID | `a346b1c78fc48549d2de3de99a789a2d` | ✅ YES — same CF account |
| Stream API Token | env: `CF_STREAM_API_TOKEN` / `CLOUDFLARE_API_TOKEN` | ✅ YES — copy secret to new app |
| Calls App ID | env: `CF_CALLS_APP_ID` | ✅ YES — copy secret |
| Customer stream URL prefix | `customer-i1ij9522l179kiqc.cloudflarestream.com` | ✅ YES — same account |

### Stripe
| Credential | Value | Reusable in Sachi Stream? |
|------------|-------|--------------------------|
| Secret key | env: `STRIPE_SECRET_KEY` | ✅ YES — same Stripe account |
| Price ID p100 | `price_1TKVSjKB9bqKOOJ0Njg8IwVw` | ✅ YES — already created |
| Price ID p500 | `price_1TKVSkKB9bqKOOJ02I2vMaHF` | ✅ YES — already created |
| Price ID p1200 | `price_1TKVSlKB9bqKOOJ0DultXMlu` | ✅ YES — already created |
| Price ID p3500 | `price_1TKVSlKB9bqKOOJ0Ew1CcIQ7` | ✅ YES — already created |
| Price ID p10000 | `price_1TKVSmKB9bqKOOJ0fOjNzyQy` | ✅ YES — already created |
| Webhook | Pointed at superagent URL | ⚠️ UPDATE — new app needs new webhook URL |
| Success/cancel URL | `https://sachi-c7f0261c.base44.app/...` | ⚠️ UPDATE — hardcoded in sachiCoins.ts |

### Gmail / Email
| Credential | Value | Reusable in Sachi Stream? |
|------------|-------|--------------------------|
| Gmail OAuth | Connected via Base44 connector | ⚠️ RE-AUTH — OAuth must be re-authorized in new app |
| SendEmail integration | Base44 Core integration | ⚠️ RE-AUTH — re-connect in new app |

### Base44
| Credential | Value | Reusable in Sachi Stream? |
|------------|-------|--------------------------|
| APP_ID | `69b2ee18a8e6fb58c7f0261c` | ❌ UPDATE — hardcoded in sachiCoins.ts, passwordReset.ts, setArchiveDates.ts |
| BASE_URL | `https://sachi-c7f0261c.base44.app/api` | ❌ UPDATE — new app gets new URL |
| BASE44_API_KEY | env secret | ⚠️ CHECK — may differ per app |
| BASE44_SERVICE_TOKEN | env secret | ⚠️ CHECK — app-specific token |

---

## 🗃️ ENTITY DEAD/UNUSED AUDIT

### ✅ ACTIVE — Migrate
SachiVideo, SachiComment, Follow, SachiPodcast, SachiPodcastEpisode,
SachiBookmark, SachiBlock, SachiLike, SachiHype, SachiReport,
UserInterest, SachiNotification, SachiMessage, SachiLiveRoom,
SachiLiveComment, SachiGuestRequest, SachiCoinWallet, SachiGift,
SachiHostEarning, SachiCoinPurchase, FoundingCreator, PasswordReset

### ⚠️ LEGACY — Check before migrating
| Entity | Issue |
|--------|-------|
| `AthaVidUser` | Legacy user table — if all users now in User entity, may be empty/dead |
| `AthaVidVideo` | Legacy video table — if all content in SachiVideo, may be empty |
| `AthaVidComment` | Legacy comment table — same as above |
| `BetaTester` | Beta tracking only — migrate if still tracking beta users |

### 🗑️ DEAD — Skip
| Entity | Reason |
|--------|--------|
| `SyncState` | Gmail webhook history tracking — superagent only |
| `TaxAppealLead` | LDNA tax appeal business — wrong app entirely |
| `SiteVisit` | Superagent analytics — not Sachi |
| `SachiAnalytics` | Snapshot records — recreate fresh in new app |
| `BugReport` | Beta-phase only — can skip or recreate fresh |

---

## ✅ MIGRATION CHECKLIST

### Before running migration script:
- [ ] Get Sachi Stream app ID → update TARGET_APP_ID in script
- [ ] Get Base44 API key for new app → update API_KEY in script
- [ ] Set DRY_RUN=true, run once, verify counts

### After migration:
- [ ] Update APP_ID in sachiCoins.ts → new Sachi Stream app ID
- [ ] Update BASE_URL in sachiCoins.ts → new app URL
- [ ] Re-authorize Gmail OAuth connector in new app
- [ ] Re-authorize Base44 SendEmail in new app
- [ ] Copy Stripe secret key to new app secrets
- [ ] Copy CF_ACCOUNT_ID, CF_STREAM_API_TOKEN, CF_CALLS_APP_ID to new app secrets
- [ ] Update Stripe webhook URL to new app function endpoint
- [ ] Run setArchiveDates.ts once as a one-time job
- [ ] Remove hardcoded beta email list from podcastGoLiveNotify.ts

### Functions to bring: 13 (drop athaVidPasswordReset.ts — use passwordReset.ts)
### Entities to migrate: 22 active + 4 legacy to verify
### Credentials to re-provision: Gmail OAuth, SendEmail, Stripe webhook URL, Base44 APP_ID/BASE_URL
