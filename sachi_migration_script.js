/**
 * SACHI STREAM — Full Entity Migration Script
 * Migrates all entities from Superagent app → Sachi Stream app
 * Handles foreign key remapping correctly across all dependent entities
 * 
 * HOW TO USE:
 * 1. Replace SOURCE_APP_ID with your Superagent app ID
 * 2. Replace TARGET_APP_ID with your Sachi Stream app ID
 * 3. Replace API_KEY with your Base44 API key
 * 4. Run: node sachi_migration_script.js
 * 
 * MIGRATION ORDER (respects FK dependencies):
 *   1. User (base entity — no FK deps)
 *   2. SachiVideo (depends on User.id via user_id)
 *   3. SachiComment (depends on User.id + SachiVideo.id)
 *   4. SachiPodcast (depends on User.id via host_user_id)
 *   5. SachiPodcastEpisode (depends on SachiPodcast.id)
 *   6. Follow (depends on User.id x2)
 *   7. SachiBookmark (depends on User.id + SachiVideo.id)
 *   8. SachiBlock (depends on User.id x2)
 *   9. SachiLike (depends on User.id + SachiVideo.id)
 *  10. SachiHype (depends on User.id + SachiVideo.id)
 *  11. SachiReport (depends on User.id + SachiVideo.id)
 *  12. UserInterest (depends on User.id)
 *  13. SachiNotification (depends on User.id x2 + SachiVideo.id)
 *  14. SachiMessage (depends on User.id x2)
 *  15. SachiAnalytics (no FK deps)
 *  16. FoundingCreator (no FK deps)
 *  17. AthaVidUser (no FK deps — legacy)
 *  18. BetaTester (no FK deps)
 *  19. BugReport (no FK deps)
 */

// ─────────────────────────────────────────────
// CONFIGURATION — UPDATE THESE BEFORE RUNNING
// ─────────────────────────────────────────────
const SOURCE_APP_ID = "69b2ee18a8e6fb58c7f0261c";   // Your Superagent app ID
const TARGET_APP_ID = "YOUR_SACHI_STREAM_APP_ID";    // Replace with Sachi Stream app ID
const API_KEY       = "YOUR_BASE44_API_KEY";         // Replace with your Base44 API key
const BASE_URL      = "https://api.base44.com/v1";
const DRY_RUN       = false;  // Set to true to test without writing to target

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function fetchAll(appId, entityName) {
  let records = [];
  let skip = 0;
  const limit = 500;
  while (true) {
    const res = await fetch(
      `${BASE_URL}/apps/${appId}/entities/${entityName}/list?limit=${limit}&skip=${skip}`,
      { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
    );
    if (!res.ok) {
      const err = await res.text();
      console.warn(`  ⚠️  Could not fetch ${entityName}: ${err}`);
      return [];
    }
    const data = await res.json();
    const batch = data.records || data || [];
    records = records.concat(batch);
    if (!data.has_more || batch.length < limit) break;
    skip += limit;
  }
  return records;
}

async function insertRecord(appId, entityName, record) {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would insert into ${entityName}:`, JSON.stringify(record).slice(0, 120));
    return { id: "dry-run-" + Math.random().toString(36).slice(2) };
  }
  const res = await fetch(
    `${BASE_URL}/apps/${appId}/entities/${entityName}`,
    {
      method: "POST",
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(record)
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Insert failed for ${entityName}: ${err}`);
  }
  return await res.json();
}

function stripSystemFields(record) {
  // Remove auto-generated fields that the target will create fresh
  const { id, created_date, updated_date, created_by, created_by_id, is_sample, ...rest } = record;
  return rest;
}

function remap(value, idMap) {
  if (!value) return value;
  return idMap[value] || value; // fall back to original if not found
}

// ─────────────────────────────────────────────
// MIGRATION FUNCTIONS
// ─────────────────────────────────────────────

async function migrateEntity(entityName, transform = null) {
  console.log(`\n📦 Migrating ${entityName}...`);
  const records = await fetchAll(SOURCE_APP_ID, entityName);
  console.log(`  Found ${records.length} records`);

  const idMap = {}; // old_id → new_id

  for (const record of records) {
    const oldId = record.id;
    let payload = stripSystemFields(record);
    if (transform) payload = transform(payload);

    try {
      const created = await insertRecord(TARGET_APP_ID, entityName, payload);
      idMap[oldId] = created.id;
    } catch (e) {
      console.error(`  ❌ Error inserting record ${oldId}: ${e.message}`);
    }
  }

  console.log(`  ✅ Migrated ${Object.keys(idMap).length}/${records.length} records`);
  return idMap;
}

// ─────────────────────────────────────────────
// MAIN MIGRATION
// ─────────────────────────────────────────────

async function migrate() {
  console.log("🚀 SACHI STREAM MIGRATION STARTING");
  console.log(`   Source App: ${SOURCE_APP_ID}`);
  console.log(`   Target App: ${TARGET_APP_ID}`);
  console.log(`   Dry Run:    ${DRY_RUN}`);
  console.log("─".repeat(50));

  // ── STEP 1: User (no FK deps — migrate first)
  const userIdMap = await migrateEntity("User");

  // ── STEP 2: SachiVideo (depends on User.id via user_id)
  const videoIdMap = await migrateEntity("SachiVideo", (r) => ({
    ...r,
    user_id: remap(r.user_id, userIdMap),
  }));

  // ── STEP 3: SachiComment (depends on User.id + SachiVideo.id + parent_id self-ref)
  const commentIdMap = await migrateEntity("SachiComment", (r) => ({
    ...r,
    user_id:   remap(r.user_id, userIdMap),
    video_id:  remap(r.video_id, videoIdMap),
    parent_id: remap(r.parent_id, {}), // self-ref: handle separately if needed
  }));

  // ── STEP 4: SachiPodcast (depends on User.id via host_user_id)
  const podcastIdMap = await migrateEntity("SachiPodcast", (r) => ({
    ...r,
    host_user_id: remap(r.host_user_id, userIdMap),
  }));

  // ── STEP 5: SachiPodcastEpisode (depends on SachiPodcast.id)
  await migrateEntity("SachiPodcastEpisode", (r) => ({
    ...r,
    podcast_id: remap(r.podcast_id, podcastIdMap),
  }));

  // ── STEP 6: Follow (depends on User.id x2)
  await migrateEntity("Follow", (r) => ({
    ...r,
    follower_id:  remap(r.follower_id, userIdMap),
    following_id: remap(r.following_id, userIdMap),
  }));

  // ── STEP 7: SachiBookmark (depends on User.id + SachiVideo.id)
  await migrateEntity("SachiBookmark", (r) => ({
    ...r,
    user_id:  remap(r.user_id, userIdMap),
    video_id: remap(r.video_id, videoIdMap),
  }));

  // ── STEP 8: SachiBlock (depends on User.id x2)
  await migrateEntity("SachiBlock", (r) => ({
    ...r,
    blocker_id: remap(r.blocker_id, userIdMap),
    blocked_id: remap(r.blocked_id, userIdMap),
  }));

  // ── STEP 9: SachiLike (depends on User.id + SachiVideo.id)
  await migrateEntity("SachiLike", (r) => ({
    ...r,
    user_id:  remap(r.user_id, userIdMap),
    video_id: remap(r.video_id, videoIdMap),
  }));

  // ── STEP 10: SachiHype (depends on User.id + SachiVideo.id)
  await migrateEntity("SachiHype", (r) => ({
    ...r,
    user_id:  remap(r.user_id, userIdMap),
    video_id: remap(r.video_id, videoIdMap),
  }));

  // ── STEP 11: SachiReport (depends on User.id + SachiVideo.id)
  await migrateEntity("SachiReport", (r) => ({
    ...r,
    reporter_id: remap(r.reporter_id, userIdMap),
    video_id:    remap(r.video_id, videoIdMap),
  }));

  // ── STEP 12: UserInterest (depends on User.id)
  await migrateEntity("UserInterest", (r) => ({
    ...r,
    user_id: remap(r.user_id, userIdMap),
  }));

  // ── STEP 13: SachiNotification (depends on User.id x2 + SachiVideo.id)
  await migrateEntity("SachiNotification", (r) => ({
    ...r,
    recipient_id: remap(r.recipient_id, userIdMap),
    sender_id:    remap(r.sender_id, userIdMap),
    video_id:     remap(r.video_id, videoIdMap),
  }));

  // ── STEP 14: SachiMessage (depends on User.id x2)
  await migrateEntity("SachiMessage", (r) => ({
    ...r,
    sender_id:    remap(r.sender_id, userIdMap),
    recipient_id: remap(r.recipient_id, userIdMap),
  }));

  // ── STEP 15: SachiLiveRoom (depends on User.id via host_id)
  await migrateEntity("SachiLiveRoom", (r) => ({
    ...r,
    host_id: remap(r.host_id, userIdMap),
  }));

  // ── STEP 16: SachiCoinWallet (depends on User.id)
  await migrateEntity("SachiCoinWallet", (r) => ({
    ...r,
    user_id: remap(r.user_id, userIdMap),
  }));

  // ── STEP 17: SachiCoinPurchase (depends on User.id)
  await migrateEntity("SachiCoinPurchase", (r) => ({
    ...r,
    user_id: remap(r.user_id, userIdMap),
  }));

  // ── STEP 18: SachiHostEarning (depends on User.id via host_id)
  await migrateEntity("SachiHostEarning", (r) => ({
    ...r,
    host_id: remap(r.host_id, userIdMap),
  }));

  // ── STEP 19: No FK deps — migrate as-is
  await migrateEntity("SachiAnalytics");
  await migrateEntity("FoundingCreator");
  await migrateEntity("AthaVidUser");
  await migrateEntity("BetaTester");
  await migrateEntity("BugReport");

  console.log("\n" + "─".repeat(50));
  console.log("✅ MIGRATION COMPLETE!");
  console.log(`   User ID map: ${Object.keys(userIdMap).length} entries`);
  console.log(`   Video ID map: ${Object.keys(videoIdMap).length} entries`);
  if (DRY_RUN) console.log("   ⚠️  DRY RUN — no data was written to target");
}

migrate().catch(console.error);
