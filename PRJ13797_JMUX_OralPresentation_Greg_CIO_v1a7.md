# PRJ13797 JMUX Replacement — CIO Oral Presentation Script v1a7
**Presenter:** Dhananjaya Gunaratne | **Audience:** Greg (CIO) | **Date:** April 29, 2026
**Updated:** April 27, 2026 — Incorporates Vic deck review + Chad PAR forecast call
**Format:** Follow slide by slide. Speak naturally — these are talking points, not a script to read verbatim.
**Timing:** Slides 4, 5 = 8–10 min each. Slide 10 (SPI) = 8–10 min. All other slides = 1–3 min.
**Total Estimated Runtime:** ~55–65 minutes including Q&A

---

## SLIDE 1 — Title (~1 minute)

"Good afternoon Greg. Thank you for making the time. I'm here today to give you a comprehensive update on PRJ13797 — the JMUX Replacement program. This is PSEG Long Island's Private Field Area Network modernization effort — replacing the legacy JMUX communications infrastructure across our substations with Nokia MPLS nodes.

I'll walk you through where we stand overall, I'll spend meaningful time on the PAR circuit migration topic because that has financial and schedule implications I want to be fully transparent about, and I'll close with our schedule status, SPI, and what we're focused on for the next 30 to 60 days.

I want this to be a two-way conversation, so please stop me at any point if you have questions."

---

## SLIDE 2 — Goals & Objectives (~3 minutes)

"Greg, we've been at this for seven months now, so I'll keep the overview concise — but I want to make sure we're aligned on how this program is structured before I get into the detail.

The overall goal is to modernize PSEG Long Island's substation communications by replacing aging legacy JMUX equipment with Nokia MPLS nodes — delivering a reliable, scalable, and future-ready network. The JMUX infrastructure is old. Some of it is over 25 years old. It is brittle, parts are no longer manufacturer-supported, and it represents a daily operational risk. This project eliminates that risk across all three phases.

The program runs across four workstreams — Engineering Services led by Burns and McDonnell, Procurement and Staging through B&M, Nokia, and Graybar, Construction and Installation through B&M and Hawkeye, and Deployment and Application Migration led by our PSEG team with B&M. All four are running concurrently across three phases at over 100 substations. The engineering IFC is the gate for everything — nothing gets installed until B&M produces and approves the IFC for that site."

---

## SLIDE 3 — Program Overview / Phase Map (~2 minutes)

"This slide shows the overall program structure. Phase 1 covers 31 Nokia MPLS nodes — that work is largely complete with a few remaining items I'll cover on the schedule slide. Phase 2 covers 36 sites — engineering is well underway and construction is scheduled to begin in August 2026. Phase 3 covers the remaining 31 sites.

One important update here — we have made a deliberate decision to pull Phase 3 site surveys and initial engineering into the Phase 2 window. We are starting Phase 3 design work during Phase 2 staging, which is estimated to begin around August 2026. This is how we recover from the PAR schedule impact I am about to walk you through, and it keeps the overall program on track for a November 2027 completion."

---

## SLIDE 4 — PAR Circuit Migration: Background & Discovery (~8–10 minutes)

"I want to spend real time on this slide, Greg, because this topic has financial implications and I want you to understand the full story — the context, how it was discovered, and why this is not a project management failure.

**What is PAR Circuit Migration?**

PAR stands for Phase Angle Regulator. These are high-voltage devices at certain substations that regulate power flow on transmission lines. The RTUs — Remote Terminal Units — at these 6 substations communicate using a direct-contact serial protocol. That protocol is decades old and was designed to talk to legacy JMUX equipment — which is exactly what we are replacing.

Here is the technical problem. When we connect the new Nokia MPLS nodes at these substations, the RTUs cannot talk directly to Nokia. Nokia uses IP-based communication. The RTUs use direct-contact serial. You cannot bridge those two protocols without an intermediary system in between.

And here is the compliance dimension — and this is what drives the cost. NERC CIP — the North American Electric Reliability Corporation Critical Infrastructure Protection standards — mandates that we cannot simply daisy-chain the Nokia equipment and the RTU together. NERC CIP requires a dedicated intermediary system at these substations. This is not optional. It is a federal regulatory requirement. There is no workaround. There is no waiver. If we do not implement the intermediary solution, PSEG Long Island is out of NERC CIP compliance — and the penalties for NERC CIP non-compliance are significant. So the compliance mandate removes any debate about whether we do this. We do it. The only questions are how and how much.

**The Solution — Iniven RC-30**

The solution we selected — and I want to be clear, it is the only viable compliant solution after evaluating all available technology options at each of the six substations — is the Iniven RC-30.

The RC-30 is a protocol converter. It converts the direct-contact serial signals from the RTU into C37.94 IP protocol, which the Nokia network can then process. One unit per site. It is important to note that the RC-30 is NOT a programmable device under NERC CIP definitions — that means installing it does not create additional cyber security exposure or additional NERC CIP obligations. It is a hardware converter. Clean, simple, compliant.

The six substations that require this are: Northport, Hicksville, Melville, Lindenhurst, Far Rockaway, and Hewlett.

Our Relay Protection Engineering team and our Implementation team have been engaged and are preparing for design and installation. Iniven RC-30 equipment has an 8-week lead time, which I will come back to on the next slide.

**How Was the Full Scope Discovered?**

Now — the question I expect you are thinking is: why wasn't this fully scoped and budgeted from the beginning? I want to address that directly and honestly.

During the 2024 requirement gathering for this project, PAR was discussed. It was acknowledged at a high level. But here is what did not happen in 2024 — there was no detailed design engagement with the relay or engineering teams, no formal cost estimate, and no budget commitment. PAR was carried as a Phase 3 placeholder in the project budget with a rough allowance of approximately $30,000 to $40,000, included in RTU migrations. That figure covered general support — not a serial-to-IP conversion system at 6 high-voltage substations with NERC CIP compliance requirements.

This is consistent with how large infrastructure programs are planned and executed. At kickoff, you capture what you know at a high level. Detailed requirements are confirmed phase by phase, during site surveys, when the engineering team is physically on-site and engaging directly with the existing equipment and the subject matter experts.

During Phase 2 detailed site surveys and design, our engineering and relay teams were formally engaged to capture the full technical requirements for the RTUs planned for Phase 2. That engagement — for the first time in the project — produced a site-by-site review of the existing RTU technology. And that review revealed the full technical and compliance scope. Six specific substations identified. The dedicated intermediary solution confirmed as mandatory. The true level of effort and cost first identified at this point.

I want to be direct: this was not a project management oversight. In 2024, there was no detailed design. The relay team was not formally engaged. Nobody at that stage had done a site-by-site RTU technology review. The scope gap was not knowable from the information available at the time. It became fully visible when the engineering team did the detailed Phase 2 work they were supposed to do — and that is exactly when it should have surfaced.

**What Have We Done Since Discovery?**

The moment this scope was confirmed, the project team moved immediately. We evaluated all available technology options at each of the six sites. We confirmed the compliance requirements with the NERC CIP team. We selected the Iniven RC-30 as the only viable compliant solution. We proactively engaged our relay protection engineering team and our implementation team. We placed the equipment order — 8-week lead time from Iniven. And we have worked up a full cost estimate, which I will cover on the next slide.

I personally want to own the communication of this to you today. No surprises later. Full transparency now."

---

## SLIDE 5 — PAR Circuit Migration: Schedule & Financial Impact (~8–10 minutes)

"Now I want to walk you through the schedule and financial impact of the PAR migration — and I want to give you both the problem and the solution, because we have a recovery plan and it is already in motion.

**Schedule Impact — The Honest Picture**

The PAR migration has a direct schedule impact on the overall JMUX program. Let me break it down into its three components.

First — hardware procurement. The Iniven RC-30 units have an 8-week lead time. We have proactively placed the order, so the clock is already running. That means equipment delivery in approximately late June to early July 2026. That is the earliest we can begin installation at any of the 6 sites.

Second — PAR engineering design and implementation. Our relay protection engineering team — Chakrapani's team — needs to complete the design for each of the 6 sites. That includes the detailed circuit design, the interface specification between the RC-30 and the RTU, and the integration design into the Nokia MPLS network. That design work, across 6 sites, is estimated at approximately 5 months of calendar time from start to completion. The implementation team — Johnny's team — then executes the physical installation, configuration, and cutover at each site. That work runs sequentially behind the design.

Third — migration and testing. The physical cut-over at each site, moving the PAR circuit from the legacy serial connection to the new Iniven RC-30/Nokia path, with full functional testing and NERC CIP compliance verification.

**What This Means Without Mitigation**

If we had NOT discovered this until Phase 3 — as originally planned — and tried to execute this work in Phase 3 sequence, the cumulative impact would have extended the project from our planned November 2027 completion to approximately May 2028. That is a 5 to 6 month schedule slip to the overall program end date.

**Our Recovery Plan — No Impact to November 2027**

Here is what I want you to hear clearly, Greg: we are not accepting a May 2028 completion. We have a recovery plan that keeps us at November 2027, and it is already in execution.

The recovery strategy has four components that run in parallel:

One — we ordered the RC-30 equipment immediately upon confirming the scope. Lead time is 8 weeks. Equipment will be on site in time for the Phase 2 construction window, so there is no wait between design completion and installation start.

Two — PAR engineering design is running in parallel with Phase 2 construction. Chakrapani's team will be designing the PAR solution at the same time as Phase 2 router installations are happening. These workstreams do not block each other. Phase 2 deployment is not delayed while PAR design proceeds.

Three — PAR implementation and testing will be parallelized with Phase 2 and Phase 3 activities wherever the site schedule allows. The 6 PAR sites are distributed across the Phase 2 footprint, so we can sequence them efficiently alongside the normal Phase 2 construction flow.

Four — and this is the Phase 3 acceleration component — we are proactively pulling Phase 3 site surveys and MPLS design into the Phase 2 staging period. As soon as Phase 2 staging begins in approximately August 2026, B&M will begin Phase 3 site surveys and detail design. By starting Phase 3 engineering 12 to 18 months ahead of when we would have otherwise, we compress the overall program timeline and recover the schedule buffer consumed by the PAR work.

The bottom line: no schedule impact to Phase 2 deployment, which completes September 2026. No change to overall program completion of November 2027. The PAR work is being absorbed through parallelization and Phase 3 front-loading.

**Financial Impact**

Now let me walk you through the numbers, because I want to be precise.

The PAR migration cost has three components.

The first is PAR engineering design — Chakrapani's team. The estimate provided is 200 hours per site, at $200 per hour, across 6 sites. That is 200 hours times 6 sites times $200 — that is $240,000.

The second is PAR installation, configuration, and cutover labor — Johnny's relay implementation team. The estimate is 1,000 total hours across all 6 sites at $200 per hour. That is $200,000.

The third is materials — cables, connectors, mounting hardware, and a contingency buffer to ensure we do not need a separate change order for incidentals. We have set that at $30,000.

Total PAR cost: $240,000 plus $200,000 plus $30,000 equals $470,000. We are rounding to $530,000 to include a 10 to 15% contingency buffer given the complexity of working in live substation environments with NERC CIP compliance requirements. This is prudent project management, not padding.

The second component of the total funding request is Phase 3 acceleration. Pulling Phase 3 site surveys and MPLS design into Phase 2 is not free — it requires B&M engineering resources during a period that was not budgeted for that work. The Phase 3 site survey cost, based on the same per-site rate used for Phase 2, is estimated at $74,000 for 31 sites. The additional Phase 3 MPLS detail design is being finalized with B&M but is estimated in the range of $700,000 to $800,000. We are using $800,000 as the request.

Total additional funding request for 2026: $530,000 PAR plus $800,000 Phase 3 acceleration equals $1.28 million, which we are rounding to $1.2 million for the formal change request.

I want to be transparent about where this stands today. The PAR cost estimate has been received from both Chakrapani's team and Johnny's team. The Phase 3 acceleration figure is being confirmed with B&M. I am working with Chad to properly reflect both components in the monthly forecast, spread across the appropriate months once design start dates are confirmed. You will have a formal Budget Change Request within the next two weeks.

Greg, this is a significant number. I am not minimizing that. But I want to put it in context. The NERC CIP compliance requirement is non-negotiable. The discovery process worked exactly as it should have for a multi-phase program of this scale and complexity. And we have a clear, executable plan to absorb the work without slipping the program timeline. The $1.2 million is what it costs to do this right — compliantly, safely, and on schedule."

---

## SLIDES 6, 7 & 8 — Phase 2 Engineering Schedule (36 Sites) (~2 minutes)

"These slides show the Phase 2 engineering schedule across all 36 sites. I want to highlight a few important points.

All 36 Phase 2 site surveys are complete. Hawkeye has been to every site and the engineering team has all the field data they need. That is a significant milestone.

We currently have 9 of 36 IFC packages submitted to Hawkeye — those are already being used to plan site-specific installation work. The next IFR milestone is Lindenhurst, due April 27th — today. Baldwin is due May 4th. The full IFR schedule runs through June 29th. All IFCs follow by July 13th. Phase 2 construction kicks off in August, and deployment completes in September 2026.

Phase 2 engineering is on track. I am not concerned about that timeline."

---

## SLIDE 9 — Phase 1 Remaining Items (~2 minutes)

"Before I get to the SPI slide, I want to close out Phase 1 explicitly because there are three active items.

One — RTU serial testing at Hicksville. John Ng confirmed via email this week that the DB9 test cables have been run. The test is scheduled for the week of April 27th. Once complete, B&M will develop the Method of Procedure for production RTU migration.

Two — Remote node verification. All 31 Phase 1 nodes have been built into the NSP GUI as of April 23rd. Lee, Rahiq, and Brianna completed that work. Remote login verification to each of the 31 nodes is next — scheduled to complete by May 9th.

Three — SSP configuration review. We need to verify all 31 routers are configured per SSP. That verification is being done as part of the node buildout confirmation work.

My target is to have all three Phase 1 close-out items complete by end of May 2026."

---

## SLIDE 10 — Schedule Status & SPI (~8–10 minutes)

"This is the slide I want to spend the most time on, Greg, because I believe in full transparency on schedule performance. I want you to understand the complete picture — the number, what is behind it, the causes, and what the recovery trajectory looks like.

**Overall Status: Yellow**

Our overall project status is Yellow. The SPI — Schedule Performance Index — is 0.77 in April. In March it was 0.80. We moved slightly in the wrong direction over the past month, and I want to explain exactly why.

**What SPI Means**

For context — SPI is the ratio of Earned Value to Planned Value. An SPI of 1.0 means you have completed exactly as much work as you planned to complete by this date. An SPI below 1.0 means you are behind plan. At 0.77, we have completed approximately 77 cents of work for every dollar we planned to have done by now.

The Yellow band on our project is defined as 0.70 to 0.90. We are in Yellow. We are not in Red, which is below 0.70. But we are not where I want to be, and I am not going to stand here and tell you 0.77 is fine. It is not fine. I am going to tell you exactly what caused it and what we are doing about it.

**What is Driving the 0.77**

The SPI impact is concentrated entirely in Phase 1 — specifically in three items: completing remote access to the Nokia NSP management system, finishing the node buildout in the NMS GUI, and completing the RTU serial test at Hicksville. Those three items, all in Phase 1, are what pulled the SPI below 1.0.

The root cause was two specific external dependencies that were outside our team's control.

The first was the Nokia server license. To stand up the NSP — the Nokia Network Services Platform, the management system for all 31 Phase 1 MPLS routers — we needed a corporate software license issued directly by Nokia. This is not a standard purchase order item. Nokia issues it as part of their licensing agreement process. We submitted the request. We waited. That license was received on April 13th. Until we had it, the NSP could not be installed. Until the NSP was installed, the node buildout could not be completed. Until the node buildout was complete, we could not verify remote access to the routers. It is a hard sequential dependency and Nokia held the critical path item.

The second dependency was a DNS record change. Once the NSP was installed and the license was in hand, we needed a single DNS record updated in the PSEG IT environment to enable remote access from our network management workstations to the NSP. That required an IT change request — it went into the change management queue, it was reviewed, approved, and ultimately required escalation to Vic to get it resolved in a timely manner. That process consumed additional calendar time.

Both of those items are now behind us. The NSP is live. Remote access was confirmed on April 21st. All 31 Phase 1 nodes were built into the NSP GUI and completed on April 23rd by Lee, Rahiq, and Brianna. The RTU serial test at Hicksville is happening the week of April 27th — test cables are in place and John Ng has committed to completing the test by April 30th.

**What the Team Did During the Delay**

I want to be explicit about what the team did while those two external dependencies were being worked through. We did not slow down. We did not wait. We kept Phase 2 engineering running at full pace.

All 36 Phase 2 site surveys were completed. IFR and IFC engineering packages were being submitted on a rolling basis. 9 IFC packages are already in Hawkeye's hands. The Lindenhurst IFR was due today. The Phase 2 engineering schedule is intact and on track. That parallel Phase 2 progress is a significant reason our SPI is 0.77 and not something materially lower — Phase 2 earned value is offsetting the Phase 1 NMS delay in the SPI calculation.

**The SPI Trend — March 0.80 to April 0.77**

I want to address this half-point decline directly because I do not want it to be misread. We went from 0.80 in March to 0.77 in April. That decline is partly explained by the Phase 1 NSP items being worked through. But it is also partly explained by something positive — in April, we added new planned milestones to the schedule baseline as we entered the Phase 2 engineering stretch. More planned work entered the measurement window. The denominator in the SPI calculation increased. When you add new planned work to the baseline, the SPI ratio adjusts. This is not masking slippage — it is a mathematical effect of the program expanding into its next phase and reflects the increased scope of work now actively in scope.

**SPI Milestone Table**

Looking at the specific milestones on this slide — the first four delivered at SPI 1.00: iLO Corporate Connectivity, BGP Layer 3 Design, Fiber Termination/NSP Remote Access, and BGP Design Approval. All on time, all at 1.00.

The NSP access milestone came in at a weekly SPI of 0.70 due to the Nokia license and DNS delays. But it is complete as of April 21st. Node buildout into the NSP GUI completed at 1.00 — done April 23rd. The 9 IFC packages to Hawkeye delivered at 1.00 — on time. The RTU test circuit at Hicksville is in progress — CNI has physically run the test circuit, John Ng executes the validation test the week of April 27th.

**The SPI Recovery Trajectory**

Here is where I expect the SPI to go from here.

May 2026 — Phase 1 close-out items complete. RTU serial test done by April 30th, node verification by May 9th, SSP configuration review and production RTU MOP developed by end of May. These completions will contribute earned value and pull the cumulative SPI back upward. I expect to see cumulative SPI move from 0.77 toward 0.82 to 0.84 by the end of May.

June through August 2026 — Phase 2 IFR and IFC completions deliver strong earned value as all 36 engineering packages close out. This is a concentrated period of milestone completions and the SPI trend should be consistently positive through this window.

September 2026 — Phase 2 construction and deployment milestones complete. Strong earned value contribution. SPI expected to reach 0.90 or above by end of Phase 2.

I am targeting an SPI at or above 0.90 — which is the Green threshold on our project — by the time we complete Phase 2 in September 2026. That is a realistic and achievable trajectory based on the scheduled work.

**My Commitment**

Greg, here is my bottom line on schedule. Phase 1 experienced a real delay driven by two external dependencies — both of which are now resolved. The team maintained full Phase 2 momentum while those were being worked. The project is Yellow but it is recovering. The recovery plan is specific, it is already in execution, and I am personally tracking every open item on the critical path.

My commitments to you:

One — all remaining Phase 1 items close out by end of May 2026.
Two — Phase 2 construction begins on schedule in August 2026.
Three — Phase 2 deployment completes September 2026.
Four — overall program remains on track for November 2027 completion.
Five — PAR migration is parallelized and absorbed — no net schedule impact to the program end date.

I will provide you a monthly SPI update going forward so you always have visibility into the trend."

---

## SLIDE 11 — Financials (~2 minutes)

"On financials — total program spend to date is $5.66 million across 2024, 2025, and 2026. The breakdown is 76% Outside Services — Burns and McDonnell, Hawkeye, and Nokia. 18% Materials. 4% Internal Labor. 2% Assessments.

As I covered in the PAR slides, we are preparing a formal Budget Change Request to capture $1.2 million in additional funding — $530,000 for the PAR circuit migration and $800,000 for Phase 3 engineering acceleration. I am working with Chad to reflect both components in the monthly forecast, spread properly across months once design start dates are confirmed with Chakrapani's team and B&M. You will have the formal Change Request within the next two weeks.

I also want to flag that the overall project is tracking a projected financial variance of approximately $668,000. This is driven primarily by the PAR scope discovery and the Phase 3 acceleration investment. The formal Change Request will address this variance and get the project baseline re-aligned."

---

## SLIDE 12 — Current Risks & Next Steps (~3 minutes)

"On current risks — three items I want to call out.

The first is the condition of the legacy JMUX equipment we are replacing. This infrastructure is over 25 years old. It is brittle. We have already encountered faulty connectors and components where parts are no longer manufacturer-supported. There is risk of an unplanned outage at a substation on any given day as long as JMUX is in service. We are moving as quickly and safely as we can, and the best mitigation is the project itself — every site we complete removes a piece of brittle infrastructure from the operational risk picture.

The second risk is weather delays during Phase 2 summer construction. Substation installations trigger safety protocols in high-heat conditions. We are building scheduling flexibility around summer temperature windows.

The third is coordination with other major substation projects running concurrently. We are actively managing resource and site access conflicts.

On Next Steps — six priorities, in order:

One — complete RTU serial test at Hicksville, week of April 27th. John Ng confirmed cables are in place.
Two — complete remote verification of all 31 Phase 1 nodes against NSP. Due May 9th.
Three — complete RTU testing and develop Production RTU Migration MOP with B&M. Due end of May.
Four — track PAR design progress with Chakrapani — confirm design start dates for all 6 sites and RC-30 delivery confirmation from Iniven.
Five — monitor IFR and IFC submittals — 9 of 36 received, Lindenhurst due today, Baldwin due May 4th.
Six — finalize and submit Budget Change Request for $1.2M — within two weeks.

Greg, I am actively working all six of these. I will keep you updated and I am happy to set a follow-up checkpoint in three to four weeks if that would be helpful."

---

## ANTICIPATED QUESTIONS — BE READY FOR THESE

**Q: Why didn't we know about PAR from the start?**
"During 2024 requirement gathering, PAR was acknowledged at a high level but no detailed design or formal cost estimate was produced. The relay engineering team was not formally engaged until Phase 2 site surveys. The full technical and compliance scope became clear only through that detailed engagement. This is consistent with how multi-phase infrastructure programs are planned — not an oversight, a discovery process working correctly."

**Q: Can we avoid the PAR cost? Is the RC-30 really the only option?**
"We evaluated all available technology options at each of the six sites. NERC CIP compliance removes alternatives — we cannot connect Nokia directly to these RTUs without an intermediary system. The Iniven RC-30 was confirmed as the only compliant solution. We have no choice on the compliance requirement. We made the best possible technology choice within that constraint."

**Q: Why did SPI drop from 0.80 to 0.77?**
"Two factors. First, the Nokia NSP license delay and DNS change consumed time in April. Both are now resolved. Second, we added new Phase 2 planned milestones to the baseline in April which increased the planned value denominator in the SPI calculation. The downward movement is not accelerating slippage — it is partly a measurement effect of the program expanding. I expect the SPI to begin recovering in May as Phase 1 close-out milestones complete."

**Q: Are you confident Phase 2 construction still starts in August?**
"Yes. All 36 site surveys are complete. 9 IFCs are already with Hawkeye. The IFR/IFC schedule through July is intact and on track. There is nothing blocking Phase 2 construction from starting in August."

**Q: What is the total funding we need above budget?**
"$1.28 million, rounded to $1.2 million. $530,000 for PAR circuit migration — engineering design, installation labor, and materials across 6 substations. $800,000 for Phase 3 acceleration — site surveys and MPLS detail design being pulled into Phase 2 to recover the schedule impact. Formal Budget Change Request will be submitted within two weeks."

**Q: When will the project be done?**
"November 2027 — unchanged. The PAR work is being executed in parallel with Phase 2 and Phase 3 activities. The Phase 3 acceleration strategy absorbs the schedule impact. We are not changing the program end date."

---

*End of Oral Presentation Script — v1a7*
*Total estimated delivery time: 55–65 minutes including Q&A*
