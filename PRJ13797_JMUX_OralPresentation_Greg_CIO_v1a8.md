# PRJ13797 JMUX Replacement — CIO Oral Presentation Script v1a8
**Presenter:** Dhananjaya Gunaratne | **Audience:** Greg (CIO) | **Date:** April 29, 2026
**Updated:** April 28, 2026 — Vic schedule rebase confirmed. SPI corrected. Slides 4 & 5 shortened.
**Format:** Follow slide by slide. Speak naturally — these are talking points, not a script to read verbatim.
**Timing:** Slides 4 & 5 = 5–6 min each (tightened). Slide 10 (SPI) = 8–10 min. All other slides = 1–3 min.
**Total Estimated Runtime:** ~50–60 minutes including Q&A

---

## SLIDE 1 — Title (~1 minute)

"Good afternoon Greg. Thank you for making the time. I'm here to give you a comprehensive update on PRJ13797 — the JMUX Replacement program — PSEG Long Island's modernization of substation communications from legacy JMUX to Nokia MPLS nodes.

I'll cover overall program status, spend meaningful time on the PAR circuit migration because it has financial implications I want to be transparent about, and close with our schedule status and SPI. Please stop me at any point with questions."

---

## SLIDE 2 — Goals & Objectives (~2 minutes)

"The goal is to modernize PSEG Long Island's substation communications — replacing aging, vendor-unsupported JMUX infrastructure with Nokia MPLS nodes. Some of this equipment is over 25 years old and represents daily operational risk.

The program runs across four concurrent workstreams: Engineering Services led by Burns and McDonnell, Procurement and Staging through B&M, Nokia, and Graybar, Construction and Installation through B&M and Hawkeye, and Deployment and Application Migration led by our PSEG team with B&M. The IFC engineering package is the gate — nothing gets installed until B&M issues and approves the IFC for that site."

---

## SLIDE 3 — Program Overview / Phase Map (~2 minutes)

"Three phases. Phase 1 covers 31 Nokia MPLS nodes — largely complete, a few remaining close-out items I'll address on the SPI slide. Phase 2 covers 36 sites — engineering well underway, construction starts August 2026. Phase 3 covers 31 remaining sites.

One key decision we've made: we are deliberately pulling Phase 3 site surveys and MPLS design into the Phase 2 window — starting as soon as Phase 2 staging begins in August. This is part of how we recover the PAR schedule impact and keep the overall program at November 2027."

---

## SLIDE 4 — PAR Circuit Migration: Background & Discovery (~5–6 minutes)

"I want to spend real time here Greg, because this has financial implications and I want you to have the full picture — not just the number, but the story behind it.

**What is PAR Circuit Migration?**

PAR stands for Phase Angle Regulator — high-voltage substation devices that regulate power flow on transmission lines. The RTUs at 6 specific substations communicate using a legacy direct-contact serial protocol. When we connect the new Nokia MPLS nodes, those RTUs cannot talk directly to Nokia. The protocols are fundamentally incompatible — Nokia is IP-based, the RTUs are serial.

NERC CIP mandates an intermediary system between them. This is non-negotiable — it's a federal compliance requirement. No workaround, no waiver. The six sites are: Northport, Pilgrim, Barrett, East Garden City, Valley Stream, and Hicksville.

The solution — and the only viable compliant solution after evaluating all options — is the Iniven RC-30. It converts direct-contact serial signals to C37.94 IP protocol. It is NOT a programmable device under NERC CIP, so installing it doesn't create additional compliance exposure. PO is placed. 8-week lead time is running.

**Why Wasn't This Fully Scoped in 2024?**

During 2024 requirement gathering, PAR was acknowledged at a high level only. No detailed design, no formal cost estimate, no budget commitment. It was carried as a Phase 3 placeholder at roughly $30,000 to $40,000 — covering general RTU migration support, not a serial-to-IP conversion system at 6 high-voltage substations with NERC CIP compliance requirements.

This is consistent with how multi-phase infrastructure programs work. You don't have the full detailed picture at kickoff. Requirements are confirmed phase by phase during site surveys.

**How Was the Full Scope Discovered?**

During Phase 2 detailed site surveys, our engineering and relay teams were formally engaged for the first time to capture detailed RTU requirements. That site-by-site review of existing SEL-2595 systems revealed the full technical and compliance scope — 6 substations, dedicated intermediary solution required, true level of effort and cost first identified at that point. This is the process working exactly as designed."

---

## SLIDE 5 — PAR Circuit Migration: Schedule & Financial Impact (~5–6 minutes)

"Now let me walk through the numbers and the recovery plan — and I want to give you both clearly.

**Financial Impact**

The cost has three components. First, Iniven RC-30 equipment — 6 units, PO placed — approximately $59,500. Second, PAR engineering design from Chakrapani's protection engineering team — 200 hours per site, $200 per hour, across 6 sites — that's $240,000. Third, installation, configuration, and cutover labor from the relay implementation team — 1,000 hours at $200 per hour plus materials — that's $230,000.

Total additional unbudgeted funding required: approximately $529,500. We are rounding to $530,000 for the formal change request, which includes a small contingency buffer for live substation work.

The second funding component is Phase 3 acceleration — pulling Phase 3 site surveys and MPLS design into Phase 2. That is estimated at $800,000. Total formal budget change request: $1.2 million.

**Schedule Impact and Recovery**

Without mitigation, the PAR work adds approximately 5 months of calendar impact — hardware procurement at 2 months, engineering design and implementation at 5 months. That would push the overall program to May 2028.

We are not accepting that. Our recovery plan is already in execution. The RC-30 equipment is ordered — 8-week lead time running. PAR engineering design is running in parallel with Phase 2 construction — they do not block each other. PAR migration has no impact to Phase 2 deployment critical path. And Phase 3 engineering is being pulled into Phase 2 to compress the overall timeline.

Net schedule impact to the program: none. We remain on track for November 2027.

The formal budget change request for the $1.2 million will be submitted within the next two weeks."

---

## SLIDES 6, 7, 8 — Phase 2 Engineering Schedule (~2 minutes)

"These slides cover the Phase 2 engineering schedule across all 36 sites. All 36 Phase 2 site surveys are complete — Hawkeye has been to every site. Nine of 36 IFC packages are already with Hawkeye. Lindenhurst IFR was due April 27th. Baldwin due May 4th. Final IFR for all Phase 2 sites by June 29th. Final IFC by July 13th. Construction starts August. Deployment completes September 2026. Phase 2 is on track — I have no concerns about that timeline."

---

## SLIDE 9 — Phase 1 Remaining Items (~1 minute)

"Three active Phase 1 close-out items — RTU serial test at Hicksville, cabling completing by end of this week; remote node verification for all 31 Phase 1 nodes, targeted by May 9th; and SSP configuration review ongoing. All three on track for end of May close-out."

---

## SLIDE 10 — Schedule Status & SPI (~8–10 minutes)

"This is the slide I want to spend the most time on, Greg, because there is an important clarification I need to walk you through — and it actually tells a better story than what was previously reported.

**The Rebase — Critical Context**

Our previous reporting was based on the original Phase 1 schedule from 2024. That schedule was impacted by supply chain delays last year — and those delays were already reported and already recovered from at the overall project level. We absorbed those delays by accelerating Phase 2 work into the Phase 1 window. That recovery was formally communicated.

What Vic and I confirmed this week is that our going-forward SPI reporting should be based on the updated project plan — the current baseline — not the original 2024 schedule. This is the correct and standard approach for a program that has already formally reported and recovered from supply chain delays.

**What the Current Baseline Shows**

On the current updated plan, the active Phase 1 activity is Layer 3 Security and Radio configuration. Planned start date: April 6th. Planned end date: May 12th. Today is April 28th. This activity is approximately 3 weeks behind on its start — NOT 3 months.

The RTU cutover activity doesn't even begin until May 12th. So reporting RTU cutovers as late is incorrect — they haven't started yet because they are not planned to start yet.

**Corrected SPI**

Based on the updated baseline, the SPI picture changes materially. The previous figures — 0.77 in April, 0.80 in March — were calculated against the original 2024 schedule. Against the current updated baseline, our SPI is approximately 0.90, which moves us from Yellow into the low end of the On Track band. The 3-week delay on the Layer 3 Security and Radio activity is the primary driver of any remaining SPI variance.

I want to be transparent about the two root causes on the slide — SSP documentation delays through the security review queue, and CMDB update coordination time. Both of those are internal process items and both are being actively worked.

**Recovery Plan — Specific and In Execution**

Let me be precise about the recovery items.

One — Layer 3 Security and Radio configuration. Started this week. Planned completion May 12th. Lee's team is executing. Once the first site is configured and proven, replication across remaining Phase 1 sites is expected to take approximately 3 days per site. It becomes a cookie-cutter process.

Two — RTU serial test at Hicksville. Cabling completing by Friday May 1st. Ethan sending configuration scripts this week. John Ng and George to confirm RTU communicates with QA EMS. We will also test failover to ACC — Ethan is following up with John on the ethernet cable needed for that test.

Three — Once the test circuit validates, we move to production RTU cutovers. Austin substation is the tentative pilot site — adjacent to Hicksville, manageable access. After the first production cutover is confirmed working, we go around the ring. Hicksville is last because it touches every circuit.

Four — Develop Method of Procedure for production RTU migration — B&M and Jay, targeted by mid-May.

Five — Remote node verification for all 31 Phase 1 nodes against NSP — targeted May 9th.

**Phase 1 Substantial Completion**

The measurable metric for Phase 1 substantial completion is RTU circuits cut over. That is what I will be reporting to you going forward — each circuit moved from legacy JMUX to Nokia, confirmed and tested. That is discrete, trackable, and reportable.

I want to be clear — full Phase 1 decommissioning of JMUX cannot happen until all three phases are complete. Some Layer 3 service connections — two-way radio, DA FEMA radio, substation security — cannot be retired on the legacy network until the Nokia service is built end-to-end across all rings. But RTU circuit cutovers are fully discrete and we will be reporting each one as complete as they are done.

**The June 23rd Target**

We have set a June 23rd internal milestone for Phase 1 substantial completion. Must-haves by that date: Hicksville and Melville head-end integrations complete for two-way radio, DA radio, and substation security. Plus at least one additional site cut over for two-way radio — Syosset — and one additional site for substation security — New Bridge. That is the June 23rd commitment.

**Bottom Line on Schedule**

Greg, here is my bottom line. The previous SPI figures of 0.77 to 0.80 were measured against a baseline that had already been formally superseded. On the correct updated baseline, we are tracking at approximately 0.90. Phase 1 is approximately 3 weeks behind on the active Layer 3 activity — not 3 months. Phase 2 is not delayed. Overall program November 2027 completion is unchanged.

My five commitments:
One — Phase 1 active Layer 3 activity completes by May 12th.
Two — RTU serial test complete by end of this week.
Three — June 23rd substantial completion milestone met.
Four — Phase 2 construction begins August 2026.
Five — Overall program November 2027 — unchanged."

---

## SLIDE 11 — Financials (~2 minutes)

"Total program spend to date is $5.66 million across 2024, 2025, and 2026. Breakdown: 76% Outside Services — B&M, Hawkeye, Nokia. 18% Materials. 4% Internal Labor. 2% Assessments.

The formal Budget Change Request for $1.2 million — $530K for PAR, $800K for Phase 3 acceleration — will be submitted within two weeks. I am working with Chad to reflect both components properly in the monthly forecast once design start dates are confirmed."

---

## SLIDE 12 — Risks & Next Steps (~2 minutes)

"Three current risks. Legacy JMUX equipment over 25 years old — brittle connectors, potential fiber and cable failures — risk of unplanned outage. Best mitigation is the project itself. Weather delays during Phase 2 summer construction — planning around high-heat protocols. And concurrent substation project coordination — actively managed.

Six next steps in priority order: RTU circuit test at Hicksville by Friday. Remote node verification, all 31 Phase 1 nodes, by May 9th. Production RTU MOP developed with B&M by mid-May. PAR design progress tracked with Chakrapani — confirm RC-30 delivery for all 6 sites. IFR/IFC submittals — 9 of 36 in, Lindenhurst due April 27th, Baldwin May 4th. Budget Change Request for $1.2M submitted within two weeks.

Greg, I'm moving on all six simultaneously. Happy to set a follow-up checkpoint in three to four weeks."

---

## ANTICIPATED QUESTIONS

**Q: Why does the SPI look better now than what was reported before?**
"Previous reporting was measured against the original 2024 baseline which included supply chain delays that were already reported and recovered from. Vic and I confirmed this week that going-forward reporting should use the current updated baseline. Against that baseline, the active Phase 1 activity is only 3 weeks behind — not 3 months. The SPI of approximately 0.90 reflects our actual current performance."

**Q: Why wasn't PAR scoped properly in 2024?**
"PAR was acknowledged at a high level in 2024 but the relay engineering team was not formally engaged and no detailed site-by-site RTU assessment was done. The full technical and compliance scope only became visible during Phase 2 detailed site surveys. This is the discovery process working correctly for a multi-phase program."

**Q: Can we avoid the $530K PAR cost?**
"No. NERC CIP compliance is non-negotiable. The Iniven RC-30 is the only viable compliant solution. The $530K is what compliance costs at these 6 substations."

**Q: Are you confident Phase 2 construction still starts in August?**
"Yes. All 36 site surveys complete. 9 IFCs already with Hawkeye. IFR/IFC schedule through July intact. Nothing is blocking August construction start."

**Q: What is the total additional funding needed?**
"$1.2 million. $530K for PAR circuit migration — equipment, engineering design, installation labor. $800K for Phase 3 engineering acceleration pulled into Phase 2. Formal BCR within two weeks."

**Q: When does the project finish?**
"November 2027 — unchanged."

---

*End of Oral Presentation Script — v1a8*
*Total estimated delivery time: 50–60 minutes including Q&A*
