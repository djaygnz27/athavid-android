# PRJ13797 — JMUX Replacement Project
## Cost Actuals & Forecast Report
### Prepared for: Irving (PSEG Leadership)
### Prepared by: Dhananjaya (Jay) Gunaratne, Senior PM
### Date: May 12, 2026
### Status: CONFIDENTIAL — For Internal Use Only

---

## EXECUTIVE SUMMARY

The JMUX Replacement Project is currently tracking a **total budget variance of -$668K** (projected), with **-$797K for 2026 capital**. The variance is driven by three factors:
1. Accelerated Phase 3 scope being pulled into Phase 2 (site surveys + engineering)
2. PAR circuit migration — an unbudgeted scope gap discovered during Phase 2 site surveys
3. Labor over-forecasting by vendors (PQA, relay team, B&M assessment charges) under active audit

---

## SECTION 1 — ACCELERATED SCOPE: PHASE 3 PULLED INTO PHASE 2

### What Is Being Accelerated
To avoid supply chain delays and compress the overall project schedule, Phase 3 site surveys and engineering (IFR/IFC packages) are being started during Phase 2 staging (August 2026), rather than waiting for Phase 2 completion.

This was confirmed by Ethan (B&M): *"As soon as Phase 2 staging begins, Phase 3 engineering can start."*

### Why We Are Accelerating
- Nokia MPLS equipment has an 8–12 week lead time
- If Phase 3 engineering starts after Phase 2 completes, equipment delivery delays push Phase 3 construction into 2028
- Starting Phase 3 design in parallel with Phase 2 staging compresses the schedule by approximately 4–6 months
- Avoids double mobilization costs for Hawkeye construction crews

### Phase 3 Scope (Being Pulled Forward)
- 31 sites (confirmed scope — correcting earlier estimates of 26)
- Site surveys: Hawkeye field team
- Engineering IFR/IFC: Burns & McDonnell (B&M)

### Cost Breakdown — Phase 3 Acceleration

| Line Item | Description | Actuals to Date | Forecast (2026) | Total Forecast |
|---|---|---|---|---|
| B&M Engineering — Phase 3 Design | IFR/IFC packages for 31 sites. Design starts Aug 2026 during Phase 2 staging. | $0 | $600,000 | $900,000–$1,290,000 |
| Hawkeye Site Surveys — Phase 3 | Field surveys for 31 sites to support B&M design. Starts Aug 2026. | $0 | Included in Hawkeye SOW | TBD (B&M/Hawkeye quotes pending) |
| Nokia Equipment — Phase 3 Pre-Order | Pre-ordering Phase 3 Nokia MPLS nodes to avoid 8-week lead time delay | $0 | TBD (PO to be placed Q3 2026) | TBD |

*Note: B&M and Hawkeye quotes for Phase 3 to be confirmed with Chad by end of May 2026.*

---

## SECTION 2 — PAR CIRCUIT MIGRATION (UNBUDGETED SCOPE)

### Background
PAR (Phase Angle Regulator) circuits were originally treated as a Phase 3 placeholder in the 2024 project scope at an estimated cost of $30,000–$40,000. During Phase 2 site surveys, the full technical scope was discovered:
- 6 high-impact substations require serial-to-IP conversion for NERC-CIP compliance
- The JMUX system transmitted PAR control signals via direct serial connection
- Nokia MPLS is IP-based — a physical intermediary device (Iniven RC-30) is required at each site
- This is mandatory — there is no alternative path under NERC-CIP

### Sites Affected
1. Northport (also requires C37.94 protocol card — unique requirement)
2. Hicksville (5HK)
3. Melville
4. Lindenhurst (7Z)
5. Far Rockaway (2H)
6. Hewlett (2R)

### PAR Cost Breakdown

| Line Item | Description | Actuals to Date | Forecast Remaining | Total |
|---|---|---|---|---|
| Iniven RC-30 Equipment (6 units) | Serial-to-IP conversion device, one per site. PO in progress — 8-week lead time. | $0 | ~$60,000 | ~$60,000 |
| C37.94 Protocol Card — Northport | Additional card required for Northport's unique PAR configuration. | $0 | TBD (bundled Phase 2 order) | TBD |
| Chakrapani Team — PAR Engineering Design | Design work for all 6 sites. Rate: $115.34/hr (being audited). Design status: Not yet started at 5 of 6 sites. | $0 | ~$240,000 | ~$240,000 |
| Johnny's Relay Team — Installation Labor | Physical installation, configuration, and cutover at each of 6 sites. Rate: ~$1,100–$1,200/hr. Scope per site: TBD based on design. | $0 | ~$200,000–$495,000 | ~$200,000–$495,000 |
| **TOTAL PAR** | | **$0** | **~$500,000–$795,000** | **~$530,000 (midpoint)** |

*Note: The $530K figure (midpoint) was presented to Greg (CIO) on April 29, 2026. Final number pending Chakrapani design completion and Johnny's team scope confirmation.*

*Note: Chad's current forecast includes only $120K (Apr–Jun) for equipment + design. The $495K relay labor estimate is NOT yet in Chad's forecast — this is a critical gap that must be reconciled.*

### PAR Timeline
| Milestone | Planned | Status |
|---|---|---|
| RC-30 Equipment PO Placed | April 30, 2026 | In Progress — PO cut, delivery TBD |
| RC-30 Equipment Delivery | June 2026 (8-wk lead) | Pending |
| Chakrapani PAR Design — All 6 Sites | June–July 2026 | Not Started (5 of 6 sites) |
| Johnny Team Installation — All 6 Sites | Aug–Sep 2026 (parallel Phase 2) | Not Started |
| PAR Circuits Complete | September 2026 | Target |

---

## SECTION 3 — OVERALL BUDGET VARIANCE SUMMARY

| Category | Original Budget | Actuals to Date | Forecast to Complete | Projected Final | Variance |
|---|---|---|---|---|---|
| B&M Engineering (Phase 1+2) | Baselined | TBD — actuals from Chad | On track | On track | ~$0 |
| Nokia Equipment (Phase 1+2) | Baselined | Phase 1: Received | Phase 2: 26 nodes on order | On track | ~$0 |
| Hawkeye Construction | Baselined | Phase 1: Complete | Phase 2: Aug 2026 start | On track | ~$0 |
| Graybar Ancillary Equipment | Baselined | Phase 1: Received | Phase 2: BOM pending | On track | ~$0 |
| PAR Migration (NEW SCOPE) | $30K–$40K (2024 placeholder) | $0 | ~$530,000 | ~$530,000 | *-$490,000–$500,000* |
| Phase 3 Engineering (Accelerated) | Phase 3 budget (future) | $0 | ~$600K–$900K (2026 portion) | $900K–$1.29M | Budget year timing shift |
| Labor Over-Forecasting (PQA/Relay/Assess.) | Baselined | Under audit | PCR underway | TBD | Under Investigation |
| *TOTAL PROJECTED VARIANCE* | | | | | *-$668K (total) / -$797K (2026 cap)* |

---

## SECTION 4 — COST CONTROL ACTIONS IN PROGRESS

1. *PQA Audit*: Marge Tanner (PQA) charges being reviewed for double-billing. Escalation in progress.
2. *Assessment Cap*: Joe Jekyll agreed assessments capped at 3.5% of total budget. PCR "get out of jail free" cards being issued for over-cap assessments.
3. *Relay Labor Rate Audit*: Chakrapani design team rate of $115.34/hr being verified against accounting. Johnny's team rate of $1,100–$1,200/hr being challenged — scope and justification required.
4. *Vendor Forecasting Control*: All future funding requests to require detailed hour-by-hour justification. No blanket forecasts accepted.
5. *B&M Overhead*: Assessment charges on B&M and engineering overhead under review for inflation above approved bill rates.

---

## SECTION 5 — OPEN ITEMS REQUIRING LEADERSHIP DECISION

1. *PAR Funding Approval*: $530K unbudgeted — Change Request required. PAR is mandatory for NERC-CIP compliance. No alternative.
2. *Phase 3 Acceleration Budget*: Confirm whether Phase 3 engineering budget ($900K–$1.29M) can be front-loaded into 2026 capital plan.
3. *Chad Reconciliation*: Chad's forecast must be updated to include $495K relay labor for PAR. Meeting required week of May 18.
4. *Chakrapani Design Confirmation*: Design owner not yet confirmed for 5 of 6 PAR sites. Blocking RC-30 delivery planning.

---

*Report prepared by Daminie (Project AI) on behalf of Jay Gunaratne | PRJ13797 | May 12, 2026*
