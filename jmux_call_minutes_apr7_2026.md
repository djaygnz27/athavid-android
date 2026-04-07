# JMUX Replacement Project — Meeting Minutes
**Date:** April 7, 2026
**Participants:** Jay (PM), Alex (Burns & Mac), Vic, Nick
**Topic:** Phase 2 & 3 Site Scope, Schedule, Cost, Equipment, and Remote Connectivity

---

## 1. REMOTE CONNECTIVITY UPDATE (Nokia NSP)
- Lee is working on corporate remote connectivity to the Nokia NSP system
- Issue identified as likely an **ACL problem** at the edge routers — no SSH access from unregistered devices
- Lee reached out to Ethan; Ethan responded and they are scheduling a troubleshoot call together
- **No firewall** in place; SSH regulation may be blocking unregistered devices
- Jay to receive an update from Lee once resolved

---

## 2. SITE SCOPE CONFIRMATION

### Phase 1
- **31 sites** completed (design + cutover)
- 17 dark fiber RTU sites cut over (no design required)
- One site removed (Green Lawn) — not included in final count

### Phase 2
- **36 sites** (26 BLS + 7 radio shelter + 3 revisits)
- Scope confirmed and agreed upon by all parties
- Additional site under investigation — TBD

### Phase 3
- **31 sites** (22 MPLS + 6 radio shelter + 3 revisits)
- Total project site summary: **Phase 1: 31 | Phase 2: 36 | Phase 3: 31**

---

## 3. SCHEDULE REVIEW

### Delays & Recovery
- Original Phase 1 completion: **February 2026**
- Supply chain issues pushed schedule by **4 months**
- Recovery action taken in 2025: Phase 2 site surveys pulled into Phase 1 window (Oct–Dec)
- Net result: **2-month recovery**, project still **2 months behind** overall
- Phase 2 work is already running **concurrently** — no additional delays from Phase 1

### Phase 2 Timeline (Projected)
- Construction / staging / CWDM cutover: **July, August, September (+buffer October)**
- Phase 2 decommissioning and as-builts: Possible **late 2026 / early 2027** after cutovers stabilized

### Phase 3 Timeline
- Site surveys and node designs starting **2026**, overlapping with Phase 2
- Cutovers and remaining work planned for **2027**
- As-builts: after Phase 3 decommissioning of JMUX equipment
- **Substantial completion** definition to be confirmed with LIPA/CIO

---

## 4. COST / BUDGET

- Phase 2 costs based on **36 sites** (confirmed)
- Phase 3 cost estimates currently show **38–39 sites** (intentional buffer/CYA)
- Phase 3 cost increase reflects **~3–4% inflation** vs Phase 2 rates
- Alex to send Jay an updated Excel cost sheet with:
  - Phase 2 construction & commissioning (4-month engagement: Jul–Oct)
  - Phase 3 site surveys
  - Phase 3 node designs
  - Staging support for both Phase 2 and Phase 3

---

## 5. EQUIPMENT STATUS

### CWDM Filters (Corning)
- Phase 1 order: ~60 units (~$55,000)
- Estimated usage: ~50–60 (mostly 2 per site, 4 for tie sites)
- **Action: Nick to verify exact count used and remaining inventory with Vinnie**
- Remaining stock to be factored into Phase 2/3 procurement

### Power Supplies (LTEC Power)
- Original order: 50 units; supplemental order: 20 units = **70 total**
- Covers Phase 1 + Phase 2
- Estimated shortfall for Phase 3: ~**10 units (~$8,000)**
- Ethan to provide more accurate count

### SFPs (Presidio)
- Ordered: **75 units** (1000Base-LX multi-mode)
- Marty's order intended to cover entire project scope
- **Action: Nick to verify if 75 SFPs covers Phase 2 and Phase 3**

### Summary of Equipment Vendors
| Vendor | Item |
|---|---|
| Nokia | MPLS nodes |
| Presidio | SFPs |
| Corning | CWDM filters |
| LTEC Power | Power supplies |
| ATRAN | Phase 1 order |
| Greybuffer | (misc) |

---

## 6. BURNS & MAC SERVICES — PHASE 2 & 3

Services to be quoted and submitted for Phase 2 and Phase 3:
- **Project Management** (ongoing)
- **Engineering:** Site surveys, staging support, node designs, as-builts, construction support
- **Construction Support:** Build support (Phase 2: Jul–Oct 2026; Phase 3: ~2027)
- **Substation Site Surveys:** Phase 3 to mirror Phase 2 scope
- **MPLS Node Designs:** Phase 3 — 31 sites
- **Staging Support:** 1 week each for Phase 2 and Phase 3 (confirmed by Alex)

### MSA Status
- PSEG procurement requires an MSA before executing Phase 3 PO
- Burns & Mac has existing MSA with NJ (different contract vehicle — IT-specific MSA in negotiation)
- Burns & Mac submitted comments; negotiations underway
- Main sticking point: **LIPA flow-down requirements**
- Proposal can be sent to Jay but may sit in limbo until MSA is finalized

---

## 7. AS-BUILT DRAWINGS

- Hawkeye (Vinnie) expected to mark up drawings in the field during installation
- As-builts for Phase 1: Vinnie claims markups/port changes were sent to the team — **not yet confirmed received on SharePoint**
- For Phase 2 onward: Hawkeye must capture installation changes on printed drawings during construction — not just photos
- Burns & Mac offered to walk Hawkeye through the process if needed
- **Action: Jay to confirm with Vinnie if Phase 1 red-lines/markups are on SharePoint**
- **Action: Jay to reiterate field markup requirement to Vinnie for Phase 2**

---

## 8. SSP / CYBER DOCUMENTATION

- SSP documents must be kept current with every change
- Ethan and Leah are maintaining updates as changes occur
- Jay cautioned the team about miscommunication between cyber groups — some require SSP review, some don't
- Confirmed: SSP updates are being maintained proactively ✅

---

## QUESTIONS ASKED DURING CALL

1. **Jay → Alex:** How many sites in Phase 2 — are we aligned at 36?
2. **Jay → Alex:** Is the remote connectivity delay affecting Phase 2?
3. **Jay → All:** What is the current Phase 1 completion date vs original plan?
4. **Jay → Alex:** Can staging for Phase 2 be done in 1 week instead of 2?
5. **Jay → Nick:** How many CWDM units were actually used in Phase 1? Any leftovers with Vinnie?
6. **Jay → Nick:** How many SFPs did Marty order and will 75 cover Phase 2 and 3?
7. **Jay → Alex:** Do we need more power supplies for Phase 2/3?
8. **Jay → Alex:** When can you get me a Phase 3 proposal for cost planning?
9. **Jay → Alex:** Do you have an MSA with New Jersey?
10. **Jay → All:** What does LIPA/PSEG consider "substantial completion"?
11. **Vic → Jay:** Did Burns & Mac need 2 weeks for Phase 2 staging?
12. **Nick → Jay:** Has Vinnie sent Phase 1 red-line markups to SharePoint yet?
13. **Jay → Nick/Alex:** Are there ACL issues blocking SSH to Nokia NSP from corporate?

---

## ACTION ITEMS

| # | Owner | Action | Due |
|---|---|---|---|
| 1 | **Alex** | Send updated Excel cost sheet (Phase 2 + Phase 3 services) | This week |
| 2 | **Alex** | Submit Phase 3 proposal (site surveys, node designs, staging, construction support) | ASAP |
| 3 | **Nick** | Verify CWDM count used in Phase 1 and remaining inventory with Vinnie | This week |
| 4 | **Nick** | Verify 75 SFPs sufficient for Phase 2 + Phase 3 | This week |
| 5 | **Jay** | Confirm with Vinnie if Phase 1 red-line drawings are on SharePoint | ASAP |
| 6 | **Jay** | Reiterate field drawing markup requirement to Vinnie for Phase 2 | ASAP |
| 7 | **Jay** | Track planned vs actual schedule dates with delay reasoning for CIO reporting | Ongoing |
| 8 | **Jay** | Pull Phase 3 site survey / node design costs from 2027 into 2026 forecast | Next CIO prep |
| 9 | **Lee/Ethan** | Troubleshoot Nokia NSP SSH / ACL issue | In progress |
| 10 | **Jay** | Clarify "substantial completion" definition with LIPA/CIO | Before next CIO meeting |
| 11 | **Ethan** | Provide accurate power supply count needed for Phase 3 | This week |

---

*Minutes prepared by Daminie | JMUX PRJ13797*
