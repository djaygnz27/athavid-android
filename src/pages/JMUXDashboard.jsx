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
  "Complete":          { color: GREEN,  bg: "#dcfce7", icon: "✅" },
  "In Progress":       { color: BLUE,   bg: "#dbeafe", icon: "🔄" },
  "Not Started":       { color: GRAY,   bg: "#f1f5f9", icon: "⬜" },
  "Overdue":           { color: RED,    bg: "#fee2e2", icon: "⚠️" },
  "At Risk":           { color: "#d97706", bg: "#fef3c7", icon: "🟡" },
  "On Track":          { color: GREEN,  bg: "#dcfce7", icon: "✅" },
  "Approved":          { color: GREEN,  bg: "#dcfce7", icon: "✅" },
  "Submitted":         { color: BLUE,   bg: "#dbeafe", icon: "📤" },
  "In Review":         { color: PURPLE, bg: "#ede9fe", icon: "🔍" },
  "Issued to Hawkeye": { color: GREEN,  bg: "#dcfce7", icon: "🏗️" },
  "PO Placed":         { color: BLUE,   bg: "#dbeafe", icon: "📋" },
  "Received":          { color: GREEN,  bg: "#dcfce7", icon: "📦" },
  "Not Ordered":       { color: RED,    bg: "#fee2e2", icon: "🚨" },
  "Active":            { color: GREEN,  bg: "#dcfce7", icon: "✅" },
  "Action Items Open": { color: "#d97706", bg: "#fef3c7", icon: "📌" },
  "Staged":            { color: PURPLE, bg: "#ede9fe", icon: "🏭" },
  "Draft":             { color: GRAY,   bg: "#f1f5f9", icon: "📝" },
  "Final":             { color: GREEN,  bg: "#dcfce7", icon: "✅" },
  "Closed":            { color: GRAY,   bg: "#f1f5f9", icon: "🔒" },
  "PO Pending":        { color: GOLD,   bg: "#fef3c7", icon: "⏳" },
  "Shipped":           { color: BLUE,   bg: "#dbeafe", icon: "🚚" },
  "Installed":         { color: GREEN,  bg: "#dcfce7", icon: "🔧" },
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

function Badge({ status, small }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG["Not Started"];
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}33`,
      borderRadius: 20,
      padding: small ? "1px 8px" : "3px 10px",
      fontSize: small ? 11 : 12,
      fontWeight: 600, whiteSpace: "nowrap"
    }}>
      {cfg.icon} {status}
    </span>
  );
}

function Bar({ pct, color, h }) {
  const c = color || BLUE;
  const height = h || 8;
  return (
    <div style={{ height, borderRadius: height, background: "#e2e8f0", overflow: "hidden" }}>
      <div style={{ width: `${Math.min(pct || 0, 100)}%`, height: "100%", background: c, borderRadius: height, transition: "width .6s" }} />
    </div>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 14,
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
      padding: 20, ...(style || {}),
      cursor: onClick ? "pointer" : "default"
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 14, paddingBottom: 8, borderBottom: "2px solid #e2e8f0" }}>
      {children}
    </div>
  );
}

function fmt(d) {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const inp = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" };
const sel = { ...inp, background: "#fff" };

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: NAVY }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: GRAY }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: GRAY, display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

function SaveCancel({ onSave, onClose }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      <button onClick={onSave} style={{ flex: 1, padding: "10px 0", background: NAVY, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Save</button>
      <button onClick={onClose} style={{ flex: 1, padding: "10px 0", background: "#f1f5f9", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
    </div>
  );
}

// ── EDIT MODALS ──────────────────────────────────────────────────────────

function MilestoneModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => { await JMUXMilestone.update(item.id, f); onSave(); };
  return (
    <Modal title="Edit Milestone" onClose={onClose}>
      <Field label="Status">
        <select style={sel} value={f.status || ""} onChange={e => s("status", e.target.value)}>
          {["Not Started", "In Progress", "Complete", "Overdue", "At Risk"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="% Complete"><input style={inp} type="number" min={0} max={100} value={f.percent_complete || 0} onChange={e => s("percent_complete", +e.target.value)} /></Field>
      <Field label="Weekly SPI"><input style={inp} type="number" step={0.01} value={f.weekly_spi || 0} onChange={e => s("weekly_spi", +e.target.value)} /></Field>
      <Field label="Cumulative SPI"><input style={inp} type="number" step={0.01} value={f.cumulative_spi || ""} onChange={e => s("cumulative_spi", +e.target.value)} /></Field>
      <Field label="Actual Date"><input style={inp} type="date" value={f.actual_date || ""} onChange={e => s("actual_date", e.target.value)} /></Field>
      <Field label="Owner"><input style={inp} type="text" value={f.owner || ""} onChange={e => s("owner", e.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

function WorkstreamModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => { await JMUXWorkstream.update(item.id, f); onSave(); };
  return (
    <Modal title="Edit Workstream" onClose={onClose}>
      <Field label="Status">
        <select style={sel} value={f.status || ""} onChange={e => s("status", e.target.value)}>
          {["Not Started", "In Progress", "On Track", "At Risk", "Overdue", "Complete"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="% Complete"><input style={inp} type="number" min={0} max={100} value={f.percent_complete || 0} onChange={e => s("percent_complete", +e.target.value)} /></Field>
      <Field label="Owner"><input style={inp} type="text" value={f.owner || ""} onChange={e => s("owner", e.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

function EngModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => { await JMUXEngPackage.update(item.id, f); onSave(); };
  return (
    <Modal title={`Edit — ${item.site_name}`} onClose={onClose}>
      <Field label="IFR Status">
        <select style={sel} value={f.ifr_status || ""} onChange={e => s("ifr_status", e.target.value)}>
          {["Not Started", "In Review", "Submitted", "Approved"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="IFR Actual Date"><input style={inp} type="date" value={f.ifr_actual || ""} onChange={e => s("ifr_actual", e.target.value)} /></Field>
      <Field label="IFC Status">
        <select style={sel} value={f.ifc_status || ""} onChange={e => s("ifc_status", e.target.value)}>
          {["Not Started", "In Review", "Submitted", "Issued to Hawkeye", "Approved"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="IFC Actual Date"><input style={inp} type="date" value={f.ifc_actual || ""} onChange={e => s("ifc_actual", e.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={2} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

function EquipModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => { await JMUXEquipment.update(item.id, f); onSave(); };
  return (
    <Modal title={`Edit — ${item.item_name}`} onClose={onClose}>
      <Field label="PO Status">
        <select style={sel} value={f.po_status || ""} onChange={e => s("po_status", e.target.value)}>
          {["Not Ordered", "PO Pending", "PO Placed", "Shipped", "Received", "Staged", "Installed"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="PO Number"><input style={inp} type="text" value={f.po_number || ""} onChange={e => s("po_number", e.target.value)} /></Field>
      <Field label="Order Date"><input style={inp} type="date" value={f.order_date || ""} onChange={e => s("order_date", e.target.value)} /></Field>
      <Field label="Expected Delivery"><input style={inp} type="date" value={f.expected_delivery || ""} onChange={e => s("expected_delivery", e.target.value)} /></Field>
      <Field label="Qty Ordered"><input style={inp} type="number" value={f.quantity_ordered || 0} onChange={e => s("quantity_ordered", +e.target.value)} /></Field>
      <Field label="Qty Received"><input style={inp} type="number" value={f.quantity_received || 0} onChange={e => s("quantity_received", +e.target.value)} /></Field>
      <Field label="Qty Staged"><input style={inp} type="number" value={f.quantity_staged || 0} onChange={e => s("quantity_staged", +e.target.value)} /></Field>
      <Field label="Qty Installed"><input style={inp} type="number" value={f.quantity_installed || 0} onChange={e => s("quantity_installed", +e.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

function PARModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => { await JMUXPARControl.update(item.id, f); onSave(); };
  return (
    <Modal title={`PAR — ${item.site_name}`} onClose={onClose}>
      <Field label="Design Status">
        <select style={sel} value={f.design_status || ""} onChange={e => s("design_status", e.target.value)}>
          {["Not Started", "In Progress", "Complete", "Approved"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="RC-30 Ordered?">
        <select style={sel} value={f.rc30_ordered ? "yes" : "no"} onChange={e => s("rc30_ordered", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </Field>
      <Field label="RC-30 Order Date"><input style={inp} type="date" value={f.rc30_order_date || ""} onChange={e => s("rc30_order_date", e.target.value)} /></Field>
      <Field label="RC-30 Expected Delivery"><input style={inp} type="date" value={f.rc30_expected_delivery || ""} onChange={e => s("rc30_expected_delivery", e.target.value)} /></Field>
      <Field label="RC-30 Received?">
        <select style={sel} value={f.rc30_received ? "yes" : "no"} onChange={e => s("rc30_received", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </Field>
      <Field label="C37.94 Card Needed?">
        <select style={sel} value={f.c3794_card_needed ? "yes" : "no"} onChange={e => s("c3794_card_needed", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </Field>
      <Field label="C37.94 Card Ordered?">
        <select style={sel} value={f.c3794_ordered ? "yes" : "no"} onChange={e => s("c3794_ordered", e.target.value === "yes")}>
          <option value="no">No</option><option value="yes">Yes</option>
        </select>
      </Field>
      <Field label="Installation Status">
        <select style={sel} value={f.installation_status || ""} onChange={e => s("installation_status", e.target.value)}>
          {["Not Started", "Scheduled", "In Progress", "Complete"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

function MinuteModal({ item, onSave, onClose }) {
  const isNew = !item.id;
  const [f, setF] = useState({ status: "Action Items Open", ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => {
    if (isNew) await JMUXMeetingMinute.create(f);
    else await JMUXMeetingMinute.update(item.id, f);
    onSave();
  };
  return (
    <Modal title={isNew ? "Add Meeting Minutes" : "Edit Meeting Minutes"} onClose={onClose}>
      <Field label="Meeting Date"><input style={inp} type="date" value={f.meeting_date || ""} onChange={e => s("meeting_date", e.target.value)} /></Field>
      <Field label="Title"><input style={inp} type="text" value={f.title || ""} onChange={e => s("title", e.target.value)} /></Field>
      <Field label="Attendees"><input style={inp} type="text" value={f.attendees || ""} onChange={e => s("attendees", e.target.value)} /></Field>
      <Field label="Key Decisions"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.key_decisions || ""} onChange={e => s("key_decisions", e.target.value)} /></Field>
      <Field label="Action Items"><textarea style={{ ...inp, resize: "vertical" }} rows={4} value={f.action_items || ""} onChange={e => s("action_items", e.target.value)} /></Field>
      <Field label="Owner"><input style={inp} type="text" value={f.owner || ""} onChange={e => s("owner", e.target.value)} /></Field>
      <Field label="Action Items Due Date"><input style={inp} type="date" value={f.due_date || ""} onChange={e => s("due_date", e.target.value)} /></Field>
      <Field label="Status">
        <select style={sel} value={f.status || ""} onChange={e => s("status", e.target.value)}>
          {["Draft", "Final", "Action Items Open", "Closed"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="Additional Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

function SOWModal({ item, onSave, onClose }) {
  const [f, setF] = useState({ ...item });
  const s = (k, v) => setF(p => ({ ...p, [k]: v }));
  const save = async () => { await JMUXSOW.update(item.id, f); onSave(); };
  return (
    <Modal title={`SOW — ${item.vendor}`} onClose={onClose}>
      <Field label="Status">
        <select style={sel} value={f.status || ""} onChange={e => s("status", e.target.value)}>
          {["Draft", "Under Review", "Executed", "Active", "Complete", "On Hold"].map(x => <option key={x}>{x}</option>)}
        </select>
      </Field>
      <Field label="Open Items"><textarea style={{ ...inp, resize: "vertical" }} rows={4} value={f.open_items || ""} onChange={e => s("open_items", e.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={f.notes || ""} onChange={e => s("notes", e.target.value)} /></Field>
      <SaveCancel onSave={save} onClose={onClose} />
    </Modal>
  );
}

// ── FILTER PILL ──────────────────────────────────────────────────────────
function Pill({ label, active, onClick, color }) {
  const bg = active ? (color || NAVY) : "#fff";
  const fg = active ? "#fff" : GRAY;
  return (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: bg, color: fg, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      {label}
    </button>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────
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
  const [expandedMinute, setExpandedMinute] = useState(null);
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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
      setMilestones(ms || []);
      setWorkstreams(ws || []);
      setMinutes(mn || []);
      setPackages(pk || []);
      setEquipment(eq || []);
      setPar(pr || []);
      setSows(sw || []);
    } catch(e) {
      console.error("Load error:", e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const closeModal = () => setModal(null);
  const saved = () => { closeModal(); setAddMinute(false); load(); };

  // ── derived stats ──
  const p1Pkgs = packages.filter(p => p.phase === "Phase 1");
  const p2Pkgs = packages.filter(p => p.phase === "Phase 2");
  const p1IfcIssued = p1Pkgs.filter(p => p.ifc_status === "Issued to Hawkeye" || p.ifc_status === "Approved").length;
  const p2IfcIssued = p2Pkgs.filter(p => p.ifc_status === "Issued to Hawkeye" || p.ifc_status === "Approved").length;
  const totalIfcIssued = p1IfcIssued + p2IfcIssued;
  const ifrDone = packages.filter(p => p.ifr_status === "Approved" || p.ifr_status === "Submitted").length;
  const completeMs = milestones.filter(m => m.status === "Complete").length;
  const overdueMs  = milestones.filter(m => m.status === "Overdue").length;
  const criticalEquip = equipment.filter(e => e.po_status === "Not Ordered");
  const spi = 0.77;

  const filteredPkgs = packages.filter(p => {
    const phaseOk = phaseFilter === "All" || p.phase === phaseFilter;
    const statusOk = statusFilter === "All" || p.ifc_status === statusFilter || p.ifr_status === statusFilter;
    return phaseOk && statusOk;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f8" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: NAVY }}>Loading JMUX Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a6b 100%)`, color: "#fff", padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.6, textTransform: "uppercase" }}>PSEG Long Island · PRJ13797 · CONFIDENTIAL</div>
              <h1 style={{ margin: "4px 0 2px", fontSize: 24, fontWeight: 800 }}>JMUX Replacement Program</h1>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Phase 1: 31 Sites · Phase 2: 36 Sites · PM: Dhananjaya Gunaratne</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{spi.toFixed(2)}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>SPI · 🟡 YELLOW</div>
              </div>
              <div style={{ background: "rgba(245,158,11,0.2)", borderRadius: 12, padding: "10px 18px", textAlign: "center", border: "1px solid rgba(245,158,11,0.4)" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: GOLD }}>{completeMs}/{milestones.length}</div>
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

          {/* Program Progression Bar */}
          <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
            {[
              { n: "01", label: "Phase 1 NMS Buildout", sub: "In Progress — 13/31 nodes in NSP", active: true },
              { n: "02", label: "RTU Migration", sub: "Upcoming — Hicksville test pending" },
              { n: "03", label: "Phase 2 Construction", sub: "On Track — Aug 2026 start" },
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, background: step.active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)", borderRadius: i === 0 ? "10px 0 0 10px" : i === 2 ? "0 10px 10px 0" : 0, padding: "10px 14px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ fontSize: 10, opacity: 0.5 }}>{step.n}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{step.label}</div>
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 1 }}>{step.sub}</div>
              </div>
            ))}
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

      {/* CONTENT */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 16px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 20 }}>
              {[
                { icon: "✅", val: `${completeMs}/${milestones.length}`, label: "Milestones Complete", color: GREEN },
                { icon: "⚠️", val: overdueMs, label: "Overdue Items", color: RED },
                { icon: "🏗️", val: `${p1IfcIssued}/31`, label: "Phase 1 IFCs Issued", color: BLUE },
                { icon: "🏗️", val: `${p2IfcIssued}/36`, label: "Phase 2 IFCs Issued", color: PURPLE },
                { icon: "🖥️", val: "13/31", label: "Phase 1 Nodes in NSP", color: "#0891b2" },
                { icon: "🚨", val: criticalEquip.length, label: "Equipment Not Ordered", color: RED },
              ].map((k, i) => (
                <Card key={i} style={{ padding: 16 }}>
                  <div style={{ fontSize: 24 }}>{k.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: k.color, lineHeight: 1.1, marginTop: 6 }}>{k.val}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{k.label}</div>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              {/* SPI History */}
              <Card>
                <SectionTitle>📈 SPI History</SectionTitle>
                {[
                  { l: "January 2026", v: 1.00, c: "#94a3b8" },
                  { l: "February 2026", v: 0.75, c: GOLD },
                  { l: "March 2026",    v: 0.80, c: GOLD },
                  { l: "April 2026",   v: 0.77, c: GOLD },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 110, fontSize: 12, color: GRAY }}>{r.l}</div>
                    <div style={{ flex: 1 }}><Bar pct={(r.v / 2) * 100} color={r.c} h={10} /></div>
                    <div style={{ width: 36, fontSize: 13, fontWeight: 700, color: r.c }}>{r.v.toFixed(2)}</div>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: 12, background: "#f8fafc", borderRadius: 10, fontSize: 13, color: GRAY }}>
                  <strong>Phase 1 delay:</strong> Nokia license received 4/13, DNS resolved by Vic.<br />
                  <strong>Phase 2:</strong> On track. Parallel progress offsetting Phase 1 slip.
                </div>
              </Card>

              {/* Action Required */}
              <Card>
                <SectionTitle>🚨 Action Required</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {milestones.filter(m => m.status === "Overdue" || m.status === "At Risk").map((m, i) => (
                    <div key={i} style={{ padding: 12, borderRadius: 10, background: m.status === "Overdue" ? "#fee2e2" : "#fef3c7", borderLeft: `4px solid ${m.status === "Overdue" ? RED : GOLD}` }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{m.milestone_name}</div>
                      <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Due: {fmt(m.planned_date)} · {m.owner}</div>
                    </div>
                  ))}
                  {criticalEquip.map((e, i) => (
                    <div key={i} style={{ padding: 12, borderRadius: 10, background: "#fee2e2", borderLeft: `4px solid ${RED}` }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>🚨 {e.item_name}</div>
                      <div style={{ fontSize: 12, color: GRAY }}>PO Not Placed · Lead time: {e.lead_time_weeks} weeks</div>
                    </div>
                  ))}
                  {packages.filter(p => p.notes && p.notes.includes("URGENT")).map((p, i) => (
                    <div key={i} style={{ padding: 12, borderRadius: 10, background: "#fef3c7", borderLeft: `4px solid ${GOLD}` }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>⚠️ {p.site_name} — IFR Due Soon</div>
                      <div style={{ fontSize: 12, color: GRAY }}>IFR: {fmt(p.ifr_planned)}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Workstreams */}
            <Card>
              <SectionTitle>⚙️ Workstream Progress</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {workstreams.map((w, i) => {
                  const cfg = STATUS_CFG[w.status] || STATUS_CFG["Not Started"];
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#dbeafe", borderRadius: 4, padding: "1px 7px" }}>{w.phase}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{w.name}</span>
                          <span style={{ fontSize: 12, color: GRAY }}>· {w.owner}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <Badge status={w.status} small />
                          <span style={{ fontWeight: 700, color: cfg.color }}>{w.percent_complete}%</span>
                          <button onClick={() => setModal({ type: "ws", item: w })} style={{ padding: "3px 10px", fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                        </div>
                      </div>
                      <Bar pct={w.percent_complete} color={cfg.color} h={10} />
                      {w.notes && <div style={{ fontSize: 11, color: GRAY, marginTop: 4 }}>{w.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ── MILESTONES ── */}
        {tab === "milestones" && (
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Phase", "Milestone", "Planned", "% Done", "Wk SPI", "Cum SPI", "Owner", "Status", ""].map((h, i) => (
                    <th key={i} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...milestones].sort((a, b) => new Date(a.planned_date) - new Date(b.planned_date)).map((m, i) => {
                  const cfg = STATUS_CFG[m.status] || STATUS_CFG["Not Started"];
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "11px 14px" }}><span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#dbeafe", borderRadius: 4, padding: "1px 7px" }}>{m.phase}</span></td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: NAVY }}>{m.milestone_name}</div>
                        {m.notes && <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{m.notes.substring(0, 70)}{m.notes.length > 70 ? "..." : ""}</div>}
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(m.planned_date)}</td>
                      <td style={{ padding: "11px 14px", minWidth: 90 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ flex: 1 }}><Bar pct={m.percent_complete} color={cfg.color} h={6} /></div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{m.percent_complete || 0}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: m.weekly_spi >= 1 ? GREEN : m.weekly_spi >= 0.7 ? GOLD : RED }}>{m.weekly_spi != null ? m.weekly_spi.toFixed(2) : "—"}</td>
                      <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: m.cumulative_spi >= 0.9 ? GREEN : m.cumulative_spi >= 0.7 ? GOLD : m.cumulative_spi ? RED : GRAY }}>{m.cumulative_spi != null ? m.cumulative_spi.toFixed(2) : "—"}</td>
                      <td style={{ padding: "11px 14px", fontSize: 12, color: GRAY }}>{m.owner || "—"}</td>
                      <td style={{ padding: "11px 14px" }}><Badge status={m.status} small /></td>
                      <td style={{ padding: "11px 14px" }}><button onClick={() => setModal({ type: "milestone", item: m })} style={{ padding: "4px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", color: NAVY, fontWeight: 600 }}>Edit</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        {/* ── IFR / IFC ── */}
        {tab === "engineering" && (
          <div>
            {/* Phase stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 18 }}>
              {[
                { label: "Phase 1 — 31 Sites", val: `${p1IfcIssued} IFCs Issued`, color: BLUE },
                { label: "Phase 2 — 36 Sites", val: `${p2IfcIssued} IFCs Issued`, color: PURPLE },
                { label: "Total IFRs Done", val: ifrDone, color: GREEN },
                { label: "IFC Not Started", val: packages.filter(p => p.ifc_status === "Not Started").length, color: GRAY },
              ].map((k, i) => (
                <Card key={i} style={{ padding: 14 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.val}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 3 }}>{k.label}</div>
                </Card>
              ))}
            </div>

            {/* Phase filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: GRAY }}>Phase:</span>
              {["All", "Phase 1", "Phase 2"].map(f => (
                <Pill key={f} label={f} active={phaseFilter === f} onClick={() => setPhaseFilter(f)} />
              ))}
            </div>
            {/* Status filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: GRAY }}>Status:</span>
              {["All", "Not Started", "In Review", "Submitted", "Issued to Hawkeye", "Approved"].map(f => (
                <Pill key={f} label={f} active={statusFilter === f} onClick={() => setStatusFilter(f)} color={BLUE} />
              ))}
            </div>

            <Card style={{ padding: 0, overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["#", "Phase", "Site", "IFR Planned", "IFR Actual", "IFR Status", "IFC Planned", "IFC Actual", "IFC Status", "Construction", ""].map((h, i) => (
                      <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPkgs.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: p.notes && p.notes.includes("URGENT") ? "#fffbeb" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, fontWeight: 600 }}>{p.site_number}</td>
                      <td style={{ padding: "9px 12px" }}><span style={{ fontSize: 10, fontWeight: 700, color: p.phase === "Phase 1" ? BLUE : PURPLE, background: p.phase === "Phase 1" ? "#dbeafe" : "#ede9fe", borderRadius: 4, padding: "1px 6px" }}>{p.phase}</span></td>
                      <td style={{ padding: "9px 12px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{p.site_name}</div>
                        {p.notes && <div style={{ fontSize: 11, color: RED }}>{p.notes}</div>}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(p.ifr_planned)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GREEN, whiteSpace: "nowrap" }}>{p.ifr_actual ? fmt(p.ifr_actual) : "—"}</td>
                      <td style={{ padding: "9px 12px" }}><Badge status={p.ifr_status} small /></td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(p.ifc_planned)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GREEN, whiteSpace: "nowrap" }}>{p.ifc_actual ? fmt(p.ifc_actual) : "—"}</td>
                      <td style={{ padding: "9px 12px" }}><Badge status={p.ifc_status} small /></td>
                      <td style={{ padding: "9px 12px", fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{fmt(p.construction_planned)}</td>
                      <td style={{ padding: "9px 12px" }}><button onClick={() => setModal({ type: "eng", item: p })} style={{ padding: "3px 10px", fontSize: 11, background: "#f1f5f9", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── EQUIPMENT ── */}
        {tab === "equipment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {equipment.map((e, i) => {
              const cfg = STATUS_CFG[e.po_status] || STATUS_CFG["Not Started"];
              const recvPct = e.quantity_ordered > 0 ? (e.quantity_received / e.quantity_ordered) * 100 : 0;
              const instPct = e.quantity_ordered > 0 ? (e.quantity_installed / e.quantity_ordered) * 100 : 0;
              return (
                <Card key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#dbeafe", borderRadius: 4, padding: "1px 7px" }}>{e.phase}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE, background: "#ede9fe", borderRadius: 4, padding: "1px 7px" }}>{e.category}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{e.item_name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>
                        Vendor: {e.vendor}{e.po_number ? ` · PO: ${e.po_number}` : ""}{e.lead_time_weeks ? ` · Lead: ${e.lead_time_weeks} wks` : ""}
                      </div>
                      {e.notes && <div style={{ fontSize: 12, color: e.po_status === "Not Ordered" ? RED : GRAY, marginTop: 4 }}>{e.notes}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Badge status={e.po_status} />
                      <button onClick={() => setModal({ type: "equip", item: e })} style={{ padding: "5px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Update</button>
                    </div>
                  </div>
                  {e.quantity_ordered > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY, marginBottom: 4 }}>
                          <span>Received</span><span style={{ fontWeight: 700 }}>{e.quantity_received}/{e.quantity_ordered}</span>
                        </div>
                        <Bar pct={recvPct} color={GREEN} h={8} />
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY, marginBottom: 4 }}>
                          <span>Installed</span><span style={{ fontWeight: 700 }}>{e.quantity_installed}/{e.quantity_ordered}</span>
                        </div>
                        <Bar pct={instPct} color={BLUE} h={8} />
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
                    {e.order_date && <span style={{ fontSize: 11, color: GRAY }}>📅 Ordered: {fmt(e.order_date)}</span>}
                    {e.expected_delivery && <span style={{ fontSize: 11, color: GRAY }}>🚚 Expected: {fmt(e.expected_delivery)}</span>}
                    {e.actual_delivery && <span style={{ fontSize: 11, color: GREEN }}>✅ Delivered: {fmt(e.actual_delivery)}</span>}
                    {e.site && <span style={{ fontSize: 11, color: GRAY }}>📍 {e.site}</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── PAR CONTROL ── */}
        {tab === "par" && (
          <div>
            <Card style={{ marginBottom: 16, background: "#fef3c7", border: "1px solid #f59e0b" }}>
              <div style={{ fontWeight: 700, color: "#92400e", fontSize: 14 }}>⚡ PAR Circuit Migration — 6 High-Impact Substations</div>
              <div style={{ fontSize: 13, color: "#78350f", marginTop: 4 }}>
                Iniven RC-30 selected (serial-to-IP, NOT a NERC CIP programmable device). 8-week lead time. PO not yet placed — CRITICAL PATH. Unbudgeted $500K variance — Change Request in progress.
              </div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              {par.map((p, i) => (
                <Card key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>⚡ {p.site_name}</div>
                    <button onClick={() => setModal({ type: "par", item: p })} style={{ padding: "4px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc" }}>
                      <div style={{ fontSize: 11, color: GRAY }}>Design Status</div>
                      <Badge status={p.design_status} small />
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc" }}>
                      <div style={{ fontSize: 11, color: GRAY }}>Installation</div>
                      <Badge status={p.installation_status} small />
                    </div>
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

        {/* ── MEETING MINUTES ── */}
        {tab === "minutes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button onClick={() => setAddMinute(true)} style={{ padding: "10px 20px", background: NAVY, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Add Meeting Minutes</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {minutes.map((m, i) => (
                <Card key={i} onClick={() => setExpandedMinute(expandedMinute === m.id ? null : m.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, color: GRAY }}>{fmt(m.meeting_date)}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 2 }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>👥 {m.attendees}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Badge status={m.status} />
                      <button onClick={e => { e.stopPropagation(); setModal({ type: "minute", item: m }); }} style={{ padding: "4px 12px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                      <span style={{ fontSize: 18, color: GRAY }}>{expandedMinute === m.id ? "▲" : "▼"}</span>
                    </div>
                  </div>
                  {expandedMinute === m.id && (
                    <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 6 }}>📌 Key Decisions</div>
                        <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-line", background: "#f8fafc", padding: 12, borderRadius: 8 }}>{m.key_decisions}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 6 }}>✅ Action Items</div>
                        <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-line", background: "#f8fafc", padding: 12, borderRadius: 8 }}>{m.action_items}</div>
                        {m.due_date && <div style={{ fontSize: 12, color: GOLD, marginTop: 6, fontWeight: 600 }}>⏰ Due: {fmt(m.due_date)} · Owner: {m.owner}</div>}
                      </div>
                      {m.notes && <div style={{ gridColumn: "span 2", fontSize: 12, color: GRAY, background: "#f8fafc", padding: 10, borderRadius: 8 }}>{m.notes}</div>}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── SOW ── */}
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
                      {s.contract_value && <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>💰 ${s.contract_value.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Badge status={s.status} />
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

      {/* MODALS */}
      {modal && modal.type === "milestone" && <MilestoneModal item={modal.item} onSave={saved} onClose={closeModal} />}
      {modal && modal.type === "ws"        && <WorkstreamModal item={modal.item} onSave={saved} onClose={closeModal} />}
      {modal && modal.type === "eng"       && <EngModal        item={modal.item} onSave={saved} onClose={closeModal} />}
      {modal && modal.type === "equip"     && <EquipModal      item={modal.item} onSave={saved} onClose={closeModal} />}
      {modal && modal.type === "par"       && <PARModal        item={modal.item} onSave={saved} onClose={closeModal} />}
      {modal && modal.type === "minute"    && <MinuteModal     item={modal.item} onSave={saved} onClose={closeModal} />}
      {modal && modal.type === "sow"       && <SOWModal        item={modal.item} onSave={saved} onClose={closeModal} />}
      {addMinute && <MinuteModal item={{}} onSave={saved} onClose={() => setAddMinute(false)} />}
    </div>
  );
}
