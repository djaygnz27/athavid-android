import { useState, useEffect } from "react";

const BASE = "https://sachi-c7f0261c.base44.app";

async function listEntity(name) {
  try {
    const r = await fetch(`${BASE}/api/entities/${name}`, {
      headers: { "Content-Type": "application/json" }
    });
    if (!r.ok) return [];
    const d = await r.json();
    return Array.isArray(d) ? d : (d.items || d.data || []);
  } catch { return []; }
}

const STATUS_COLOR = {
  "Complete": "#22c55e", "In Progress": "#3b82f6", "Not Started": "#6b7280",
  "At Risk": "#f59e0b", "Delayed": "#ef4444", "On Hold": "#8b5cf6",
  "IFR Issued": "#06b6d4", "IFC Issued": "#10b981", "Pending": "#f59e0b",
  "Active": "#3b82f6", "Closed": "#6b7280", "Overdue": "#ef4444",
};

const TABS = ["Overview", "Phase 1 ✅", "Phase 2 🔵", "Phase 3 🟣", "Milestones", "Engineering", "PAR Control", "SOW", "Meetings"];

const s = {
  app: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0f172a", minHeight: "100vh", color: "#e2e8f0" },
  header: { background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", borderBottom: "2px solid #f59e0b", padding: "20px 32px" },
  headerTitle: { fontSize: 22, fontWeight: 700, color: "#f59e0b", margin: 0 },
  headerSub: { fontSize: 13, color: "#94a3b8", margin: "4px 0 0 0" },
  tabBar: { display: "flex", gap: 4, padding: "12px 32px", background: "#1e293b", borderBottom: "1px solid #334155", overflowX: "auto" },
  tab: (active) => ({ padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", background: active ? "#f59e0b" : "transparent", color: active ? "#0f172a" : "#94a3b8" }),
  body: { padding: "24px 32px", maxWidth: 1400, margin: "0 auto" },
  card: { background: "#1e293b", borderRadius: 10, padding: "18px 22px", border: "1px solid #334155" },
  clickCard: { background: "#1e293b", borderRadius: 10, padding: "18px 22px", border: "1px solid #334155", cursor: "pointer", transition: "all 0.2s" },
  cardNum: { fontSize: 36, fontWeight: 800, color: "#f59e0b", margin: 0 },
  cardLabel: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  cardSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  cardHint: { fontSize: 11, color: "#475569", marginTop: 6 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#f59e0b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  table: { width: "100%", borderCollapse: "collapse", background: "#1e293b", borderRadius: 10, overflow: "hidden" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #334155", background: "#0f172a" },
  td: { padding: "10px 14px", fontSize: 13, color: "#e2e8f0", borderBottom: "1px solid #1e293b" },
  badge: (status) => ({ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: (STATUS_COLOR[status] || "#475569") + "22", color: STATUS_COLOR[status] || "#94a3b8", border: `1px solid ${STATUS_COLOR[status] || "#475569"}44` }),
  loading: { textAlign: "center", padding: 60, color: "#94a3b8" },
  refreshBtn: { marginLeft: "auto", padding: "6px 16px", background: "#1e3a5f", border: "1px solid #3b82f6", borderRadius: 6, color: "#93c5fd", fontSize: 12, cursor: "pointer", fontWeight: 600 },
  input: { background: "#0f172a", border: "1px solid #334155", borderRadius: 6, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, width: "100%", boxSizing: "border-box" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  modal: { background: "#1e293b", borderRadius: 12, border: "1px solid #334155", width: "100%", maxWidth: 720, maxHeight: "85vh", overflow: "auto", padding: 28 },
  modalTitle: { fontSize: 18, fontWeight: 700, color: "#f59e0b", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "#94a3b8", marginBottom: 20 },
  closeBtn: { float: "right", background: "none", border: "1px solid #475569", borderRadius: 6, color: "#94a3b8", padding: "4px 12px", cursor: "pointer", fontSize: 13 },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b" },
  checkIcon: (done) => ({ fontSize: 16, color: done ? "#22c55e" : "#475569", flexShrink: 0, marginTop: 1 }),
  checkText: (done) => ({ fontSize: 13, color: done ? "#e2e8f0" : "#64748b", flex: 1 }),
  checkNote: { fontSize: 11, color: "#64748b", marginTop: 2 },
};

function pb(pct, color) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: "#334155", position: "relative", overflow: "hidden", marginTop: 8 }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${Math.min(pct||0,100)}%`, background: color||"#f59e0b", borderRadius: 3 }} />
    </div>
  );
}

function Badge({ status }) { return <span style={s.badge(status)}>{status||"—"}</span>; }

// ── PHASE DRILL-DOWN MODAL ────────────────────────────────────────────────────
function PhaseModal({ phase, data, onClose }) {
  const { milestones, engineering, equipment } = data;

  const PHASES = {
    "Phase 1": {
      color: "#22c55e",
      icon: "🟢",
      subtitle: "Nokia SR-Series NMS Integration — 31 Sites",
      pct: 85,
      summary: "All Nokia MPLS routers installed. All 31 nodes built into NSP GUI by PSEG techs. IFR/IFC packages complete for all sites. Pending: RTU serial test (John Ng, due Apr 30) and production RTU MOP.",
      checklist: [
        { done: true,  text: "iLO Corporate Connectivity — Melville & Hicksville", note: "Completed Feb 26" },
        { done: true,  text: "BGP Network Design & Configurations", note: "Completed Mar 9" },
        { done: true,  text: "BGP Design Approved", note: "Completed Mar 16" },
        { done: true,  text: "Remote Access to NSP — Fiber Terminated at Hicksville", note: "Completed Apr 13" },
        { done: true,  text: "Nokia NSP License Received & DNS Resolved", note: "License received Apr 13, DNS resolved by Vic" },
        { done: true,  text: "All 31 Nokia MPLS Routers Installed", note: "Hardware install complete" },
        { done: true,  text: "All 31 Nodes Built into NSP GUI", note: "Completed by Lee, Rahiq & Brianna" },
        { done: true,  text: "All Phase 1 IFR & IFC Packages Issued", note: "All 31 sites — sealed and approved" },
        { done: false, text: "RTU Serial Test — Hicksville (John Ng)", note: "50-ft DB9 cables delivered. John Ng targeting Apr 30." },
        { done: false, text: "Develop Production RTU Migration MOP", note: "To follow successful RTU test with B&M" },
        { done: false, text: "Remote Node Verification — All 31 Sites", note: "Remote login via NSP GUI to confirm configs & connectivity" },
      ]
    },
    "Phase 2": {
      color: "#3b82f6",
      icon: "🔵",
      subtitle: "Nokia SR-Series Expansion — 36 Sites",
      pct: Math.round((9/36)*100),
      summary: "Nokia equipment ordered, delivered and staged in Hawkeye trailer. 9 of 36 sites have sealed & approved IFR/IFC packages on shared drive. Hawkeye is conducting site surveys on those 9 sites to assess cable lengths, connectors, and installation requirements.",
      checklist: [
        { done: true,  text: "Nokia Phase 2 Equipment Ordered & Delivered", note: "All equipment staged in Hawkeye trailer" },
        { done: true,  text: "9/36 IFR & IFC Packages — Sealed & Approved", note: "On shared drive. Hawkeye conducting site surveys." },
        { done: false, text: "Remaining 27/36 IFR Submissions", note: `Final IFR deadline: June 29, 2026` },
        { done: false, text: "All 36 IFC Packages Issued", note: "Final IFC deadline: July 13, 2026" },
        { done: false, text: "Hawkeye Site Surveys Complete — All 36 Sites", note: "Currently in progress for first 9 sites" },
        { done: false, text: "Phase 2 Construction Start", note: "Planned Aug 5, 2026" },
        { done: false, text: "Phase 2 Deployment Complete", note: "Planned Sep 28, 2026" },
      ]
    },
    "Phase 3": {
      color: "#8b5cf6",
      icon: "🟣",
      subtitle: "Nokia MPLS Expansion — 31 Sites + PAR Circuit Migration",
      pct: 5,
      summary: "31-site Nokia MPLS expansion. Engineering (IFR/IFC) being accelerated into Phase 2 staging starting Aug 2026 to avoid 2028 delays. PAR circuit migration (6 substations, Iniven RC-30, NERC-CIP mandatory, $530K unbudgeted) runs in parallel with Phase 2 construction.",
      checklist: [
        { done: true,  text: "Phase 3 Scope Confirmed — 31 Sites", note: "Corrected from earlier estimate of 26 sites. May 2026." },
        { done: true,  text: "Phase 3 Acceleration Decision Made", note: "Engineering to start Aug 2026 during Phase 2 staging. Confirmed by Ethan (B&M)." },
        { done: true,  text: "PAR Migration Strategy Defined", note: "Iniven RC-30 selected — converts direct contact → C37.94. NOT a programmable device under NERC CIP." },
        { done: false, text: "Hawkeye Site Surveys — 31 Ph3 Sites", note: "Starting week of May 18, 2026. Surveys needed to support B&M IFR design." },
        { done: false, text: "B&M Engineering IFR/IFC — 31 Sites", note: "Design starts Aug 2026. ~$900K–$1.29M total cost. $600K allocated 2026." },
        { done: false, text: "Nokia Equipment Pre-Order — Ph3 Nodes", note: "PO target Q3 2026. 8–12 week lead time. Critical to avoid 2028 delays." },
        { done: false, text: "Iniven RC-30 Equipment PO Placed — 6 PAR Sites", note: "8-week lead time. CRITICAL PATH. PO in progress." },
        { done: false, text: "Northport C37.94 Card Ordered", note: "To be bundled with Phase 2 equipment orders" },
        { done: false, text: "Chakrapani PAR Design — All 6 Sites", note: "Not started (5 of 6 sites). Design owners unassigned. ~$240K." },
        { done: false, text: "RC-30 Equipment Received & Staged", note: "Pending PO + 8-week lead" },
        { done: false, text: "PAR Installation — Johnny's Relay Team (6 Sites)", note: "~$200K–$495K. Parallel to Phase 2 construction Aug–Sep 2026." },
        { done: false, text: "Ph3 Nokia Router Construction & Installation", note: "Starts after IFC complete. Target 2027." },
        { done: false, text: "Ph3 RTU Production Cutovers", note: "After routers installed and tested." },
        { done: false, text: "NERC CIP Compliance Verified — All PAR Sites", note: "Post-migration validation required" },
      ]
    },
    "Decommission": {
      color: "#f59e0b",
      icon: "🟡",
      subtitle: "JMUX Legacy Equipment Decommission",
      pct: 0,
      summary: "Legacy JMUX equipment decommission follows successful Phase 1 & Phase 2 cutover. 2W Barrett decommission scheduled to conclude before Robert Costello's construction work begins in 2027.",
      checklist: [
        { done: false, text: "Phase 1 Cutover Complete — Prerequisite", note: "Required before decommission begins" },
        { done: false, text: "Phase 2 Cutover Complete — Prerequisite", note: "Required before decommission begins" },
        { done: false, text: "2W Barrett Decommission", note: "Must conclude before Costello construction (2027)" },
        { done: false, text: "Legacy JMUX Equipment Removal — All Sites", note: "To be scheduled post-cutover" },
        { done: false, text: "Decommission Complete & Final Sign-Off", note: "Project closeout" },
      ]
    }
  };

  const cfg = PHASES[phase];
  if (!cfg) return null;
  const done = cfg.checklist.filter(c => c.done).length;
  const total = cfg.checklist.length;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕ Close</button>
        <div style={s.modalTitle}>{cfg.icon} {phase}</div>
        <div style={s.modalSub}>{cfg.subtitle}</div>

        {/* Progress bar */}
        <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>Overall Progress</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: cfg.color }}>{cfg.pct}%</span>
          </div>
          {pb(cfg.pct, cfg.color)}
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{done} of {total} work items complete</div>
        </div>

        {/* Summary */}
        <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          {cfg.summary}
        </div>

        {/* Checklist */}
        <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13, marginBottom: 10 }}>Work Items</div>
        {cfg.checklist.map((item, i) => (
          <div key={i} style={s.checkRow}>
            <span style={s.checkIcon(item.done)}>{item.done ? "✅" : "⬜"}</span>
            <div>
              <div style={s.checkText(item.done)}>{item.text}</div>
              {item.note && <div style={s.checkNote}>{item.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({ data }) {
  const { milestones, engineering, equipment, sow, meetings } = data;
  const [activePhase, setActivePhase] = useState(null);

  const ph2IFCIssued = engineering.filter(e => e.phase === "Phase 2" && e.ifc_status === "IFC Issued").length;
  const milestonesComplete = milestones.filter(m => m.status === "Complete").length;
  const milestonesTotal = milestones.length;
  const equipOrdered = equipment.filter(e => e.po_status === "Ordered" || e.po_status === "Received").length;
  const equipTotal = equipment.length;
  const openActions = meetings.reduce((acc, m) => {
    const items = m.action_items ? (Array.isArray(m.action_items) ? m.action_items : [m.action_items]) : [];
    return acc + items.filter(i => i && typeof i === "string" && !i.toLowerCase().includes("complete")).length;
  }, 0);

  const withSPI = milestones.filter(m => m.cumulative_spi);
  const latestSPI = withSPI.length ? withSPI[withSPI.length - 1].cumulative_spi : null;
  const spiColor = !latestSPI ? "#94a3b8" : latestSPI >= 0.95 ? "#22c55e" : latestSPI >= 0.80 ? "#f59e0b" : "#ef4444";
  const spiStatus = !latestSPI ? "N/A" : latestSPI >= 0.95 ? "GREEN" : latestSPI >= 0.80 ? "YELLOW" : "RED";

  const phaseCards = [
    { phase: "Phase 1", num: 31, label: "Phase 1 — NMS Integration", sub: "85% complete · RTU test pending Apr 30", pct: 85, color: "#22c55e" },
    { phase: "Phase 2", num: 36, label: "Phase 2 — Expansion", sub: `9/36 IFR & IFC issued · Equipment in Hawkeye trailer`, pct: Math.round((9/36)*100), color: "#3b82f6" },
    { phase: "Phase 3", num: 31, label: "Phase 3 — Nokia Expansion + PAR", sub: "31 sites · IFR/IFC starting Aug 2026 · PAR parallel", pct: 5, color: "#8b5cf6" },
    { phase: "Decommission", num: "—", label: "Decommission", sub: "Legacy JMUX removal · Post-cutover", pct: 0, color: "#f59e0b" },
  ];

  return (
    <div>
      {activePhase && <PhaseModal phase={activePhase} data={data} onClose={() => setActivePhase(null)} />}

      {/* Phase KPI Cards — clickable */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
        {phaseCards.map(({ phase, num, label, sub, pct, color }) => (
          <div
            key={phase}
            style={{ ...s.clickCard, borderColor: color + "55" }}
            onClick={() => setActivePhase(phase)}
            onMouseEnter={e => e.currentTarget.style.borderColor = color}
            onMouseLeave={e => e.currentTarget.style.borderColor = color + "55"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ ...s.cardNum, color }}>{num}</div>
              <span style={{ fontSize: 11, color: color, background: color + "22", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={s.cardLabel}>{label}</div>
            <div style={s.cardSub}>{sub}</div>
            {pb(pct, color)}
            <div style={s.cardHint}>Click to see details →</div>
          </div>
        ))}
      </div>

      {/* Secondary KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div style={s.card}>
          <div style={{ ...s.cardNum, color: spiColor }}>{latestSPI ? latestSPI.toFixed(2) : "—"}</div>
          <div style={s.cardLabel}>Cumulative SPI</div>
          <div style={{ ...s.cardSub, color: spiColor }}>{spiStatus}</div>
        </div>
        <div style={s.card}>
          <div style={s.cardNum}>{milestonesComplete}/{milestonesTotal}</div>
          <div style={s.cardLabel}>Milestones Complete</div>
          {pb((milestonesComplete / (milestonesTotal || 1)) * 100, "#f59e0b")}
        </div>
        <div style={s.card}>
          <div style={s.cardNum}>{equipOrdered}/{equipTotal}</div>
          <div style={s.cardLabel}>Equipment Ordered</div>
          {pb((equipOrdered / (equipTotal || 1)) * 100, "#06b6d4")}
        </div>
        <div style={s.card}>
          <div style={{ ...s.cardNum, color: openActions > 5 ? "#ef4444" : "#f59e0b" }}>{openActions}</div>
          <div style={s.cardLabel}>Open Action Items</div>
          <div style={s.cardSub}>from {meetings.length} meetings</div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div style={s.section}>
        <div style={s.sectionTitle}>🎯 Recent Milestones</div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Milestone</th><th style={s.th}>Phase</th><th style={s.th}>Workstream</th>
              <th style={s.th}>Planned</th><th style={s.th}>Actual</th><th style={s.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {milestones.slice(-10).reverse().map((m, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                <td style={s.td}>{m.milestone_name}</td>
                <td style={s.td}>{m.phase}</td>
                <td style={s.td}>{m.workstream}</td>
                <td style={s.td}>{m.planned_date}</td>
                <td style={s.td}>{m.actual_date || "—"}</td>
                <td style={s.td}><Badge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SOW Summary */}
      <div style={s.section}>
        <div style={s.sectionTitle}>📋 SOW Status</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {sow.map((sw, i) => (
            <div key={i} style={{ ...s.card, flex: "1 1 220px" }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 14 }}>{sw.vendor}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0" }}>{sw.scope_summary}</div>
              <Badge status={sw.status} />
              {sw.contract_value && <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 6 }}>${Number(sw.contract_value).toLocaleString()}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MILESTONES ─────────────────────────────────────────────────────────────────
function Milestones({ items, onRefresh }) {
  const [filter, setFilter] = useState("");
  const filtered = items.filter(m =>
    !filter || m.milestone_name?.toLowerCase().includes(filter.toLowerCase()) ||
    m.phase?.toLowerCase().includes(filter.toLowerCase()) ||
    m.workstream?.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <input style={{ ...s.input, maxWidth: 300 }} placeholder="Filter milestones..." value={filter} onChange={e => setFilter(e.target.value)} />
        <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Milestone</th><th style={s.th}>Phase</th><th style={s.th}>Workstream</th>
            <th style={s.th}>Owner</th><th style={s.th}>Planned</th><th style={s.th}>Actual</th>
            <th style={s.th}>% Done</th><th style={s.th}>SPI</th><th style={s.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={s.td}>{m.milestone_name}</td>
              <td style={s.td}>{m.phase}</td>
              <td style={s.td}>{m.workstream}</td>
              <td style={s.td}>{m.owner || "—"}</td>
              <td style={s.td}>{m.planned_date}</td>
              <td style={s.td}>{m.actual_date || "—"}</td>
              <td style={{ ...s.td, minWidth: 80 }}>
                {pb(m.percent_complete, "#f59e0b")}
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{m.percent_complete || 0}%</div>
              </td>
              <td style={{ ...s.td, color: !m.cumulative_spi ? "#6b7280" : m.cumulative_spi >= 0.95 ? "#22c55e" : m.cumulative_spi >= 0.80 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>
                {m.cumulative_spi ? m.cumulative_spi.toFixed(2) : "—"}
              </td>
              <td style={s.td}><Badge status={m.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── ENGINEERING ────────────────────────────────────────────────────────────────
function Engineering({ items, onRefresh }) {
  const [phFilter, setPhFilter] = useState("All");
  const filtered = phFilter === "All" ? items : items.filter(e => e.phase === phFilter);
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        {["All", "Phase 1", "Phase 2"].map(p => (
          <button key={p} style={{ ...s.tab(phFilter === p), fontSize: 12 }} onClick={() => setPhFilter(p)}>{p}</button>
        ))}
        <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>#</th><th style={s.th}>Site Name</th><th style={s.th}>Phase</th>
            <th style={s.th}>IFR Status</th><th style={s.th}>IFC Status</th>
            <th style={s.th}>Construction</th><th style={s.th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={{ ...s.td, color: "#64748b" }}>{e.site_number}</td>
              <td style={{ ...s.td, fontWeight: 600 }}>{e.site_name}</td>
              <td style={s.td}>{e.phase}</td>
              <td style={s.td}><Badge status={e.ifr_status} /></td>
              <td style={s.td}><Badge status={e.ifc_status} /></td>
              <td style={s.td}>{e.construction_planned || "—"}</td>
              <td style={{ ...s.td, fontSize: 12, color: "#94a3b8" }}>{e.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── EQUIPMENT ──────────────────────────────────────────────────────────────────

// ── PAR CONTROL (replaces Equipment + old PAR tabs) ───────────────────────────
function PARControl({ items, equipment, onRefresh }) {
  const [expanded, setExpanded] = useState(null);
  const [activeSection, setActiveSection] = useState("sites");

  const parEquipment = (equipment || []).filter(e =>
    e.category === "Iniven RC-30" || e.category === "C37.94 Card" ||
    (e.item_name && (e.item_name.toLowerCase().includes("rc-30") || e.item_name.toLowerCase().includes("c37.94") || e.item_name.toLowerCase().includes("par")))
  );

  const nextSteps = [
    { priority: "🔴 CRITICAL", color: "#ef4444", item: "Confirm Iniven RC-30 PO Number & Delivery Date", owner: "Chakrapani", due: "Immediate",
      status: items.some(i => i.rc30_po_number && i.rc30_po_number !== "TBD") ? "Complete" : "Not Started",
      note: "8-week lead time. PO must be confirmed NOW to align with Phase 2 construction (Aug 2026). All 6 sites show PO TBD." },
    { priority: "🔴 CRITICAL", color: "#ef4444", item: "Assign Design Owners — All 6 PAR Sites", owner: "Chakrapani / Jay", due: "May 22, 2026",
      status: items.filter(i => i.design_owner && i.design_owner !== "TBD").length > 0 ? "In Progress" : "Not Started",
      note: "5 of 6 sites have no design owner. Design must start ASAP. Northport is only site In Progress." },
    { priority: "🔴 CRITICAL", color: "#ef4444", item: "Order C37.94 Protocol Card — Northport", owner: "Chakrapani", due: "May 22, 2026",
      status: items.find(i => i.site_name === "Northport")?.c3794_ordered ? "Complete" : "Not Started",
      note: "Must be bundled with Phase 2 equipment PO. Northport is the ONLY site requiring this additional card." },
    { priority: "🟡 HIGH", color: "#f59e0b", item: "Complete PAR Design — All 6 Sites", owner: "Chakrapani Team", due: "Jul 2026",
      status: items.filter(i => i.design_status === "Complete" || i.design_status === "Approved").length === 6 ? "Complete"
             : items.filter(i => i.design_status === "In Progress").length > 0 ? "In Progress" : "Not Started",
      note: "Design must be complete before installation. ~$240K engineering cost. Johnny's relay team cannot start until design is approved." },
    { priority: "🟡 HIGH", color: "#f59e0b", item: "RC-30 Equipment Received & Staged — All 6 Sites", owner: "Chakrapani / Hawkeye", due: "Jul 2026",
      status: items.every(i => i.rc30_received) ? "Complete" : items.some(i => i.rc30_received) ? "In Progress" : "Not Started",
      note: "Pending PO confirmation + 8-week lead. Staging location: Hawkeye trailer." },
    { priority: "🟡 HIGH", color: "#f59e0b", item: "Confirm NERC CIP Compliance Documentation — All 6 Sites", owner: "Jay / Engineering", due: "Jun 2026",
      status: items.every(i => i.nerc_cip_compliant) ? "Complete" : "In Progress",
      note: "RC-30 is NOT a programmable device under NERC CIP — compliance docs must confirm this for all 6 sites before cutover." },
    { priority: "🔵 NORMAL", color: "#3b82f6", item: "Schedule Johnny's Relay Team — Installation All 6 Sites", owner: "Jay / Johnny", due: "Aug–Sep 2026",
      status: items.some(i => i.installation_status === "In Progress" || i.installation_status === "Complete") ? "In Progress" : "Not Started",
      note: "~$1,100–$1,200/hr. Cannot schedule until design approved + RC-30 on site. Must align with Phase 2 window (Aug 5–Sep 28, 2026)." },
    { priority: "🔵 NORMAL", color: "#3b82f6", item: "PAR Installation Complete & Tested — All 6 Sites", owner: "Johnny's Team / PSEG", due: "Sep 28, 2026",
      status: items.every(i => i.installation_status === "Complete") ? "Complete" : "Not Started",
      note: "Final cutover at Northport, Hicksville (5HK), Melville, Lindenhurst (7Z), Far Rockaway (2H), Hewlett (2R)." },
  ];

  const criticalCount = nextSteps.filter(n => n.status === "Not Started" && n.priority.includes("CRITICAL")).length;
  const totalDone = nextSteps.filter(n => n.status === "Complete").length;

  const sBtn = (key) => ({ padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
    background: activeSection === key ? "#f59e0b" : "#1e3a5f", color: activeSection === key ? "#0f172a" : "#93c5fd" });

  return (
    <div>
      {/* Header banner */}
      <div style={{ background: "#1e3a5f33", border: "1px solid #3b82f644", borderRadius: 10, padding: "14px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#93c5fd", marginBottom: 4 }}>⚡ PAR Circuit Migration — Phase Angle Regulator Cutover</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
              Iniven RC-30: direct contact → C37.94 · NOT programmable (NERC CIP compliant) · 6 substations · 8-wk lead time ·
              <span style={{ color: "#f59e0b", fontWeight: 700 }}> ~$530K unbudgeted</span> (inherited 2024 scope gap) · Design: Chakrapani · Install: Johnny's relay team
            </div>
          </div>
          <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "PAR Sites",          val: items.length,                                                            color: "#f59e0b" },
          { label: "RC-30 Ordered",      val: `${items.filter(i=>i.rc30_ordered).length} / ${items.length}`,          color: items.filter(i=>i.rc30_ordered).length===items.length?"#22c55e":"#ef4444" },
          { label: "RC-30 Received",     val: `${items.filter(i=>i.rc30_received).length} / ${items.length}`,         color: items.filter(i=>i.rc30_received).length===items.length?"#22c55e":"#64748b" },
          { label: "Design Complete",    val: items.filter(i=>i.design_status==="Complete"||i.design_status==="Approved").length, color: "#22c55e" },
          { label: "Installed",          val: `${items.filter(i=>i.installation_status==="Complete").length} / ${items.length}`, color: "#22c55e" },
          { label: "C37.94 Needed",      val: `${items.filter(i=>i.c3794_card_needed).length} site(s)`,               color: "#ef4444" },
          { label: "Critical Open",      val: criticalCount,                                                           color: criticalCount>0?"#ef4444":"#22c55e" },
          { label: "Next Steps Done",    val: `${totalDone} / ${nextSteps.length}`,                                   color: "#3b82f6" },
        ].map((kpi, i) => (
          <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "10px 14px", border: "1px solid #334155" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: kpi.color }}>{kpi.val}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button style={sBtn("sites")} onClick={() => setActiveSection("sites")}>📍 6 Sites</button>
        <button style={sBtn("equipment")} onClick={() => setActiveSection("equipment")}>📦 Equipment Orders</button>
        <button style={sBtn("nextSteps")} onClick={() => setActiveSection("nextSteps")}>
          ✅ Next Steps {criticalCount > 0 ? `(${criticalCount} critical)` : `(${totalDone}/${nextSteps.length} done)`}
        </button>
      </div>

      {/* SITES */}
      {activeSection === "sites" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((p, i) => {
            const isOpen = expanded === i;
            const alert = !p.rc30_ordered || p.design_status === "Not Started" || p.rc30_po_number === "TBD" || p.c3794_card_needed;
            return (
              <div key={i} style={{ background: "#1e293b", borderRadius: 10, border: `1px solid ${alert?"#f59e0b55":"#334155"}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }} onClick={() => setExpanded(isOpen ? null : i)}>
                  <div style={{ minWidth: 190 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#e2e8f0" }}>{p.site_name}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>ID: {p.substation_id}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                    {[
                      { label: `📐 Design: ${p.design_status||"Not Started"}`, ok: p.design_status==="Complete"||p.design_status==="Approved", warn: !p.design_status||p.design_status==="Not Started" },
                      { label: `📦 RC-30: ${p.rc30_ordered?"Ordered ✅":"NOT Ordered ❌"}`, ok: p.rc30_ordered, warn: !p.rc30_ordered },
                      { label: `🚚 Received: ${p.rc30_received?"Yes ✅":"Pending"}`, ok: p.rc30_received, warn: false },
                      ...(p.c3794_card_needed ? [{ label: `⚠️ C37.94: ${p.c3794_ordered?"Ordered ✅":"NOT Ordered ❌"}`, ok: p.c3794_ordered, warn: !p.c3794_ordered }] : []),
                      { label: `🔧 Install: ${p.installation_status||"Not Started"}`, ok: p.installation_status==="Complete", warn: false },
                      { label: `🔐 NERC: ${p.nerc_cip_compliant?"OK":"TBD"}`, ok: p.nerc_cip_compliant, warn: !p.nerc_cip_compliant },
                    ].map((pill, j) => (
                      <span key={j} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 700,
                        background: pill.ok?"#22c55e22":pill.warn?"#ef444422":"#1e293b",
                        color: pill.ok?"#22c55e":pill.warn?"#ef4444":"#94a3b8", border: "1px solid currentColor" }}>
                        {pill.label}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 18, color: "#64748b", transform: isOpen?"rotate(90deg)":"none", transition: "transform 0.2s" }}>›</div>
                </div>
                {isOpen && (
                  <div style={{ borderTop: "1px solid #334155", padding: "16px 20px", background: "#162032" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>📦 Equipment Ordering</div>
                        {[
                          ["Ordered By", p.rc30_ordered_by||"—"],
                          ["PO Number", p.rc30_po_number&&p.rc30_po_number!=="TBD"?p.rc30_po_number:"TBD ⚠️"],
                          ["RC-30 Qty", p.rc30_quantity||1],
                          ["Order Date", p.rc30_order_date||"TBD ⚠️"],
                          ["Expected Delivery", p.rc30_expected_delivery&&p.rc30_expected_delivery!=="TBD"?p.rc30_expected_delivery:"TBD ⚠️"],
                          ["Actual Delivery", p.rc30_actual_delivery||"—"],
                          ...(p.c3794_card_needed?[["C37.94 PO#",p.c3794_po_number||"TBD ⚠️"],["C37.94 Ordered",p.c3794_ordered?"✅ Yes":"❌ Not Yet"],["C37.94 Delivery",p.c3794_expected_delivery&&p.c3794_expected_delivery!=="TBD"?p.c3794_expected_delivery:"TBD ⚠️"]]:[]),
                        ].map(([l,v],j)=>(
                          <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #1e293b" }}>
                            <span style={{ fontSize:12, color:"#64748b" }}>{l}</span>
                            <span style={{ fontSize:12, color:String(v).includes("TBD")?"#f59e0b":"#e2e8f0", fontWeight:600 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#3b82f6", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>📐 Design Work</div>
                        {[
                          ["Design Status", p.design_status||"Not Started"],
                          ["Design Owner", p.design_owner&&p.design_owner!=="TBD"?p.design_owner:"TBD ⚠️"],
                          ["Design Start", p.design_actual_start||p.design_planned_start||"Not Started"],
                          ["Design Due", p.design_due_date&&p.design_due_date!=="TBD"?p.design_due_date:"TBD ⚠️"],
                          ["Design Complete", p.design_complete_date||"—"],
                          ["NERC CIP", p.nerc_cip_compliant?"✅ Compliant":"⏳ Pending"],
                        ].map(([l,v],j)=>(
                          <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #1e293b" }}>
                            <span style={{ fontSize:12, color:"#64748b" }}>{l}</span>
                            <span style={{ fontSize:12, color:(String(v).includes("TBD")||v==="Not Started")?"#f59e0b":"#e2e8f0", fontWeight:600 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#22c55e", fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>🔧 Installation</div>
                        {[
                          ["Install Status", p.installation_status||"Not Started"],
                          ["Install Start", p.installation_actual_start||"TBD"],
                          ["Install Complete", p.installation_date||"TBD"],
                          ["Installer", "Johnny's Relay Team"],
                          ["Est. Rate", "~$1,100–$1,200/hr"],
                          ["Window", "Aug–Sep 2026"],
                        ].map(([l,v],j)=>(
                          <div key={j} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #1e293b" }}>
                            <span style={{ fontSize:12, color:"#64748b" }}>{l}</span>
                            <span style={{ fontSize:12, color:(v==="Not Started"||v==="TBD")?"#f59e0b":"#e2e8f0", fontWeight:600 }}>{v}</span>
                          </div>
                        ))}
                        {p.open_questions && <div style={{ marginTop:12 }}>
                          <div style={{ fontWeight:700, color:"#ef4444", fontSize:11, textTransform:"uppercase", marginBottom:6 }}>❓ Open Questions</div>
                          <div style={{ fontSize:11, color:"#fca5a5", lineHeight:1.7, whiteSpace:"pre-line" }}>{p.open_questions}</div>
                        </div>}
                        {p.notes && <div style={{ marginTop:10 }}>
                          <div style={{ fontWeight:700, color:"#94a3b8", fontSize:11, textTransform:"uppercase", marginBottom:4 }}>📝 Notes</div>
                          <div style={{ fontSize:11, color:"#94a3b8", lineHeight:1.6 }}>{p.notes}</div>
                        </div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* EQUIPMENT ORDERS */}
      {activeSection === "equipment" && (
        <div>
          <div style={{ fontSize:13, color:"#94a3b8", marginBottom:16 }}>All PAR-related equipment — Iniven RC-30 (6 sites) and C37.94 protocol card (Northport only)</div>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Item</th><th style={s.th}>Vendor</th><th style={s.th}>Sites</th>
                <th style={s.th}>Qty Ord</th><th style={s.th}>Qty Rcvd</th><th style={s.th}>PO Status</th>
                <th style={s.th}>PO #</th><th style={s.th}>Lead Time</th><th style={s.th}>Exp. Delivery</th><th style={s.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {(parEquipment.length > 0 ? parEquipment : [
                { item_name:"Iniven RC-30 — PAR Circuit Conversion", vendor:"Iniven", sites:"All 6 PAR Sites", quantity_ordered:6, quantity_received:0, po_status:"Not Ordered", po_number:"TBD ⚠️", lead_time_weeks:8, expected_delivery:"TBD ⚠️", notes:"CRITICAL PATH — 8-week lead. PO must be placed immediately." },
                { item_name:"C37.94 Protocol Card", vendor:"TBD", sites:"Northport only", quantity_ordered:0, quantity_received:0, po_status:"Not Ordered", po_number:"TBD ⚠️", lead_time_weeks:null, expected_delivery:"TBD ⚠️", notes:"Bundle with Phase 2 PO. Northport only." },
              ]).map((e,i) => (
                <tr key={i} style={{ background: i%2===0?"#1e293b":"#162032" }}>
                  <td style={{ ...s.td, fontWeight:600 }}>{e.item_name}</td>
                  <td style={s.td}>{e.vendor||"—"}</td>
                  <td style={s.td}>{e.sites||e.site||"All 6 PAR Sites"}</td>
                  <td style={s.td}>{e.quantity_ordered||0}</td>
                  <td style={s.td}>{e.quantity_received||0}</td>
                  <td style={s.td}><Badge status={e.po_status}/></td>
                  <td style={{ ...s.td, color:(!e.po_number||String(e.po_number).includes("TBD"))?"#f59e0b":"#e2e8f0" }}>{e.po_number||"TBD ⚠️"}</td>
                  <td style={s.td}>{e.lead_time_weeks?`${e.lead_time_weeks} wks`:"—"}</td>
                  <td style={{ ...s.td, color:(!e.expected_delivery||String(e.expected_delivery).includes("TBD"))?"#f59e0b":"#e2e8f0" }}>{e.expected_delivery||"TBD ⚠️"}</td>
                  <td style={{ ...s.td, fontSize:11, color:"#94a3b8", maxWidth:240 }}>{e.notes||"—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ ...s.card, marginTop:20, borderLeft:"4px solid #f59e0b" }}>
            <div style={{ fontWeight:700, color:"#f59e0b", marginBottom:10, fontSize:13 }}>💰 PAR Migration Cost Summary</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))", gap:12 }}>
              {[
                { label:"Engineering Design (Chakrapani)", val:"~$240,000", color:"#3b82f6" },
                { label:"RC-30 Equipment (6 units, Iniven)", val:"~$30,000–$60,000", color:"#f59e0b" },
                { label:"Installation Labor (Johnny's team)", val:"~$200,000–$495,000", color:"#ef4444" },
                { label:"Total Unbudgeted Variance", val:"~$530,000", color:"#ef4444" },
                { label:"Budget Status", val:"PCR In Progress — Joe Jekyll", color:"#22c55e" },
                { label:"Inherited From", val:"2024 Phase 3 Placeholder (~$30–40K)", color:"#64748b" },
              ].map((r,i)=>(
                <div key={i} style={{ padding:"8px 12px", background:"#0f172a", borderRadius:6 }}>
                  <div style={{ fontSize:11, color:"#64748b", marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:r.color }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEXT STEPS */}
      {activeSection === "nextSteps" && (
        <div>
          <div style={{ fontSize:13, color:"#94a3b8", marginBottom:16 }}>{totalDone}/{nextSteps.length} complete · {criticalCount} critical items open</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {nextSteps.map((step,i) => (
              <div key={i} style={{ background:"#1e293b", borderRadius:10, padding:"14px 18px", border:`1px solid ${step.status==="Complete"?"#22c55e33":step.color+"44"}`, display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ fontSize:22, flexShrink:0, marginTop:2 }}>
                  {step.status==="Complete"?"✅":step.status==="In Progress"?"🔄":step.priority.split(" ")[0]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ fontWeight:700, fontSize:14, color:step.status==="Complete"?"#22c55e":"#e2e8f0" }}>{step.item}</span>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:999, fontWeight:700, background:step.color+"22", color:step.color, border:`1px solid ${step.color}44` }}>{step.priority}</span>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:999, background:step.status==="Complete"?"#22c55e22":step.status==="In Progress"?"#3b82f622":"#334155", color:step.status==="Complete"?"#22c55e":step.status==="In Progress"?"#3b82f6":"#94a3b8", border:"1px solid currentColor" }}>{step.status}</span>
                  </div>
                  <div style={{ display:"flex", gap:20, fontSize:12, color:"#64748b", marginBottom:6 }}>
                    <span>👤 {step.owner}</span><span>📅 Due: {step.due}</span>
                  </div>
                  <div style={{ fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>{step.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SOW ────────────────────────────────────────────────────────────────────────
function SOW({ items, onRefresh }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {items.map((sw, i) => (
          <div key={i} style={{ ...s.card, flex: "1 1 300px" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#e2e8f0", marginBottom: 4 }}>{sw.vendor}</div>
            <Badge status={sw.status} />
            <div style={{ fontSize: 13, color: "#94a3b8", margin: "10px 0 6px" }}>{sw.scope_summary}</div>
            {sw.contract_value && <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>${Number(sw.contract_value).toLocaleString()}</div>}
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{sw.start_date} → {sw.end_date || "TBD"}</div>
            {sw.open_items && <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 8 }}>⚠️ {sw.open_items}</div>}
            {sw.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>{sw.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MEETINGS ───────────────────────────────────────────────────────────────────
function Meetings({ items, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const sorted = [...items].sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setSelected(null)}>✕ Close</button>
            <div style={s.modalTitle}>{selected.title}</div>
            <div style={s.modalSub}>{selected.meeting_date} · Attendees: {selected.attendees || "—"}</div>
            {selected.key_decisions && <><div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 6, marginTop: 12 }}>Key Decisions</div><div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{selected.key_decisions}</div></>}
            {selected.action_items && <><div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 6, marginTop: 16 }}>Action Items</div><div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{Array.isArray(selected.action_items) ? selected.action_items.join("\n") : selected.action_items}</div></>}
            {selected.notes && <><div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 6, marginTop: 16 }}>Notes</div><div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{selected.notes}</div></>}
          </div>
        </div>
      )}
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Date</th><th style={s.th}>Title</th><th style={s.th}>Owner</th>
            <th style={s.th}>Due Date</th><th style={s.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032", cursor: "pointer" }} onClick={() => setSelected(m)}>
              <td style={s.td}>{m.meeting_date}</td>
              <td style={{ ...s.td, color: "#93c5fd", fontWeight: 600 }}>{m.title}</td>
              <td style={s.td}>{m.owner || "—"}</td>
              <td style={s.td}>{m.due_date || "—"}</td>
              <td style={s.td}><Badge status={m.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ── PHASE COMPLETION VIEW ─────────────────────────────────────────────────────
function PhaseCompletion({ phase, data }) {
  const { milestones, engineering, par } = data;

  // Filter milestones for this phase
  const phaseKey = phase.replace(" ✅","").replace(" 🔵","").replace(" 🟣","");
  const phaseMilestones = milestones.filter(m => m.phase === phaseKey);
  const completedMS = phaseMilestones.filter(m => m.status === "Complete");
  const inProgressMS = phaseMilestones.filter(m => m.status === "In Progress");
  const notStartedMS = phaseMilestones.filter(m => m.status === "Not Started");

  const PHASE_CONFIG = {
    "Phase 1": {
      color: "#22c55e", icon: "🟢", pct: 87,
      label: "Phase 1 — NMS Integration (31 Sites)",
      summary: "All 31 Nokia MPLS routers installed and built into NSP GUI. BGP design complete. RTU serial test in progress at Hicksville. Production RTU cutovers next.",
      hardCompleted: [
        { item: "iLO Corporate Connectivity — Melville & Hicksville", date: "Feb 26, 2026", owner: "PSEG / Hawkeye" },
        { item: "Layer 3 BGP Network Design & Configurations", date: "Mar 9, 2026", owner: "B&M / Lee" },
        { item: "BGP Design Approved", date: "Mar 16, 2026", owner: "Lee / B&M" },
        { item: "Nokia NSP License Received & DNS Resolved", date: "Apr 13, 2026", owner: "Vic / Nokia" },
        { item: "All 31 Nokia MPLS Routers — Received, Staged & Installed", date: "Apr 2026", owner: "Graybar / Hawkeye" },
        { item: "All 31 Phase 1 IFR Packages — Issued & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "All 31 Phase 1 IFC Packages — Issued & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "9 Phase 2 IFR/IFC Packages Sent to Hawkeye", date: "Apr 20, 2026", owner: "B&M" },
      ],
    },
    "Phase 2": {
      color: "#3b82f6", icon: "🔵", pct: 25,
      label: "Phase 2 — Expansion (36 Sites)",
      summary: "Nokia Phase 2 equipment ordered, delivered and staged. 9 of 36 IFR/IFC packages sealed and approved. Hawkeye site surveys in progress. Construction starts Aug 5, 2026.",
      hardCompleted: [
        { item: "Nokia Phase 2 Equipment — Ordered & Delivered", date: "Apr 2026", owner: "Nokia / Graybar" },
        { item: "Phase 2 Nodes Staged in Hawkeye Trailer", date: "Apr 2026", owner: "Hawkeye" },
        { item: "2WB Barrett Outside — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "2ZB EF Barrett PS Inside — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "2R Hewlett — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "2R Hewlett Shelter — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "2H Far Rockaway — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "2KB Cedarhurst — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "7BH Bohemia — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "7J Sterling — IFR & IFC Sealed & Approved", date: "Apr 2026", owner: "B&M" },
        { item: "Phase 2 Site Surveys Started — First 9 Sites", date: "Apr 2026", owner: "Hawkeye" },
        { item: "Phase 3 Acceleration Decision — Engineering Start Aug 2026", date: "May 12, 2026", owner: "Ethan / Jay" },
      ],
    },
    "Phase 3": {
      color: "#8b5cf6", icon: "🟣", pct: 5,
      label: "Phase 3 — Nokia Expansion + PAR (31 Sites)",
      summary: "31-site Nokia MPLS expansion. Engineering accelerated into Phase 2 staging (Aug 2026). PAR circuit migration (6 substations, Iniven RC-30, NERC-CIP mandatory, ~$530K) runs parallel to Phase 2 construction.",
      hardCompleted: [
        { item: "Phase 3 Scope Confirmed — 31 Sites", date: "May 2026", owner: "Jay / B&M" },
        { item: "Phase 3 Acceleration Strategy Approved", date: "May 12, 2026", owner: "Ethan / Jay" },
        { item: "PAR Migration Strategy Defined — Iniven RC-30 Selected", date: "Apr 2026", owner: "Jay / Chakrapani" },
        { item: "RC-30 Equipment Ordered (6 units, 8-wk lead)", date: "Apr 2026", owner: "Chakrapani" },
      ],
    },
  };

  const cfg = PHASE_CONFIG[phaseKey];
  if (!cfg) return null;

  // Combine hard-coded completions + live completed milestones (deduplicated by name)
  const liveCompletedNames = new Set(completedMS.map(m => m.milestone_name));
  const hardFiltered = cfg.hardCompleted.filter(h => !liveCompletedNames.has(h.item));

  const statusDot = (status) => {
    const colors = { "Complete": "#22c55e", "In Progress": "#3b82f6", "Not Started": "#6b7280", "At Risk": "#f59e0b", "Delayed": "#ef4444" };
    return colors[status] || "#6b7280";
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...s.card, marginBottom: 24, borderLeft: `4px solid ${cfg.color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{cfg.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: cfg.color }}>{cfg.label}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{cfg.summary}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: cfg.color }}>{cfg.pct}%</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Complete</div>
          </div>
        </div>
        {pb(cfg.pct, cfg.color)}
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <span style={{ fontSize: 12, color: "#22c55e" }}>✅ {completedMS.length + cfg.hardCompleted.length} Completed</span>
          <span style={{ fontSize: 12, color: "#3b82f6" }}>⏳ {inProgressMS.length} In Progress</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>○ {notStartedMS.length} Not Started</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* LEFT: COMPLETED */}
        <div>
          <div style={{ ...s.sectionTitle, color: "#22c55e", marginBottom: 16 }}>
            ✅ Completed Milestones
          </div>

          {/* Live milestones from DB */}
          {completedMS.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, padding: "4px 10px", background: "#22c55e11", borderRadius: 4, border: "1px solid #22c55e33" }}>
                📋 Tracked Milestones
              </div>
              {completedMS.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", marginBottom: 6, background: "#22c55e0a", borderRadius: 8, border: "1px solid #22c55e22" }}>
                  <span style={{ color: "#22c55e", fontSize: 16, flexShrink: 0 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{m.milestone_name}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                      {m.actual_date && <span style={{ fontSize: 11, color: "#22c55e" }}>📅 {m.actual_date}</span>}
                      {m.owner && <span style={{ fontSize: 11, color: "#64748b" }}>👤 {m.owner}</span>}
                      {m.planned_date && m.actual_date && m.actual_date > m.planned_date &&
                        <span style={{ fontSize: 11, color: "#f59e0b" }}>⚠ Late vs {m.planned_date}</span>
                      }
                      {m.planned_date && m.actual_date && m.actual_date <= m.planned_date &&
                        <span style={{ fontSize: 11, color: "#22c55e" }}>✓ On time</span>
                      }
                    </div>
                    {m.notes && <div style={{ fontSize: 11, color: "#475569", marginTop: 4, fontStyle: "italic" }}>{m.notes.substring(0, 100)}{m.notes.length > 100 ? "…" : ""}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hard-coded completed items not already in DB */}
          {hardFiltered.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, padding: "4px 10px", background: "#0f172a", borderRadius: 4 }}>
                📌 Additional Completed Work
              </div>
              {hardFiltered.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", borderBottom: "1px solid #1e293b", alignItems: "flex-start" }}>
                  <span style={{ color: "#22c55e", fontSize: 14, flexShrink: 0 }}>✓</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 500 }}>{item.item}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{item.date} · {item.owner}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: IN PROGRESS + NOT STARTED */}
        <div>
          {/* In Progress */}
          {inProgressMS.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ ...s.sectionTitle, color: "#3b82f6", marginBottom: 12 }}>
                ⏳ In Progress ({inProgressMS.length})
              </div>
              {inProgressMS.map((m, i) => (
                <div key={i} style={{ padding: "10px 12px", marginBottom: 8, borderRadius: 8, background: "#3b82f611", border: "1px solid #3b82f633" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, flex: 1 }}>{m.milestone_name}</div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#3b82f6" }}>{m.percent_complete}%</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                    {m.planned_date && <span style={{ fontSize: 11, color: m.planned_date < new Date().toISOString().split("T")[0] ? "#ef4444" : "#f59e0b" }}>📅 Due: {m.planned_date}{m.planned_date < new Date().toISOString().split("T")[0] ? " ⚠ OVERDUE" : ""}</span>}
                    {m.owner && <span style={{ fontSize: 11, color: "#64748b" }}>👤 {m.owner}</span>}
                  </div>
                  <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: "#334155" }}>
                    <div style={{ height: "100%", width: `${m.percent_complete||0}%`, background: "#3b82f6", borderRadius: 2 }} />
                  </div>
                  {m.notes && <div style={{ fontSize: 11, color: "#475569", marginTop: 6, fontStyle: "italic" }}>{m.notes.substring(0, 120)}{m.notes.length > 120 ? "…" : ""}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Not Started */}
          {notStartedMS.length > 0 && (
            <div>
              <div style={{ ...s.sectionTitle, color: "#6b7280", marginBottom: 12 }}>
                ○ Not Started ({notStartedMS.length})
              </div>
              {notStartedMS.map((m, i) => (
                <div key={i} style={{ padding: "10px 12px", marginBottom: 8, borderRadius: 8, background: "#6b728011", border: "1px solid #6b728033" }}>
                  <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{m.milestone_name}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" }}>
                    {m.planned_date && <span style={{ fontSize: 11, color: "#475569" }}>📅 Planned: {m.planned_date}</span>}
                    {m.owner && <span style={{ fontSize: 11, color: "#475569" }}>👤 {m.owner}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Overview");
  const [data, setData] = useState({ milestones: [], engineering: [], equipment: [], sow: [], meetings: [], par: [] });
  const [loading, setLoading] = useState(true);
  const [lastLoaded, setLastLoaded] = useState(null);

  async function loadData() {
    setLoading(true);
    const [milestones, engineering, equipment, sow, meetings, par] = await Promise.all([
      listEntity("JMUXMilestone"),
      listEntity("JMUXEngPackage"),
      listEntity("JMUXEquipment"),
      listEntity("JMUXSOW"),
      listEntity("JMUXMeetingMinute"),
      listEntity("JMUXPARControl"),
    ]);
    setData({ milestones, engineering, equipment, sow, meetings, par });
    setLastLoaded(new Date().toLocaleTimeString());
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={s.headerTitle}>⚡ JMUX Replacement Dashboard</h1>
            <p style={s.headerSub}>PRJ13797 · PSEG Long Island · Nokia SR-Series NMS Integration</p>
          </div>
          {lastLoaded && <div style={{ fontSize: 12, color: "#475569" }}>Last loaded: {lastLoaded}</div>}
        </div>
      </div>
      <div style={s.tabBar}>
        {TABS.map(t => <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <div style={s.body}>
        {loading ? <div style={s.loading}>⏳ Loading data...</div> : (
          <>
            {tab === "Overview"    && <Overview data={data} />}
            {tab === "Phase 1 ✅"   && <PhaseCompletion phase="Phase 1 ✅" data={data} />}
            {tab === "Phase 2 🔵"   && <PhaseCompletion phase="Phase 2 🔵" data={data} />}
            {tab === "Phase 3 🟣"   && <PhaseCompletion phase="Phase 3 🟣" data={data} />}
            {tab === "Milestones"  && <Milestones items={data.milestones} onRefresh={loadData} />}
            {tab === "Engineering" && <Engineering items={data.engineering} onRefresh={loadData} />}
            
            {tab === "PAR Control" && <PARControl items={data.par} equipment={data.equipment} onRefresh={loadData} />}
            {tab === "SOW"         && <SOW items={data.sow} onRefresh={loadData} />}
            {tab === "Meetings"    && <Meetings items={data.meetings} onRefresh={loadData} />}
          </>
        )}
      </div>
    </div>
  );
}
