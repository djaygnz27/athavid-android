import { useState, useEffect } from "react";
import { JMUXMilestone, JMUXWorkstream, JMUXMeetingMinute, JMUXEngPackage, JMUXEquipment, JMUXPARControl, JMUXSOW } from "@/api/entities";

const NAVY = "#0f2744";
const BLUE = "#1d4ed8";
const GOLD = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GRAY = "#64748b";
const PURPLE = "#7c3aed";

const STATUS_CFG = {
  "Complete":          { color: GREEN,     bg: "#dcfce7", icon: "✅" },
  "In Progress":       { color: BLUE,      bg: "#dbeafe", icon: "🔄" },
  "Not Started":       { color: GRAY,      bg: "#f1f5f9", icon: "⬜" },
  "Overdue":           { color: RED,       bg: "#fee2e2", icon: "⚠️" },
  "At Risk":           { color: "#d97706", bg: "#fef3c7", icon: "🟡" },
  "On Track":          { color: GREEN,     bg: "#dcfce7", icon: "✅" },
  "Approved":          { color: GREEN,     bg: "#dcfce7", icon: "✅" },
  "Submitted":         { color: BLUE,      bg: "#dbeafe", icon: "📤" },
  "In Review":         { color: PURPLE,    bg: "#ede9fe", icon: "🔍" },
  "Issued to Hawkeye": { color: GREEN,     bg: "#dcfce7", icon: "🏗️" },
  "PO Placed":         { color: BLUE,      bg: "#dbeafe", icon: "📋" },
  "Received":          { color: GREEN,     bg: "#dcfce7", icon: "📦" },
  "Not Ordered":       { color: RED,       bg: "#fee2e2", icon: "🚨" },
  "Action Items Open": { color: "#d97706", bg: "#fef3c7", icon: "📌" },
  "Staged":            { color: PURPLE,    bg: "#ede9fe", icon: "🏭" },
  "Draft":             { color: GRAY,      bg: "#f1f5f9", icon: "📝" },
  "Final":             { color: GREEN,     bg: "#dcfce7", icon: "✅" },
  "Closed":            { color: GRAY,      bg: "#f1f5f9", icon: "🔒" },
  "PO Pending":        { color: GOLD,      bg: "#fef3c7", icon: "⏳" },
  "Shipped":           { color: BLUE,      bg: "#dbeafe", icon: "🚚" },
  "Installed":         { color: GREEN,     bg: "#dcfce7", icon: "🔧" },
  "Under Review":      { color: PURPLE,    bg: "#ede9fe", icon: "🔍" },
  "Executed":          { color: GREEN,     bg: "#dcfce7", icon: "✅" },
  "Active":            { color: GREEN,     bg: "#dcfce7", icon: "✅" },
  "On Hold":           { color: GRAY,      bg: "#f1f5f9", icon: "⏸️" },
  "Scheduled":         { color: BLUE,      bg: "#dbeafe", icon: "📅" },
};

const TABS = [
  { id: "overview",    label: "📊 Overview" },
  { id: "milestones",  label: "🎯 Milestones" },
  { id: "engineering", label: "📋 IFR / IFC" },
  { id: "equipment",   label: "📦 Equipment" },
  { id: "par",         label: "⚡ PAR Control" },
  { id: "minutes",     label: "📝 Meeting Minutes" },
  { id: "sow",         label: "📄 SOW / Contracts" },
];

function badge(status, small) {
  const cfg = STATUS_CFG[status] || { color: GRAY, bg: "#f1f5f9", icon: "⬜" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33`, borderRadius: 20, padding: small ? "1px 8px" : "3px 10px", fontSize: small ? 11 : 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {cfg.icon} {status || "—"}
    </span>
  );
}

function Bar({ pct, color, h }) {
  return (
    <div style={{ height: h || 8, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(pct || 0, 100)}%`, height: "100%", background: color || BLUE, borderRadius: 99 }} />
    </div>
  );
}

function Card({ children, style }) {
  return <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", padding: 20, ...(style || {}) }}>{children}</div>;
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid #e2e8f0" }}>{children}</div>;
}

function fmt(d) {
  if (!d) return "TBD";
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
}

const INP = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: NAVY }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: GRAY, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function F({ label, children }) {
  return <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 700, color: GRAY, display: "block", marginBottom: 4 }}>{label}</label>{children}</div>;
}

function Btns({ onSave, onClose }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
      <button onClick={onSave} style={{ flex: 1, padding: "10px 0", background: NAVY, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Save</button>
      <button onClick={onClose} style={{ flex: 1, padding: "10px 0", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
    </div>
  );
}

function Pill({ label, active, onClick }) {
  return <button onClick={onClick} style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: active ? NAVY : "#fff", color: active ? "#fff" : GRAY, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>{label}</button>;
}

// ── MODALS ────────────────────────────────────────────────────────────────────

function MilestoneEditModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Edit Milestone" onClose={onClose}>
      <F label="Status">
        <select style={{ ...INP, background: "#fff" }} value={f.status || ""} onChange={e => set("status", e.target.value)}>
          {["Not Started", "In Progress", "Complete", "Overdue", "At Risk"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="% Complete"><input style={INP} type="number" min={0} max={100} value={f.percent_complete || 0} onChange={e => set("percent_complete", +e.target.value)} /></F>
      <F label="Weekly SPI"><input style={INP} type="number" step={0.01} value={f.weekly_spi || ""} onChange={e => set("weekly_spi", +e.target.value)} /></F>
      <F label="Cumulative SPI"><input style={INP} type="number" step={0.01} value={f.cumulative_spi || ""} onChange={e => set("cumulative_spi", +e.target.value)} /></F>
      <F label="Actual Date"><input style={INP} type="date" value={f.actual_date || ""} onChange={e => set("actual_date", e.target.value)} /></F>
      <F label="Owner"><input style={INP} type="text" value={f.owner || ""} onChange={e => set("owner", e.target.value)} /></F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={() => JMUXMilestone.update(f.id, f).then(onSave)} onClose={onClose} />
    </Modal>
  );
}

function WorkstreamEditModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Edit Workstream" onClose={onClose}>
      <F label="Status">
        <select style={{ ...INP, background: "#fff" }} value={f.status || ""} onChange={e => set("status", e.target.value)}>
          {["Not Started", "In Progress", "On Track", "At Risk", "Overdue", "Complete"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="% Complete"><input style={INP} type="number" min={0} max={100} value={f.percent_complete || 0} onChange={e => set("percent_complete", +e.target.value)} /></F>
      <F label="Owner"><input style={INP} type="text" value={f.owner || ""} onChange={e => set("owner", e.target.value)} /></F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={() => JMUXWorkstream.update(f.id, f).then(onSave)} onClose={onClose} />
    </Modal>
  );
}

function EngEditModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={`Edit — ${item.site_name}`} onClose={onClose}>
      <F label="IFR Status">
        <select style={{ ...INP, background: "#fff" }} value={f.ifr_status || ""} onChange={e => set("ifr_status", e.target.value)}>
          {["Not Started", "In Review", "Submitted", "Approved"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="IFR Actual Date"><input style={INP} type="date" value={f.ifr_actual || ""} onChange={e => set("ifr_actual", e.target.value)} /></F>
      <F label="IFC Status">
        <select style={{ ...INP, background: "#fff" }} value={f.ifc_status || ""} onChange={e => set("ifc_status", e.target.value)}>
          {["Not Started", "In Review", "Submitted", "Issued to Hawkeye", "Approved"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="IFC Actual Date"><input style={INP} type="date" value={f.ifc_actual || ""} onChange={e => set("ifc_actual", e.target.value)} /></F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={2} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={() => JMUXEngPackage.update(f.id, f).then(onSave)} onClose={onClose} />
    </Modal>
  );
}

function EquipEditModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={`Edit — ${item.item_name}`} onClose={onClose}>
      <F label="PO Status">
        <select style={{ ...INP, background: "#fff" }} value={f.po_status || ""} onChange={e => set("po_status", e.target.value)}>
          {["Not Ordered", "PO Pending", "PO Placed", "Shipped", "Received", "Staged", "Installed"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="PO Number"><input style={INP} type="text" value={f.po_number || ""} onChange={e => set("po_number", e.target.value)} /></F>
      <F label="Order Date"><input style={INP} type="date" value={f.order_date || ""} onChange={e => set("order_date", e.target.value)} /></F>
      <F label="Expected Delivery"><input style={INP} type="date" value={f.expected_delivery || ""} onChange={e => set("expected_delivery", e.target.value)} /></F>
      <F label="Qty Ordered"><input style={INP} type="number" value={f.quantity_ordered || 0} onChange={e => set("quantity_ordered", +e.target.value)} /></F>
      <F label="Qty Received"><input style={INP} type="number" value={f.quantity_received || 0} onChange={e => set("quantity_received", +e.target.value)} /></F>
      <F label="Qty Staged"><input style={INP} type="number" value={f.quantity_staged || 0} onChange={e => set("quantity_staged", +e.target.value)} /></F>
      <F label="Qty Installed"><input style={INP} type="number" value={f.quantity_installed || 0} onChange={e => set("quantity_installed", +e.target.value)} /></F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={2} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={() => JMUXEquipment.update(f.id, f).then(onSave)} onClose={onClose} />
    </Modal>
  );
}

function PAREditModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={`PAR — ${item.site_name}`} onClose={onClose}>
      <F label="Design Status">
        <select style={{ ...INP, background: "#fff" }} value={f.design_status || ""} onChange={e => set("design_status", e.target.value)}>
          {["Not Started", "In Progress", "Complete", "Approved"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="RC-30 Ordered?">
        <select style={{ ...INP, background: "#fff" }} value={f.rc30_ordered ? "yes" : "no"} onChange={e => set("rc30_ordered", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </F>
      <F label="RC-30 Order Date"><input style={INP} type="date" value={f.rc30_order_date || ""} onChange={e => set("rc30_order_date", e.target.value)} /></F>
      <F label="RC-30 Expected Delivery"><input style={INP} type="date" value={f.rc30_expected_delivery || ""} onChange={e => set("rc30_expected_delivery", e.target.value)} /></F>
      <F label="RC-30 Received?">
        <select style={{ ...INP, background: "#fff" }} value={f.rc30_received ? "yes" : "no"} onChange={e => set("rc30_received", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </F>
      <F label="C37.94 Card Needed?">
        <select style={{ ...INP, background: "#fff" }} value={f.c3794_card_needed ? "yes" : "no"} onChange={e => set("c3794_card_needed", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </F>
      <F label="C37.94 Card Ordered?">
        <select style={{ ...INP, background: "#fff" }} value={f.c3794_ordered ? "yes" : "no"} onChange={e => set("c3794_ordered", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </F>
      <F label="Installation Status">
        <select style={{ ...INP, background: "#fff" }} value={f.installation_status || ""} onChange={e => set("installation_status", e.target.value)}>
          {["Not Started", "Scheduled", "In Progress", "Complete"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={() => JMUXPARControl.update(f.id, f).then(onSave)} onClose={onClose} />
    </Modal>
  );
}

function MinuteEditModal({ item, isNew, onSave, onClose }) {
  const [f, setF] = useState({ status: "Action Items Open", ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = () => {
    const p = isNew ? JMUXMeetingMinute.create(f) : JMUXMeetingMinute.update(f.id, f);
    p.then(onSave);
  };
  return (
    <Modal title={isNew ? "Add Meeting Minutes" : "Edit Minutes"} onClose={onClose}>
      <F label="Meeting Date"><input style={INP} type="date" value={f.meeting_date || ""} onChange={e => set("meeting_date", e.target.value)} /></F>
      <F label="Title"><input style={INP} type="text" value={f.title || ""} onChange={e => set("title", e.target.value)} /></F>
      <F label="Attendees"><input style={INP} type="text" value={f.attendees || ""} onChange={e => set("attendees", e.target.value)} /></F>
      <F label="Key Decisions"><textarea style={{ ...INP, resize: "vertical" }} rows={3} value={f.key_decisions || ""} onChange={e => set("key_decisions", e.target.value)} /></F>
      <F label="Action Items"><textarea style={{ ...INP, resize: "vertical" }} rows={4} value={f.action_items || ""} onChange={e => set("action_items", e.target.value)} /></F>
      <F label="Owner"><input style={INP} type="text" value={f.owner || ""} onChange={e => set("owner", e.target.value)} /></F>
      <F label="Due Date"><input style={INP} type="date" value={f.due_date || ""} onChange={e => set("due_date", e.target.value)} /></F>
      <F label="Status">
        <select style={{ ...INP, background: "#fff" }} value={f.status || ""} onChange={e => set("status", e.target.value)}>
          {["Draft", "Final", "Action Items Open", "Closed"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={save} onClose={onClose} />
    </Modal>
  );
}

function SOWEditModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={`SOW — ${item.vendor}`} onClose={onClose}>
      <F label="Status">
        <select style={{ ...INP, background: "#fff" }} value={f.status || ""} onChange={e => set("status", e.target.value)}>
          {["Draft", "Under Review", "Executed", "Active", "Complete", "On Hold"].map(x => <option key={x}>{x}</option>)}
        </select>
      </F>
      <F label="Open Items"><textarea style={{ ...INP, resize: "vertical" }} rows={4} value={f.open_items || ""} onChange={e => set("open_items", e.target.value)} /></F>
      <F label="Notes"><textarea style={{ ...INP, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => set("notes", e.target.value)} /></F>
      <Btns onSave={() => JMUXSOW.update(f.id, f).then(onSave)} onClose={onClose} />
    </Modal>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function JMUXDashboard() {
  const [tab, setTab] = useState("overview");
  const [milestones, setMilestones] = useState([]);
  const [workstreams, setWorkstreams] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [par, setPar] = useState([]);
  const [sows, setSows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type, item }
  const [addMinute, setAddMinute] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [phaseFilter, setPhaseFilter] = useState("All");

  const load = async () => {
    setLoading(true);
    try {
      const [ms, ws, mn, pk, eq, pr, sw] = await Promise.all([
        JMUXMilestone.list(),
        JMUXWorkstream.list(),
        JMUXMeetingMinute.list(),
        JMUXEngPackage.list(),
        JMUXEquipment.list(),
        JMUXPARControl.list(),
        JMUXSOW.list(),
      ]);
      setMilestones(Array.isArray(ms) ? ms : []);
      setWorkstreams(Array.isArray(ws) ? ws : []);
      setMinutes((Array.isArray(mn) ? mn : []).sort((a, b) => (b.meeting_date || "") > (a.meeting_date || "") ? 1 : -1));
      setPackages((Array.isArray(pk) ? pk : []).sort((a, b) => String(a.site_number || "").localeCompare(String(b.site_number || ""), undefined, { numeric: true })));
      setEquipment(Array.isArray(eq) ? eq : []);
      setPar(Array.isArray(pr) ? pr : []);
      setSows(Array.isArray(sw) ? sw : []);
    } catch (e) {
      console.error("Load error:", e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const close = () => setModal(null);
  const saved = () => { close(); setAddMinute(false); load(); };

  // derived
  const p1 = packages.filter(p => p.phase === "Phase 1");
  const p2 = packages.filter(p => p.phase === "Phase 2");
  const p1Ifc = p1.filter(p => p.ifc_status === "Issued to Hawkeye" || p.ifc_status === "Approved").length;
  const p2Ifc = p2.filter(p => p.ifc_status === "Issued to Hawkeye" || p.ifc_status === "Approved").length;
  const ifrDone = packages.filter(p => p.ifr_status === "Approved" || p.ifr_status === "Submitted").length;
  const doneMs = milestones.filter(m => m.status === "Complete").length;
  const overdueMs = milestones.filter(m => m.status === "Overdue").length;
  const critEquip = equipment.filter(e => e.po_status === "Not Ordered");
  const filtPkgs = phaseFilter === "All" ? packages : packages.filter(p => p.phase === phaseFilter);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>⚡</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginTop: 12 }}>Loading JMUX Dashboard...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a6b 100%)`, color: "#fff", padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.6, textTransform: "uppercase" }}>PSEG Long Island · PRJ13797 · CONFIDENTIAL</div>
              <h1 style={{ margin: "4px 0 2px", fontSize: 24, fontWeight: 800 }}>JMUX Replacement Program</h1>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Phase 1: 31 Sites · Phase 2: 36 Sites · PM: Dhananjaya Gunaratne</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>0.77</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>SPI · 🟡 YELLOW</div>
              </div>
              <div style={{ background: "rgba(245,158,11,0.2)", borderRadius: 12, padding: "10px 18px", textAlign: "center", border: "1px solid rgba(245,158,11,0.4)" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{doneMs}/{milestones.length}</div>
                <div style={{ fontSize: 10, color: GOLD }}>Milestones Done</div>
              </div>
              {overdueMs > 0 && (
                <div style={{ background: "rgba(220,38,38,0.2)", borderRadius: 12, padding: "10px 18px", textAlign: "center", border: "1px solid rgba(220,38,38,0.4)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fca5a5" }}>{overdueMs}</div>
                  <div style={{ fontSize: 10, color: "#fca5a5" }}>Overdue</div>
                </div>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "11px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#fff" : "rgba(255,255,255,0.55)", borderBottom: tab === t.id ? "3px solid #fff" : "3px solid transparent", whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 16px" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { icon: "✅", val: `${doneMs}/${milestones.length}`, label: "Milestones Complete", color: GREEN },
                { icon: "⚠️", val: overdueMs, label: "Overdue Items", color: RED },
                { icon: "🏗️", val: `${p1Ifc}/31`, label: "Phase 1 IFCs Issued", color: BLUE },
                { icon: "🏗️", val: `${p2Ifc}/36`, label: "Phase 2 IFCs Issued", color: PURPLE },
                { icon: "🖥️", val: "13/31", label: "Nodes in NSP", color: "#0891b2" },
                { icon: "🚨", val: critEquip.length, label: "Equipment Not Ordered", color: RED },
              ].map((k, i) => (
                <Card key={i} style={{ padding: 16 }}>
                  <div style={{ fontSize: 24 }}>{k.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: k.color, lineHeight: 1.1, marginTop: 6 }}>{k.val}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{k.label}</div>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <SectionTitle>📈 SPI History</SectionTitle>
                {[["January 2026", 1.00], ["February 2026", 0.75], ["March 2026", 0.80], ["April 2026", 0.77]].map(([l, v], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 110, fontSize: 12, color: GRAY }}>{l}</div>
                    <div style={{ flex: 1 }}><Bar pct={v * 70} color={v === 1 ? "#94a3b8" : GOLD} h={10} /></div>
                    <div style={{ width: 36, fontSize: 13, fontWeight: 700, color: v === 1 ? "#94a3b8" : GOLD }}>{v.toFixed(2)}</div>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: 12, background: "#f8fafc", borderRadius: 10, fontSize: 13, color: GRAY }}>
                  <strong>Phase 1 delay:</strong> Nokia license received 4/13; DNS resolved by Vic.<br />
                  <strong>Phase 2:</strong> On track — parallel progress offsets Phase 1 slip.
                </div>
              </Card>

              <Card>
                <SectionTitle>🚨 Action Required</SectionTitle>
                {milestones.filter(m => m.status === "Overdue" || m.status === "At Risk").map((m, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 10, background: m.status === "Overdue" ? "#fee2e2" : "#fef3c7", borderLeft: `4px solid ${m.status === "Overdue" ? RED : GOLD}`, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{m.milestone_name}</div>
                    <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Due: {fmt(m.planned_date)} · {m.owner}</div>
                  </div>
                ))}
                {critEquip.map((e, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 10, background: "#fee2e2", borderLeft: `4px solid ${RED}`, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>🚨 {e.item_name}</div>
                    <div style={{ fontSize: 12, color: GRAY }}>PO Not Placed · Lead: {e.lead_time_weeks} weeks</div>
                  </div>
                ))}
              </Card>
            </div>

            <Card>
              <SectionTitle>⚙️ Workstream Progress</SectionTitle>
              {workstreams.map((w, i) => {
                const cfg = STATUS_CFG[w.status] || STATUS_CFG["Not Started"];
                return (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#dbeafe", borderRadius: 4, padding: "1px 7px" }}>{w.phase}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{w.name}</span>
                        <span style={{ fontSize: 12, color: GRAY }}>· {w.owner}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {badge(w.status, true)}
                        <span style={{ fontWeight: 700, color: cfg.color }}>{w.percent_complete}%</span>
                        <button onClick={() => setModal({ type: "ws", item: w })} style={{ padding: "3px 10px", fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                      </div>
                    </div>
                    <Bar pct={w.percent_complete} color={cfg.color} h={10} />
                    {w.notes && <div style={{ fontSize: 11, color: GRAY, marginTop: 4 }}>{w.notes}</div>}
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* MILESTONES */}
        {tab === "milestones" && (
          <Card style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Phase", "Milestone", "Planned", "% Done", "Wk SPI", "Cum SPI", "Owner", "Status", ""].map((h, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...milestones].sort((a, b) => new Date(a.planned_date) - new Date(b.planned_date)).map((m, i) => {
                  const cfg = STATUS_CFG[m.status] || STATUS_CFG["Not Started"];
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#dbeafe", borderRadius: 4, padding: "1px 7px" }}>{m.phase}</span></td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{m.milestone_name}</div>
                        {m.notes && <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{m.notes.slice(0, 70)}{m.notes.length > 70 ? "…" : ""}</div>}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(m.planned_date)}</td>
                      <td style={{ padding: "10px 14px", minWidth: 100 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ flex: 1 }}><Bar pct={m.percent_complete} color={cfg.color} h={6} /></div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{m.percent_complete || 0}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: m.weekly_spi >= 1 ? GREEN : m.weekly_spi >= 0.7 ? GOLD : RED }}>{m.weekly_spi != null ? (+m.weekly_spi).toFixed(2) : "—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: m.cumulative_spi >= 0.9 ? GREEN : m.cumulative_spi >= 0.7 ? GOLD : m.cumulative_spi ? RED : GRAY }}>{m.cumulative_spi != null ? (+m.cumulative_spi).toFixed(2) : "—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: GRAY }}>{m.owner || "—"}</td>
                      <td style={{ padding: "10px 14px" }}>{badge(m.status, true)}</td>
                      <td style={{ padding: "10px 14px" }}><button onClick={() => setModal({ type: "ms", item: m })} style={{ padding: "4px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Edit</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        {/* IFR / IFC */}
        {tab === "engineering" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 18 }}>
              {[
                { label: "Phase 1 — 31 Sites", val: `${p1Ifc} IFCs Issued`, color: BLUE },
                { label: "Phase 2 — 36 Sites", val: `${p2Ifc} IFCs Issued`, color: PURPLE },
                { label: "Total IFRs Done", val: ifrDone, color: GREEN },
                { label: "IFC Not Started", val: packages.filter(p => p.ifc_status === "Not Started" || !p.ifc_status).length, color: GRAY },
              ].map((k, i) => (
                <Card key={i} style={{ padding: 14 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.val}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 3 }}>{k.label}</div>
                </Card>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: GRAY }}>Phase:</span>
              {["All", "Phase 1", "Phase 2"].map(f => <Pill key={f} label={f} active={phaseFilter === f} onClick={() => setPhaseFilter(f)} />)}
            </div>
            <Card style={{ padding: 0, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["#", "Phase", "Site", "IFR Planned", "IFR Actual", "IFR Status", "IFC Planned", "IFC Actual", "IFC Status", "Construction", ""].map((h, i) => (
                      <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtPkgs.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, fontWeight: 600 }}>{p.site_number}</td>
                      <td style={{ padding: "9px 12px" }}><span style={{ fontSize: 10, fontWeight: 700, color: p.phase === "Phase 1" ? BLUE : PURPLE, background: p.phase === "Phase 1" ? "#dbeafe" : "#ede9fe", borderRadius: 4, padding: "1px 6px" }}>{p.phase}</span></td>
                      <td style={{ padding: "9px 12px" }}><div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{p.site_name}</div>{p.notes && <div style={{ fontSize: 11, color: RED }}>{p.notes}</div>}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(p.ifr_planned)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: p.ifr_actual ? GREEN : GRAY, whiteSpace: "nowrap" }}>{p.ifr_actual ? fmt(p.ifr_actual) : "—"}</td>
                      <td style={{ padding: "9px 12px" }}>{badge(p.ifr_status, true)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(p.ifc_planned)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: p.ifc_actual ? GREEN : GRAY, whiteSpace: "nowrap" }}>{p.ifc_actual ? fmt(p.ifc_actual) : "—"}</td>
                      <td style={{ padding: "9px 12px" }}>{badge(p.ifc_status, true)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(p.construction_planned)}</td>
                      <td style={{ padding: "9px 12px" }}><button onClick={() => setModal({ type: "eng", item: p })} style={{ padding: "3px 10px", fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* EQUIPMENT */}
        {tab === "equipment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {equipment.map((e, i) => {
              const recvPct = e.quantity_ordered > 0 ? (e.quantity_received / e.quantity_ordered) * 100 : 0;
              const instPct = e.quantity_ordered > 0 ? (e.quantity_installed / e.quantity_ordered) * 100 : 0;
              return (
                <Card key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {e.phase && <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#dbeafe", borderRadius: 4, padding: "1px 7px" }}>{e.phase}</span>}
                        {e.category && <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE, background: "#ede9fe", borderRadius: 4, padding: "1px 7px" }}>{e.category}</span>}
                        <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{e.item_name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>
                        {e.vendor && `Vendor: ${e.vendor}`}{e.po_number ? ` · PO: ${e.po_number}` : ""}{e.lead_time_weeks ? ` · Lead: ${e.lead_time_weeks} wks` : ""}
                      </div>
                      {e.notes && <div style={{ fontSize: 12, color: e.po_status === "Not Ordered" ? RED : GRAY, marginTop: 4 }}>{e.notes}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {badge(e.po_status)}
                      <button onClick={() => setModal({ type: "equip", item: e })} style={{ padding: "5px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Update</button>
                    </div>
                  </div>
                  {e.quantity_ordered > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY, marginBottom: 4 }}><span>Received</span><span style={{ fontWeight: 700 }}>{e.quantity_received || 0}/{e.quantity_ordered}</span></div>
                        <Bar pct={recvPct} color={GREEN} h={8} />
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY, marginBottom: 4 }}><span>Installed</span><span style={{ fontWeight: 700 }}>{e.quantity_installed || 0}/{e.quantity_ordered}</span></div>
                        <Bar pct={instPct} color={BLUE} h={8} />
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                    {e.order_date && <span style={{ fontSize: 11, color: GRAY }}>📅 Ordered: {fmt(e.order_date)}</span>}
                    {e.expected_delivery && <span style={{ fontSize: 11, color: GRAY }}>🚚 Expected: {fmt(e.expected_delivery)}</span>}
                    {e.site && <span style={{ fontSize: 11, color: GRAY }}>📍 {e.site}</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* PAR CONTROL */}
        {tab === "par" && (
          <div>
            <Card style={{ marginBottom: 16, background: "#fef3c7", border: "1px solid #f59e0b" }}>
              <div style={{ fontWeight: 700, color: "#92400e", fontSize: 14 }}>⚡ PAR Circuit Migration — 6 High-Impact Substations</div>
              <div style={{ fontSize: 13, color: "#78350f", marginTop: 4 }}>
                Iniven RC-30 selected — serial-to-IP, NOT a NERC CIP programmable device. 8-week lead time. PO not yet placed — CRITICAL PATH. Unbudgeted $500K variance — Change Request in progress.
              </div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16 }}>
              {par.map((p, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>⚡ {p.site_name}</div>
                    <button onClick={() => setModal({ type: "par", item: p })} style={{ padding: "4px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc" }}><div style={{ fontSize: 11, color: GRAY }}>Design Status</div>{badge(p.design_status, true)}</div>
                    <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc" }}><div style={{ fontSize: 11, color: GRAY }}>Installation</div>{badge(p.installation_status, true)}</div>
                    <div style={{ padding: 10, borderRadius: 8, background: p.rc30_ordered ? "#dcfce7" : "#fee2e2" }}>
                      <div style={{ fontSize: 11, color: GRAY }}>Iniven RC-30</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.rc30_ordered ? GREEN : RED }}>{p.rc30_ordered ? "✅ Ordered" : "🚨 Not Ordered"}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: p.rc30_received ? "#dcfce7" : "#f8fafc" }}>
                      <div style={{ fontSize: 11, color: GRAY }}>RC-30 Received</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.rc30_received ? GREEN : GRAY }}>{p.rc30_received ? "✅ Yes" : "⬜ No"}</div>
                    </div>
                    {p.c3794_card_needed && (
                      <div style={{ padding: 10, borderRadius: 8, background: p.c3794_ordered ? "#dcfce7" : "#fee2e2", gridColumn: "span 2" }}>
                        <div style={{ fontSize: 11, color: GRAY }}>C37.94 Card Required</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: p.c3794_ordered ? GREEN : RED }}>{p.c3794_ordered ? "✅ Ordered" : "🚨 Not Ordered — Bundle with Phase 2"}</div>
                      </div>
                    )}
                  </div>
                  {p.notes && <div style={{ fontSize: 12, color: GRAY, marginTop: 10, padding: 8, background: "#f8fafc", borderRadius: 8 }}>{p.notes}</div>}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* MEETING MINUTES */}
        {tab === "minutes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button onClick={() => setAddMinute(true)} style={{ padding: "10px 20px", background: NAVY, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>+ Add Meeting Minutes</button>
            </div>
            {minutes.map((m, i) => (
              <Card key={i} style={{ marginBottom: 14, cursor: "pointer" }}>
                <div onClick={() => setExpanded(expanded === m.id ? null : m.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, color: GRAY }}>{fmt(m.meeting_date)}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 2 }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>👥 {m.attendees}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {badge(m.status)}
                    <button onClick={e => { e.stopPropagation(); setModal({ type: "min", item: m }); }} style={{ padding: "4px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                    <span style={{ fontSize: 18, color: GRAY }}>{expanded === m.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expanded === m.id && (
                  <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 6 }}>📌 Key Decisions</div>
                      <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-line", background: "#f8fafc", padding: 12, borderRadius: 8 }}>{m.key_decisions}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 6 }}>✅ Action Items</div>
                      <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-line", background: "#f8fafc", padding: 12, borderRadius: 8 }}>{m.action_items}</div>
                      {m.due_date && <div style={{ fontSize: 12, color: GOLD, marginTop: 6, fontWeight: 600 }}>⏰ Due: {fmt(m.due_date)} · {m.owner}</div>}
                    </div>
                    {m.notes && <div style={{ gridColumn: "span 2", fontSize: 12, color: GRAY, background: "#f8fafc", padding: 10, borderRadius: 8 }}>{m.notes}</div>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* SOW */}
        {tab === "sow" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sows.map((s, i) => (
              <Card key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{s.vendor}</div>
                    <div style={{ fontSize: 13, color: GRAY, marginTop: 4, maxWidth: 600 }}>{s.scope_summary}</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                      {s.start_date && <span style={{ fontSize: 12, color: GRAY }}>📅 Start: {fmt(s.start_date)}</span>}
                      {s.end_date && <span style={{ fontSize: 12, color: GRAY }}>🏁 End: {fmt(s.end_date)}</span>}
                      {s.contract_value && <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>💰 ${Number(s.contract_value).toLocaleString()}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {badge(s.status)}
                    <button onClick={() => setModal({ type: "sow", item: s })} style={{ padding: "5px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  </div>
                </div>
                {s.open_items && (
                  <div style={{ marginTop: 14, padding: 12, background: "#fef3c7", borderRadius: 10, borderLeft: `3px solid ${GOLD}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>📋 Open Items</div>
                    <div style={{ fontSize: 13, color: "#78350f", whiteSpace: "pre-line" }}>{s.open_items}</div>
                  </div>
                )}
                {s.notes && <div style={{ fontSize: 12, color: GRAY, marginTop: 10 }}>{s.notes}</div>}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {modal?.type === "ms"    && <MilestoneEditModal  item={modal.item} onSave={saved} onClose={close} />}
      {modal?.type === "ws"    && <WorkstreamEditModal item={modal.item} onSave={saved} onClose={close} />}
      {modal?.type === "eng"   && <EngEditModal        item={modal.item} onSave={saved} onClose={close} />}
      {modal?.type === "equip" && <EquipEditModal      item={modal.item} onSave={saved} onClose={close} />}
      {modal?.type === "par"   && <PAREditModal        item={modal.item} onSave={saved} onClose={close} />}
      {modal?.type === "min"   && <MinuteEditModal     item={modal.item} isNew={false} onSave={saved} onClose={close} />}
      {modal?.type === "sow"   && <SOWEditModal        item={modal.item} onSave={saved} onClose={close} />}
      {addMinute && <MinuteEditModal item={{}} isNew={true} onSave={saved} onClose={() => setAddMinute(false)} />}
    </div>
  );
}
