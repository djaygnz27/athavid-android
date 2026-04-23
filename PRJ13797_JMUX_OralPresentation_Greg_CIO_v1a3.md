# PRJ13797 JMUX Replacement — CIO Oral Presentation Script
**Presenter:** Dhananjaya Gunaratne | **Audience:** Greg (CIO) | **Date:** April 2026
**Format:** Follow slide by slide. Speak naturally — these are talking points, not a script to read verbatim.

---

## SLIDE 1 — Title

"Good [morning/afternoon] Greg. I'm here to give you an update on PRJ13797 — the JMUX Replacement program. This is our Private Field Area Network modernization project, replacing the legacy JMUX communications infrastructure across PSEG Long Island's substations with Nokia MPLS nodes. I'll walk you through where we are on schedule, our financials, current risks, and what we're focused on to keep things moving."

---

## SLIDE 2 — Goals & Objectives

"Just to level-set — this is a large, multi-phase program. The goal is to replace aging JMUX equipment across 129 substations with a modern, reliable MPLS network.

We have four workstreams running concurrently. Burns & McDonnell is handling all engineering — site surveys, rack designs, and producing the IFR, IFC, and As-Built documents. Nokia and Graybar are managing equipment procurement and staging. Hawkeye is our construction contractor — they're doing the physical installation at each site. And our PSEG team, together with B&M, is handling the network deployment and application migration.

In terms of scale — we're talking 129 substations, 74 MPLS sites, 36 RTU sites, and 79 Nokia MPLS nodes across three phases. It's a significant infrastructure undertaking."

---

## SLIDES 3 & 4 — [Phase 1 Overview / Program Map]

"These slides show the overall program layout and Phase 1 scope. Phase 1 covers 49 substations with 31 Nokia MPLS nodes. This is where our current focus is — completing the NMS buildout and RTU migration work before we move into full Phase 2 construction."

---

## SLIDES 5, 6 & 7 — Phase 2 Engineering Schedule (36 Sites)

"These three slides show the Phase 2 engineering schedule across all 36 sites. I want to highlight something positive here — all 36 site surveys for Phase 2 are complete. Hawkeye has been out to every site.

The engineering packages — IFRs and IFCs — are progressing on schedule. We have 9 of 36 IFC packages already submitted to Hawkeye to begin their site-specific installation planning. The next immediate milestone is Lindenhurst, with an IFR due this coming Monday, April 27th.

The full IFR schedule runs through late June, with all IFCs following in July. Construction kicks off in August across all sites, with deployment completing in September. Phase 2 is on track."

---

## SLIDE 8 — Schedule Status

"This is the most important slide, so I want to be transparent with you, Greg.

Our overall project status is **Yellow** — SPI of 0.77. But I want to give you the full picture because there are two separate stories here.

**Phase 1 is approximately 2.8 months behind** on its remaining activities. Specifically — getting full remote access to the Nokia NSP management system, completing the node buildout in the NMS GUI, and executing the RTU test circuit at Hicksville.

The reason for this delay was entirely outside our control. We needed a corporate server license from Nokia to stand up the NSP. We waited on Nokia for that license — it was received on April 13th. Once we had it, we needed a DNS record change to enable remote access. We opened an IT change request, escalated it to Vic, and it was resolved — but that process took time to work through the change management queue. Neither of these delays were something we could accelerate internally.

**However — Phase 2 is on track and running in parallel.** While we were waiting on Nokia and the DNS ticket, our team kept moving forward. Engineering packages are being delivered, site surveys are complete, and Hawkeye has the IFCs they need to start planning. That parallel progress is what's keeping our overall SPI at 0.77 rather than dropping into the critical range.

The SPI chart shows we were at 0.80 in March, and we've moved to 0.77 in April as we've added more planned milestones to the denominator. The recovery plan is clear — close out the Phase 1 NMS buildout this week, complete the RTU test, and keep Phase 2 engineering on its current pace.

Looking at the milestone table — our first four milestones all delivered at SPI 1.00 each. The NSP access work is at 0.70 weekly SPI — in progress. Node buildout is back to 1.00 — the team expects to complete that by Friday April 24th. The 9 IFCs to Hawkeye — done at 1.00. The RTU test circuit is still pending — CNI will run the test circuit so we can validate RTU communication before we touch any production equipment."

---

## SLIDE 9 — Financials

"On financials — program total spend to date is $5.66 million across 2024, 2025, and 2026.

The breakdown is: 76% Outside Services — that's B&M, Hawkeye, and Nokia. 18% Materials — equipment and cabling. 4% Internal Labor. 2% Assessments.

I do need to flag a budget variance that we are working through. The PAR circuit migration — Phase Angle Regulator circuits at 6 high-impact substations — requires a serial-to-IP conversion solution using Iniven RC-30 devices. This was a design decision made in 2024, prior to my involvement on the project, and it was not fully budgeted in the original capital plan. We are currently preparing a formal Change Request to capture the additional 2026 capital requirements. I'll have that to you shortly."

---

## SLIDE 10 — Current Risks & Next Steps

"On risks — there are a few I want to call out.

The most significant risk is the **Iniven RC-30 equipment order** for the PAR migration. These devices have an 8-week lead time and the PO has not yet been placed. This is on my critical path and I am personally driving this to closure immediately.

We also have a risk around legacy equipment condition. Some of the JMUX equipment we're replacing is over 25 years old. We've already encountered faulty connectors and brittle fiber components that aren't readily available from vendors. We're managing this carefully and tracking it weekly.

Weather is also a standing risk — substation work can be delayed when temperatures exceed 90 degrees. We're planning critical construction activities in the cooler windows this summer.

On Next Steps — our priorities in order are:

First — complete the Phase 1 node buildout in the NMS GUI. The team is targeting this Friday, April 24th.

Second — execute the RTU test circuit at Hicksville with B&M. CNI is running the test circuit so we can verify communication before touching any production RTU.

Third — once the RTU test is validated, work with B&M on the MOP and begin production RTU migration.

Fourth — place the PO for the Iniven RC-30 devices. 8-week lead time — this needs to happen now.

Fifth — keep pushing Phase 2 IFR/IFC submittals. Lindenhurst is due Monday. Baldwin is due May 4th.

Sixth — follow up with Hawkeye to ensure Phase 2 site surveys are scheduled as each IFC is issued.

Greg, the bottom line is this — Phase 1 had a delay driven by external dependencies we couldn't control. We didn't sit still — we kept Phase 2 moving the entire time. The project is Yellow but recovering, and we have a clear, actionable plan to get back to green."

---

## ANTICIPATED QUESTIONS FROM GREG & SUGGESTED ANSWERS

**Q: Why are we 2.8 months behind on Phase 1?**
> "The core issue was waiting on Nokia for a corporate server license for the NSP management system. That's a single-vendor dependency — we can't proceed without it. Once we received it on April 13th, we hit a second dependency — a DNS change request that had to go through IT change management and be escalated to Vic. Both of those are now resolved and we're actively closing out the remaining Phase 1 work."

**Q: Will this impact the overall project completion date?**
> "The overall program timeline is not at risk. Because Phase 2 engineering has been running in parallel throughout this period, we haven't lost time on the program's critical path. Phase 2 construction is still targeting August through September as planned."

**Q: What's the PAR budget issue?**
> "The PAR circuit migration was scoped in 2024 as part of the JMUX replacement. The decision to route PAR circuits through the new Nokia infrastructure was made before I joined the project. The cost of the serial-to-IP conversion devices — Iniven RC-30 — wasn't fully captured in the original budget. We're formalizing a Change Request to address it. The total additional capital required for 2026 is approximately $500,000."

**Q: When will Phase 1 be complete?**
> "Our target is to close out all remaining Phase 1 NMS and RTU activities by end of May, assuming the RTU test goes well and the MOP is approved by B&M. Construction at Phase 1 sites is scheduled for August."

---
*Prepared by Daminie AI | April 23, 2026*
