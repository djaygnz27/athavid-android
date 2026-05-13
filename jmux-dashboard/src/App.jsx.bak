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

const TABS = ["Overview", "Milestones", "Engineering", "Equipment", "PAR Control", "SOW", "Meetings"];

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
      subtitle: "PAR Circuit Migration — 6 High-Impact Substations",
      pct: 10,
      summary: "Serial-to-IP intermediary solution using Iniven RC-30 for NERC CIP compliance. Inherited 2024 scope gap — $500K unbudgeted. 8-week equipment lead time. Northport requires additional C37.94 protocol card.",
      checklist: [
        { done: true,  text: "PAR Migration Strategy Defined", note: "Iniven RC-30 selected — converts direct contact → C37.94. NOT a programmable device under NERC CIP." },
        { done: false, text: "Iniven RC-30 Equipment PO Placed — 6 Sites", note: "8-week lead time. CRITICAL PATH." },
        { done: false, text: "Northport C37.94 Card Ordered", note: "To be bundled with Phase 2 equipment orders" },
        { done: false, text: "RC-30 Equipment Received & Staged", note: "Pending PO placement" },
        { done: false, text: "PAR Circuit Migration — All 6 Sites", note: "~6 high-impact substations" },
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
    { phase: "Phase 3", num: 6,  label: "Phase 3 — PAR Migration", sub: "Iniven RC-30 · 6 substations · PO pending", pct: 10, color: "#8b5cf6" },
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
function Equipment({ items, onRefresh }) {
  const [filter, setFilter] = useState("");
  const filtered = items.filter(e =>
    !filter || e.item_name?.toLowerCase().includes(filter.toLowerCase()) ||
    e.vendor?.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <input style={{ ...s.input, maxWidth: 300 }} placeholder="Filter equipment..." value={filter} onChange={e => setFilter(e.target.value)} />
        <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Item</th><th style={s.th}>Category</th><th style={s.th}>Vendor</th>
            <th style={s.th}>Site / Phase</th><th style={s.th}>Ordered</th><th style={s.th}>Received</th>
            <th style={s.th}>Staged</th><th style={s.th}>Installed</th><th style={s.th}>PO Status</th><th style={s.th}>Delivery</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={{ ...s.td, fontWeight: 600 }}>{e.item_name}</td>
              <td style={s.td}>{e.category}</td>
              <td style={s.td}>{e.vendor || "—"}</td>
              <td style={s.td}>{e.site || e.phase || "—"}</td>
              <td style={s.td}>{e.quantity_ordered || 0}</td>
              <td style={s.td}>{e.quantity_received || 0}</td>
              <td style={s.td}>{e.quantity_staged || 0}</td>
              <td style={s.td}>{e.quantity_installed || 0}</td>
              <td style={s.td}><Badge status={e.po_status} /></td>
              <td style={s.td}>{e.actual_delivery || e.expected_delivery || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── PAR CONTROL ────────────────────────────────────────────────────────────────
function PARControl({ items, onRefresh }) {
  const [expanded, setExpanded] = useState(null);

  const statusDot = (val) => {
    if (val === true) return { icon: "✅", color: "#22c55e" };
    if (val === false) return { icon: "❌", color: "#ef4444" };
    return { icon: "⏳", color: "#f59e0b" };
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#93c5fd", background: "#1e3a5f33", border: "1px solid #3b82f644", borderRadius: 8, padding: "10px 16px", flex: 1, marginRight: 12 }}>
          ⚡ <strong>PAR Migration</strong> — Iniven RC-30 converts direct contact → C37.94 protocol · 6 high-impact substations · 8-week lead time · $500K unbudgeted (inherited 2024 scope gap) · RC-30 ordered by <strong>Chakrapani</strong>
        </div>
        <button style={s.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total PAR Sites", val: items.length, color: "#f59e0b" },
          { label: "RC-30 Ordered", val: items.filter(i => i.rc30_ordered).length + " / " + items.length, color: "#22c55e" },
          { label: "RC-30 Received", val: items.filter(i => i.rc30_received).length + " / " + items.length, color: "#06b6d4" },
          { label: "Design In Progress", val: items.filter(i => i.design_status === "In Progress").length, color: "#3b82f6" },
          { label: "Design Complete", val: items.filter(i => i.design_status === "Complete" || i.design_status === "Approved").length, color: "#22c55e" },
          { label: "C37.94 Card Needed", val: items.filter(i => i.c3794_card_needed).length + " site(s)", color: "#ef4444" },
        ].map((kpi, i) => (
          <div key={i} style={{ background: "#1e293b", borderRadius: 8, padding: "10px 14px", border: "1px solid #334155" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: kpi.color }}>{kpi.val}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Site cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((p, i) => {
          const isOpen = expanded === i;
          const hasAlert = p.c3794_card_needed || !p.rc30_ordered || p.design_status === "Not Started";
          return (
            <div key={i} style={{ background: "#1e293b", borderRadius: 10, border: `1px solid ${hasAlert ? "#f59e0b55" : "#334155"}`, overflow: "hidden" }}>
              {/* Card header — always visible */}
              <div
                style={{ padding: "14px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                {/* Site name */}
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#e2e8f0" }}>{p.site_name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{p.substation_id}</div>
                </div>

                {/* Status pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 700, background: (p.design_status === "Complete" || p.design_status === "Approved") ? "#22c55e22" : p.design_status === "In Progress" ? "#3b82f622" : "#ef444422", color: (p.design_status === "Complete" || p.design_status === "Approved") ? "#22c55e" : p.design_status === "In Progress" ? "#3b82f6" : "#ef4444", border: "1px solid currentColor" }}>
                    📐 Design: {p.design_status || "Not Started"}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 700, background: p.rc30_ordered ? "#22c55e22" : "#ef444422", color: p.rc30_ordered ? "#22c55e" : "#ef4444", border: "1px solid currentColor" }}>
                    📦 RC-30: {p.rc30_ordered ? "Ordered ✅" : "NOT Ordered ❌"}
                  </span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 700, background: p.rc30_received ? "#22c55e22" : "#64748b22", color: p.rc30_received ? "#22c55e" : "#64748b", border: "1px solid currentColor" }}>
                    🚚 Received: {p.rc30_received ? "Yes ✅" : "Pending"}
                  </span>
                  {p.c3794_card_needed && (
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 700, background: p.c3794_ordered ? "#22c55e22" : "#ef444422", color: p.c3794_ordered ? "#22c55e" : "#ef4444", border: "1px solid currentColor" }}>
                      ⚠️ C37.94 Card: {p.c3794_ordered ? "Ordered ✅" : "NOT Ordered ❌"}
                    </span>
                  )}
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, fontWeight: 700, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155" }}>
                    🔧 Install: {p.installation_status || "Not Started"}
                  </span>
                </div>

                {/* Expand arrow */}
                <div style={{ fontSize: 18, color: "#64748b", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ borderTop: "1px solid #334155", padding: "16px 20px", background: "#162032" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Left column — tracking details */}
                    <div>
                      <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Tracking Details</div>
                      {[
                        ["Ordered By", p.rc30_ordered_by || "—"],
                        ["PO Number", p.rc30_po_number || "TBD ⚠️"],
                        ["RC-30 Qty", p.rc30_quantity || "—"],
                        ["Expected Delivery", p.rc30_expected_delivery || "TBD ⚠️"],
                        ["Actual Delivery", p.rc30_actual_delivery || "—"],
                        ["Design Owner", p.design_owner || "TBD ⚠️"],
                        ["Design Due Date", p.design_due_date || "TBD ⚠️"],
                        ["Design Complete", p.design_complete_date || "—"],
                        ["NERC CIP Compliant", p.nerc_cip_compliant ? "✅ Yes" : "⏳ Pending"],
                        ...(p.c3794_card_needed ? [["C37.94 PO#", p.c3794_po_number || "TBD ⚠️"], ["C37.94 Delivery", p.c3794_expected_delivery || "TBD ⚠️"]] : []),
                      ].map(([label, val], j) => (
                        <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1e293b" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
                          <span style={{ fontSize: 12, color: val && val.toString().includes("TBD") ? "#f59e0b" : "#e2e8f0", fontWeight: 600 }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    {/* Right column — open questions + notes */}
                    <div>
                      <div style={{ fontWeight: 700, color: "#ef4444", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>❓ Open Questions</div>
                      <div style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: 16 }}>{p.open_questions || "None"}</div>
                      <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>📝 Notes</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{p.notes || "—"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
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
            {tab === "Milestones"  && <Milestones items={data.milestones} onRefresh={loadData} />}
            {tab === "Engineering" && <Engineering items={data.engineering} onRefresh={loadData} />}
            {tab === "Equipment"   && <Equipment items={data.equipment} onRefresh={loadData} />}
            {tab === "PAR Control" && <PARControl items={data.par} onRefresh={loadData} />}
            {tab === "SOW"         && <SOW items={data.sow} onRefresh={loadData} />}
            {tab === "Meetings"    && <Meetings items={data.meetings} onRefresh={loadData} />}
          </>
        )}
      </div>
    </div>
  );
}
