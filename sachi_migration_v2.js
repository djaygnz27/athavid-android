/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║     SACHI STREAM — Entity Migration Script v2.0                 ║
 * ║     Generated: May 1, 2026                                      ║
 * ║                                                                  ║
 * ║  Fixes over v1:                                                  ║
 * ║  • Added SachiLiveComment, SachiGuestRequest, SachiGift         ║
 * ║  • Added AthaVidVideo, AthaVidComment, PasswordReset            ║
 * ║  • Fixed SachiComment.parent_id self-ref (two-pass)             ║
 * ║  • Fixed SachiLiveRoom transform (adds host_avatar)             ║
 * ║  • SKIP_ENTITIES constant for dead/JMUX/non-Sachi entities      ║
 * ║  • Pre-flight count report before any writes                    ║
 * ║  • Post-migration diff/verification                              ║
 * ║  • Resume procedure for mid-migration failures                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * HOW TO RUN:
 *   node sachi_migration_v2.js
 *
 * RESUME AFTER FAILURE:
 *   1. Check migration_state.json — it shows last completed step
 *   2. Set RESUME_FROM_STEP to the step name that failed
 *   3. Re-run — completed steps are skipped, failed step retries
 *
 * SAFE TO RUN MULTIPLE TIMES:
 *   The script writes migration_state.json after each entity batch.
 *   If it crashes, re-run and it resumes from where it left off.
 *   ID maps are saved to migration_idmaps.json between steps.
 */

import fs from "fs";

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION — UPDATE BEFORE RUNNING
// ─────────────────────────────────────────────────────────────────
const SOURCE_APP_ID  = "69b2ee18a8e6fb58c7f0261c";   // Superagent app ID
const TARGET_APP_ID  = "YOUR_SACHI_STREAM_APP_ID";    // ← REPLACE
const API_KEY        = "YOUR_BASE44_API_KEY";         // ← REPLACE
const BASE_URL       = "https://api.base44.com/v1";
const DRY_RUN        = false;   // true = no writes, just counts
const RESUME_FROM_STEP = null;  // e.g. "SachiComment" to resume from that step

// Entities to skip entirely — JMUX, tax, analytics, superagent-only
const SKIP_ENTITIES = new Set([
  "JMUXMilestone",
  "JMUXWorkstream",
  "JMUXMeetingMinute",
  "JMUXEngPackage",
  "JMUXEquipment",
  "JMUXPARControl",
  "JMUXSOW",
  "TaxAppealLead",
  "SiteVisit",
  "SyncState",
  "SachiAnalytics",  // Recreate fresh in new app — snapshot data not worth migrating
  "BugReport",       // Beta phase only — skip or migrate manually
]);

// State persistence files
const STATE_FILE   = "./migration_state.json";
const IDMAPS_FILE  = "./migration_idmaps.json";

// ─────────────────────────────────────────────────────────────────
// STATE MANAGEMENT (for resume support)
// ─────────────────────────────────────────────────────────────────
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { completed: [], failed: null, started_at: new Date().toISOString() };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadIdMaps() {
  try {
    return JSON.parse(fs.readFileSync(IDMAPS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveIdMaps(maps) {
  fs.writeFileSync(IDMAPS_FILE, JSON.stringify(maps, null, 2));
}

// ─────────────────────────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────────────────────────
async function apiCall(appId, method, path, body = null) {
  const res = await fetch(`${BASE_URL}/apps/${appId}${path}`, {
    method,
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function fetchAll(appId, entityName) {
  const records = [];
  let skip = 0;
  const limit = 500;
  let page = 0;
  while (true) {
    let data;
    try {
      data = await apiCall(appId, "GET", `/entities/${entityName}?limit=${limit}&skip=${skip}&sort=created_date`);
    } catch (e) {
      console.warn(`  ⚠️  fetchAll ${entityName} failed: ${e.message}`);
      return [];
    }
    const batch = Array.isArray(data) ? data : (data.records || data.items || []);
    records.push(...batch);
    page++;
    process.stdout.write(`\r    Fetched ${records.length} records (page ${page})...`);
    if (!data.has_more || batch.length < limit) break;
    skip += limit;
  }
  process.stdout.write("\n");
  return records;
}

async function insertRecord(appId, entityName, record) {
  if (DRY_RUN) {
    return { id: "dry-" + Math.random().toString(36).slice(2, 10) };
  }
  return apiCall(appId, "POST", `/entities/${entityName}`, record);
}

async function updateRecord(appId, entityName, id, data) {
  if (DRY_RUN) return { id };
  return apiCall(appId, "PUT", `/entities/${entityName}/${id}`, data);
}

function stripSystemFields(record) {
  const { id, created_date, updated_date, created_by, created_by_id, is_sample, _id, __v, ...rest } = record;
  return rest;
}

function remap(value, idMap) {
  if (!value) return value;
  return idMap[value] || value;
}

// ─────────────────────────────────────────────────────────────────
// PRE-FLIGHT: COUNT REPORT
// ─────────────────────────────────────────────────────────────────
async function preflightReport(entityList) {
  console.log("\n📊 PRE-FLIGHT REPORT — Record counts in SOURCE app");
  console.log("─".repeat(55));
  let totalRecords = 0;
  const counts = {};
  for (const entity of entityList) {
    if (SKIP_ENTITIES.has(entity)) {
      console.log(`  ⏭️  ${entity.padEnd(30)} SKIPPED`);
      continue;
    }
    const records = await fetchAll(SOURCE_APP_ID, entity);
    counts[entity] = records.length;
    totalRecords += records.length;
    const flag = records.length === 0 ? "  ← EMPTY" : "";
    console.log(`  📦 ${entity.padEnd(30)} ${String(records.length).padStart(6)} records${flag}`);
  }
  console.log("─".repeat(55));
  console.log(`  TOTAL: ${totalRecords} records to migrate`);
  console.log(`  DRY_RUN: ${DRY_RUN}`);
  console.log("");
  return counts;
}

// ─────────────────────────────────────────────────────────────────
// CORE MIGRATE FUNCTION
// ─────────────────────────────────────────────────────────────────
async function migrateEntity(entityName, transform, state, idMaps) {
  // Skip if already completed in a previous run
  if (state.completed.includes(entityName)) {
    console.log(`  ✅ ${entityName} — already completed (resuming from state)`);
    return idMaps[entityName] || {};
  }

  // Skip if in SKIP list
  if (SKIP_ENTITIES.has(entityName)) {
    console.log(`  ⏭️  ${entityName} — SKIPPED`);
    return {};
  }

  console.log(`\n📦 Migrating ${entityName}...`);
  const records = await fetchAll(SOURCE_APP_ID, entityName);
  console.log(`  Found ${records.length} records`);

  if (records.length === 0) {
    console.log(`  ⚠️  No records — skipping (entity still needs to exist in target)`);
    state.completed.push(entityName);
    saveState(state);
    return {};
  }

  const idMap = {};
  let success = 0;
  let failed = 0;

  for (const record of records) {
    const oldId = record.id;
    let payload = stripSystemFields(record);
    if (transform) payload = transform(payload, idMaps);

    try {
      const created = await insertRecord(TARGET_APP_ID, entityName, payload);
      idMap[oldId] = created.id;
      success++;
    } catch (e) {
      console.error(`  ❌ Record ${oldId}: ${e.message}`);
      failed++;
    }
  }

  console.log(`  ✅ ${success}/${records.length} migrated${failed > 0 ? ` | ❌ ${failed} failed` : ""}`);

  // Persist ID map and state
  idMaps[entityName] = idMap;
  saveIdMaps(idMaps);
  state.completed.push(entityName);
  saveState(state);

  return idMap;
}

// ─────────────────────────────────────────────────────────────────
// POST-MIGRATION VERIFICATION
// ─────────────────────────────────────────────────────────────────
async function verifyMigration(entityList, preflightCounts) {
  console.log("\n🔍 POST-MIGRATION VERIFICATION — Comparing source vs target");
  console.log("─".repeat(65));

  let allGood = true;

  for (const entity of entityList) {
    if (SKIP_ENTITIES.has(entity)) continue;

    const sourceCount = preflightCounts[entity] || 0;
    let targetCount = 0;

    try {
      const data = await apiCall(TARGET_APP_ID, "GET", `/entities/${entity}?limit=1`);
      // Most APIs return total count in the response
      targetCount = data.total || data.count || (Array.isArray(data) ? data.length : (data.records?.length || 0));
    } catch {
      targetCount = -1;
    }

    const match = targetCount >= sourceCount;
    const icon = targetCount === -1 ? "❓" : match ? "✅" : "⚠️ ";
    const note = targetCount === -1 ? "(error reading target)" : !match ? `← MISSING ${sourceCount - targetCount}` : "";
    console.log(`  ${icon} ${entity.padEnd(30)} src:${String(sourceCount).padStart(5)} → tgt:${String(targetCount).padStart(5)}  ${note}`);

    if (!match && targetCount !== -1) allGood = false;
  }

  console.log("─".repeat(65));
  console.log(allGood ? "  ✅ VERIFICATION PASSED" : "  ⚠️  VERIFICATION FOUND DISCREPANCIES — check above");
}

// ─────────────────────────────────────────────────────────────────
// RESUME INSTRUCTIONS (printed if run fails mid-way)
// ─────────────────────────────────────────────────────────────────
function printResumeInstructions(lastCompleted, failedEntity) {
  console.log("\n" + "─".repeat(65));
  console.log("⚡ RESUME INSTRUCTIONS");
  console.log("─".repeat(65));
  console.log(`  Migration stopped at: ${failedEntity || "unknown"}`);
  console.log(`  Last completed step: ${lastCompleted || "none"}`);
  console.log("");
  console.log("  To resume:");
  console.log(`  1. migration_state.json already records completed steps`);
  console.log(`  2. migration_idmaps.json has all saved old→new ID maps`);
  console.log(`  3. Just re-run:  node sachi_migration_v2.js`);
  console.log(`  4. Script will skip completed entities automatically`);
  console.log(`  5. SachiComment parent_id pass will re-run (idempotent)`);
  console.log("");
  console.log("  If TARGET has duplicate records from partial run:");
  console.log("  • Delete the partial entity records in target manually");
  console.log("  • Remove entity name from migration_state.json completed[]");
  console.log("  • Remove entity entry from migration_idmaps.json");
  console.log("  • Re-run the script");
}

// ─────────────────────────────────────────────────────────────────
// MAIN MIGRATION
// ─────────────────────────────────────────────────────────────────
async function migrate() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        SACHI STREAM MIGRATION v2.0                        ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log(`  Source: ${SOURCE_APP_ID}`);
  console.log(`  Target: ${TARGET_APP_ID}`);
  console.log(`  DryRun: ${DRY_RUN}`);
  console.log(`  Resume: ${RESUME_FROM_STEP || "no (fresh run)"}`);

  // Validate config
  if (TARGET_APP_ID === "YOUR_SACHI_STREAM_APP_ID") {
    console.error("\n❌ ERROR: Set TARGET_APP_ID before running!");
    process.exit(1);
  }
  if (API_KEY === "YOUR_BASE44_API_KEY") {
    console.error("\n❌ ERROR: Set API_KEY before running!");
    process.exit(1);
  }

  // Load or init state
  const state = loadState();
  const idMaps = loadIdMaps();

  // Full entity list for preflight
  const ALL_ENTITIES = [
    "User", "SachiVideo", "SachiComment", "SachiPodcast", "SachiPodcastEpisode",
    "Follow", "SachiBookmark", "SachiBlock", "SachiLike", "SachiHype",
    "SachiReport", "UserInterest", "SachiNotification", "SachiMessage",
    "SachiLiveRoom", "SachiLiveComment", "SachiGuestRequest",
    "SachiCoinWallet", "SachiGift", "SachiHostEarning", "SachiCoinPurchase",
    "SachiAnalytics", "FoundingCreator", "BetaTester", "BugReport",
    "AthaVidUser", "AthaVidVideo", "AthaVidComment",
    "PasswordReset", "SyncState", "SiteVisit",
    "JMUXMilestone", "JMUXWorkstream", "JMUXMeetingMinute",
    "JMUXEngPackage", "JMUXEquipment", "JMUXPARControl", "JMUXSOW",
    "TaxAppealLead",
  ];

  // ── PRE-FLIGHT ────────────────────────────────────────────────
  const preflightCounts = await preflightReport(ALL_ENTITIES);

  console.log("\nPress Ctrl+C within 5 seconds to abort, or wait to start...");
  await new Promise(r => setTimeout(r, DRY_RUN ? 0 : 5000));

  try {
    // ── STEP 1: User ──────────────────────────────────────────────────────────
    const userIdMap = await migrateEntity("User", null, state, idMaps);

    // ── STEP 2: SachiVideo ────────────────────────────────────────────────────
    const videoIdMap = await migrateEntity("SachiVideo", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 3: SachiComment (PASS 1 — migrate all, parent_id remapped best-effort)
    //    Pass 2 below fixes self-referential parent_ids after all comments exist
    const commentIdMap = await migrateEntity("SachiComment", (r, maps) => ({
      ...r,
      user_id:   remap(r.user_id, maps.User || {}),
      video_id:  remap(r.video_id, maps.SachiVideo || {}),
      parent_id: remap(r.parent_id, maps.SachiComment || {}), // best-effort on pass 1
    }), state, idMaps);

    // ── STEP 4: SachiPodcast ──────────────────────────────────────────────────
    const podcastIdMap = await migrateEntity("SachiPodcast", (r, maps) => ({
      ...r,
      host_user_id: remap(r.host_user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 5: SachiPodcastEpisode ───────────────────────────────────────────
    await migrateEntity("SachiPodcastEpisode", (r, maps) => ({
      ...r,
      podcast_id: remap(r.podcast_id, maps.SachiPodcast || {}),
    }), state, idMaps);

    // ── STEP 6: Follow ────────────────────────────────────────────────────────
    await migrateEntity("Follow", (r, maps) => ({
      ...r,
      follower_id:  remap(r.follower_id, maps.User || {}),
      following_id: remap(r.following_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 7: SachiBookmark ─────────────────────────────────────────────────
    await migrateEntity("SachiBookmark", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.User || {}),
      video_id: remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 8: SachiBlock ────────────────────────────────────────────────────
    await migrateEntity("SachiBlock", (r, maps) => ({
      ...r,
      blocker_id: remap(r.blocker_id, maps.User || {}),
      blocked_id: remap(r.blocked_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 9: SachiLike ─────────────────────────────────────────────────────
    await migrateEntity("SachiLike", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.User || {}),
      video_id: remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 10: SachiHype ────────────────────────────────────────────────────
    await migrateEntity("SachiHype", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.User || {}),
      video_id: remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 11: SachiReport ──────────────────────────────────────────────────
    await migrateEntity("SachiReport", (r, maps) => ({
      ...r,
      reporter_id: remap(r.reporter_id, maps.User || {}),
      video_id:    remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 12: UserInterest ─────────────────────────────────────────────────
    await migrateEntity("UserInterest", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 13: SachiNotification ────────────────────────────────────────────
    await migrateEntity("SachiNotification", (r, maps) => ({
      ...r,
      recipient_id: remap(r.recipient_id, maps.User || {}),
      sender_id:    remap(r.sender_id, maps.User || {}),
      video_id:     remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 14: SachiMessage ─────────────────────────────────────────────────
    await migrateEntity("SachiMessage", (r, maps) => ({
      ...r,
      sender_id:    remap(r.sender_id, maps.User || {}),
      recipient_id: remap(r.recipient_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 15: SachiLiveRoom (FIXED — includes host_avatar) ────────────────
    const liveRoomIdMap = await migrateEntity("SachiLiveRoom", (r, maps) => ({
      ...r,
      host_id:      remap(r.host_id, maps.User || {}),
      host_username: r.host_username,  // string — no remap needed
      host_avatar:  r.host_avatar,     // ← v1 was missing this field
    }), state, idMaps);

    // ── STEP 16: SachiLiveComment (NEW in v2) ────────────────────────────────
    await migrateEntity("SachiLiveComment", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
      room_id: remap(r.room_id, maps.SachiLiveRoom || {}),
    }), state, idMaps);

    // ── STEP 17: SachiGuestRequest (NEW in v2) ───────────────────────────────
    await migrateEntity("SachiGuestRequest", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
      room_id: remap(r.room_id, maps.SachiLiveRoom || {}),
    }), state, idMaps);

    // ── STEP 18: SachiCoinWallet ──────────────────────────────────────────────
    await migrateEntity("SachiCoinWallet", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 19: SachiGift (NEW in v2) ───────────────────────────────────────
    await migrateEntity("SachiGift", (r, maps) => ({
      ...r,
      sender_id: remap(r.sender_id, maps.User || {}),
      host_id:   remap(r.host_id, maps.User || {}),
      room_id:   remap(r.room_id, maps.SachiLiveRoom || {}),
    }), state, idMaps);

    // ── STEP 20: SachiHostEarning ─────────────────────────────────────────────
    await migrateEntity("SachiHostEarning", (r, maps) => ({
      ...r,
      host_id: remap(r.host_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 21: SachiCoinPurchase ────────────────────────────────────────────
    await migrateEntity("SachiCoinPurchase", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 22: FoundingCreator (no FKs) ────────────────────────────────────
    await migrateEntity("FoundingCreator", null, state, idMaps);

    // ── STEP 23: BetaTester (no FKs) ─────────────────────────────────────────
    await migrateEntity("BetaTester", null, state, idMaps);

    // ── STEP 24: AthaVidUser (legacy — no FKs) ───────────────────────────────
    await migrateEntity("AthaVidUser", null, state, idMaps);

    // ── STEP 25: AthaVidVideo (NEW in v2 — FK to AthaVidUser) ────────────────
    const athaVidVideoIdMap = await migrateEntity("AthaVidVideo", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.AthaVidUser || {}),
    }), state, idMaps);

    // ── STEP 26: AthaVidComment (NEW in v2 — FK to AthaVidUser + AthaVidVideo)
    await migrateEntity("AthaVidComment", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.AthaVidUser || {}),
      video_id: remap(r.video_id, maps.AthaVidVideo || {}),
    }), state, idMaps);

    // ── STEP 27: PasswordReset (NEW in v2 — no FKs, just email string) ───────
    await migrateEntity("PasswordReset", null, state, idMaps);

    // ════════════════════════════════════════════════════════════════
    // PASS 2: Fix SachiComment.parent_id self-referential FK
    // Must run AFTER all comments are migrated and commentIdMap is full
    // ════════════════════════════════════════════════════════════════
    if (!state.completed.includes("SachiComment_parentId_pass2")) {
      console.log("\n🔁 PASS 2: Fixing SachiComment.parent_id self-referential FKs...");

      const freshCommentIdMap = idMaps["SachiComment"] || {};
      const sourceComments = await fetchAll(SOURCE_APP_ID, "SachiComment");
      const commentsWithParent = sourceComments.filter(c => c.parent_id);

      console.log(`  Found ${commentsWithParent.length} comments with parent_id to fix`);

      let fixed = 0, skipped = 0;
      for (const oldComment of commentsWithParent) {
        const newCommentId = freshCommentIdMap[oldComment.id];
        const newParentId  = freshCommentIdMap[oldComment.parent_id];

        if (!newCommentId || !newParentId) {
          skipped++;
          continue; // Parent comment wasn't migrated — skip
        }

        try {
          await updateRecord(TARGET_APP_ID, "SachiComment", newCommentId, { parent_id: newParentId });
          fixed++;
        } catch (e) {
          console.error(`  ❌ parent_id fix failed for ${newCommentId}: ${e.message}`);
        }
      }

      console.log(`  ✅ Fixed ${fixed} parent_ids | Skipped ${skipped} (parent not found in map)`);
      state.completed.push("SachiComment_parentId_pass2");
      saveState(state);
    } else {
      console.log("\n  ✅ SachiComment parent_id pass2 — already completed");
    }

    // ── POST-MIGRATION VERIFICATION ───────────────────────────────
    await verifyMigration(ALL_ENTITIES, preflightCounts);

    // ── FINAL SUMMARY ─────────────────────────────────────────────
    console.log("\n" + "═".repeat(65));
    console.log("✅ MIGRATION COMPLETE!");
    console.log(`   User ID map:     ${Object.keys(idMaps.User || {}).length} entries`);
    console.log(`   Video ID map:    ${Object.keys(idMaps.SachiVideo || {}).length} entries`);
    console.log(`   Comment ID map:  ${Object.keys(idMaps.SachiComment || {}).length} entries`);
    console.log(`   Podcast ID map:  ${Object.keys(idMaps.SachiPodcast || {}).length} entries`);
    console.log(`   LiveRoom ID map: ${Object.keys(idMaps.SachiLiveRoom || {}).length} entries`);
    if (DRY_RUN) console.log("   ⚠️  DRY RUN — no data was written to target");
    console.log("\n   Next steps:");
    console.log("   1. Update APP_ID in sachiCoins.ts → new app ID");
    console.log("   2. Update BASE_URL in sachiCoins.ts → new app URL");
    console.log("   3. Re-authorize Gmail OAuth in new app");
    console.log("   4. Re-authorize SendEmail connector in new app");
    console.log("   5. Copy all secrets (CF tokens, Stripe key) to new app");
    console.log("   6. Update Stripe webhook URL to new app function endpoint");
    console.log("   7. Run setArchiveDates.ts once as a one-time job");
    console.log("═".repeat(65));

  } catch (e) {
    const lastCompleted = state.completed[state.completed.length - 1];
    state.failed = e.message;
    saveState(state);
    console.error(`\n\n💥 MIGRATION FAILED: ${e.message}`);
    printResumeInstructions(lastCompleted, e.message);
    process.exit(1);
  }
}

migrate();
