# JMUX Replacement Project — Meeting Minutes (Part 2)
**Date:** April 7, 2026
**Participants:** Jay (PM), Ethan, Brianna, Nick, Tony (and waiting on Lee)
**Topic:** Remote Connectivity Status, NSP Setup, RTU Serial Testing, IFR Package Updates

---

## 1. REMOTE CONNECTIVITY — STATUS UPDATE ✅

- **ACC3 router** is now accessible remotely
- Lee and **Brianna** worked on ACC3 to resolve missing configuration (likely a copy/paste error)
- ACC3 was passing traffic correctly — issue only apparent when trying to log in
- **All routers now confirmed accessible via direct SSH** remotely
- Item **3AI (BGP iLO configuration)** = ✅ COMPLETE
  - iLO configured and set up on-site work is DONE
  - Remote access to NSP appliance server confirmed via iLO
  - No on-site presence required for remaining steps

---

## 2. NSP SETUP — NEXT STEPS

- Current state: SSH direct remote access only (command line / terminal)
- **NSP is NOT yet set up** — routers not yet accessible through NSP
- **Ethan scheduled a meeting with Lee for this Friday** to:
  - Stand up NSP
  - Connect NSP to routers
  - Enable full Nokia NSP remote access
- After NSP: Layer 3 services can begin (can run in parallel but NSP takes priority)

---

## 3. RTU SERIAL TESTING — NEW ITEM

- **Ethan** flagged the need to test serial connectivity before bulk RTU cutovers begin
- Goal: Prove out RTU ↔ EMS communication via serial cable configuration
- **Location:** Hicksville — QA RTU and QA EMS available for controlled testing
- Why Hicksville: Not a live substation — safe to test without risk
- **What's needed:** 2 temporary cables (1 to test RTU, 1 to test EMS) — to be removed after testing
- RTU and cabling: Ethan is comfortable. **EMS side is the unknown** (patching complexity, serial cable differences at Hicksville)
- Staging already covered most of this — EMS side was the only thing not testable during staging

### Cable / Resource Decision
- **Option A (preferred):** Ask John's team to run the 2 cables
- **Option B (backup):** Use Vinny (Hawkeye) — on hold pending SOW approval
- Jay: "Let's use John's team first. Builds familiarity and relationship."
- **Ethan to reach out to John's team — copy Jay on the email**
- Not time-sensitive but should be done **before bulk RTU cutovers begin**

---

## 4. IFR PACKAGE UPDATES (Tony)

- Tony's team made progress pulling forward IFR packages to get to Hawkeye faster
- **Next 5 packages updated** with new earlier dates
- **2 packages coming next Monday**
- Following week: shelter house at **11 hertz** also pulled in
- Overall trend: packages moving faster, staying on pace
- If packages hit a bind, will revert to normal schedule
- Tony to track upcoming 5 sites; Jay can request specific site dates on demand

---

## 5. NOKIA TRAINING

- Waiting on **Glenn** — Jay has not heard back
- Jay to call Glenn after the call
- Follow-up with team next week on Nokia training dates

---

## 6. LAYER 3 SERVICES

- Can run in **parallel** with NSP setup but NSP takes priority
- Not time-sensitive — nothing to action yet
- Will revisit after NSP is stood up Friday

---

## QUESTIONS ASKED (Part 2)

1. **Jay → Brianna:** Can you confirm all routers are accessible and we have remote connectivity?
2. **Jay → Brianna:** What was the problem at ACC3?
3. **Jay → Ethan:** Are we accessing routers through NSP now?
4. **Jay → Ethan:** What do we need to do to log into NSP and access routers remotely?
5. **Jay → Ethan:** Do we need someone on-site for NSP setup?
6. **Jay → Ethan:** Is NSP setup happening this Friday?
7. **Jay → Ethan:** Is there anything we can do for Layer 3 before NSP is set up?
8. **Jay → Ethan:** Why did you pick Friday instead of tomorrow for the Lee meeting?
9. **Jay → Ethan:** For the RTU serial test — do we ask John's team or Vinny for the cables?
10. **Jay → Ethan:** Do you have a preference on Vinny being present for the serial test?

---

## ACTION ITEMS (Part 2)

| # | Owner | Action | Due |
|---|---|---|---|
| 12 | **Ethan** | Stand up NSP with Lee — remote session | Friday Apr 10 |
| 13 | **Ethan** | Reach out to John's team for 2 temp cables at Hicksville for RTU serial test — copy Jay | This week |
| 14 | **Jay** | Call Glenn re: Nokia training | Today |
| 15 | **Jay** | Follow up with team on Nokia training dates | Next week |
| 16 | **Tony** | Track next 5 IFR package dates and share with Jay | Ongoing |
| 17 | **Brianna** | Confirm all routers fully accessible via SSH | ✅ Done on call |

---

*Minutes prepared by Daminie | JMUX PRJ13797 | April 7, 2026*
