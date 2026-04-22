# PRJ13797 JMUX Replacement — CIO Status Update
**Date:** April 22, 2026
**Prepared by:** Dhananjaya Gunaratne, Senior Infrastructure PM
**Reviewed by:** Irving (Director), Vikas Vohra (Director)

---

## OVERALL PROJECT STATUS: 🟡 YELLOW — TRENDING ⬆️ TOWARD GREEN

---

## EXECUTIVE SUMMARY

The JMUX Replacement project is **not behind as a whole.** Phase 2 activities are running in parallel and are fully on track. The delay is isolated to a subset of Phase 1 remaining activities, which the team is actively recovering through resource acceleration.

---

## PHASE 1 — STATUS: 🟡 YELLOW (Recovering)

**What is complete:**
- Remote connectivity established — Hicksville & Melville ✅
- BGP design approved and configuration executed ✅
- iLO corporate connectivity interfaces turned up — Hicksville & Melville ✅
- Layer 3 BGP network design and configuration complete ✅
- NSP installation and stand-up — Hicksville ✅ (90% — DNS update pending)
- Northport DC power installation complete ✅
- OTDR testing Hicksville–Syosset complete ✅

**What remains (delayed ~3 months from original Phase 1 completion target):**
- Nokia NSP full configuration and remote GUI access to all routers — 90% complete, blocked on DNS entry update (escalated to Vic)
- RTU serial port test at Hicksville — cables sourced from Hawkeye warehouse, test scheduling in progress with John Ng
- Relay RTU cutover from JMUX to Nokia network — pending RTU test confirmation
- Layer 3 services — 2-Way Radio migration pending NSP completion

**Recovery actions underway:**
- DNS escalation raised to Vic same day — one-line change, expected to resolve imminently
- Vinny (Hawkeye) dispatched to warehouse today to source DB9 cables for RTU test
- Additional resources being applied to close Phase 1 gap

---

## PHASE 2 — STATUS: 🟢 GREEN (On Track)

Phase 2 activities are proceeding in parallel with no delays or issues.

**Engineering — IFR/IFC Packages (Burns & McDonnell):**
| Site | IFR Date | IFC Date | Status |
|---|---|---|---|
| 2H Far Rockaway, 2K Valley Stream, 2KB Cedarhurst | 2/23/26 | 3/9/26 | ✅ Complete |
| 6S Kings Hwy, 7BH Bohemia | 3/16/26 | 3/31/26 | ✅ Complete |
| 2RB Green Acres, 7W Berry St | 3/31/26 | 4/20/26 | ✅ Complete |
| 7J Sterling, 3J Whiteside | 4/13/26 | 4/20/26 | ✅ Complete |
| 2R Hewlett, 2R Hewlett Radio Shelter | 4/20/26 | 5/4/26 | ✅ IFR Submitted — Lee reviewing |
| 7Z Lindenhurst | 4/27/26 | 5/11/26 | 🔄 On track |
| 4M Baldwin, 4M Baldwin Radio Shelter | 5/4/26 | 5/18/26 | 🔄 On track |
| All remaining sites | Through 6/29/26 | Through 7/13/26 | 🔄 On schedule |

**Field / Hawkeye — Site Surveys & Inventory:**
- Vinny (Hawkeye) received 9 IFC packages — field crews being dispatched this week to begin site surveys
- Site surveys will capture: cable types needed, SFP requirements, any additional equipment per site
- This detailed inventory data will confirm true Phase 2 schedule and final cost — standard practice for complex infrastructure

**Equipment Staging:**
- All Nokia Phase 2 equipment moved to Hawkeye staging trailer ✅
- Materials confirmed per order form ✅

---

## RISKS

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| DNS update delay blocks NSP completion | High — delays Nokia router management access | Medium | Escalated to Vic 4/21. Expected same-day resolution. |
| Weather delays — substation closures at temps >90°F | Medium — potential 2-week delay per event | Medium (summer months) | Monitor forecast. Schedule critical work for cooler periods. Build float into summer schedule. |
| PAR serial-to-IP equipment (Iniven RC-30) — 8-week lead time | High — delays Phase 2 PAR site cutover | High if PO not placed immediately | PO placement in progress. Design work to start concurrently. |

---

## KEY MESSAGE FOR CIO

> *"The JMUX Replacement project is trending toward Green. Phase 2 — engineering packages, site surveys, equipment staging and inventory — is running on schedule with no issues. The delay is limited to Phase 1 remaining activities, specifically Nokia NSP finalization and RTU serial testing. These are being actively resolved this week. The overall project trajectory is upward."*

---

## NEXT STEPS — IMMEDIATE PRIORITIES

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Resolve DNS entry (.11→.15, .21→.25) — unblock NSP access | Vic / Jay | This week |
| 2 | Confirm Nokia NSP GUI access to all routers | Lee / Wayne / Ethan | After DNS fix |
| 3 | Execute RTU serial port test — Hicksville | Ethan / John Ng / Jay | TBD — ASAP |
| 4 | Relay RTU cutover to Nokia network | Lee / John Ng | After RTU test |
| 5 | Place PO — Iniven RC-30 (6 PAR sites) ⚠️ 8-week lead time | Jay | IMMEDIATELY |
| 6 | Start PAR engineering design — concurrently with PO | BMcD / Jay | IMMEDIATELY |
| 7 | Hawkeye site surveys — cable & SFP inventory all Phase 2 sites | Vinny / Hawkeye | This week |
| 8 | Confirm Nokia training dates with Glenn | Jay | This week |
