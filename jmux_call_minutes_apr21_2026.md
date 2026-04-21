# JMUX Weekly Call — Meeting Minutes
**Date:** Tuesday, April 21, 2026
**Captured by:** Daminie (AI)

---

## ATTENDEES
- Jay Gunaratne (PSEG LI / LDNA — PM)
- Lee (PSEG LI)
- Ethan Koch (Burns & McDonnell)
- Wayne
- Vinny Montano (Hawkeye)
- Ricky Cabrera (late/absent)
- Eric (facilitator)

---

## 1. NSP CONFIGURATION — DNS ISSUE 🔴

**Status:** 90% complete — blocked on DNS entry update

**Issue:**
- NSP license was received and stood up ~April 13
- DNS entry has NOT been updated by PSEG IT despite request submitted several days ago
- Lee cannot resolve the NSP hostname — page won't load
- Root cause confirmed: DNS entry pointing to .11 needs to be changed to .15; similarly .21 needs to change to .25

**Key finding during call:**
- Wayne tested navigation directly to the .15 IP address — it IS redirecting correctly to the NSP cluster webpage
- This confirms the NSP appliance itself is working correctly
- The ONLY blocker is the DNS record update — a one-line change, could be done in 5 minutes with access

**Action taken on call:**
- Jay escalated to Vic — asked him to review Lee's email and push for DNS update
- Ethan to invite Jay and Wayne to a follow-up call after this meeting to confirm navigation and access

**Action Items:**
| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Escalate DNS update to Vic — change .11 → .15 and .21 → .25 | Jay / Vic | TODAY |
| 2 | Hop on call with Wayne after this meeting — confirm NSP navigation and access | Ethan / Wayne / Jay | TODAY |
| 3 | Once DNS resolved — confirm all Nokia routers accessible via NSP GUI | Lee / Wayne | ASAP |

---

## 2. RTU SERIAL TESTING — DB9 CABLE 🟡

**Status:** Unblocked — Vinny going to site

**Issue:**
- John Ng suggested ordering a 50-foot DB9 serial cable for the RTU test
- Jay noted Hawkeye warehouse should already have extra cables from the project order

**Resolution:**
- Vinny confirmed he will go to Hawkeye warehouse to verify cable availability
- Jay to call Vinny after this meeting to push visit to TODAY instead of tomorrow
- If cable is available at Hawkeye — no need to order new cable, no 2-week wait

**Action Items:**
| # | Action | Owner | Due |
|---|---|---|---|
| 4 | Call Vinny — push warehouse visit to today (not tomorrow) | Jay | TODAY |
| 5 | Vinny verifies 50-ft DB9 cable at Hawkeye warehouse | Vinny | TODAY/Tomorrow |
| 6 | Bring cable to Hicksville for RTU serial port test | Vinny | TBD |

---

## 3. NOKIA TRAINING 🟡

**Status:** Pending — Jay to speak with Glenn

- Jay confirmed he will follow up with Glenn (Nokia) on training dates
- No further detail discussed on this call

**Action Items:**
| # | Action | Owner | Due |
|---|---|---|---|
| 7 | Contact Glenn (Nokia) — confirm training dates and attendee list | Jay | This week |

---

## 4. ENGINEERING — IFR/IFC PACKAGES 🟢

**Status:** On schedule

- **Hewlett & Hewlett Shelter IFR** — submitted yesterday (April 20) ✅ — now with Lee for review
- **4 previous IFC packages** — sent back by Ethan; Lee confirmed receipt
- **Lindenhurst IFR** — due next Monday, April 27 (referred to as "London Hearst" in call — confirmed Lindenhurst)
- **Hawkeye site surveys** — Vinny confirmed he received ~9 IFC packages; sending crews out to field to begin site surveys and collect field data
- Ethan sent all 6 IFC packages to Vinny in one email (Kings Highway + 5 others) — confirmed contained

**Action Items:**
| # | Action | Owner | Due |
|---|---|---|---|
| 8 | Review Hewlett & Hewlett Shelter IFR packages | Lee | ASAP |
| 9 | Lindenhurst IFR submission | Burns & McDonnell (Nick) | Mon 4/27/26 |
| 10 | Hawkeye field crews begin site surveys from 9 IFC packages | Vinny / Field crews | This week |

---

## 5. PAR EQUIPMENT 🔴

- Jay confirmed he already spoke to Chuck Crapani about the PARs
- No further detail discussed — action to place PO for Iniven RC-30 remains open

---

## SUMMARY — OPEN ACTION ITEMS

| # | Action | Owner | Due |
|---|---|---|---|
| 1 | Escalate DNS update — .11→.15 and .21→.25 | Jay / Vic | TODAY |
| 2 | Post-call: confirm NSP navigation with Wayne | Ethan / Wayne | TODAY |
| 3 | Confirm all Nokia routers accessible via NSP GUI | Lee / Wayne | ASAP |
| 4 | Call Vinny — push warehouse visit to today | Jay | TODAY |
| 5 | Verify 50-ft DB9 cable at Hawkeye warehouse | Vinny | TODAY |
| 6 | Bring DB9 cable to Hicksville for RTU test | Vinny | TBD |
| 7 | Contact Glenn (Nokia) — confirm training dates | Jay | This week |
| 8 | Review Hewlett & Hewlett Shelter IFR | Lee | ASAP |
| 9 | Lindenhurst IFR submission | BMcD / Nick | Mon 4/27 |
| 10 | Hawkeye field crews begin site surveys (9 IFC packages) | Vinny | This week |
| 11 | Place PO — Iniven RC-30 (6 sites) ⚠️ CRITICAL | Jay | IMMEDIATELY |
