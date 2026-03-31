# PAR Controls Project — Meeting Notes
**Date:** March 31, 2026
**Attendees:** Jay (PM), Steve (TRC/Field), Chakrabarti/Chak (Design Engineer), plus others

---

## KEY DECISIONS

### 1. Technology Solution — Inivea Device
- Interface device: **Inivea** (not "Inibun")
- Function: Takes contacts from Nokia MPLS → converts to **C37.94 fiber** at control room side → at field side converts back to contact outputs → connects to Phase Angle Regulator (PAR)
- This is an **IP-to-serial intermediary solution** bridging Nokia MPLS to existing PAR controls
- **No impact on Verizon** — the 6 selected sites have Nokia only, no Verizon today ✅

### 2. Pilot Site Strategy — Hicksville First
- Do **Hicksville (Pulaski/Pilgrim ring)** as the first site
- Control room tests PAR response — if transparent/same as before → copy design to all remaining sites
- If issues arise → bring in Verizon/Nokia/Inivea to troubleshoot BEFORE rolling out to remaining 5 sites
- **Efficiency model:** Design once → implement → learn → copy. Sites 2-6 will be significantly faster

### 3. Schedule
| Item | Target |
|------|--------|
| Inivea device received | ~April 3, 2026 |
| Design complete (Hicksville) | End of April 2026 |
| Steve's team implementation/feedback | May 2026 |
| URP update (with one site working) | June/July 2026 |
| All design hours | 2026 |
| Implementation | 70-80% in 2026, 20% may spill to 2027 |

### 4. Budget & Bill Rates
- **Labor rate:** $200/hour (uniform — engineers and technicians)
- **Supervision factor:** 30% overhead applied to base hours
- **Design team:** 1 Engineer + 1 Designer per design package
- **Estimated hours:** ~200 hours per PAR site
- **Small materials (cables, fiber jumpers, panel wiring):** ~$5,000–$10,000 total for all 6 sites
  - Items: gray wire, lugs, fiber jumpers (40-50 ft each), panel wiring — all stock items
- **Inivea device/materials PO:** $52,000 invoice — forecast payment for **April**

### 5. Sites Status
- **3 of 6 PAR sites** already built and on Nokia network
- Remaining 3 sites complete under **Phase 2 (2026)**
- Northport: **2 PARs, 2 Inivea devices, 2 fiber pairs** (unique — more complex than other sites)

---

## ACTION ITEMS

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Send **IT labor accounting code** (ending in 2.1) to Chak | Jay | ASAP |
| 2 | Send **material charge code** to Chak (already in Teams meeting chat) | Jay | Done — email it directly |
| 3 | Confirm **$52,000 Inivea invoice** in April forecast with controller | Jay | April |
| 4 | Complete **design drawings for Hicksville** (Pilot site) | Chak/Design team | End of April |
| 5 | Begin **implementation at Hicksville** once design received | Steve (TRC) | May 2026 |
| 6 | Provide **material inventory list** (fiber jumpers, wiring) in design package | Chak | With design |
| 7 | Schedule **all 6 design hours in 2026** budget | Jay | Budget update |

---

## BUDGET SUMMARY (PAR Controls)

| Item | Amount |
|------|--------|
| Design labor (6 sites × ~200 hrs × $200/hr) | ~$240,000 |
| Field implementation (Steve's estimate) | See Steve's spreadsheet |
| Small materials (cables, jumpers, incidentals) | $5,000–$10,000 |
| Inivea devices/equipment PO | $52,000 |
| **Budget split** | 80% in 2026 / 20% in 2027 |

---

## NOTES
- Design is for **internal employees only** — no external contractors for design work
- Burns & McDonnell supplying Nokia connectivity to each site
- Northport two-PAR complexity already noted — design drawings must reflect dual-device setup
- Jay to go back to **URP in June/July** with one site live as proof of concept
