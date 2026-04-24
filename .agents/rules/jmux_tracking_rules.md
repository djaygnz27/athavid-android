# JMUX Project Tracking Rules
## ALWAYS apply these rules when updating JMUX project data

### DATE TRACKING — MANDATORY
Every update to any JMUX entity MUST capture dates for SPI calculation:

**Milestones:**
- `planned_date` — original baseline date (never change this once set)
- `actual_start_date` — when work actually began (set when status → In Progress)
- `actual_finish_date` — when work actually completed (set when status → Complete)
- `actual_date` = same as actual_finish_date (legacy field, keep in sync)

**Engineering Packages (IFR/IFC):**
- `ifr_planned` — baseline IFR submission date (never change)
- `ifr_actual_start` — date IFR work began
- `ifr_actual` — date IFR was submitted/approved
- `ifc_planned` — baseline IFC submission date (never change)
- `ifc_actual_start` — date IFC work began
- `ifc_actual` — date IFC was issued/approved
- `construction_actual_start` / `construction_actual_finish`
- `deployment_actual_start` / `deployment_actual_finish`

**Equipment:**
- `order_date` — when PO was placed
- `actual_delivery` — when equipment physically arrived
- `staging_start_date` / `staging_complete_date`
- `installation_start_date` / `installation_complete_date`

**PAR Control:**
- `design_actual_start` — when design work began
- `design_complete_date` — when design was approved
- `rc30_order_date` — when RC-30 PO was placed
- `rc30_actual_delivery` — when RC-30 physically arrived
- `rc30_received_date` — date confirmed received on site
- `c3794_order_date` — when C37.94 card was ordered
- `installation_actual_start` / `installation_date` (finish)

### SPI CALCULATION RULES
- SPI = EV / PV (Earned Value / Planned Value)
- EV = % complete × baseline budget for that task
- PV = planned % complete by this date × baseline budget
- NEVER change planned_date after baseline is set — it destroys SPI history
- Track weekly_spi AND cumulative_spi separately on milestones
- When a milestone completes late: actual_finish_date > planned_date → SPI < 1.0

### WHEN A WHATSAPP RECORDING COMES IN:
1. Transcribe it
2. Extract: decisions, action items, owner, due date, dates mentioned
3. Update relevant entities with ANY dates mentioned (start, finish, delivery, order)
4. Flag anything overdue or at risk
5. Add meeting minutes record with recording_source = "WhatsApp - [date]"
6. Update memory.md with key project state changes

### BASELINE DATES (DO NOT CHANGE):
- Phase 1 baseline start: Jan 2026
- Final IFR all Phase 2 sites: Jun 29, 2026
- Final IFC all Phase 2 sites: Jul 13, 2026
- Phase 2 construction start: Aug 5, 2026
- Phase 2 deployment complete: Sep 28, 2026
