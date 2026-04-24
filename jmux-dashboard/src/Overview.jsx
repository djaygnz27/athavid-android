import { useState } from "react";

const STATUS_COLOR = {
  "Complete": "#22c55e",
  "In Progress": "#3b82f6",
  "Not Started": "#6b7280",
  "At Risk": "#f59e0b",
  "Delayed": "#ef4444",
  "Overdue": "#ef4444",
  "On Hold": "#8b5cf6",
  "IFR Issued": "#06b6d4",
  "IFC Issued": "#10b981",
  "Pending": "#f59e0b",
  "Active": "#3b82f6",
  "Closed": "#6b7280",
};

function StatusBadge({ status }) {
  const color = STATUS_COLOR[status] || "#475569";
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: color + "22", color, border: `1px solid ${color}44`
    }}>{status || "—"}</span>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: "#334155", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${Math.min(pct || 0, 100)}%`, background: color || "#f59e0b", borderRadius: 3, transition: "width 0.6s ease" }} />
    </div>
  );
}

// Modal overlay for drill-down
function DrillDownModal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#1e293b", borderRadius: 12, border: "1px solid #334155", width: "100%", maxWidth: 860, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #334155" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: "16px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

const th = { padding: "9px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", borderBottom: "1px solid #334155", background: "#0f172a" };
const td = { padding: "9px 12px", fontSize: 12, color: "#e2e8f0", borderBottom: "1px solid #1e293b" };

export default function Overview({ data }) {
  const { milestones, engineering, equipment, sow, meetings } = data;
  const [modal, setModal] = useState(null); // null | "ph1" | "ph2" | "spi" | "milestones" | "equipment" | "actions"

  const ph1Sites = engineering.filter(e => e.phase === "Phase 1");
  const ph2Sites = engineering.filter(e => e.phase === "Phase 2");

  // Phase 1 — PM confirmed 85% (Apr 24 2026): all installs, IFR/IFC, NMS GUI done. RTU test + MOP remaining.
  const ph1Milestones = milestones.filter(m => m.phase === "Phase 1");
  const ph1CompletedCount = ph1Milestones.filter(m => m.status === "Complete").length;
  const ph1AvgPct = 85;

  // Phase 2
  const ph2IFC = ph2Sites.filter(e => e.ifc_status === "IFC Issued").length;
  const ph2IFR = ph2Sites.filter(e => e.ifr_status === "IFR Issued").length;
  const ph2Pct = Math.round((ph2IFC / (ph2Sites.length || 1)) * 100);

  // Milestones
  const milestonesComplete = milestones.filter(m => m.status === "Complete").length;
  const milestonesTotal = milestones.length;

  // Equipment
  const equipOrdered = equipment.filter(e => e.po_status === "Ordered" || e.po_status === "Received").length;
  const equipTotal = equipment.length;

  // SPI
  const withSPI = milestones.filter(m => m.cumulative_spi);
  const latestSPI = withSPI.length ? withSPI[withSPI.length - 1].cumulative_spi : null;
  const spiColor = !latestSPI ? "#94a3b8" : latestSPI >= 0.95 ? "#22c55e" : latestSPI >= 0.80 ? "#f59e0b" : "#ef4444";
  const spiStatus = !latestSPI ? "N/A" : latestSPI >= 0.95 ? "GREEN" : latestSPI >= 0.80 ? "YELLOW" : "RED";

  // Open actions
  const openActions = meetings.reduce((acc, m) => {
    const items = m.action_items ? (Array.isArray(m.action_items) ? m.action_items : [m.action_items]) : [];
    return acc + items.filter(i => i && typeof i === "string" && !i.toLowerCase().includes("complete")).length;
  }, 0);

  const cardStyle = {
    background: "#1e293b", borderRadius: 10, padding: "18px 22px",
    border: "1px solid #334155", cursor: "pointer",
    transition: "border-color 0.2s, transform 0.15s",
  };
  const cardHover = { borderColor: "#f59e0b", transform: "translateY(-2px)" };

  function KPICard({ id, num, numColor, label, sub, pct, barColor, children }) {
    const [hov, setHov] = useState(false);
    return (
      <div
        style={{ ...cardStyle, ...(hov ? cardHover : {}) }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => setModal(id)}
      >
        <div style={{ fontSize: 36, fontWeight: 800, color: numColor || "#f59e0b" }}>{num}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{sub}</div>
        {pct !== undefined && <div style={{ marginTop: 8 }}><ProgressBar pct={pct} color={barColor} /></div>}
        <div style={{ fontSize: 10, color: "#475569", marginTop: 6 }}>Click to view details ›</div>
      </div>
    );
  }

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <KPICard id="ph1" num={ph1Sites.length} label="Phase 1 Sites"
          sub={`${ph1AvgPct}% complete · ${ph1CompletedCount}/${ph1Milestones.length} milestones done`}
          pct={ph1AvgPct} barColor="#22c55e" />
        <KPICard id="ph2" num={ph2Sites.length} label="Phase 2 Sites"
          sub={`${ph2IFC}/36 IFC Issued · ${ph2IFR}/36 IFR Issued`}
          pct={ph2Pct} barColor="#3b82f6" />
        <KPICard id="spi" num={latestSPI ? latestSPI.toFixed(2) : "—"} numColor={spiColor}
          label="Cumulative SPI" sub={spiStatus} />
        <KPICard id="milestones" num={`${milestonesComplete}/${milestonesTotal}`} label="Milestones Complete"
          pct={(milestonesComplete / (milestonesTotal || 1)) * 100} barColor="#f59e0b" />
        <KPICard id="equipment" num={`${equipOrdered}/${equipTotal}`} label="Equipment Ordered"
          pct={(equipOrdered / (equipTotal || 1)) * 100} barColor="#06b6d4" />
        <KPICard id="actions" num={openActions} numColor={openActions > 5 ? "#ef4444" : "#f59e0b"}
          label="Open Action Items" sub={`from ${meetings.length} meetings`} />
      </div>

      {/* Recent Milestones table */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>🎯 Recent Milestones</div>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e293b", borderRadius: 10, overflow: "hidden" }}>
          <thead><tr>
            {["Milestone","Phase","Workstream","Planned","Actual","SPI","Status"].map(h => <th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {milestones.slice(-10).reverse().map((m, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                <td style={td}>{m.milestone_name}</td>
                <td style={td}>{m.phase}</td>
                <td style={td}>{m.workstream}</td>
                <td style={td}>{m.planned_date}</td>
                <td style={td}>{m.actual_date || "—"}</td>
                <td style={{ ...td, color: !m.cumulative_spi ? "#6b7280" : m.cumulative_spi >= 0.95 ? "#22c55e" : m.cumulative_spi >= 0.80 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>
                  {m.cumulative_spi ? m.cumulative_spi.toFixed(2) : "—"}
                </td>
                <td style={td}><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SOW Summary */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", marginBottom: 12 }}>📋 SOW Status</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {sow.map((s, i) => (
            <div key={i} style={{ background: "#1e293b", borderRadius: 10, padding: "16px 20px", border: "1px solid #334155", flex: "1 1 220px" }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 14 }}>{s.vendor}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0" }}>{s.scope_summary}</div>
              <StatusBadge status={s.status} />
              {s.contract_value && <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 6 }}>{s.contract_value}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODALS ── */}

      {modal === "ph1" && (
        <DrillDownModal title="⚡ Phase 1 — 31 Sites Detail" onClose={() => setModal(null)}>
          {/* Summary bullets */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Nokia MPLS Routers Installed", val: "31 / 31 ✅" },
              { label: "Nodes Built in NSP GUI", val: "31 / 31 ✅" },
              { label: "IFR Status", val: "All Issued ✅" },
              { label: "IFC Status", val: "All Issued ✅" },
              { label: "RTU Serial Test (John Ng)", val: "Due Apr 30 🔄" },
              { label: "Production RTU MOP", val: "Pending ⏳" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: "10px 14px", border: "1px solid #334155" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginTop: 2 }}>{item.val}</div>
              </div>
            ))}
          </div>
          {/* Milestone list */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Milestones</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Milestone","Workstream","Status","% Done"].map(h => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {ph1Milestones.map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                  <td style={td}>{m.milestone_name}</td>
                  <td style={td}>{m.workstream}</td>
                  <td style={td}><StatusBadge status={m.status} /></td>
                  <td style={{ ...td, fontWeight: 700, color: m.percent_complete >= 100 ? "#22c55e" : m.percent_complete > 0 ? "#f59e0b" : "#6b7280" }}>{m.percent_complete || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DrillDownModal>
      )}

      {modal === "ph2" && (
        <DrillDownModal title="🔵 Phase 2 — 36 Sites Detail" onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { label: "Nokia Equipment", val: "Ordered & Delivered ✅" },
              { label: "Equipment Location", val: "Hawkeye Trailer 📦" },
              { label: "IFR & IFC Sealed/Approved", val: "9 / 36 ✅" },
              { label: "Site Surveys (Hawkeye)", val: "In Progress 🔄" },
              { label: "Final IFR Deadline", val: "Jun 29, 2026" },
              { label: "Final IFC Deadline", val: "Jul 13, 2026" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0f172a", borderRadius: 8, padding: "10px 14px", border: "1px solid #334155" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginTop: 2 }}>{item.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Engineering Package Status</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["#","Site","IFR Status","IFC Status"].map(h => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {ph2Sites.sort((a,b) => (parseInt(a.site_number)||0) - (parseInt(b.site_number)||0)).map((s, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                  <td style={{ ...td, color: "#64748b" }}>{s.site_number}</td>
                  <td style={td}>{s.site_name}</td>
                  <td style={td}><StatusBadge status={s.ifr_status} /></td>
                  <td style={td}><StatusBadge status={s.ifc_status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </DrillDownModal>
      )}

      {modal === "spi" && (
        <DrillDownModal title="📈 SPI — Schedule Performance" onClose={() => setModal(null)}>
          <div style={{ marginBottom: 12, padding: "12px 16px", background: "#0f172a", borderRadius: 8, border: `1px solid ${spiColor}44` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: spiColor }}>{latestSPI ? latestSPI.toFixed(2) : "—"}</div>
            <div style={{ fontSize: 13, color: spiColor, fontWeight: 700 }}>{spiStatus} — Phase 1 delayed due to Nokia license + DNS dependencies (now resolved)</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Phase 2 work running concurrently, offsetting Phase 1 slippage</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Milestone","Planned","Actual","Cum. SPI","Status"].map(h => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {milestones.filter(m => m.cumulative_spi).map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                  <td style={td}>{m.milestone_name}</td>
                  <td style={td}>{m.planned_date}</td>
                  <td style={td}>{m.actual_date || "—"}</td>
                  <td style={{ ...td, fontWeight: 700, color: m.cumulative_spi >= 0.95 ? "#22c55e" : m.cumulative_spi >= 0.80 ? "#f59e0b" : "#ef4444" }}>{m.cumulative_spi.toFixed(2)}</td>
                  <td style={td}><StatusBadge status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </DrillDownModal>
      )}

      {modal === "milestones" && (
        <DrillDownModal title="🎯 All Milestones" onClose={() => setModal(null)}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Milestone","Phase","Workstream","Planned","Status","% Done"].map(h => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {milestones.map((m, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                  <td style={td}>{m.milestone_name}</td>
                  <td style={td}>{m.phase}</td>
                  <td style={td}>{m.workstream}</td>
                  <td style={td}>{m.planned_date}</td>
                  <td style={td}><StatusBadge status={m.status} /></td>
                  <td style={{ ...td, fontWeight: 700, color: m.percent_complete >= 100 ? "#22c55e" : m.percent_complete > 0 ? "#f59e0b" : "#6b7280" }}>{m.percent_complete || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DrillDownModal>
      )}

      {modal === "equipment" && (
        <DrillDownModal title="📦 Equipment Status" onClose={() => setModal(null)}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Item","Category","Qty Ordered","Qty Received","PO Status","Vendor"].map(h => <th key={h} style={th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {equipment.map((e, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#1e293b" : "#162032" }}>
                  <td style={td}>{e.item_name}</td>
                  <td style={td}>{e.category}</td>
                  <td style={td}>{e.quantity_ordered}</td>
                  <td style={td}>{e.quantity_received}</td>
                  <td style={td}><StatusBadge status={e.po_status} /></td>
                  <td style={td}>{e.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DrillDownModal>
      )}

      {modal === "actions" && (
        <DrillDownModal title="✅ Open Action Items" onClose={() => setModal(null)}>
          {meetings.map((m, mi) => {
            const items = m.action_items ? (Array.isArray(m.action_items) ? m.action_items : [m.action_items]) : [];
            const open = items.filter(i => i && typeof i === "string" && !i.toLowerCase().includes("complete"));
            if (!open.length) return null;
            return (
              <div key={mi} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 13, marginBottom: 6 }}>{m.title} — {m.meeting_date}</div>
                {open.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid #1e293b" }}>
                    <span style={{ color: "#ef4444", marginTop: 1 }}>•</span>
                    <span style={{ fontSize: 13, color: "#e2e8f0" }}>{item}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </DrillDownModal>
      )}
    </div>
  );
}
