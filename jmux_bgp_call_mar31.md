# JMUX BGP Bridge Call — Meeting Notes
**Date:** Tuesday, March 31, 2026 | **Time:** ~10:00 AM EDT
**Attendees:** Jay (PM), Lee (Nokia SA/BGP), Nick (Engineering), Bill, Ethan, Brianna, Raheek, Renito, Vinny (partial)

---

## ✅ COMPLETED — Confirmed on Call

| Item | Status |
|---|---|
| Hicksville wiring & SP installation | ✅ COMPLETE |
| All drops ready | ✅ COMPLETE |
| NSP cabled up & ready to go online | ✅ CONFIRMED (Ethan & team verified) |
| Nokia BOM — all materials received per order | ✅ COMPLETE (Vinny reviewed) |
| Melville ILO procedure | ✅ COMPLETE (last week) |
| BGP peer review (Daniel Hasib) | ✅ APPROVED — ready to execute |

---

## 🚨 BGP CUTOVER — TOMORROW Wed April 1, 2026

| Detail | Info |
|---|---|
| Start site | **Melville FIRST** |
| Second site | **Hicksville** (same day if Melville goes smoothly) |
| Bridge opens | **10:15 AM** (Jay to open) |
| On-site time | **10:00 AM** — Raheek or Brianna on site at Melville |
| Remote lead | **Lee** — pre-staging all changes on corporate side TODAY |
| Approach | Plug in → bring up Nokia side simultaneously |
| Estimated time | ~30 min per site if no issues |
| Both sites same day? | **YES — possible** (one change covers both) |
| Backup plan | If issues at Melville, Hicksville pushed to Thursday |

---

## 📋 ACTION ITEMS

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Pre-stage BGP changes on corporate side | **Lee** | Today Mar 31 |
| 2 | Open bridge at 10:15 AM | **Jay** | Tomorrow Apr 1 |
| 3 | Be on site at Melville by 10:00 AM | **Raheek / Brianna** | Tomorrow Apr 1 |
| 4 | Execute BGP cutover — Melville then Hicksville | **Lee + team** | Tomorrow Apr 1 |
| 5 | After BGP — verify NSP access to all routers | **Lee / Jay** | Post-BGP Apr 1 |
| 6 | Schedule NSP configuration session (screen share) | **Jay + Lee/Brijesh/Brianna** | This week |
| 7 | Upload IFRs & IFCs for Green Acres, Barry Schuch, Kings Hwy, Bohemia | **Nick** | Today Mar 31 |
| 8 | Review schedule to expedite Sterling, Whiteside, Hewlett IFRs | **Nick** | This week |
| 9 | Follow up on Nokia training dates from Glenn & trainer | **Jay** | Awaiting response |

---

## 🔄 CRITICAL PATH — Next 2 Weeks

```
TODAY (Mar 31)     → Lee pre-stages BGP | Nick uploads IFRs/IFCs
TOMORROW (Apr 1)   → BGP Cutover: Melville 10AM → Hicksville (if smooth)
POST-BGP           → Verify router access via NSP ✅
NEXT STEP          → NSP configuration session (screen share with Lee/Brijesh/Brianna)
POST-NSP           → Configure all 31 Phase 1 nodes remotely
PHASE 2 PREP       → Vinny reviews IFRs → SOW + cost analysis
```

---

## ⚠️ NOTES
- NSP access is currently ILO only — full NSP access comes AFTER BGP + NSP config
- NSP documentation is complex — multiple interlinked docs, not straightforward
- Phase 2 SOW & cost estimate from Vinny is blocked on receiving all IFRs/IFCs
- Jay pushing Nick to expedite IFRs to unblock Vinny's Phase 2 cost analysis

