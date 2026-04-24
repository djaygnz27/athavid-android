# PRJ13797 JMUX Replacement — CIO Oral Presentation Script
**Presenter:** Dhananjaya Gunaratne | **Audience:** Greg (CIO) | **Date:** April 29, 2026
**Format:** Follow slide by slide. Speak naturally — these are talking points, not a script to read verbatim.

---

## SLIDE 1 — Title

"Good afternoon Greg. I'm here to give you an update on PRJ13797 — the JMUX Replacement program. This is our Private Field Area Network modernization project, replacing the legacy JMUX communications infrastructure across PSEG Long Island's substations with Nokia MPLS nodes. I'll walk you through where we stand on schedule, financials, the PAR migration discovery, current risks, and what we're focused on going forward."

---

## SLIDE 2 — Goals & Objectives

"Just to level-set — this is a large, multi-phase program. The goal is to replace aging JMUX equipment across 129 substations with a modern, reliable MPLS network. We have four workstreams running concurrently — Burns & McDonnell on engineering, Nokia and Graybar on procurement, Hawkeye on construction, and our PSEG team with B&M on deployment and application migration. It's a significant infrastructure undertaking and we've been managing all four tracks simultaneously throughout the project."

---

## SLIDE 3 — Program Overview / Phase Map

"This slide shows the overall program layout and Phase 1 scope. Phase 1 covers 49 substations with 31 Nokia MPLS nodes. This is where our current focus is — completing the NMS buildout and RTU migration work before we move into full Phase 2 construction in August."

---

## SLIDE 4 — PAR Circuit Migration: Background & Discovery

"I want to spend a few minutes on this slide because it explains a scope addition that has financial and schedule implications, and I want to make sure you have the full picture.

The PAR Circuit Migration involves 6 high-voltage substations — Northport, Hicksville, Melville, Lindenhurst, Far Rockaway, and Hewlett — where the existing RTUs communicate using a direct contact serial protocol that is not compatible with the new Nokia MPLS network.

NERC CIP compliance mandates that we cannot connect the Nokia equipment directly to these RTUs — we are required to have an intermediary system in between. That is a non-negotiable compliance requirement, not a design preference.

The solution we selected — and the only viable compliant option — is the Iniven RC-30, which converts direct contact signals to C37.94 IP protocol, allowing the RTU to communicate cleanly with the Nokia network.

Now, the question you may have is — why wasn't this fully scoped and budgeted in 2024? I want to be direct about that. During the 2024 kickoff, PAR was acknowledged at a high level only. There was no detailed design, no cost estimate, and no schedule produced at that time. The 2024 discussion indicated that design costs would fall on the technical security team, but no dollar figure was ever agreed upon or committed.

PAR was carried as a Phase 3 placeholder with a rough budget of approximately $30,000 to $40,000 — which covered only general support, not the full serial-to-IP conversion scope we now understand is required.

This is consistent with our project methodology — detailed requirements are confirmed during each phase's site surveys, not at kickoff. The full technical and compliance scope was simply not visible until the relay team was formally engaged during Phase 2 site surveys.

During those Phase 2 surveys, the relay team reviewed the existing RTU technology site by site, identified the SEL-2595 systems at these 6 substations, and determined that a dedicated intermediary solution was required at each one.

This was the first time the true level of effort and cost was identified — and I want to be clear that this was not a project management oversight. It is a discovery that emerged from the detailed engineering process, exactly as our methodology is designed to work.

Since identifying this, we have moved quickly. We engaged Chakrapani's T&D team for engineering design, placed the PO for the Iniven RC-30 equipment, and are proactively engaging all Phase 3 stakeholders now to prevent any similar gaps going forward."

---

## SLIDE 5 — PAR Circuit Migration: Schedule & Financial Impact

"This slide covers the financial impact and our recovery plan, and I want to walk you through each component carefully.

On the financial side — there are three cost components. The Iniven RC-30 equipment for all 6 sites comes to approximately $59,500, and the PO has been placed. The PAR engineering design by Chakrapani's T&D team is currently in progress — the cost is TBD and will be confirmed once the design scope is complete. The largest component is the installation, configuration, and cutover labor by Johnny's relay team, which is estimated at approximately $495,000 based on labor rates of $1,100 to $1,200 per hour. That work has not yet started.

The total additional unbudgeted funding required is approximately $550,000 or more, and we will be submitting a formal Change Request to capture this.

I also want to flag a specific gap in the current forecast. Chad's April through June forecast currently includes $120,000 — which covers equipment and design only. The $495,000 in relay labor is not yet included in Chad's numbers. Once Chakrapani's design is complete and we have a confirmed start date from Johnny's team, we will work with Chad to spread that labor cost across the appropriate months.

On the schedule side — the direct impact of the PAR migration is approximately 2 to 3 months. However, PAR work is running in parallel with Phase 2 construction and is not on the critical path. Phase 2 deployment remains on schedule for completion in September 2026.

We have also accelerated Phase 3 to reduce overall program risk. Ethan confirmed that Phase 3 site surveys and detail design can begin as soon as Phase 2 staging starts in August. Burns & McDonnell's Phase 3 design is estimated to run from June through December 2026, at an additional cost of approximately $900,000 to $1.29 million — to be confirmed with Chad and B&M quotes.

The projected full recovery for the overall program is end of 2026.

To summarize the recovery actions already taken — the RC-30 PO is placed and equipment is on order. Chakrapani's team is engaged for design. PAR migration is parallelized with Phase 2 so there is no impact to the deployment critical path. Phase 3 engineering has been accelerated. You were informed informally at the All Hands, so this is not a surprise. And we are preparing the formal budget Change Request now.

The two items still in progress are: the Change Request submission, and spreading the $495,000 relay labor across months in Chad's forecast once design is complete."

---

## SLIDES 6, 7 & 8 — Phase 2 Engineering Schedule (36 Sites)

"These three slides show the Phase 2 engineering schedule across all 36 sites. All 36 Phase 2 site surveys are complete — Hawkeye has been out to every site. We have 9 of 36 IFC packages submitted to Hawkeye. The next immediate milestone is Lindenhurst, with an IFR due this coming Monday April 27th. The full IFR schedule runs through June 29th, IFCs follow through July 13th, construction kicks off in August, and deployment completes in September. Phase 2 is on track."

---

## SLIDE 10 — Schedule Status & SPI

"This is an important slide and I want to be fully transparent with you, Greg.

Our overall project status is Yellow — SPI of 0.77 in April, compared to 0.80 in March. I want to explain exactly what's driving that number and why I believe the project is in a recoverable position.

Phase 1 is approximately 2.8 months behind on its remaining activities. The two root causes were entirely external to our team. First, we needed a corporate server license from Nokia to stand up the NSP management system — that license was received on April 13th, after an extended wait on Nokia. Second, once the license was in hand, we needed a DNS record change to enable remote access — that required an IT change request which went through the change management queue and had to be escalated to Vic before it was resolved. Neither of these were delays we could accelerate internally.

What I want to emphasize is what the team did while those dependencies were being resolved. We did not stop. Phase 2 engineering kept moving — site surveys were completed, IFR and IFC packages were submitted, and Hawkeye received the first 9 IFCs to begin their installation planning. That parallel progress is what is keeping our SPI at 0.77 and not dropping into critical territory.

On the SPI chart — we were at 0.80 in March and have moved to 0.77 in April. That slight decline reflects the addition of new planned milestones in the denominator as we entered the Phase 2 engineering stretch. It is not a sign of accelerating slippage.

The recovery plan is concrete and already underway. All 31 Phase 1 Nokia MPLS routers are installed. All 31 nodes are now built into the NSP GUI — that was completed on April 23rd. Remote access to the NSP was confirmed on April 21st. The RTU serial test at Hicksville is scheduled for the week of April 27th — the DB9 test cables were delivered to John Ng this week. Once the RTU test is complete, B&M will develop the MOP and we will begin production RTU migration.

The SSP documentation review and CMDB update coordination, which were flagged as root causes in prior reporting, have also been progressing through the security review queue.

Looking at the milestone SPI table — our first four milestones all delivered at SPI 1.00. The NSP access work came in at 0.70 weekly SPI but is now complete. Node buildout is complete at 1.00. The 9 IFCs to Hawkeye are done at 1.00. The RTU test circuit is in progress — CNI ran the test circuit this week and John Ng will execute the test the week of April 27th.

Greg, the bottom line is this — Phase 1 had a delay driven by two external dependencies that are now both resolved. We kept Phase 2 moving the entire time. The project is Yellow but recovering, the recovery plan is clear and in execution, and I am personally tracking every open item on the critical path."

---

## SLIDE 11 — Financials

"On financials — program total spend to date is $5.66 million across 2024, 2025, and 2026. The breakdown is 76% Outside Services — B&M, Hawkeye, and Nokia — 18% Materials, 4% Internal Labor, and 2% Assessments. As noted on the PAR slides, we are preparing a formal Change Request to capture the additional $550,000 plus in unbudgeted PAR capital for 2026."

---

## SLIDE 12 — Current Risks & Next Steps

"On current risks — there are three I want to call out.

The first is the legacy JMUX equipment condition. This infrastructure is over 25 years old and is brittle. We have already encountered faulty connectors that are no longer readily available from vendors, and there is risk of brittle fiber patch panels, face plates, and cabling as we work through the remaining Phase 1 sites. We are managing this carefully and tracking it every week. The risk of an unplanned outage is real and we are moving as quickly as safely possible to get the new Nokia equipment in place.

The second risk is weather delays. Substation work can be impacted when temperatures exceed 90 degrees Fahrenheit — that triggers safety protocols that can delay installation. We are planning all critical construction activities in cooler windows and monitoring the summer forecast closely. This is a standing risk we track weekly.

The third risk is potential schedule conflicts with other major substation projects running concurrently at PSEG. We are coordinating with the other project teams to avoid resource and access conflicts.

On Next Steps — in priority order: First, work with B&M to complete the RTU circuit test that CNI ran at Hicksville. Second, confirm that all Phase 1 nodes are built into the network GUI and can be accessed remotely — and verify all routers are configured per SSP. Third, complete RTU testing and work with B&M to finalize the MOP for production RTU migration. Fourth, follow up with Hawkeye to ensure Phase 2 site surveys are scheduled as each IFC is issued — 9 of 36 IFCs are already with Hawkeye. Fifth, track PAR control design and confirm equipment delivery for all 6 sites. Sixth, keep tracking IFR and IFC submittals — 9 of 36 received to date, with Lindenhurst due Monday.

Greg, we are moving on all fronts. I am personally driving the PAR PO, the RTU test, and the Phase 2 engineering pace. I'll keep you updated as each of these closes out."

---

## ANTICIPATED QUESTIONS FROM GREG & SUGGESTED ANSWERS

**Q: Why are we 2.8 months behind on Phase 1?**
> "Two external dependencies — Nokia's server license for the NSP, which we received April 13th after an extended wait, and a DNS change request that had to go through IT change management and be escalated to Vic. Both are now resolved. The team kept Phase 2 moving the entire time."

**Q: Will this impact the overall project completion date?**
> "No. Phase 2 engineering ran in parallel throughout, so we haven't lost time on the program's critical path. Phase 2 construction is still targeting August through September as planned. Full program recovery is projected by end of 2026."

**Q: What exactly is the PAR budget issue and who is responsible?**
> "The decision to route PAR circuits through the Nokia infrastructure was made in 2024, prior to my involvement. PAR was held as a Phase 3 placeholder at roughly $30K-$40K with no detailed design or cost commitment. The full scope — NERC CIP compliance requiring an intermediary device at 6 substations — was only discoverable through the Phase 2 detailed site surveys when the relay team was formally engaged for the first time. We are submitting a formal Change Request for the additional $550,000 plus in capital."

**Q: Why wasn't the relay team engaged earlier?**
> "The relay team engagement is sequenced with the detailed site surveys — that is consistent with our project methodology. You don't engage a relay team for detailed design until you have the site-specific engineering data from the surveys. The surveys happen phase by phase, and that is when the full picture emerges."

**Q: When will the $495K relay labor hit the budget?**
> "Once Chakrapani's design is complete and we have a confirmed start date from Johnny's team, we will work with Chad to spread that labor cost across the appropriate months. Chad's current forecast of $120K covers equipment and design only — the relay labor will be added separately once we have the design timeline confirmed."

**Q: When will Phase 1 be complete?**
> "Target is end of May for all remaining Phase 1 NMS and RTU activities, assuming the RTU test the week of April 27th goes well and B&M approves the MOP. Phase 1 construction is part of the August through September window along with Phase 2."

---
*Prepared by Daminie AI | April 24, 2026*
