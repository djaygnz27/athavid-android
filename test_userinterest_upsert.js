/**
 * Idempotency test — UserInterest external_id upsert
 * Tests: INSERT → re-run (SKIP, no diff) → mutate score → re-run (UPDATE)
 * Cleans up after itself. Does NOT touch real migration data.
 */

const APP_ID  = "69b2ee18a8e6fb58c7f0261c";  // current app (has UserInterest + external_id)
const API_KEY = process.env.BASE44_API_KEY;

if (!API_KEY) { console.error("❌ Set BASE44_API_KEY env var"); process.exit(1); }

async function apiCall(method, path, body = null) {
  const opts = {
    method,
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.base44.com/v1/apps/${APP_ID}${path}`, opts);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${res.status} ${t}`);
  }
  return res.json();
}

async function fetchByExtId(extId) {
  const res = await apiCall("GET", `/entities/UserInterest?external_id=${extId}&limit=5`);
  const records = Array.isArray(res) ? res : (res?.items || res?.records || []);
  return records.filter(r => r.external_id === extId);
}

async function upsert(payload) {
  const existing = await fetchByExtId(payload.external_id);
  if (existing.length === 0) {
    const created = await apiCall("POST", `/entities/UserInterest`, payload);
    return { action: "CREATE", id: created.id };
  }
  const hit = existing[0];
  const diff =
    hit.score        !== payload.score        ||
    hit.hashtag      !== payload.hashtag      ||
    hit.last_updated !== payload.last_updated ||
    hit.user_id      !== payload.user_id;
  if (diff) {
    await apiCall("PUT", `/entities/UserInterest/${hit.id}`, payload);
    return { action: "UPDATE", id: hit.id };
  }
  return { action: "SKIP", id: hit.id };
}

async function deleteRecord(id) {
  await apiCall("DELETE", `/entities/UserInterest/${id}`);
}

async function run() {
  console.log("=".repeat(55));
  console.log("  UserInterest — Idempotency Test");
  console.log("=".repeat(55));

  const TEST_EXT_ID = `TEST_IDEM_${Date.now()}`;
  const base = {
    external_id:  TEST_EXT_ID,
    user_id:      "test-user-001",
    hashtag:      "cricket",
    score:        10,
    last_updated: new Date().toISOString(),
  };

  let recordId;

  // ── Pass 1: INSERT ────────────────────────────────────────
  console.log("\n[Pass 1] First run — expect CREATE");
  const r1 = await upsert(base);
  recordId = r1.id;
  console.log(`  → Action : ${r1.action}  (expected: CREATE)`);
  console.log(`  → ID     : ${r1.id}`);
  if (r1.action !== "CREATE") { console.error("  ❌ FAIL"); process.exit(1); }
  console.log("  ✅ PASS");

  // ── Pass 2: SKIP (identical payload) ─────────────────────
  console.log("\n[Pass 2] Identical re-run — expect SKIP");
  const r2 = await upsert(base);
  console.log(`  → Action : ${r2.action}  (expected: SKIP)`);
  console.log(`  → ID     : ${r2.id}  (same as Pass 1: ${r2.id === recordId})`);
  if (r2.action !== "SKIP") { console.error("  ❌ FAIL"); process.exit(1); }
  console.log("  ✅ PASS");

  // ── Pass 3: UPDATE (score changed) ───────────────────────
  console.log("\n[Pass 3] Score changed — expect UPDATE");
  const mutated = { ...base, score: 42 };
  const r3 = await upsert(mutated);
  console.log(`  → Action : ${r3.action}  (expected: UPDATE)`);
  console.log(`  → ID     : ${r3.id}  (same as Pass 1: ${r3.id === recordId})`);
  if (r3.action !== "UPDATE") { console.error("  ❌ FAIL"); process.exit(1); }
  console.log("  ✅ PASS");

  // ── Pass 4: SKIP again (score now matches) ───────────────
  console.log("\n[Pass 4] Re-run with updated payload — expect SKIP");
  const r4 = await upsert(mutated);
  console.log(`  → Action : ${r4.action}  (expected: SKIP)`);
  if (r4.action !== "SKIP") { console.error("  ❌ FAIL"); process.exit(1); }
  console.log("  ✅ PASS");

  // ── Cleanup ───────────────────────────────────────────────
  console.log("\n[Cleanup] Deleting test record...");
  await deleteRecord(recordId);
  const check = await fetchByExtId(TEST_EXT_ID);
  console.log(`  → Records remaining with ext_id: ${check.length}  (expected: 0)`);
  if (check.length !== 0) { console.error("  ❌ Cleanup FAIL"); process.exit(1); }
  console.log("  ✅ Deleted cleanly");

  console.log("\n" + "=".repeat(55));
  console.log("  ALL PASSES: CREATE → SKIP → UPDATE → SKIP ✅");
  console.log("  UserInterest Step 11 is safe for Pass 1.");
  console.log("=".repeat(55));
}

run().catch(e => { console.error("❌ Unexpected error:", e.message); process.exit(1); });
