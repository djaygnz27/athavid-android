
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

