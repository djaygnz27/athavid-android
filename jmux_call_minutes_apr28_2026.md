# JMUX Project Call — April 28, 2026
**Source:** WhatsApp voice recording (pasted transcript)
**Attendees:** Jay (Dhananjaya), Ethan, Lee, Alex
**Purpose:** Phase 1 close-out sequencing, RTU testing plan, service deployment strategy

---

## KEY DECISIONS

1. **Nokia Training** — Call with Glenn held yesterday (Apr 27). Syllabus reviewed, dates confirmed. Awaiting confirmation email. Target: last week of May / first week of June 2026.

2. **RTU Test Cabling (Hicksville)** — John Ng has the two DB9-to-DB9 50-ft cables. Cabling installation expected complete by end of this week (Friday May 1). Ethan to send John email re: ACC ethernet cable for failover test.

3. **RTU Test Process** — Simple: configure C-pipe on router, paste config, confirm data flows. John and/or George to confirm RTU communicates with QA EMS. Test confirms wiring is correct — not software. No need for Rahiq/Brianna on-site for test circuit. First few PRODUCTION cutovers: one person on-site (Brianna), then cookie-cutter after that.

4. **Failover Testing** — Need ethernet cable from Hicksville to ACC to test failover. Ethan to email John asking if redundant QA EMS exists at ACC. If yes, test failover there. If not, use a test production RTU.

5. **Pilot Production Site** — Austin substation selected as tentative first production RTU cutover (adjacent to Hicksville, easy access). Ethan to email John to confirm if he has a priority preference.

6. **RTU Cutover Sequence** — Go around the ring. Hicksville to be LAST (touches every single circuit). Start with Austin, then work the ring.

7. **Phase 1 Substantial Completion Metric** — RTU circuits cut over = the measurable Phase 1 completion metric to report externally. JMUX decommission at each site (e.g. Bagatelle) cannot happen until all 3 phases complete.

8. **June 23, 2026 Target Milestones (MUST-HAVES):**
   - Hicksville + Melville integration complete for TWO-WAY RADIO ✅
   - Hicksville + Melville integration complete for DA/FEMA RADIO ✅
   - Hicksville + Melville integration complete for SUBSTATION SECURITY ✅
   - At least ONE additional site cut over for two-way radio — Syosset confirmed ✅
   - At least ONE additional site for substation security — New Bridge (replacing North Port due to NERC CIP escort requirement) ✅

9. **Layer 3 Services (Two-Way Radio, DA Radio, Substation Security)** — Cannot retire legacy JMUX layer 3 connections until services built across ALL phases and tied into head-end locations (Hicksville/Melville). Will track internally but NOT report externally. Start with Melville + Hicksville head-end integration first.

10. **NFMP vs Scripts** — Individual circuit deployments: use CLI scripts pasted on routers (NOT NFMP). NFMP better for reporting and pushing security settings. Ethan to send scripts per router. SNMP v3 config: configure locally on one router, synchronize username/password, push via NFMP to all others.

11. **TACACS Integration** — Must be completed BEFORE changing/disabling admin passwords. Ethan to do TACACS server build. Alex to send required changes for TACACS server. Local break-glass accounts to be set up first, then admin account disabled after TACACS confirmed working.

12. **SolarWinds SNMP v3** — Not yet done. Next step: iron out username/password/security profile, configure on routers to match SolarWinds. Can push via NFMP once agreed.

13. **NSP / NFMP** — Considered COMPLETE externally. TACACS, SolarWinds, email alerts, password changes = internal tracking items only, not reported externally.

14. **IFR/IFC Reviews** — Lee reviewing Lindenhurst and Hewlett IFRs today (Apr 28). More coming. B&M pushing hard to keep Phase 2 on track. Alex to give update next week on whether team can accelerate IFR/IFC pace.

15. **Two-Way Radio Architecture** — Ethan has diagrams in service diagrams folder. Ethan to send Lee a link for review and feedback. Lee to review and confirm before deployment starts.

16. **Overall Project Status** — Phase 1 is 2.5 to 3 months behind on close-out items. BUT Phase 2 is NOT delayed. Overall project still on track for December 2027 completion. Agile approach — Phase 2 moving in parallel. Phase 3 site surveys being pulled into Phase 2 window.

17. **Change Management** — Production RTU cutovers require: bridge open, change management ticket, one person on-site (first few). After process is ironed out = cookie cutter.

---

## ACTION ITEMS

| # | Action | Owner | Due |
|---|--------|-------|-----|
| 1 | Email John Ng: ask about redundant QA EMS at ACC + request ethernet cable run for failover test | Ethan | Today Apr 28 |
| 2 | Email John Ng: confirm if he has RTU cutover priority preference (propose Austin as pilot site) | Ethan | This week |
| 3 | Send Lee link to two-way radio service architecture diagrams for review | Ethan | Today Apr 28 |
| 4 | Send TACACS server build changes/requirements to Alex | Ethan | ASAP |
| 5 | Confirm Nokia training dates with Glenn — awaiting email confirmation | Jay | This week |
| 6 | Confirm cabling complete at Hicksville, coordinate RTU test execution | Jay / Ethan | By Friday May 1 |
| 7 | Review Lindenhurst and Hewlett IFRs | Lee | Today Apr 28 |
| 8 | Assess whether B&M can accelerate IFR/IFC pace — provide update | Alex | Next week |
| 9 | Identify and confirm June 23 must-have sites for two-way radio, DA radio, substation security | Jay / Lee / Ethan | This week |
| 10 | Develop RTU cutover scripts (C-pipe config) for test circuit — send to team | Ethan | Before Friday |
| 11 | TACACS server integration — complete before password changes | Alex / Ethan | TBD |
| 12 | Document SOP for standing up circuit types (two-way radio, substation security, etc.) | Lee | Ongoing |

---

## DATES MENTIONED

| Date | Item |
|------|------|
| Friday May 1, 2026 | RTU test cabling installation complete at Hicksville |
| Week of Apr 27 | RTU serial test execution (John Ng) |
| Last week May / First week June 2026 | Nokia training with Glenn |
| June 23, 2026 | Phase 1 substantial completion target — RTU circuits + two-way radio/DA radio/substation security head-end integrations |
| December 2027 | Overall project completion (unchanged) |

---

## RISKS / FLAGS

🔴 **John Ng communication** — Does not respond to Jay directly. Ethan to be primary contact. Escalate to Vic if needed.
🟡 **Failover test** — May not be possible on QA system if no redundant ACC EMS. May need production RTU pilot for failover test.
🟡 **North Port substation security** — NERC CIP escorted site, replaced with New Bridge for June 23 milestone.
🟡 **RTU cutovers** — Won't complete ALL Phase 1 RTU circuits by June 23. Cookie-cutter process once first few are done.
🟡 **Supply chain** — Jay flagged concern about supply chain for Phase 2 equipment. Vinny doing site surveys and inventory lists. Order ASAP to avoid delays.
