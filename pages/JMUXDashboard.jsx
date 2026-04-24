import { useState, useEffect } from "react";
import { JMUXMilestone, JMUXWorkstream } from "@/api/entities";

const STATUS_CONFIG = {
  "Complete":     { color: "#22c55e", bg: "#dcfce7", icon: "✅", ring: "#16a34a" },
  "In Progress":  { color: "#3b82f6", bg: "#dbeafe", icon: "🔄", ring: "#2563eb" },
  "Not Started":  { color: "#94a3b8", bg: "#f1f5f9", icon: "⬜", ring: "#64748b" },
  "Overdue":      { color: "#ef4444", bg: "#fee2e2", icon: "⚠️", ring: "#dc2626" },
  "At Risk":      { color: "#f59e0b", bg: "#fef3c7", icon: "🟡", ring: "#d97706" },
  "On Track":     { color: "#22c55e", bg: "#dcfce7", icon: "✅", ring: "#16a34a" },
};

const PHASE_COLORS = {
  "Phase 1": "#3b82f6",
  "Phase 2": "#8b5cf6",
  "Phase 3": "#f59e0b",
  "All":     "#64748b",
};

function SPIGauge({ spi }) {
  const clamped = Math.min(Math.max(spi || 0, 0), 2);
  const pct = (clamped / 2) * 100;
  const color = spi < 0.70 ? "#ef4444" : spi < 0.90 ? "#f59e0b" : "#22c55e";
  const label = spi < 0.70 ? "🔴 Critical" : spi < 0.90 ? "🟡 Yellow" : spi < 1.10 ? "🟢 On Track" : "🔵 Ahead";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, fontWeight: 800, color, lineHeight: 1 }}>{spi?.toFixed(2)}</div>
      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{label}</div>
      <div style={{ marginTop: 10, height: 10, borderRadius: 5, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 5, transition: "width 0.8s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
        <span>0.00</span><span>0.70</span><span>1.00</span><span>2.00</span>
      </div>
    </div>
  );
}

function ProgressBar({ pct, color = "#3b82f6", height = 10 }) {
  return (
    <div style={{ height, borderRadius: height / 2, background: "#e2e8f0", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(pct || 0, 100)}%`, height: "100%", background: color, borderRadius: height / 2, transition: "width 0.6s ease" }} />
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.08)", padding: 24, ...style }}>
      {children}
    </div>
  );
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Not Started"];
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {cfg.icon} {status}
    </span>
  );
}

// Edit Modal
function EditMilestoneModal({ milestone, onSave, onClose }) {
  const [form, setForm] = useState({ ...milestone });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    await JMUXMilestone.update(milestone.id, form);
    onSave();
  };

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginTop: 12 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Edit Milestone</h3>
        <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: 13 }}>{milestone.milestone_name}</p>

        <label style={labelStyle}>Status</label>
        <select value={form.status || ""} onChange={e => set("status", e.target.value)} style={inputStyle}>
          {["Not Started","In Progress","Complete","Overdue","At Risk"].map(s => <option key={s}>{s}</option>)}
        </select>

        <label style={labelStyle}>% Complete</label>
        <input type="number" min={0} max={100} value={form.percent_complete || 0} onChange={e => set("percent_complete", Number(e.target.value))} style={inputStyle} />

        <label style={labelStyle}>Weekly SPI</label>
        <input type="number" step={0.01} value={form.weekly_spi || 0} onChange={e => set("weekly_spi", Number(e.target.value))} style={inputStyle} />

        <label style={labelStyle}>Cumulative SPI</label>
        <input type="number" step={0.01} value={form.cumulative_spi || 0} onChange={e => set("cumulative_spi", Number(e.target.value))} style={inputStyle} />

        <label style={labelStyle}>Actual Date</label>
        <input type="date" value={form.actual_date || ""} onChange={e => set("actual_date", e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Owner</label>
        <input type="text" value={form.owner || ""} onChange={e => set("owner", e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Notes / Key Updates</label>
        <textarea rows={3} value={form.notes || ""} onChange={e => set("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={handleSave} style={{ flex: 1, padding: "10px 0", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Save</button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// Edit Workstream Modal
function EditWorkstreamModal({ ws, onSave, onClose }) {
  const [form, setForm] = useState({ ...ws });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    await JMUXWorkstream.update(ws.id, form);
    onSave();
  };

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", marginTop: 4 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginTop: 12 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Edit Workstream</h3>

        <label style={labelStyle}>Status</label>
        <select value={form.status || ""} onChange={e => set("status", e.target.value)} style={inputStyle}>
          {["Not Started","In Progress","On Track","At Risk","Overdue","Complete"].map(s => <option key={s}>{s}</option>)}
        </select>

        <label style={labelStyle}>% Complete</label>
        <input type="number" min={0} max={100} value={form.percent_complete || 0} onChange={e => set("percent_complete", Number(e.target.value))} style={inputStyle} />

        <label style={labelStyle}>Owner</label>
        <input type="text" value={form.owner || ""} onChange={e => set("owner", e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Notes</label>
        <textarea rows={3} value={form.notes || ""} onChange={e => set("notes", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={handleSave} style={{ flex: 1, padding: "10px 0", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Save</button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function JMUXDashboard() {
  const [milestones, setMilestones] = useState([]);
  const [workstreams, setWorkstreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [editingWS, setEditingWS] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [phaseFilter, setPhaseFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    const [ms, ws] = await Promise.all([
      JMUXMilestone.list("-created_date"),
      JMUXWorkstream.list(),
    ]);
    setMilestones(ms);
    setWorkstreams(ws);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Derived stats
  const latestSPI = milestones.filter(m => m.cumulative_spi).sort((a,b) => new Date(b.planned_date) - new Date(a.planned_date))[0]?.cumulative_spi || 0.77;
  const completeCount = milestones.filter(m => m.status === "Complete").length;
  const overdueCount = milestones.filter(m => m.status === "Overdue").length;
  const inProgressCount = milestones.filter(m => m.status === "In Progress").length;
  const totalCount = milestones.length;

  const filteredMilestones = phaseFilter === "All" ? milestones : milestones.filter(m => m.phase === phaseFilter);

  // Timeline sort
  const timelineMilestones = [...milestones].sort((a,b) => new Date(a.planned_date) - new Date(b.planned_date));

  const today = new Date();
  const formatDate = (d) => {
    if (!d) return "TBD";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isUpcoming = (d) => d && new Date(d) > today;
  const isPast = (d) => d && new Date(d) < today;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#1e3a5f" }}>Loading JMUX Dashboard...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5f8f 100%)", color: "#fff", padding: "24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, textTransform: "uppercase", marginBottom: 4 }}>PSEG Long Island | PRJ13797</div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>JMUX Replacement Program</h1>
              <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>Private Field Area Network Modernization · PM: Dhananjaya Gunaratne</div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Overall Status</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>🟡 YELLOW</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Recovery Plan Active</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800 }}>{latestSPI.toFixed(2)}</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Overall SPI</div>
              </div>
            </div>
          </div>

          {/* Program Progression */}
          <div style={{ marginTop: 24, display: "flex", gap: 2, alignItems: "stretch" }}>
            {[
              { num: "01", label: "Phase 1 NMS Buildout", sub: "In Progress", active: true },
              { num: "02", label: "RTU Migration", sub: "Upcoming", active: false },
              { num: "03", label: "Phase 2 Construction", sub: "On Track — Aug 2026", active: false },
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, background: step.active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", borderRadius: i === 0 ? "10px 0 0 10px" : i === 2 ? "0 10px 10px 0" : 0, padding: "12px 16px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{step.num}</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{step.label}</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{step.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0 }}>
          {[["overview","📊 Overview"], ["milestones","🎯 Milestones"], ["workstreams","⚙️ Workstreams"], ["timeline","📅 Timeline"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ padding: "14px 24px", border: "none", background: "none", cursor: "pointer", fontSize: 14, fontWeight: activeTab === id ? 700 : 500, color: activeTab === id ? "#1e3a5f" : "#64748b", borderBottom: activeTab === id ? "3px solid #1e3a5f" : "3px solid transparent", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Milestones Complete", value: `${completeCount}/${totalCount}`, sub: "Closed out", color: "#22c55e", icon: "✅" },
                { label: "In Progress", value: inProgressCount, sub: "Active items", color: "#3b82f6", icon: "🔄" },
                { label: "Overdue", value: overdueCount, sub: "Need attention", color: "#ef4444", icon: "⚠️" },
                { label: "Phase 2 Site Surveys", value: "36/36", sub: "100% Complete", color: "#8b5cf6", icon: "🗂️" },
                { label: "Phase 2 IFCs Issued", value: "9/36", sub: "25% Complete", color: "#f59e0b", icon: "📋" },
                { label: "Phase 1 Nodes in NMS", value: "13/31", sub: "42% Complete", color: "#06b6d4", icon: "🖥️" },
              ].map((kpi, i) => (
                <Card key={i} style={{ padding: 20 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{kpi.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{kpi.sub}</div>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* SPI Card */}
              <Card>
                <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>📈 Schedule Performance Index (SPI)</h3>
                <SPIGauge spi={latestSPI} />
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[{ label: "January 2026", spi: 1.00, color: "#94a3b8" }, { label: "February 2026", spi: 0.75, color: "#f59e0b" }, { label: "March 2026", spi: 0.80, color: "#f59e0b" }, { label: "April 2026", spi: 0.77, color: "#f59e0b" }].map((row, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 100, fontSize: 12, color: "#64748b" }}>{row.label}</div>
                      <div style={{ flex: 1 }}><ProgressBar pct={(row.spi / 2) * 100} color={row.color} height={8} /></div>
                      <div style={{ width: 36, fontSize: 13, fontWeight: 700, color: row.color, textAlign: "right" }}>{row.spi.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Urgent Items */}
              <Card>
                <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>🚨 Urgent / Action Required</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {milestones.filter(m => m.status === "Overdue" || m.status === "At Risk").map((m, i) => (
                    <div key={i} style={{ padding: 12, borderRadius: 10, background: m.status === "Overdue" ? "#fee2e2" : "#fef3c7", borderLeft: `4px solid ${m.status === "Overdue" ? "#ef4444" : "#f59e0b"}` }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{m.milestone_name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Due: {formatDate(m.planned_date)} · Owner: {m.owner}</div>
                      {m.notes && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{m.notes}</div>}
                    </div>
                  ))}
                  {milestones.filter(m => m.status === "Overdue" || m.status === "At Risk").length === 0 && (
                    <div style={{ color: "#22c55e", fontWeight: 600 }}>✅ No urgent items</div>
                  )}
                </div>
              </Card>
            </div>

            {/* Workstream overview */}
            <Card style={{ marginTop: 24 }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>⚙️ Workstream Progress</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {workstreams.map((ws, i) => {
                  const cfg = STATUS_CONFIG[ws.status] || STATUS_CONFIG["Not Started"];
                  const phaseColor = PHASE_COLORS[ws.phase] || "#64748b";
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ background: phaseColor + "20", color: phaseColor, borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{ws.phase}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{ws.name}</span>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>· {ws.owner}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Badge status={ws.status} />
                          <span style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{ws.percent_complete}%</span>
                          <button onClick={() => setEditingWS(ws)} style={{ padding: "3px 10px", fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", color: "#475569" }}>Edit</button>
                        </div>
                      </div>
                      <ProgressBar pct={ws.percent_complete} color={cfg.color} height={10} />
                      {ws.notes && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{ws.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* MILESTONES TAB */}
        {activeTab === "milestones" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              {["All", "Phase 1", "Phase 2", "Phase 3"].map(p => (
                <button key={p} onClick={() => setPhaseFilter(p)} style={{ padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: phaseFilter === p ? "#1e3a5f" : "#fff", color: phaseFilter === p ? "#fff" : "#475569", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  {p}
                </button>
              ))}
            </div>

            <Card style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Phase", "Milestone", "Planned Date", "% Done", "Weekly SPI", "Cum. SPI", "Owner", "Status", ""].map((h, i) => (
                      <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMilestones.sort((a,b) => new Date(a.planned_date) - new Date(b.planned_date)).map((m, i) => {
                    const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG["Not Started"];
                    const phaseColor = PHASE_COLORS[m.phase] || "#64748b";
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: phaseColor + "20", color: phaseColor, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{m.phase}</span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{m.milestone_name}</div>
                          {m.notes && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, maxWidth: 280 }}>{m.notes.substring(0, 80)}{m.notes.length > 80 ? "..." : ""}</div>}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#475569", whiteSpace: "nowrap" }}>{formatDate(m.planned_date)}</td>
                        <td style={{ padding: "12px 16px", minWidth: 100 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1 }}><ProgressBar pct={m.percent_complete} color={cfg.color} height={6} /></div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, width: 32 }}>{m.percent_complete || 0}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: m.weekly_spi >= 1 ? "#22c55e" : m.weekly_spi >= 0.7 ? "#f59e0b" : "#ef4444" }}>
                          {m.weekly_spi != null ? m.weekly_spi.toFixed(2) : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: m.cumulative_spi >= 0.9 ? "#22c55e" : m.cumulative_spi >= 0.7 ? "#f59e0b" : m.cumulative_spi ? "#ef4444" : "#94a3b8" }}>
                          {m.cumulative_spi != null ? m.cumulative_spi.toFixed(2) : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{m.owner || "—"}</td>
                        <td style={{ padding: "12px 16px" }}><Badge status={m.status} /></td>
                        <td style={{ padding: "12px 16px" }}>
                          <button onClick={() => setEditingMilestone(m)} style={{ padding: "5px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", color: "#1e3a5f", fontWeight: 600 }}>Edit</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* WORKSTREAMS TAB */}
        {activeTab === "workstreams" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
            {workstreams.map((ws, i) => {
              const cfg = STATUS_CONFIG[ws.status] || STATUS_CONFIG["Not Started"];
              const phaseColor = PHASE_COLORS[ws.phase] || "#64748b";
              return (
                <Card key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <span style={{ background: phaseColor + "20", color: phaseColor, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{ws.phase}</span>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginTop: 6 }}>{ws.name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>Owner: {ws.owner}</div>
                    </div>
                    <Badge status={ws.status} />
                  </div>
                  <div style={{ margin: "16px 0 8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>Progress</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: cfg.color }}>{ws.percent_complete}%</span>
                    </div>
                    <ProgressBar pct={ws.percent_complete} color={cfg.color} height={12} />
                  </div>
                  {ws.notes && <div style={{ fontSize: 12, color: "#64748b", marginTop: 10, padding: 10, background: "#f8fafc", borderRadius: 8 }}>{ws.notes}</div>}
                  <button onClick={() => setEditingWS(ws)} style={{ marginTop: 14, width: "100%", padding: "8px 0", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Update Progress
                  </button>
                </Card>
              );
            })}
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <Card>
            <h3 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>📅 Program Timeline</h3>
            <div style={{ position: "relative" }}>
              {/* Timeline line */}
              <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "#e2e8f0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {timelineMilestones.map((m, i) => {
                  const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG["Not Started"];
                  const phaseColor = PHASE_COLORS[m.phase] || "#64748b";
                  const isToday = m.planned_date && Math.abs(new Date(m.planned_date) - today) < 7 * 24 * 3600 * 1000;
                  return (
                    <div key={i} style={{ display: "flex", gap: 20, paddingLeft: 8, paddingBottom: 24, position: "relative" }}>
                      {/* Dot */}
                      <div style={{ width: 24, height: 24, borderRadius: "50%", background: cfg.color, border: `3px solid ${cfg.ring}`, flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                        {m.status === "Complete" ? "✓" : ""}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, background: isToday ? "#fef3c7" : "#f8fafc", borderRadius: 10, padding: 14, border: isToday ? "2px solid #f59e0b" : "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                          <div>
                            <span style={{ background: phaseColor + "20", color: phaseColor, borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginRight: 8 }}>{m.phase}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{m.milestone_name}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Badge status={m.status} />
                            <button onClick={() => setEditingMilestone(m)} style={{ padding: "3px 10px", fontSize: 11, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", color: "#475569" }}>Edit</button>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 20, marginTop: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>📅 {formatDate(m.planned_date)}</span>
                          {m.actual_date && <span style={{ fontSize: 12, color: "#22c55e" }}>✅ Actual: {formatDate(m.actual_date)}</span>}
                          <span style={{ fontSize: 12, color: "#64748b" }}>👤 {m.owner || "—"}</span>
                          {m.weekly_spi != null && <span style={{ fontSize: 12, fontWeight: 700, color: m.weekly_spi >= 1 ? "#22c55e" : "#f59e0b" }}>SPI: {m.weekly_spi.toFixed(2)}</span>}
                        </div>
                        {m.notes && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{m.notes}</div>}
                        {m.percent_complete > 0 && m.percent_complete < 100 && (
                          <div style={{ marginTop: 8 }}>
                            <ProgressBar pct={m.percent_complete} color={cfg.color} height={6} />
                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{m.percent_complete}% complete</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      {editingMilestone && (
        <EditMilestoneModal
          milestone={editingMilestone}
          onSave={() => { setEditingMilestone(null); load(); }}
          onClose={() => setEditingMilestone(null)}
        />
      )}
      {editingWS && (
        <EditWorkstreamModal
          ws={editingWS}
          onSave={() => { setEditingWS(null); load(); }}
          onClose={() => setEditingWS(null)}
        />
      )}
    </div>
  );
}
