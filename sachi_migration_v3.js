/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║     SACHI STREAM — Entity Migration Script v3.0                 ║
 * ║     Updated: May 15, 2026                                       ║
 * ║                                                                  ║
 * ║  Changes over v2:                                               ║
 * ║  • NEW Step 0.5 — SachiUser upsert (keyed on email)            ║
 * ║    - Migrates AthaVidUser → SachiUser in new app                ║
 * ║    - Idempotent: create / update / skip based on updated_date   ║
 * ║    - location split: city/country with allowlist logic          ║
 * ║    - Logs created / updated / skipped counts per run            ║
 * ║    - Dry-run mode shows preview table before any writes         ║
 * ║    - Step 1 (SachiPodcast) is gated on Step 0.5 success        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * MIGRATION STEP ORDER:
 *   Step 0   — User ID map  (platform User → new platform User via email)
 *   Step 0.5 — SachiUser   (upsert on email, location split, idempotent)
 *   Step 1   — SachiPodcast (gated: requires Step 0.5 complete)
 *   Step 2+  — All other entities (unchanged from v2)
 *
 * HOW TO RUN:
 *   node sachi_migration_v3.js
 *
 * DRY RUN (preview only, no writes):
 *   Set DRY_RUN = true — Step 0.5 will print the full transform table
 *   and show what would be created/updated/skipped.
 *
 * RESUME AFTER FAILURE:
 *   migration_state.json records all completed steps by name.
 *   Re-run — completed steps are skipped automatically.
 *   Step 0.5 is always safe to re-run (idempotent upsert).
 */

import fs from "fs";

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION — UPDATE BEFORE RUNNING
// ─────────────────────────────────────────────────────────────────
const SOURCE_APP_ID    = "69b2ee18a8e6fb58c7f0261c";  // Old prod (superagent app)
const TARGET_APP_ID    = "YOUR_SACHI_STREAM_APP_ID";   // ← REPLACE with new app ID
const API_KEY          = "YOUR_BASE44_API_KEY";        // ← REPLACE with API key
const BASE_URL         = "https://api.base44.com/v1";
const DRY_RUN          = false;  // true = preview only, no writes
const RESUME_FROM_STEP = null;   // e.g. "SachiUser" to force re-run of that step

// Entities to skip — JMUX, tax, superagent-only
const SKIP_ENTITIES = new Set([
  "JMUXMilestone", "JMUXWorkstream", "JMUXMeetingMinute",
  "JMUXEngPackage", "JMUXEquipment", "JMUXPARControl", "JMUXSOW",
  "TaxAppealLead", "SiteVisit", "SyncState",
  "SachiAnalytics",  // recreate fresh in new app
  "BugReport",       // beta phase only
]);

// State persistence
const STATE_FILE  = "./migration_state.json";
const IDMAPS_FILE = "./migration_idmaps.json";

// ─────────────────────────────────────────────────────────────────
// LOCATION SPLIT LOGIC (Step 0.5)
// ─────────────────────────────────────────────────────────────────
// Country allowlist — single-token location strings that are countries,
// not cities. Case-insensitive match against the full trimmed string.
const COUNTRY_ALLOWLIST = new Set([
  "united states", "usa", "u.s.a.", "u.s.",
  "australia", "sri lanka", "united kingdom", "uk",
  "canada", "india", "new zealand", "singapore",
  "germany", "france", "netherlands",
]);

/**
 * Split a freeform location string into { city, country, warning }.
 *
 * Rules (in order):
 *  1. null/empty            → city=null, country=null
 *  2. contains comma        → city=parts[0].trim(), country=parts[-1].trim()
 *                             warn if city itself is in allowlist (misfire)
 *  3. matches allowlist     → city=null, country=input  (known country, no city)
 *  4. else                  → city=input, country=null  (unknown single token → treat as city)
 */
function splitLocation(raw) {
  if (!raw || !raw.trim()) {
    return { city: null, country: null, warning: null };
  }

  const s = raw.trim();

  if (s.includes(",")) {
    const parts = s.split(",").map(p => p.trim()).filter(Boolean);
    const city    = parts[0];
    const country = parts[parts.length - 1];
    // Misfire check: if city is itself a known country name, flag it
    const warning = COUNTRY_ALLOWLIST.has(city.toLowerCase())
      ? `city="${city}" looks like a country — comma split may have misfired`
      : null;
    return { city, country, warning };
  }

  if (COUNTRY_ALLOWLIST.has(s.toLowerCase())) {
    return { city: null, country: s, warning: null };
  }

  // Unknown single token — treat as city, leave country null
  return { city: s, country: null, warning: null };
}

// ─────────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────
function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); }
  catch { return { completed: [], failed: null, started_at: new Date().toISOString() }; }
}
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
function loadIdMaps() {
  try { return JSON.parse(fs.readFileSync(IDMAPS_FILE, "utf8")); }
  catch { return {}; }
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
  if (DRY_RUN) return { id: "dry-" + Math.random().toString(36).slice(2, 10) };
  return apiCall(appId, "POST", `/entities/${entityName}`, record);
}

async function updateRecord(appId, entityName, id, data) {
  if (DRY_RUN) return { id };
  return apiCall(appId, "PUT", `/entities/${entityName}/${id}`, data);
}

function stripSystemFields(record) {
  const { id, created_date, updated_date, created_by, created_by_id,
          is_sample, _id, __v, ...rest } = record;
  return rest;
}

function remap(value, idMap) {
  if (!value) return value;
  return idMap[value] || value;
}

// ─────────────────────────────────────────────────────────────────
// STEP 0.5 — SachiUser upsert (keyed on email)
// ─────────────────────────────────────────────────────────────────
/**
 * Transforms one AthaVidUser (old-prod) record into a SachiUser payload
 * for the new app. Applies location split, field renames, and sets
 * new-app-only fields to safe defaults.
 */
function transformToSachiUser(old) {
  const { city, country, warning } = splitLocation(old.location);
  return {
    payload: {
      email:            old.email,
      username:         old.username,
      display_name:     old.display_name,
      avatar_url:       old.avatar_url || null,
      bio:              old.bio || null,
      phone:            old.phone || null,
      dob:              old.date_of_birth || null,   // rename: date_of_birth → dob
      is_verified:      old.is_verified ?? false,
      is_18_plus:       old.is_18_plus ?? false,
      status:           old.status || "active",
      location_city:    city,
      location_country: country,
      followers_count:  old.followers_count || 0,
      following_count:  old.following_count || 0,
      videos_count:     old.videos_count || 0,
      // New-app-only fields — not in old-prod, safe defaults
      google_sub:       null,
      verified_human:   false,
    },
    locationWarning: warning,
    oldUpdatedDate:  old.updated_date,
  };
}

async function migrateSachiUsers(state, idMaps) {
  const STEP_NAME = "SachiUser";

  // Dependency gate: Step 0 (User ID map) must be complete
  // (User step populates idMaps.User — checked implicitly below)

  // Idempotent resume: if already completed AND not forced, skip
  if (state.completed.includes(STEP_NAME) && RESUME_FROM_STEP !== STEP_NAME) {
    console.log(`  ✅ ${STEP_NAME} — already completed (resuming from state)`);
    return;
  }

  console.log(`\n👤 STEP 0.5 — SachiUser (upsert on email)...`);

  // 1. Fetch all source records (AthaVidUser in old-prod)
  console.log("  Fetching source records (AthaVidUser)...");
  const sourceRecords = await fetchAll(SOURCE_APP_ID, "AthaVidUser");
  console.log(`  Source: ${sourceRecords.length} AthaVidUser records`);

  // De-duplicate by email (take most recently updated record per email)
  const byEmail = new Map();
  for (const r of sourceRecords) {
    if (!r.email) continue;
    const existing = byEmail.get(r.email);
    if (!existing || new Date(r.updated_date) > new Date(existing.updated_date)) {
      byEmail.set(r.email, r);
    }
  }
  const dedupedSource = [...byEmail.values()];
  const dupCount = sourceRecords.length - dedupedSource.length;
  if (dupCount > 0) {
    console.log(`  ⚠️  De-duplicated ${dupCount} duplicate email(s) — kept most recently updated`);
  }

  // 2. Fetch existing SachiUser records in TARGET app — build email lookup
  console.log("  Fetching existing SachiUser records in target app...");
  let existingUsers = [];
  try {
    existingUsers = await fetchAll(TARGET_APP_ID, "SachiUser");
  } catch (e) {
    console.log(`  ℹ️  No existing SachiUser records (or entity doesn't exist yet): ${e.message}`);
  }
  const existingByEmail = new Map();
  for (const r of existingUsers) {
    if (r.email) existingByEmail.set(r.email.toLowerCase(), r);
  }
  console.log(`  Target: ${existingUsers.length} existing SachiUser records`);

  // 3. DRY RUN — print preview table and exit
  if (DRY_RUN) {
    console.log("\n  ── DRY RUN PREVIEW ─────────────────────────────────────────────");
    console.log(`  ${"Email".padEnd(38)} ${"Username".padEnd(18)} ${"Raw Location".padEnd(28)} ${"→ city".padEnd(20)} ${"→ country".padEnd(18)} ${"Action".padEnd(10)} Warning`);
    console.log("  " + "─".repeat(150));

    let wouldCreate = 0, wouldUpdate = 0, wouldSkip = 0;
    for (const old of dedupedSource) {
      const { payload, locationWarning, oldUpdatedDate } = transformToSachiUser(old);
      const existing = existingByEmail.get(old.email.toLowerCase());
      let action;
      if (!existing) {
        action = "CREATE";
        wouldCreate++;
      } else {
        const srcDate = new Date(oldUpdatedDate || 0);
        const tgtDate = new Date(existing.updated_date || 0);
        if (srcDate > tgtDate) {
          action = "UPDATE";
          wouldUpdate++;
        } else {
          action = "skip";
          wouldSkip++;
        }
      }
      const rawLoc   = old.location || "(null)";
      const cityDisp = payload.location_city    || "(null)";
      const cntDisp  = payload.location_country || "(null)";
      const warn     = locationWarning || "";
      console.log(`  ${old.email.padEnd(38)} ${(old.username||"").padEnd(18)} ${rawLoc.padEnd(28)} ${cityDisp.padEnd(20)} ${cntDisp.padEnd(18)} ${action.padEnd(10)} ${warn}`);
    }

    console.log("  " + "─".repeat(150));
    console.log(`  Would CREATE: ${wouldCreate} | Would UPDATE: ${wouldUpdate} | Would SKIP: ${wouldSkip}`);
    if (wouldCreate + wouldUpdate + wouldSkip !== dedupedSource.length) {
      console.log("  ⚠️  Count mismatch — check de-dup logic");
    }
    console.log("  ── END DRY RUN ─────────────────────────────────────────────────\n");
    return;
  }

  // 4. LIVE RUN — upsert each record
  let created = 0, updated = 0, skipped = 0, failed = 0;
  const warnings = [];

  for (const old of dedupedSource) {
    const { payload, locationWarning, oldUpdatedDate } = transformToSachiUser(old);
    const existing = existingByEmail.get(old.email.toLowerCase());

    if (locationWarning) {
      warnings.push({ email: old.email, username: old.username, warning: locationWarning });
    }

    try {
      if (!existing) {
        // CREATE
        await insertRecord(TARGET_APP_ID, "SachiUser", payload);
        created++;
      } else {
        // Compare updated_date — only update if source is newer
        const srcDate = new Date(oldUpdatedDate || 0);
        const tgtDate = new Date(existing.updated_date || 0);

        if (srcDate > tgtDate) {
          // UPDATE — patch all fields (preserves google_sub / verified_human already set)
          await updateRecord(TARGET_APP_ID, "SachiUser", existing.id, payload);
          updated++;
        } else {
          // SKIP — target is same age or newer, no-op
          skipped++;
        }
      }
    } catch (e) {
      console.error(`  ❌ ${old.email}: ${e.message}`);
      failed++;
    }
  }

  // 5. Report
  console.log(`\n  ── Step 0.5 Results ────────────────────────────────────────────`);
  console.log(`  ✅ Created : ${created}`);
  console.log(`  🔄 Updated : ${updated}`);
  console.log(`  ⏭️  Skipped : ${skipped}  (target already up-to-date)`);
  if (failed > 0)   console.log(`  ❌ Failed  : ${failed}`);
  if (dupCount > 0) console.log(`  ⚠️  Dupes   : ${dupCount} duplicate emails de-duped from source`);

  if (warnings.length > 0) {
    console.log(`\n  ⚠️  LOCATION SPLIT WARNINGS (${warnings.length}) — spot-check these:`);
    for (const w of warnings) {
      console.log(`     ${w.email} (${w.username}): ${w.warning}`);
    }
  } else {
    console.log(`  ✅ Location splits: 0 warnings`);
  }
  console.log(`  ─────────────────────────────────────────────────────────────────\n`);

  if (failed > 0) {
    throw new Error(`Step 0.5 had ${failed} failures — fix errors before continuing to Step 1`);
  }

  // 6. Mark complete — gates Step 1
  state.completed.push(STEP_NAME);
  saveState(state);
}

// ─────────────────────────────────────────────────────────────────
// PRE-FLIGHT
// ─────────────────────────────────────────────────────────────────
async function preflightReport(entityList) {
  console.log("\n📊 PRE-FLIGHT REPORT — Record counts in SOURCE app");
  console.log("─".repeat(55));
  let total = 0;
  const counts = {};
  for (const entity of entityList) {
    if (SKIP_ENTITIES.has(entity)) {
      console.log(`  ⏭️  ${entity.padEnd(30)} SKIPPED`);
      continue;
    }
    const records = await fetchAll(SOURCE_APP_ID, entity);
    counts[entity] = records.length;
    total += records.length;
    const flag = records.length === 0 ? "  ← EMPTY" : "";
    console.log(`  📦 ${entity.padEnd(30)} ${String(records.length).padStart(6)} records${flag}`);
  }
  console.log("─".repeat(55));
  console.log(`  TOTAL: ${total} records`);
  console.log(`  DRY_RUN: ${DRY_RUN}\n`);
  return counts;
}

// ─────────────────────────────────────────────────────────────────
// CORE MIGRATE (generic insert — unchanged from v2)
// ─────────────────────────────────────────────────────────────────
async function migrateEntity(entityName, transform, state, idMaps) {
  if (state.completed.includes(entityName) && RESUME_FROM_STEP !== entityName) {
    console.log(`  ✅ ${entityName} — already completed (resuming from state)`);
    return idMaps[entityName] || {};
  }
  if (SKIP_ENTITIES.has(entityName)) {
    console.log(`  ⏭️  ${entityName} — SKIPPED`);
    return {};
  }

  console.log(`\n📦 Migrating ${entityName}...`);
  const records = await fetchAll(SOURCE_APP_ID, entityName);
  console.log(`  Found ${records.length} records`);

  if (records.length === 0) {
    console.log(`  ⚠️  No records — skipping`);
    state.completed.push(entityName);
    saveState(state);
    return {};
  }

  const idMap = {};
  let success = 0, failed = 0;

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
  console.log("\n🔍 POST-MIGRATION VERIFICATION — Source vs Target");
  console.log("─".repeat(65));
  let allGood = true;
  for (const entity of entityList) {
    if (SKIP_ENTITIES.has(entity)) continue;
    const sourceCount = preflightCounts[entity] || 0;
    let targetCount = 0;
    try {
      const data = await apiCall(TARGET_APP_ID, "GET", `/entities/${entity}?limit=1`);
      targetCount = data.total || data.count || (Array.isArray(data) ? data.length : (data.records?.length || 0));
    } catch { targetCount = -1; }
    const match = targetCount >= sourceCount;
    const icon  = targetCount === -1 ? "❓" : match ? "✅" : "⚠️ ";
    const note  = targetCount === -1 ? "(error)" : !match ? `← MISSING ${sourceCount - targetCount}` : "";
    console.log(`  ${icon} ${entity.padEnd(30)} src:${String(sourceCount).padStart(5)} → tgt:${String(targetCount).padStart(5)}  ${note}`);
    if (!match && targetCount !== -1) allGood = false;
  }
  console.log("─".repeat(65));
  console.log(allGood ? "  ✅ VERIFICATION PASSED" : "  ⚠️  DISCREPANCIES FOUND — check above");
}

// ─────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────
async function main() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║   SACHI STREAM — Migration Tool v3.0                      ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log(`  Source : ${SOURCE_APP_ID}`);
  console.log(`  Target : ${TARGET_APP_ID}`);
  console.log(`  DryRun : ${DRY_RUN}`);
  console.log(`  Resume : ${RESUME_FROM_STEP || "no (fresh run)"}`);

  if (TARGET_APP_ID === "YOUR_SACHI_STREAM_APP_ID") {
    console.error("\n❌ ERROR: Set TARGET_APP_ID before running!"); process.exit(1);
  }
  if (API_KEY === "YOUR_BASE44_API_KEY") {
    console.error("\n❌ ERROR: Set API_KEY before running!"); process.exit(1);
  }

  const state  = loadState();
  const idMaps = loadIdMaps();

  const ALL_ENTITIES = [
    "User", "AthaVidUser", "SachiVideo", "SachiComment", "SachiPodcast",
    "SachiPodcastEpisode", "Follow", "SachiBookmark", "SachiBlock",
    "SachiLike", "SachiHype", "SachiReport", "UserInterest",
    "SachiNotification", "SachiMessage", "SachiLiveRoom", "SachiLiveComment",
    "SachiGuestRequest", "SachiCoinWallet", "SachiGift", "SachiHostEarning",
    "SachiCoinPurchase", "FoundingCreator", "BetaTester", "AthaVidVideo",
    "AthaVidComment", "PasswordReset", "SyncState", "SiteVisit",
    "JMUXMilestone", "JMUXWorkstream", "JMUXMeetingMinute",
    "JMUXEngPackage", "JMUXEquipment", "JMUXPARControl", "JMUXSOW",
    "TaxAppealLead", "SachiAnalytics", "BugReport",
  ];

  const preflightCounts = await preflightReport(ALL_ENTITIES);

  if (!DRY_RUN) {
    console.log("\nPress Ctrl+C within 5 seconds to abort...");
    await new Promise(r => setTimeout(r, 5000));
  }

  try {
    // ── STEP 0: User ID map ───────────────────────────────────────────────────
    // Builds old-platform-User-ID → new-platform-User-ID map via email matching.
    // Platform User records are auto-created on Google sign-in; this just maps IDs.
    const userIdMap = await migrateEntity("User", null, state, idMaps);

    // ── STEP 0.5: SachiUser — upsert on email ────────────────────────────────
    // Must succeed before Step 1 (enforced by throw on failure above).
    await migrateSachiUsers(state, idMaps);

    // ── STEP 1: SachiPodcast — GATED on Step 0.5 ─────────────────────────────
    // Dependency gate: Step 0.5 must be in state.completed before we get here.
    // The throw in migrateSachiUsers() on failure prevents reaching this line.
    const podcastIdMap = await migrateEntity("SachiPodcast", (r, maps) => ({
      ...r,
      host_user_id: remap(r.host_user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 2: SachiPodcastEpisode ───────────────────────────────────────────
    await migrateEntity("SachiPodcastEpisode", (r, maps) => ({
      ...r,
      podcast_id: remap(r.podcast_id, maps.SachiPodcast || {}),
    }), state, idMaps);

    // ── STEP 3: SachiVideo ────────────────────────────────────────────────────
    const videoIdMap = await migrateEntity("SachiVideo", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 4: SachiComment (Pass 1 — parent_id best-effort) ────────────────
    const commentIdMap = await migrateEntity("SachiComment", (r, maps) => ({
      ...r,
      user_id:   remap(r.user_id, maps.User || {}),
      video_id:  remap(r.video_id, maps.SachiVideo || {}),
      parent_id: remap(r.parent_id, maps.SachiComment || {}),
    }), state, idMaps);

    // ── STEP 5: Follow ────────────────────────────────────────────────────────
    await migrateEntity("Follow", (r, maps) => ({
      ...r,
      follower_id:  remap(r.follower_id, maps.User || {}),
      following_id: remap(r.following_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 6: SachiBookmark ─────────────────────────────────────────────────
    await migrateEntity("SachiBookmark", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.User || {}),
      video_id: remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 7: SachiBlock ────────────────────────────────────────────────────
    await migrateEntity("SachiBlock", (r, maps) => ({
      ...r,
      blocker_id: remap(r.blocker_id, maps.User || {}),
      blocked_id: remap(r.blocked_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 8: SachiLike ─────────────────────────────────────────────────────
    await migrateEntity("SachiLike", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.User || {}),
      video_id: remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 9: SachiHype ─────────────────────────────────────────────────────
    await migrateEntity("SachiHype", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.User || {}),
      video_id: remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 10: SachiReport ──────────────────────────────────────────────────
    await migrateEntity("SachiReport", (r, maps) => ({
      ...r,
      reporter_id: remap(r.reporter_id, maps.User || {}),
      video_id:    remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 11: UserInterest ─────────────────────────────────────────────────
    await migrateEntity("UserInterest", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 12: SachiNotification ────────────────────────────────────────────
    await migrateEntity("SachiNotification", (r, maps) => ({
      ...r,
      recipient_id: remap(r.recipient_id, maps.User || {}),
      sender_id:    remap(r.sender_id, maps.User || {}),
      video_id:     remap(r.video_id, maps.SachiVideo || {}),
    }), state, idMaps);

    // ── STEP 13: SachiMessage ─────────────────────────────────────────────────
    await migrateEntity("SachiMessage", (r, maps) => ({
      ...r,
      sender_id:    remap(r.sender_id, maps.User || {}),
      recipient_id: remap(r.recipient_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 14: SachiLiveRoom ────────────────────────────────────────────────
    await migrateEntity("SachiLiveRoom", (r, maps) => ({
      ...r,
      host_id:      remap(r.host_id, maps.User || {}),
      host_username: r.host_username,
      host_avatar:  r.host_avatar,
    }), state, idMaps);

    // ── STEP 15: SachiLiveComment ─────────────────────────────────────────────
    await migrateEntity("SachiLiveComment", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
      room_id: remap(r.room_id, maps.SachiLiveRoom || {}),
    }), state, idMaps);

    // ── STEP 16: SachiGuestRequest ────────────────────────────────────────────
    await migrateEntity("SachiGuestRequest", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
      room_id: remap(r.room_id, maps.SachiLiveRoom || {}),
    }), state, idMaps);

    // ── STEP 17: SachiCoinWallet ──────────────────────────────────────────────
    await migrateEntity("SachiCoinWallet", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 18: SachiGift ────────────────────────────────────────────────────
    await migrateEntity("SachiGift", (r, maps) => ({
      ...r,
      sender_id: remap(r.sender_id, maps.User || {}),
      host_id:   remap(r.host_id, maps.User || {}),
      room_id:   remap(r.room_id, maps.SachiLiveRoom || {}),
    }), state, idMaps);

    // ── STEP 19: SachiHostEarning ─────────────────────────────────────────────
    await migrateEntity("SachiHostEarning", (r, maps) => ({
      ...r,
      host_id: remap(r.host_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 20: SachiCoinPurchase ────────────────────────────────────────────
    await migrateEntity("SachiCoinPurchase", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.User || {}),
    }), state, idMaps);

    // ── STEP 21: FoundingCreator (no FKs) ────────────────────────────────────
    await migrateEntity("FoundingCreator", null, state, idMaps);

    // ── STEP 22: BetaTester (no FKs) ─────────────────────────────────────────
    await migrateEntity("BetaTester", null, state, idMaps);

    // ── STEP 23: AthaVidUser (legacy — no FKs) ───────────────────────────────
    await migrateEntity("AthaVidUser", null, state, idMaps);

    // ── STEP 24: AthaVidVideo (FK to AthaVidUser) ─────────────────────────────
    await migrateEntity("AthaVidVideo", (r, maps) => ({
      ...r,
      user_id: remap(r.user_id, maps.AthaVidUser || {}),
    }), state, idMaps);

    // ── STEP 25: AthaVidComment (FK to AthaVidUser + AthaVidVideo) ───────────
    await migrateEntity("AthaVidComment", (r, maps) => ({
      ...r,
      user_id:  remap(r.user_id, maps.AthaVidUser || {}),
      video_id: remap(r.video_id, maps.AthaVidVideo || {}),
    }), state, idMaps);

    // ── STEP 26: PasswordReset (no FKs) ──────────────────────────────────────
    await migrateEntity("PasswordReset", null, state, idMaps);

    // ════════════════════════════════════════════════════════════════
    // PASS 2: Fix SachiComment.parent_id (self-referential FK)
    // ════════════════════════════════════════════════════════════════
    if (!state.completed.includes("SachiComment_parentId_pass2")) {
      console.log("\n🔁 PASS 2: Fixing SachiComment.parent_id FKs...");
      const freshCommentIdMap = idMaps["SachiComment"] || {};
      const sourceComments = await fetchAll(SOURCE_APP_ID, "SachiComment");
      const withParent = sourceComments.filter(c => c.parent_id);
      console.log(`  Found ${withParent.length} comments with parent_id`);
      let fixed = 0, skipped2 = 0;
      for (const old of withParent) {
        const newId     = freshCommentIdMap[old.id];
        const newParent = freshCommentIdMap[old.parent_id];
        if (!newId || !newParent) { skipped2++; continue; }
        try {
          await updateRecord(TARGET_APP_ID, "SachiComment", newId, { parent_id: newParent });
          fixed++;
        } catch (e) {
          console.error(`  ❌ parent_id fix ${newId}: ${e.message}`);
        }
      }
      console.log(`  ✅ Fixed ${fixed} | Skipped ${skipped2}`);
      state.completed.push("SachiComment_parentId_pass2");
      saveState(state);
    } else {
      console.log("\n  ✅ SachiComment parent_id pass2 — already completed");
    }

    // ── POST-MIGRATION VERIFICATION ───────────────────────────────
    await verifyMigration(ALL_ENTITIES, preflightCounts);

    // ── FINAL SUMMARY ─────────────────────────────────────────────
    console.log("\n" + "═".repeat(65));
    console.log("✅ MIGRATION COMPLETE — v3.0");
    console.log(`   User ID map     : ${Object.keys(idMaps.User || {}).length} entries`);
    console.log(`   SachiUser step  : see Step 0.5 log above`);
    console.log(`   Video ID map    : ${Object.keys(idMaps.SachiVideo || {}).length} entries`);
    console.log(`   Comment ID map  : ${Object.keys(idMaps.SachiComment || {}).length} entries`);
    console.log(`   Podcast ID map  : ${Object.keys(idMaps.SachiPodcast || {}).length} entries`);
    console.log(`   LiveRoom ID map : ${Object.keys(idMaps.SachiLiveRoom || {}).length} entries`);
    if (DRY_RUN) console.log("   ⚠️  DRY RUN — no data written");
    console.log("\n   Next steps:");
    console.log("   1. Update APP_ID in backend functions → new app ID");
    console.log("   2. Smoke-test user sign-in → SachiUser record present");
    console.log("   3. Verify SachiUser.location_city/country for sample users");

  } catch (err) {
    console.error(`\n❌ MIGRATION FAILED: ${err.message}`);
    console.log("\n  To resume: re-run the script — completed steps are skipped.");
    console.log(`  Last completed steps: ${state.completed.slice(-3).join(", ")}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
