import { useState } from "react";

const JMUX_PV_EXAMPLES = [
  {
    month: "January 2026",
    planned: [
      { task: "Complete Northport DC power installation", value: 1 },
      { task: "Hawkeye completes router racking at 5 Phase 1 sites", value: 2 },
      { task: "BGP design draft submitted to Lee Blackman", value: 1 },
      { task: "Phase 2 site surveys continue — 10 sites", value: 1 },
    ],
    actual: [
      { task: "Complete Northport DC power installation", done: true },
      { task: "Hawkeye completes router racking at 5 Phase 1 sites", done: true },
      { task: "BGP design draft submitted to Lee Blackman", done: true },
      { task: "Phase 2 site surveys continue — 10 sites", done: true },
    ],
    pv: 5,
    ev: 5,
  },
  {
    month: "February 2026",
    planned: [
      { task: "Northport ILO port configuration complete", value: 1 },
      { task: "OTDR test Hicksville–Syosset link confirmed active", value: 1 },
      { task: "NSP fiber cabling run and terminated at Hicksville", value: 1 },
      { task: "Phase 2 IFR packages — Far Rockaway, Valley Stream, Cedarhurst submitted", value: 1 },
    ],
    actual: [
      { task: "Northport ILO port configuration complete", done: false, note: "DC power fuse tripping — blocked" },
      { task: "OTDR test Hicksville–Syosset link confirmed active", done: true },
      { task: "NSP fiber cabling run and terminated at Hicksville", done: true },
      { task: "Phase 2 IFR packages — Far Rockaway, Valley Stream, Cedarhurst submitted", done: true },
    ],
    pv: 4,
    ev: 3,
  },
  {
    month: "March 2026",
    planned: [
      { task: "ILO configuration complete at Hicksville & Melville", value: 1 },
      { task: "BGP design approved by Vikas Vohra", value: 1 },
      { task: "Nokia NSP equipment wiring complete at Hicksville", value: 1 },
      { task: "BGP Change Review Board approval", value: 1 },
      { task: "BGP execution at Hicksville (Apr 1) & Melville (Apr 2)", value: 1 },
    ],
    actual: [
      { task: "ILO configuration complete at Hicksville & Melville", done: false, note: "In progress — Rahiq & Brianna on-site this week" },
      { task: "BGP design approved by Vikas Vohra", done: true },
      { task: "Nokia NSP equipment wiring complete at Hicksville", done: true },
      { task: "BGP Change Review Board approval", done: false, note: "Target March 31 — peer review underway" },
      { task: "BGP execution at Hicksville (Apr 1) & Melville (Apr 2)", done: false, note: "Scheduled April 1–2" },
    ],
    pv: 5,
    ev: 2,
  },
];

const JMUX_EXAMPLES = [
  { label: "January 2026 — On Track", pv: 5, ev: 5, description: "All milestones hit. BGP design underway, surveys progressing." },
  { label: "February 2026 — Northport DC Power Issue", pv: 4, ev: 3, description: "Northport DC power blocking ILO work. One milestone slipped." },
  { label: "March 2026 — Recovery Underway", pv: 5, ev: 3.8, description: "NSP wiring complete, BGP approved, OTDR active. Recovery in progress." },
];

function getSPIColor(spi) {
  if (spi >= 0.9 && spi <= 1.1) return { color: "#16a34a", label: "🟢 On Track", bg: "#dcfce7" };
  if (spi >= 0.7 && spi < 0.9) return { color: "#ca8a04", label: "🟡 Yellow — Monitor Closely", bg: "#fef9c3" };
  if (spi >= 0.5 && spi < 0.7) return { color: "#ea580c", label: "🟠 Orange — Action Required", bg: "#ffedd5" };
  if (spi > 1.1) return { color: "#2563eb", label: "🔵 Ahead of Schedule", bg: "#dbeafe" };
  return { color: "#dc2626", label: "🔴 Critical — Escalate Now", bg: "#fee2e2" };
}

export default function SPICalculator() {
  const [pv, setPV] = useState("");
  const [ev, setEV] = useState("");
  const [loaded, setLoaded] = useState(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [expandedMonth, setExpandedMonth] = useState(null);

  const spi = pv && ev && parseFloat(pv) !== 0 ? parseFloat(ev) / parseFloat(pv) : null;
  const status = spi !== null ? getSPIColor(spi) : null;

  function loadExample(ex) {
    setPV(ex.pv);
    setEV(ex.ev);
    setLoaded(ex);
    setActiveTab("calculator");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setPV("");
    setEV("");
    setLoaded(null);
  }

  const tabs = [
    { id: "calculator", label: "🧮 Calculator" },
    { id: "pv", label: "📐 How to Calculate PV" },
    { id: "scale", label: "📊 SPI Scale" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f1f5f9", padding: "24px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", borderRadius: 16, padding: "28px", marginBottom: 20, color: "white" }}>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4, letterSpacing: 1 }}>PRJ13797 — PSEG LONG ISLAND · JMUX REPLACEMENT</div>
          <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800 }}>📊 SPI Calculator & Training Guide</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 14 }}>Schedule Performance Index — using real examples from the JMUX project</p>
        </div>

        {/* What is SPI - always visible */}
        <div style={{ background: "white", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 16, color: "#1e3a5f" }}>📖 What is SPI? (Plain English)</h2>
          <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
            SPI tells you <strong>how much work you actually completed</strong> vs. <strong>how much you planned to complete</strong> by a certain date. Think of it like a report card for your schedule.
          </p>
          <div style={{ background: "#f0f7ff", borderRadius: 10, padding: "14px 18px", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>SPI = EV ÷ PV</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>
              <div>• <strong style={{ color: "#16a34a" }}>EV</strong> = Earned Value — work you actually finished</div>
              <div>• <strong style={{ color: "#7c3aed" }}>PV</strong> = Planned Value — work you were supposed to finish</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: activeTab === tab.id ? "#2563eb" : "white",
                color: activeTab === tab.id ? "white" : "#64748b",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                transition: "all 0.15s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: CALCULATOR ── */}
        {activeTab === "calculator" && (
          <>
            <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#1e3a5f" }}>🧮 Plug In Your Numbers</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    PV — Planned Value
                    <span style={{ fontWeight: 400, color: "#94a3b8" }}> (milestones or $)</span>
                  </label>
                  <input
                    type="number"
                    value={pv}
                    onChange={(e) => { setPV(e.target.value); setLoaded(null); }}
                    placeholder="e.g. 5"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 16, outline: "none", boxSizing: "border-box", color: "#1e293b" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    EV — Earned Value
                    <span style={{ fontWeight: 400, color: "#94a3b8" }}> (milestones or $)</span>
                  </label>
                  <input
                    type="number"
                    value={ev}
                    onChange={(e) => { setEV(e.target.value); setLoaded(null); }}
                    placeholder="e.g. 3.8"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 16, outline: "none", boxSizing: "border-box", color: "#1e293b" }}
                  />
                </div>
              </div>

              {spi !== null && (
                <div style={{ background: status.bg, borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `2px solid ${status.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Your SPI Result</div>
                      <div style={{ fontSize: 48, fontWeight: 800, color: status.color, lineHeight: 1 }}>{spi.toFixed(2)}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: status.color, marginTop: 6 }}>{status.label}</div>
                    </div>
                    <div style={{ background: "white", borderRadius: 10, padding: "14px 18px", minWidth: 180 }}>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>How we got there</div>
                      <div style={{ fontSize: 15, color: "#475569" }}>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>EV {parseFloat(ev)}</span>
                        <span style={{ color: "#94a3b8" }}> ÷ </span>
                        <span style={{ color: "#7c3aed", fontWeight: 700 }}>PV {parseFloat(pv)}</span>
                        <span style={{ color: "#94a3b8" }}> = </span>
                        <span style={{ color: status.color, fontWeight: 700 }}>{spi.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                        {spi < 1 ? `${Math.round((1 - spi) * 100)}% behind plan` : spi > 1 ? `${Math.round((spi - 1) * 100)}% ahead of plan` : "Exactly on plan ✅"}
                      </div>
                    </div>
                  </div>
                  {loaded && (
                    <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.6)", borderRadius: 8, fontSize: 13, color: "#475569" }}>
                      <strong>JMUX Context:</strong> {loaded.description}
                    </div>
                  )}
                </div>
              )}
              <button onClick={reset} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
                🔄 Reset
              </button>
            </div>

            {/* Quick Load Examples */}
            <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 16, color: "#1e3a5f" }}>⚡ Load a Real JMUX Example</h2>
              <p style={{ margin: "0 0 14px", color: "#94a3b8", fontSize: 13 }}>Click to instantly load real numbers from PRJ13797 — then go to the "How to Calculate PV" tab to see how PV was derived.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {JMUX_EXAMPLES.map((ex) => {
                  const exSpi = parseFloat(ex.ev) / parseFloat(ex.pv);
                  const exStatus = getSPIColor(exSpi);
                  return (
                    <div
                      key={ex.label}
                      onClick={() => loadExample(ex)}
                      style={{ border: `1.5px solid ${loaded?.label === ex.label ? exStatus.color : "#e2e8f0"}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", background: loaded?.label === ex.label ? exStatus.bg : "#fafafa", transition: "all 0.15s" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{ex.label}</div>
                          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{ex.description}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 24, fontWeight: 800, color: exStatus.color }}>{exSpi.toFixed(2)}</div>
                          <div style={{ fontSize: 11, color: exStatus.color }}>{exStatus.label.split("—")[0].trim()}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, display: "flex", gap: 8, fontSize: 12 }}>
                        <span style={{ background: "#ede9fe", color: "#7c3aed", borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>PV: {ex.pv}</span>
                        <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>EV: {ex.ev}</span>
                        <span style={{ background: exStatus.bg, color: exStatus.color, borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>SPI: {exSpi.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: HOW TO CALCULATE PV ── */}
        {activeTab === "pv" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Step by step */}
            <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 16, color: "#1e3a5f" }}>📐 How Do You Calculate PV?</h2>
              <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
                PV = the total value of work you <strong>planned to complete</strong> by a specific date. Here's how to build it step by step:
              </p>
              {[
                { step: "1", title: "List all milestones for the period", detail: "What did your schedule say should be done by end of this month? Write every task or deliverable.", icon: "📋" },
                { step: "2", title: "Assign a value to each milestone", detail: "Use milestones (1 per task), percentages, or dollar amounts. Be consistent — don't mix units.", icon: "🏷️" },
                { step: "3", title: "Add them up — that's your PV", detail: "If you planned 5 milestones this month, PV = 5. If they had dollar values, add those up.", icon: "➕" },
                { step: "4", title: "Count what actually got done — that's your EV", detail: "Go through the same list. Mark each task complete or incomplete. Add up completed ones only.", icon: "✅" },
                { step: "5", title: "Divide EV ÷ PV to get SPI", detail: "If EV = 3 and PV = 5, then SPI = 0.60 — you're behind schedule.", icon: "🧮" },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                  <div style={{ background: "#2563eb", color: "white", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{item.step}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{item.icon} {item.title}</div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Month by month JMUX breakdown */}
            <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 16, color: "#1e3a5f" }}>📁 JMUX Project — Month by Month PV Breakdown</h2>
              <p style={{ margin: "0 0 16px", color: "#94a3b8", fontSize: 13 }}>Tap any month to see exactly how PV and EV were calculated from real project milestones.</p>

              {JMUX_PV_EXAMPLES.map((month) => {
                const monthSpi = month.ev / month.pv;
                const monthStatus = getSPIColor(monthSpi);
                const isOpen = expandedMonth === month.month;
                const completedCount = month.actual.filter(a => a.done).length;

                return (
                  <div key={month.month} style={{ marginBottom: 12, border: `1.5px solid ${isOpen ? monthStatus.color : "#e2e8f0"}`, borderRadius: 12, overflow: "hidden" }}>
                    {/* Month header */}
                    <div
                      onClick={() => setExpandedMonth(isOpen ? null : month.month)}
                      style={{ padding: "14px 18px", cursor: "pointer", background: isOpen ? monthStatus.bg : "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15 }}>{month.month}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                          {month.planned.length} planned milestones · {completedCount} completed
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: monthStatus.color }}>{monthSpi.toFixed(2)}</div>
                          <div style={{ fontSize: 11, color: monthStatus.color }}>{monthStatus.label.split("—")[0].trim()}</div>
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 18 }}>{isOpen ? "▲" : "▼"}</div>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div style={{ padding: "0 18px 18px", background: "white" }}>

                        {/* PV calculation */}
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", marginBottom: 8, borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
                            📋 Step 1–3: Build Your PV (Planned Value = {month.pv})
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                              <tr style={{ background: "#f8f5ff" }}>
                                <th style={{ textAlign: "left", padding: "8px 10px", color: "#7c3aed", fontWeight: 600 }}>Planned Milestone</th>
                                <th style={{ textAlign: "center", padding: "8px 10px", color: "#7c3aed", fontWeight: 600, width: 70 }}>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {month.planned.map((p, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #f1f5f9" }}>
                                  <td style={{ padding: "8px 10px", color: "#374151" }}>{p.task}</td>
                                  <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 700, color: "#7c3aed" }}>+{p.value}</td>
                                </tr>
                              ))}
                              <tr style={{ background: "#f8f5ff", borderTop: "2px solid #ddd6fe" }}>
                                <td style={{ padding: "8px 10px", fontWeight: 700, color: "#7c3aed" }}>TOTAL PV</td>
                                <td style={{ padding: "8px 10px", textAlign: "center", fontWeight: 800, color: "#7c3aed", fontSize: 15 }}>{month.pv}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* EV calculation */}
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a", marginBottom: 8, borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
                            ✅ Step 4: Count What Got Done — EV (Earned Value = {month.ev})
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                              <tr style={{ background: "#f0fdf4" }}>
                                <th style={{ textAlign: "left", padding: "8px 10px", color: "#16a34a", fontWeight: 600 }}>Milestone</th>
                                <th style={{ textAlign: "center", padding: "8px 10px", color: "#16a34a", fontWeight: 600, width: 80 }}>Status</th>
                                <th style={{ textAlign: "left", padding: "8px 10px", color: "#16a34a", fontWeight: 600 }}>Note</th>
                              </tr>
                            </thead>
                            <tbody>
                              {month.actual.map((a, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #f1f5f9", background: a.done ? "#f0fdf4" : "#fff7f7" }}>
                                  <td style={{ padding: "8px 10px", color: "#374151" }}>{a.task}</td>
                                  <td style={{ padding: "8px 10px", textAlign: "center", fontSize: 16 }}>{a.done ? "✅" : "❌"}</td>
                                  <td style={{ padding: "8px 10px", color: "#94a3b8", fontSize: 12 }}>{a.note || (a.done ? "Complete" : "—")}</td>
                                </tr>
                              ))}
                              <tr style={{ background: "#f0fdf4", borderTop: "2px solid #86efac" }}>
                                <td style={{ padding: "8px 10px", fontWeight: 700, color: "#16a34a" }}>TOTAL EV (completed only)</td>
                                <td colSpan={2} style={{ padding: "8px 10px", fontWeight: 800, color: "#16a34a", fontSize: 15 }}>{month.ev}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Final SPI */}
                        <div style={{ marginTop: 14, background: monthStatus.bg, borderRadius: 10, padding: "14px 18px", border: `1.5px solid ${monthStatus.color}`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                          <div style={{ fontSize: 13, color: "#64748b" }}>
                            <strong>Step 5:</strong> SPI = EV ÷ PV =&nbsp;
                            <span style={{ color: "#16a34a", fontWeight: 700 }}>{month.ev}</span>
                            <span style={{ color: "#94a3b8" }}> ÷ </span>
                            <span style={{ color: "#7c3aed", fontWeight: 700 }}>{month.pv}</span>
                            <span style={{ color: "#94a3b8" }}> = </span>
                            <span style={{ color: monthStatus.color, fontWeight: 800, fontSize: 18 }}>{monthSpi.toFixed(2)}</span>
                          </div>
                          <div style={{ fontWeight: 600, color: monthStatus.color }}>{monthStatus.label}</div>
                          <button
                            onClick={() => { setPV(month.pv); setEV(month.ev); setLoaded(JMUX_EXAMPLES.find(e => e.label.includes(month.month.split(" ")[0]))); setActiveTab("calculator"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                            style={{ marginLeft: "auto", background: monthStatus.color, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                          >
                            Load in Calculator →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pro tip */}
            <div style={{ background: "#1e3a5f", borderRadius: 14, padding: 20, color: "white" }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>💡 Pro Tip from Jay's JMUX Project</div>
              <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.7 }}>
                On JMUX, each milestone = 1 point. This keeps it simple and easy for the team to understand. You could also assign dollar values — e.g. if BGP configuration costs $50K, then completing it earns $50K in EV. Either approach works as long as you're <strong>consistent</strong> throughout the project.
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SPI SCALE ── */}
        {activeTab === "scale" && (
          <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, color: "#1e3a5f" }}>📊 SPI Scale & What To Do</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { range: "Above 1.10", color: "#2563eb", bg: "#dbeafe", label: "🔵 Ahead of Schedule", action: "Maintain pace. Consider reallocating resources to other areas.", jmux: null },
                { range: "0.90 – 1.10", color: "#16a34a", bg: "#dcfce7", label: "🟢 On Track", action: "All good. Keep executing the plan.", jmux: "January 2026 — SPI 1.00" },
                { range: "0.70 – 0.90", color: "#ca8a04", bg: "#fef9c3", label: "🟡 Yellow — Monitor", action: "Flag to PM. Identify what slipped and why. Create a recovery plan.", jmux: "March 2026 — SPI 0.76 (BGP pending, ILO in progress)" },
                { range: "0.50 – 0.70", color: "#ea580c", bg: "#ffedd5", label: "🟠 Orange — Act Now", action: "Escalate to project leadership. Re-baseline or add resources.", jmux: "February 2026 — SPI 0.75 (Northport DC power blocked)" },
                { range: "Below 0.50", color: "#dc2626", bg: "#fee2e2", label: "🔴 Critical", action: "Immediate CIO/SVP escalation. Project in serious jeopardy.", jmux: null },
              ].map((item) => (
                <div key={item.range} style={{ background: item.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${item.color}30` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 100, fontWeight: 700, color: item.color, fontSize: 13, marginTop: 2 }}>{item.range}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: item.color, fontSize: 14 }}>{item.label}</div>
                      <div style={{ color: "#475569", fontSize: 13, marginTop: 3 }}>{item.action}</div>
                      {item.jmux && (
                        <div style={{ marginTop: 6, fontSize: 12, background: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "4px 10px", display: "inline-block", color: item.color, fontWeight: 600 }}>
                          📁 JMUX Example: {item.jmux}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: "#f8fafc", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", marginBottom: 8 }}>🎯 Key Rule of Thumb</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
                SPI only tells you <em>schedule</em> health — not cost. For a complete picture you also track <strong>CPI (Cost Performance Index)</strong> = EV ÷ AC (Actual Cost). Together SPI + CPI give you the full health of your project.
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, padding: "20px 0" }}>
          PRJ13797 JMUX Replacement — PSEG Long Island · Built by Sachi for Jay Gunaratne
        </div>

      </div>
    </div>
  );
}
