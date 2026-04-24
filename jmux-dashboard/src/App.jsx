import { useState, useEffect } from "react";

const APP_ID = "69b2ee18a8e6fb58c7f0261c";
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
  "Complete": "#22c55e",
  "In Progress": "#3b82f6",
  "Not Started": "#6b7280",
  "At Risk": "#f59e0b",
  "Delayed": "#ef4444",
  "On Hold": "#8b5cf6",
  "IFR Issued": "#06b6d4",
  "IFC Issued": "#10b981",
  "Pending": "#f59e0b",
  "Active": "#3b82f6",
  "Closed": "#6b7280",
};

const TABS = ["Overview", "Milestones", "Engineering", "Equipment", "PAR Control", "SOW", "Meetings"];

const styles = {
  app: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0f172a", minHeight: "100vh", color: "#e2e8f0" },
  header: { background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)", borderBottom: "2px solid #f59e0b", padding: "20px 32px" },
  headerTitle: { fontSize: 22, fontWeight: 700, color: "#f59e0b", margin: 0 },
  headerSub: { fontSize: 13, color: "#94a3b8", margin: "4px 0 0 0" },
  tabBar: { display: "flex", gap: 4, padding: "12px 32px", background: "#1e293b", borderBottom: "1px solid #334155", overflowX: "auto" },
  tab: (active) => ({
    padding: "8px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
    background: active ? "#f59e0b" : "transparent", color: active ? "#0f172a" : "#94a3b8",
    transition: "all 0.2s"
  }),
  body: { padding: "24px 32px", maxWidth: 1400, margin: "0 auto" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 },
  card: { background: "#1e293b", borderRadius: 10, padding: "18px 22px", border: "1px solid #334155" },
  cardNum: { fontSize: 36, fontWeight: 800, color: "#f59e0b", margin: 0 },
  cardLabel: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
  cardSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: "#f59e0b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  table: { width: "100%", borderCollapse: "collapse", background: "#1e293b", borderRadius: 10, overflow: "hidden" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #334155", background: "#0f172a" },
  td: { padding: "10px 14px", fontSize: 13, color: "#e2e8f0", borderBottom: "1px solid #1e293b" },
  badge: (status) => ({
    display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
    background: (STATUS_COLOR[status] || "#475569") + "22",
    color: STATUS_COLOR[status] || "#94a3b8",
    border: `1px solid ${STATUS_COLOR[status] || "#475569"}44`
  }),
  loading: { textAlign: "center", padding: 60, color: "#94a3b8" },
  empty: { textAlign: "center", padding: 40, color: "#475569", fontSize: 14 },
  refreshBtn: { marginLeft: "auto", padding: "6px 16px", background: "#1e3a5f", border: "1px solid #3b82f6", borderRadius: 6, color: "#93c5fd", fontSize: 12, cursor: "pointer", fontWeight: 600 },
  input: { background: "#0f172a", border: "1px solid #334155", borderRadius: 6, padding: "6px 10px", color: "#e2e8f0", fontSize: 13, width: "100%", boxSizing: "border-box" },
  progressBar: (pct, color) => ({
    height: 6, borderRadius: 3, background: "#334155", position: "relative", overflow: "hidden"
  }),
  progressFill: (pct, color) => ({
    position: "absolute", top: 0, left: 0, height: "100%",
    width: `${Math.min(pct || 0, 100)}%`,
    background: color || "#f59e0b", borderRadius: 3,
    transition: "width 0.6s ease"
  }),
};

function StatusBadge({ status }) {
  return <span style={styles.badge(status)}>{status || "—"}</span>;
}

function ProgressBar({ pct, color }) {
  return (
    <div style={styles.progressBar(pct, color)}>
      <div style={styles.progressFill(pct, color)} />
    </div>
  );
}

function Loading() {
  return <div style={styles.loading}>⏳ Loading data...</div>;
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({ data }) {
  const { milestones, engineering, equipment, sow, meetings, par } = data;

  const ph1Sites = engineering.filter(e => e.phase === "Phase 1");
  const ph2Sites = engineering.filter(e => e.phase === "Phase 2");
  const ph1Complete = ph1Sites.filter(e => e.ifc_status === "IFC Issued" || e.ifc_status === "Complete").length;
  const ph2IFR = ph2Sites.filter(e => e.ifr_status === "IFR Issued" || e.ifr_status === "Complete").length;

  const milestonesComplete = milestones.filter(m => m.status === "Complete").length;
  const milestonesTotal = milestones.length;
  const openActions = meetings.reduce((acc, m) => {
    const items = m.action_items ? (Array.isArray(m.action_items) ? m.action_items : [m.action_items]) : [];
    return acc + items.filter(i => i && typeof i === "string" && !i.toLowerCase().includes("complete")).length;
  }, 0);

  const equipOrdered = equipment.filter(e => e.po_status === "Ordered" || e.po_status === "Received").length;
  const equipTotal = equipment.length;

  // SPI from milestones
  const withSPI = milestones.filter(m => m.cumulative_spi);
  const latestSPI = withSPI.length ? withSPI[withSPI.length - 1].cumulative_spi : null;
  const spiColor = !latestSPI ? "#94a3b8" : latestSPI >= 0.95 ? "#22c55e" : latestSPI >= 0.80 ? "#f59e0b" : "#ef4444";
  const spiStatus = !latestSPI ? "N/A" : latestSPI >= 0.95 ? "GREEN" : latestSPI >= 0.80 ? "YELLOW" : "RED";

  return (
    <div>
      {/* KPI row */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardNum}>{ph1Sites.length}</div>
          <div style={styles.cardLabel}>Phase 1 Sites</div>
          <div style={styles.cardSub}>{ph1Complete} IFC issued</div>
          <div style={{ marginTop: 8 }}><ProgressBar pct={(ph1Complete / (ph1Sites.length || 1)) * 100} color="#22c55e" /></div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardNum}>{ph2Sites.length}</div>
          <div style={styles.cardLabel}>Phase 2 Sites</div>
          <div style={styles.cardSub}>{ph2IFR} IFR issued</div>
          <div style={{ marginTop: 8 }}><ProgressBar pct={(ph2IFR / (ph2Sites.length || 1)) * 100} color="#3b82f6" /></div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.cardNum, color: spiColor }}>{latestSPI ? latestSPI.toFixed(2) : "—"}</div>
          <div style={styles.cardLabel}>Cumulative SPI</div>
          <div style={{ ...styles.cardSub, color: spiColor }}>{spiStatus}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardNum}>{milestonesComplete}/{milestonesTotal}</div>
          <div style={styles.cardLabel}>Milestones Complete</div>
          <div style={{ marginTop: 8 }}><ProgressBar pct={(milestonesComplete / (milestonesTotal || 1)) * 100} color="#f59e0b" /></div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardNum}>{equipOrdered}/{equipTotal}</div>
          <div style={styles.cardLabel}>Equipment Ordered</div>
          <div style={{ marginTop: 8 }}><ProgressBar pct={(equipOrdered / (equipTotal || 1)) * 100} color="#06b6d4" /></div>
        </div>
        <div style={styles.card}>
          <div style={{ ...styles.cardNum, color: openActions > 5 ? "#ef4444" : "#f59e0b" }}>{openActions}</div>
          <div style={styles.cardLabel}>Open Action Items</div>
          <div style={styles.cardSub}>from {meetings.length} meetings</div>
        </div>
      </div>

      {/* Recent Milestones */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🎯 Recent Milestones</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Milestone</th>
              <th style={styles.th}>Phase</th>
              <th style={styles.th}>Workstream</th>
              <th style={styles.th}>Planned</th>
              <th style={styles.th}>Actual</th>
              <th style={styles.th}>SPI</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {milestones.slice(-10).reverse().map((m, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                <td style={styles.td}>{m.milestone_name}</td>
                <td style={styles.td}>{m.phase}</td>
                <td style={styles.td}>{m.workstream}</td>
                <td style={styles.td}>{m.planned_date}</td>
                <td style={styles.td}>{m.actual_date || "—"}</td>
                <td style={{ ...styles.td, color: !m.cumulative_spi ? "#6b7280" : m.cumulative_spi >= 0.95 ? "#22c55e" : m.cumulative_spi >= 0.80 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>
                  {m.cumulative_spi ? m.cumulative_spi.toFixed(2) : "—"}
                </td>
                <td style={styles.td}><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SOW Summary */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>📋 SOW Status</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {sow.map((s, i) => (
            <div key={i} style={{ ...styles.card, flex: "1 1 220px" }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 14 }}>{s.vendor}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0" }}>{s.scope_summary}</div>
              <StatusBadge status={s.status} />
              {s.contract_value && <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 6 }}>${Number(s.contract_value).toLocaleString()}</div>}
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
        <input style={{ ...styles.input, maxWidth: 300 }} placeholder="Filter milestones..." value={filter} onChange={e => setFilter(e.target.value)} />
        <button style={styles.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Milestone</th>
            <th style={styles.th}>Phase</th>
            <th style={styles.th}>Workstream</th>
            <th style={styles.th}>Owner</th>
            <th style={styles.th}>Planned</th>
            <th style={styles.th}>Actual</th>
            <th style={styles.th}>% Done</th>
            <th style={styles.th}>SPI</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={9} style={{ ...styles.td, ...styles.empty }}>No milestones found</td></tr>
          ) : filtered.map((m, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={styles.td}>{m.milestone_name}</td>
              <td style={styles.td}>{m.phase}</td>
              <td style={styles.td}>{m.workstream}</td>
              <td style={styles.td}>{m.owner || "—"}</td>
              <td style={styles.td}>{m.planned_date}</td>
              <td style={styles.td}>{m.actual_date || "—"}</td>
              <td style={{ ...styles.td, minWidth: 80 }}>
                <ProgressBar pct={m.percent_complete} color="#f59e0b" />
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{m.percent_complete || 0}%</div>
              </td>
              <td style={{ ...styles.td, color: !m.cumulative_spi ? "#6b7280" : m.cumulative_spi >= 0.95 ? "#22c55e" : m.cumulative_spi >= 0.80 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>
                {m.cumulative_spi ? m.cumulative_spi.toFixed(2) : "—"}
              </td>
              <td style={styles.td}><StatusBadge status={m.status} /></td>
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
          <button key={p} style={{ ...styles.tab(phFilter === p), fontSize: 12 }} onClick={() => setPhFilter(p)}>{p}</button>
        ))}
        <button style={styles.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Site Name</th>
            <th style={styles.th}>Phase</th>
            <th style={styles.th}>IFR Planned</th>
            <th style={styles.th}>IFR Actual</th>
            <th style={styles.th}>IFR Status</th>
            <th style={styles.th}>IFC Planned</th>
            <th style={styles.th}>IFC Actual</th>
            <th style={styles.th}>IFC Status</th>
            <th style={styles.th}>Construction</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={10} style={{ ...styles.td, textAlign: "center", color: "#475569" }}>No sites found</td></tr>
          ) : filtered.map((e, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={{ ...styles.td, color: "#64748b" }}>{e.site_number}</td>
              <td style={{ ...styles.td, fontWeight: 600 }}>{e.site_name}</td>
              <td style={styles.td}>{e.phase}</td>
              <td style={styles.td}>{e.ifr_planned || "—"}</td>
              <td style={styles.td}>{e.ifr_actual || "—"}</td>
              <td style={styles.td}><StatusBadge status={e.ifr_status} /></td>
              <td style={styles.td}>{e.ifc_planned || "—"}</td>
              <td style={styles.td}>{e.ifc_actual || "—"}</td>
              <td style={styles.td}><StatusBadge status={e.ifc_status} /></td>
              <td style={styles.td}>{e.construction_planned || "—"}</td>
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
    e.vendor?.toLowerCase().includes(filter.toLowerCase()) ||
    e.site?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <input style={{ ...styles.input, maxWidth: 300 }} placeholder="Filter equipment..." value={filter} onChange={e => setFilter(e.target.value)} />
        <button style={styles.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Vendor</th>
            <th style={styles.th}>Site</th>
            <th style={styles.th}>Phase</th>
            <th style={styles.th}>PO #</th>
            <th style={styles.th}>Ordered</th>
            <th style={styles.th}>Received</th>
            <th style={styles.th}>Staged</th>
            <th style={styles.th}>Installed</th>
            <th style={styles.th}>PO Status</th>
            <th style={styles.th}>Delivery</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={12} style={{ ...styles.td, textAlign: "center", color: "#475569" }}>No equipment found</td></tr>
          ) : filtered.map((e, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={{ ...styles.td, fontWeight: 600 }}>{e.item_name}</td>
              <td style={styles.td}>{e.category}</td>
              <td style={styles.td}>{e.vendor || "—"}</td>
              <td style={styles.td}>{e.site || "—"}</td>
              <td style={styles.td}>{e.phase || "—"}</td>
              <td style={styles.td}>{e.po_number || "—"}</td>
              <td style={styles.td}>{e.quantity_ordered || 0}</td>
              <td style={styles.td}>{e.quantity_received || 0}</td>
              <td style={styles.td}>{e.quantity_staged || 0}</td>
              <td style={styles.td}>{e.quantity_installed || 0}</td>
              <td style={styles.td}><StatusBadge status={e.po_status} /></td>
              <td style={styles.td}>{e.actual_delivery || e.expected_delivery || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── PAR CONTROL ────────────────────────────────────────────────────────────────
function PARControl({ items, onRefresh }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={styles.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <div style={{ background: "#1e3a5f22", border: "1px solid #3b82f644", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#93c5fd" }}>
        ℹ️ PAR migration uses Iniven RC-30 (converts direct contact → C37.94). ~6–7 high-impact sites. 8-week lead time. $500K unbudgeted cost — inherited 2024 scope gap.
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Site</th>
            <th style={styles.th}>Substation ID</th>
            <th style={styles.th}>Design</th>
            <th style={styles.th}>RC-30 Ordered</th>
            <th style={styles.th}>Order Date</th>
            <th style={styles.th}>Expected Delivery</th>
            <th style={styles.th}>RC-30 Received</th>
            <th style={styles.th}>C37.94 Needed</th>
            <th style={styles.th}>C37.94 Ordered</th>
            <th style={styles.th}>Install Status</th>
            <th style={styles.th}>NERC CIP</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={11} style={{ ...styles.td, textAlign: "center", color: "#475569" }}>No PAR control records found</td></tr>
          ) : items.map((p, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
              <td style={{ ...styles.td, fontWeight: 600 }}>{p.site_name}</td>
              <td style={styles.td}>{p.substation_id || "—"}</td>
              <td style={styles.td}><StatusBadge status={p.design_status} /></td>
              <td style={styles.td}>{p.rc30_ordered ? "✅" : "❌"}</td>
              <td style={styles.td}>{p.rc30_order_date || "—"}</td>
              <td style={styles.td}>{p.rc30_expected_delivery || "—"}</td>
              <td style={styles.td}>{p.rc30_received ? "✅" : "❌"}</td>
              <td style={styles.td}>{p.c3794_card_needed ? "Yes" : "No"}</td>
              <td style={styles.td}>{p.c3794_ordered ? "✅" : "❌"}</td>
              <td style={styles.td}><StatusBadge status={p.installation_status} /></td>
              <td style={styles.td}>{p.nerc_cip_compliant ? "✅ Yes" : "⚠️ Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── SOW ───────────────────────────────────────────────────────────────────────
function SOW({ items, onRefresh }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button style={styles.refreshBtn} onClick={onRefresh}>↻ Refresh</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.length === 0 ? (
          <div style={styles.empty}>No SOW records found</div>
        ) : items.map((s, i) => (
          <div key={i} style={{ ...styles.card, borderLeft: `4px solid ${STATUS_COLOR[s.status] || "#475569"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9" }}>{s.vendor}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{s.scope_summary}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13 }}>
              {s.contract_value && <div><span style={{ color: "#64748b" }}>Value: </span><span style={{ color: "#f59e0b", fontWeight: 700 }}>${Number(s.contract_value).toLocaleString()}</span></div>}
              {s.start_date && <div><span style={{ color: "#64748b" }}>Start: </span><span>{s.start_date}</span></div>}
              {s.end_date && <div><span style={{ color: "#64748b" }}>End: </span><span>{s.end_date}</span></div>}
            </div>
            {s.open_items && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: "#0f172a", borderRadius: 6, fontSize: 12, color: "#fbbf24" }}>
                ⚠️ Open Items: {s.open_items}
              </div>
            )}
            {s.notes && <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>{s.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MEETINGS ──────────────────────────────────────────────────────────────────
function Meetings({ items, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const sorted = [...items].sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));

  return (
    <div style={{ display: "flex", gap: 20 }}>
      {/* List */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>{items.length} meetings</div>
          <button style={styles.refreshBtn} onClick={onRefresh}>↻</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((m, i) => (
            <div
              key={i}
              onClick={() => setSelected(m)}
              style={{
                ...styles.card, cursor: "pointer", padding: "12px 14px",
                borderLeft: selected === m ? "3px solid #f59e0b" : "3px solid transparent",
                background: selected === m ? "#1e3a5f" : "#1e293b"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.title || "Meeting"}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{m.meeting_date}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{m.owner || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1 }}>
        {!selected ? (
          <div style={styles.empty}>← Select a meeting to view details</div>
        ) : (
          <div style={styles.card}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>{selected.title}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{selected.meeting_date} · {selected.owner}</div>

            {selected.attendees && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>ATTENDEES</div>
                <div style={{ fontSize: 13 }}>{Array.isArray(selected.attendees) ? selected.attendees.join(", ") : selected.attendees}</div>
              </div>
            )}

            {selected.key_decisions && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>KEY DECISIONS</div>
                <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{Array.isArray(selected.key_decisions) ? selected.key_decisions.join("\n") : selected.key_decisions}</div>
              </div>
            )}

            {selected.action_items && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>ACTION ITEMS</div>
                <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{Array.isArray(selected.action_items) ? selected.action_items.join("\n") : selected.action_items}</div>
              </div>
            )}

            {selected.notes && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>NOTES</div>
                <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{selected.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    milestones: [], engineering: [], equipment: [], sow: [], meetings: [], par: []
  });

  const load = async () => {
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
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={styles.headerTitle}>⚡ JMUX Replacement Dashboard</div>
            <div style={styles.headerSub}>PRJ13797 · PSEG Long Island · Nokia SR-Series NMS Integration</div>
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Last loaded: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div style={styles.tabBar}>
        {TABS.map(t => (
          <button key={t} style={styles.tab(tab === t)} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div style={styles.body}>
        {loading ? <Loading /> : (
          <>
            {tab === "Overview" && <Overview data={data} />}
            {tab === "Milestones" && <Milestones items={data.milestones} onRefresh={load} />}
            {tab === "Engineering" && <Engineering items={data.engineering} onRefresh={load} />}
            {tab === "Equipment" && <Equipment items={data.equipment} onRefresh={load} />}
            {tab === "PAR Control" && <PARControl items={data.par} onRefresh={load} />}
            {tab === "SOW" && <SOW items={data.sow} onRefresh={load} />}
            {tab === "Meetings" && <Meetings items={data.meetings} onRefresh={load} />}
          </>
        )}
      </div>
    </div>
  );
}
