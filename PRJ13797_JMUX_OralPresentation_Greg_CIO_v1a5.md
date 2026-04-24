# PRJ13797 JMUX Replacement — CIO Oral Presentation Script
**Presenter:** Dhananjaya Gunaratne | **Audience:** Greg (CIO) | **Date:** April 29, 2026
**Format:** Follow slide by slide. Speak naturally — these are talking points, not a script to read verbatim.
**Timing:** Slides 4, 5, and 10 are 8–10 minutes each. All other slides are 1–3 minutes.

---

## SLIDE 1 — Title (~1 minute)

"Good afternoon Greg. Thank you for making the time. I'm here today to give you a comprehensive update on PRJ13797 — the JMUX Replacement program. This is PSEG Long Island's Private Field Area Network modernization effort — replacing the legacy JMUX communications infrastructure across our substations with Nokia MPLS nodes.

I'll walk you through where we stand overall, I'll spend meaningful time on the PAR circuit migration topic because that has financial and schedule implications I want to be fully transparent about, and then I'll close with our schedule status and what we're focused on for the next 30 to 60 days.

I want this to be a two-way conversation, so please stop me at any point if you have questions."

---

## SLIDE 2 — Goals & Objectives (~2 minutes)

"Before I get into the detail, let me quickly level-set on what this program is.

The goal is to modernize PSEG Long Island's substation communications by replacing aging legacy JMUX equipment with Nokia MPLS nodes — delivering a reliable, scalable, and future-ready network. The JMUX equipment in the field is old. Some of it is over 25 years old. It is brittle, parts are no longer readily available, and it is a risk to operational continuity every day it stays in service. This project exists to eliminate that risk.

The program runs across four workstreams. Burns and McDonnell is handling all engineering — site surveys, rack elevations, power and cabling design, and producing all IFR, IFC, and As-Built documents. On the procurement side, Burns and McDonnell, Nokia, and Graybar are managing the bill of materials, MPLS equipment orders, and all ancillary materials like patch panels, fiber cables, and mounting kits. Hawkeye is our construction contractor — they're doing the physical site work, racking and stacking, cabling, and installation at each substation per the approved IFC documents. And on the deployment side, our PSEG team working with Burns and McDonnell is handling all Layer 3 network design, pre-staging application connectivity, and migrating production applications to the new infrastructure.

All four of those workstreams are running concurrently. That's what makes this program complex to manage — we're not doing these sequentially, we're running them in parallel across three phases and over 100 substations."

---

## SLIDE 3 — Program Overview / Phase Map (~2 minutes)

"This slide shows the overall program structure. We have three phases. Phase 1 covers 31 Nokia MPLS nodes across the Phase 1 substation footprint — that work is largely complete, with a few remaining items I'll cover shortly. Phase 2 covers 36 sites, with engineering well underway and construction scheduled to begin in August 2026. Phase 3 covers the remaining sites, and we've taken deliberate steps to accelerate Phase 3 planning into the Phase 2 window to compress the overall timeline.

The Phase 1 work is what I want to close out cleanly before we move full force into Phase 2 construction. We have a small number of remaining items — RTU testing, node verification against SSP, and the production RTU migration MOP — and we are actively executing all of those right now."

---

## SLIDE 4 — PAR Circuit Migration: Background & Discovery (~8–10 minutes)

"I want to spend real time on this slide, Greg, because this topic has financial implications and I want you to understand the full story — not just the number, but the context, the discovery process, and why this is not a project management failure.

Let me start by explaining what PAR circuit migration actually is, because it's technical and I want to make sure the context is clear.

PAR stands for Phase Angle Regulator. These are high-voltage devices at certain substations that control the flow of power on transmission lines. The RTUs — Remote Terminal Units — at these substations communicate using a direct contact serial protocol. That protocol is decades old, and it was designed to talk to legacy JMUX equipment — which is exactly what we're replacing.

Here is the problem. When we connect the new Nokia MPLS nodes at these 6 substations, the RTUs cannot talk directly to the Nokia equipment. The communication protocols are fundamentally incompatible. Nokia uses IP-based communication. The RTUs use direct contact serial. You cannot bridge those directly without an intermediary system.

And here is the critical compliance dimension. NERC CIP — the North American Electric Reliability Corporation Critical Infrastructure Protection standards — mandates that we cannot simply daisy-chain the Nokia equipment and the RTU together. NERC CIP requires an intermediary system between them at these substations. This is not optional. It is a federal compliance requirement. There is no workaround, there is no waiver, and there is no alternative. If we do not implement the intermediary solution, we are out of NERC CIP compliance, which carries significant regulatory risk for PSEG Long Island.

The solution we selected — and I want to be very clear, it is the only viable compliant solution — is the Iniven RC-30. The RC-30 is a device that converts the direct contact serial signals from the RTU into C37.94 IP protocol, which the Nokia network can then receive and process. It is not a programmable device, which is important under NERC CIP — it doesn't create additional compliance exposure by virtue of being installed. It's essentially a protocol converter. Six of them — one per site — at Northport, Hicksville, Melville, Lindenhurst, Far Rockaway, and Hewlett.

Now — the question I expect you are asking is: why wasn't this fully scoped and budgeted from the beginning? I want to address that directly and honestly.

During the 2024 kickoff meetings for this project, PAR was discussed. It was acknowledged at a high level. But here is what did not happen in 2024 — there was no detailed design engagement, no formal cost estimate, and no formal schedule commitment. The 2024 discussions indicated that the design cost would fall on the technical security team, but no specific dollar amount was ever agreed to and no budget line was formally committed. PAR was carried as a Phase 3 placeholder in the project budget with a rough allowance of approximately $30,000 to $40,000. That figure was intended to cover general support — not a serial-to-IP conversion system at 6 high-impact substations.

I also want to be transparent — this is consistent with how large infrastructure projects are scoped and executed. You do not have the full detailed engineering picture at kickoff. Detailed requirements are confirmed during each phase's site surveys, when the engineering team is actually on-site, looking at the existing equipment, and understanding the specific technical conditions at each location. That is the industry-standard methodology and it is how this project was structured.

What changed the picture was the Phase 2 detailed site surveys. During those surveys, the relay team was formally engaged for the first time. That is an important statement — for the first time. Prior to Phase 2 surveys, the relay team had not been brought into the detailed engineering conversations. When they were engaged, they went site by site, reviewed the existing RTU technology — specifically the SEL-2595 systems at these 6 substations — and identified the full technical and compliance scope that a direct Nokia-to-RTU connection was not viable and that NERC CIP required the intermediary solution.

That is when the true level of effort and cost was first identified. And I want to say this clearly — this was not a project management oversight. The information was not available until the detailed engineering work was done at the site level. The moment the relay team confirmed the scope, we moved immediately to identify a solution, evaluate all available options, select the Iniven RC-30 as the only viable compliant device, engage Chakrapani's T&D team for engineering design, and place the purchase order for the RC-30 equipment.

I am also taking a lesson from this for Phase 3. We are proactively engaging all Phase 3 stakeholders now — before the Phase 3 surveys are complete — specifically to surface any similar issues early, before they become budget surprises. That is a direct process improvement we are implementing as a result of this discovery."

---

## SLIDE 5 — PAR Circuit Migration: Schedule & Financial Impact (~8–10 minutes)

"Now let me take you through the financial and schedule impact in detail, because I want you to have full visibility into the numbers, what's confirmed, what's still being refined, and what actions are already underway.

On the financial side, there are three distinct cost components and I want to walk through each one separately.

The first component is the Iniven RC-30 equipment — one unit per site, six sites total. The cost is approximately $59,500. The purchase order has been placed. That is confirmed and done. Equipment is on order with an 8-week lead time, so we are expecting delivery aligned with when the Phase 2 construction window opens in August.

The second component is the PAR engineering design. This work is being done by Chakrapani's T&D team. They are currently engaged and the design is in progress. The cost for this component is still TBD — we will have a confirmed number once Chakrapani's team completes their design scope. I am following up with Chakrapani directly to get a timeline and cost estimate, and that is one of my open action items going into next week.

The third component — and the largest — is the installation, configuration, and cutover labor. This is Johnny's relay team. The estimated labor rate is $1,100 to $1,200 per hour. Based on the scope at all 6 substations, the estimated total is approximately $495,000. I want to be clear — this work has not started. The relay team cannot begin until Chakrapani's design is complete and approved, because the installation must follow the design. This is properly sequenced, but it does mean this cost will land in the budget after the design phase concludes.

That brings the total additional unbudgeted funding required to approximately $550,000 or more. I say "or more" because the engineering design cost from Chakrapani's team is still TBD. We are preparing a formal budget Change Request to capture this in the capital plan.

I also want to flag something specific about the current forecast. I spoke with Chad, and his current April through June forecast shows $120,000. That $120,000 covers the RC-30 equipment and an estimate for the design work only. The $495,000 in relay labor from Johnny's team is not yet in Chad's numbers — it has not been entered into the forecast. Once we have Chakrapani's design completion date and a confirmed start date from Johnny's team, I will work with Chad to properly spread that $495,000 across the correct months. I wanted you to know this gap exists so you are not surprised when the Change Request comes in with a higher number than what is currently showing in the forecast.

On the schedule side — the PAR migration does have a direct schedule impact of approximately 2 to 3 months relative to the original PAR Phase 3 placeholder. However, and this is the critical point — PAR work is running in parallel with Phase 2 construction. It is not on the critical path for Phase 2 deployment. The Nokia MPLS installation at the Phase 2 sites, the IFR and IFC engineering, and the Hawkeye construction work all continue on their planned August through September schedule regardless of where PAR design stands.

We have also taken a deliberate step to accelerate Phase 3 to recover time on the overall program. Ethan confirmed to me directly that Phase 3 site surveys and detail design can begin as soon as Phase 2 staging starts — which is August 2026. We do not have to wait for Phase 2 construction to complete before starting Phase 3 engineering. Burns and McDonnell's Phase 3 design is estimated to run from June through December 2026, at an additional cost of approximately $900,000 to $1.29 million. Those numbers need to be confirmed with Chad and through formal B&M quotes, and I am initiating that process.

The projected full recovery for the overall program is end of 2026.

On the recovery actions — let me go through each one specifically. The RC-30 purchase order is placed and equipment is on order. Chakrapani's team is engaged and design is in progress. The PAR migration is structured to run in parallel with Phase 2 so there is no impact to the Phase 2 deployment critical path. Phase 3 engineering has been pulled forward into the Phase 2 staging window. You were informed informally at the All Hands meeting, so this is not coming to you cold today. And I am preparing the formal Change Request now — you will have that in the next two weeks.

The two items still in progress are the Change Request submission, and getting the $495,000 relay labor properly reflected in Chad's monthly forecast once the design timeline is confirmed.

I am personally owning both of those action items."

---

## SLIDES 6, 7 & 8 — Phase 2 Engineering Schedule (36 Sites) (~2 minutes)

"These three slides show the Phase 2 engineering schedule across all 36 sites. I want to highlight something important here — all 36 Phase 2 site surveys are complete. Hawkeye has been to every site. That is a significant milestone and it means our engineering team has everything they need to complete the IFR and IFC packages without waiting on additional site access.

We currently have 9 of 36 IFC packages submitted to Hawkeye — those are the ones Hawkeye is already using to plan their site-specific installation work. The next immediate milestone is Lindenhurst, with an IFR due this coming Monday April 27th. Baldwin is due May 4th. The full IFR schedule runs through June 29th, all IFCs follow by July 13th, Phase 2 construction kicks off in August, and deployment completes in September 2026. Phase 2 is on track and I am not concerned about that timeline."

---

## SLIDE 10 — Schedule Status & SPI (~8–10 minutes)

"This is the slide I want to spend the most time on, Greg, because I believe in being fully transparent about where we stand and I want you to understand the complete picture — not just the number, but what is behind it, what caused it, and what we are doing about it.

Our overall project status is Yellow. The SPI — Schedule Performance Index — is 0.77 in April. In March it was 0.80. So we have moved slightly in the wrong direction over the past month and I want to explain exactly why.

First, let me explain what SPI means for anyone in the room who may not use it regularly. SPI is a ratio of Earned Value to Planned Value. An SPI of 1.0 means we are exactly on schedule — we have completed exactly as much work as we planned to have completed by this date. An SPI below 1.0 means we have completed less work than planned. At 0.77, we have completed about 77 cents worth of work for every dollar we planned to have done by now. That puts us in the Yellow band, which is defined as 0.70 to 0.90. We are not in the critical range, which is below 0.70, but we are not where I want to be.

Now let me explain exactly what is driving that number, because the story is more nuanced than the single metric suggests.

Phase 1 is approximately 2.8 months behind on its remaining activities. Specifically — completing the remote access setup to the Nokia NSP management system, finishing the node buildout in the NMS GUI, and executing the RTU test circuit at Hicksville. Those three items are what is dragging the Phase 1 SPI below 1.0.

The root cause of that delay is two specific external dependencies that were outside our team's control.

The first was the Nokia server license. To stand up the NSP — the Nokia Network Services Platform, which is the management system for all 31 Phase 1 MPLS routers — we needed a corporate server license from Nokia. This is not something we can procure through a standard purchase order. It has to be issued directly by Nokia as part of the software licensing agreement. We submitted the request and we waited. That license was received on April 13th. Until we had it, we could not complete the NSP installation, which meant we could not do the node buildout in the GUI, which meant we could not verify remote access to the routers. It is a sequential dependency and Nokia held the key.

The second dependency was a DNS record change. Once the NSP was installed and the Nokia license was in hand, we needed a DNS record updated in the PSEG IT environment to enable remote access to the NSP from our network management workstations. That required an IT change request — it went into the change management queue, it had to be reviewed, it had to be approved, and ultimately it had to be escalated to Vic to get it resolved in a timely manner. That process took additional time to work through.

Both of those items are now resolved. The NSP is up. Remote access was confirmed on April 21st. All 31 Phase 1 nodes have been built into the NSP GUI — that was completed on April 23rd by Lee, Rahiq, and Brianna. And the RTU serial test at Hicksville is scheduled for the week of April 27th — the DB9 test cables were delivered to John Ng at Hicksville this week and John has committed to running the test by April 30th.

So the Phase 1 delay was real, but the causes were both external and are both now behind us.

What I want to emphasize is what the team did while those two dependencies were being worked through. We did not slow down. We did not wait. We kept Phase 2 engineering moving at full pace. Site surveys were completed across all 36 Phase 2 sites. IFR and IFC engineering packages were submitted on a rolling basis. Nine IFC packages are already in Hawkeye's hands. The Lindenhurst IFR is due Monday. The overall Phase 2 engineering schedule is intact. That parallel progress is the reason our overall SPI is 0.77 and not something lower — because the Phase 2 work is contributing positive earned value even as the Phase 1 NMS items were pending.

I also want to address the SPI trend directly. We went from 0.80 in March to 0.77 in April. That half-point decline is not because we are falling further behind — it is because we added new planned milestones to the schedule in April as we entered the Phase 2 engineering stretch, which increased the denominator in the SPI calculation. More planned work entered the measurement window, and the ratio adjusted accordingly. It is a sign of the program expanding into its next phase, not of accelerating slippage.

On the recovery plan — let me be specific about each item. The NSP is live and all 31 nodes are built in the GUI — done as of April 23rd. Remote access is confirmed — done as of April 21st. The RTU test is happening the week of April 27th. Once the test is complete, B&M will develop the Method of Procedure for the production RTU migration and we will begin that migration. The SSP configuration review is ongoing — we need to verify that all 31 routers are configured per SSP, and that verification is being done as part of the node buildout confirmation work.

On the SPI chart on this slide — the first four milestones in the table all delivered at SPI 1.00. The NSP access work came in at 0.70 weekly SPI due to the Nokia and DNS delays I described, but it is now complete. Node buildout completed at 1.00 — done. The 9 IFCs to Hawkeye delivered at 1.00 — done. The RTU test circuit is in progress — CNI has run the physical test circuit and John Ng executes the validation test the week of April 27th.

Greg, here is my bottom line on schedule. Phase 1 experienced a delay driven by two specific external dependencies — a Nokia license and an IT DNS change — both of which are now resolved. The team did not sit still while those were being worked through — we kept Phase 2 moving. The project is Yellow but it is recovering. The recovery plan is concrete, it is already in execution, and I am personally tracking every open item on the critical path. My expectation is that we close out all remaining Phase 1 work by end of May, and Phase 2 construction begins on schedule in August."

---

## SLIDE 11 — Financials (~2 minutes)

"On financials — total program spend to date is $5.66 million across 2024, 2025, and 2026. The breakdown is 76% Outside Services — that is Burns and McDonnell, Hawkeye, and Nokia. 18% Materials. 4% Internal Labor. 2% Assessments.

As I covered in the PAR slides, we are preparing a formal Change Request to capture the additional $550,000 plus in unbudgeted PAR capital for 2026. I will also be working with Chad to properly reflect the $495,000 relay labor component in the monthly forecast once the design timeline is confirmed. You will have the formal Change Request within the next two weeks."

---

## SLIDE 12 — Current Risks & Next Steps (~3 minutes)

"On current risks — three items I want to call out specifically.

The first is the condition of the legacy JMUX equipment we are replacing. This infrastructure is over 25 years old and it is brittle. We have already encountered faulty connectors at sites where the parts are no longer available from vendors. There is also risk of brittle fiber patch panels, face plates, and cabling as we work through each site. This creates a real risk of an unplanned outage at any given substation on any given day. We are moving as quickly and as carefully as we safely can, and we are tracking this risk every week. The best mitigation is the project itself — getting the Nokia equipment in place and the JMUX decommissioned. Every site we complete reduces this risk.

The second risk is weather delays during summer construction. Substation installations trigger safety protocols when temperatures exceed 90 degrees. We are planning all critical construction activities in cooler windows and we will monitor the forecast closely throughout the summer months.

The third is potential conflicts with other major substation projects running concurrently. We are coordinating with the other project teams to manage resource and site access conflicts as they arise.

On Next Steps — six items in priority order. One, complete the RTU circuit test with B&M at Hicksville — week of April 27th. Two, confirm all Phase 1 nodes are in the network GUI and accessible remotely, and verify all routers are configured per SSP. Three, complete RTU testing and develop the MOP with B&M for production RTU migration. Four, follow up with Hawkeye to ensure Phase 2 site surveys are scheduled as each remaining IFC is issued. Five, track PAR design progress with Chakrapani and confirm RC-30 equipment delivery for all 6 sites. Six, keep tracking IFR and IFC submittals — 9 of 36 received to date, Lindenhurst due Monday April 27th.

Greg, I am moving on all of these simultaneously. I will keep you updated as each one closes out and I am happy to schedule a follow-up checkpoint in two to three weeks if that would be helpful."

---

## ANTICIPATED QUESTIONS FROM GREG & SUGGESTED ANSWERS

**Q: Why are we 2.8 months behind on Phase 1?**
> "Two specific external dependencies — both now resolved. Nokia's server license for the NSP, which we waited on and received April 13th. And a DNS change request that had to go through IT change management and required escalation to Vic before it was resolved. The moment both were cleared, the team completed the node buildout and confirmed remote access within days. While we were waiting, Phase 2 kept moving."

**Q: Will this impact the overall project completion date?**
> "No. Phase 2 has been running in parallel the entire time, so we haven't lost time on the program's critical path. Phase 2 construction targets August through September as planned. We've also pulled Phase 3 engineering forward into the Phase 2 staging window, which compresses the overall timeline. Full program recovery is projected by end of 2026."

**Q: What exactly is the PAR budget issue and who is responsible for the original scoping gap?**
> "The decision to route PAR circuits through the Nokia infrastructure was made in 2024, prior to my involvement on the project. PAR was held as a Phase 3 placeholder at roughly $30K to $40K with no detailed design or formal cost commitment. The full scope — NERC CIP compliance requiring a serial-to-IP intermediary device at 6 substations — was only discoverable through the Phase 2 detailed site surveys when the relay team was formally engaged for the first time. This is consistent with the project methodology — detailed requirements emerge from detailed engineering, which happens phase by phase. We are submitting a formal Change Request for the additional $550,000 plus in capital."

**Q: Why wasn't the relay team engaged earlier?**
> "The relay team engagement is sequenced with the detailed site surveys — you engage them when you have site-specific engineering data to work from. The surveys happen phase by phase. You cannot do Phase 2 site surveys during Phase 1 — the scope isn't defined yet. When the Phase 2 surveys were done and the relay team was brought in, the scope became clear immediately. The process worked as designed — the gap was in the original budget assumption, not in the execution."

**Q: When will the $495K relay labor hit the budget?**
> "Once Chakrapani's design is complete and we have a confirmed start date from Johnny's relay team, I will work with Chad to spread that $495,000 across the correct months in the forecast. Chad's current numbers show $120K — equipment and design only. The relay labor will be entered separately as a line item once the design timeline is confirmed. The Change Request will capture the full amount."

**Q: When will Phase 1 be fully complete?**
> "Target is end of May for all remaining Phase 1 NMS and RTU activities — RTU test week of April 27th, MOP development in early May, production RTU migration to follow. Phase 1 construction as part of the Phase 2 August through September window."

---
*Prepared by Daminie AI | April 24, 2026*
