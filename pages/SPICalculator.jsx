import { useState } from "react";

const JMUX_EXAMPLES = [
  {
    label: "January 2026 — On Track",
    pv: 5,
    ev: 5,
    description: "All milestones completed on schedule. BGP design underway, surveys progressing.",
  },
  {
    label: "February 2026 — Northport DC Power Issue",
    pv: 4,
    ev: 3,
    description: "Northport DC power blocking ILO work. One milestone slipped. SPI dropped to Orange.",
  },
  {
    label: "March 2026 — Recovery Underway",
    pv: 5,
    ev: 3.8,
    description: "NSP wiring complete, BGP approved, OTDR link active. Recovery in progress toward Green.",
  },
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

  const spi = pv && ev && parseFloat(pv) !== 0 ? parseFloat(ev) / parseFloat(pv) : null;
  const status = spi !== null ? getSPIColor(spi) : null;

  function loadExample(ex) {
    setPV(ex.pv);
    setEV(ex.ev);
    setLoaded(ex);
  }

  function reset() {
    setPV("");
    setEV("");
    setLoaded(null);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f1f5f9", padding: "24px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", borderRadius: 16, padding: "32px 28px", marginBottom: 24, color: "white" }}>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6, letterSpacing: 1 }}>PRJ13797 — JMUX REPLACEMENT</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>📊 SPI Calculator</h1>
          <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: 15 }}>
            Schedule Performance Index — a simple way to measure if your project is on time.
          </p>
        </div>

        {/* What is SPI */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 17, color: "#1e3a5f" }}>📖 What is SPI? (Plain English)</h2>
          <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 15, lineHeight: 1.6 }}>
            SPI tells you <strong>how much work you actually completed</strong> vs. <strong>how much you planned to complete</strong> by a certain date.
          </p>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>SPI = EV ÷ PV</div>
            <div style={{ color: "#64748b", fontSize: 14 }}>
              <div>• <strong>EV</strong> = Earned Value — work actually completed (in $ or milestones)</div>
              <div>• <strong>PV</strong> = Planned Value — work you were supposed to complete by now</div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { val: "= 1.0", label: "Exactly on schedule", color: "#16a34a", bg: "#dcfce7" },
              { val: "> 1.0", label: "Ahead of schedule", color: "#2563eb", bg: "#dbeafe" },
              { val: "< 1.0", label: "Behind schedule", color: "#dc2626", bg: "#fee2e2" },
            ].map((item) => (
              <div key={item.val} style={{ background: item.bg, borderRadius: 8, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: item.color }}>{item.val}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 17, color: "#1e3a5f" }}>🧮 Calculator — Plug In Your Numbers</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                PV — Planned Value
                <span style={{ fontWeight: 400, color: "#94a3b8" }}> (what you planned to finish)</span>
              </label>
              <input
                type="number"
                value={pv}
                onChange={(e) => { setPV(e.target.value); setLoaded(null); }}
                placeholder="e.g. 5 milestones"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 16, outline: "none", boxSizing: "border-box", color: "#1e293b" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                EV — Earned Value
                <span style={{ fontWeight: 400, color: "#94a3b8" }}> (what you actually finished)</span>
              </label>
              <input
                type="number"
                value={ev}
                onChange={(e) => { setEV(e.target.value); setLoaded(null); }}
                placeholder="e.g. 3.8 milestones"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 16, outline: "none", boxSizing: "border-box", color: "#1e293b" }}
              />
            </div>
          </div>

          {spi !== null && (
            <div style={{ background: status.bg, borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `2px solid ${status.color}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Your SPI Result</div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: status.color, lineHeight: 1 }}>{spi.toFixed(2)}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: status.color, marginTop: 6 }}>{status.label}</div>
                </div>
                <div style={{ background: "white", borderRadius: 10, padding: "14px 18px", minWidth: 180 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Calculation</div>
                  <div style={{ fontSize: 15, color: "#475569" }}>
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>{parseFloat(ev)}</span>
                    <span style={{ color: "#94a3b8" }}> ÷ </span>
                    <span style={{ color: "#7c3aed", fontWeight: 700 }}>{parseFloat(pv)}</span>
                    <span style={{ color: "#94a3b8" }}> = </span>
                    <span style={{ color: status.color, fontWeight: 700 }}>{spi.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                    {spi < 1 ? `${Math.round((1 - spi) * 100)}% behind plan` : spi > 1 ? `${Math.round((spi - 1) * 100)}% ahead of plan` : "Exactly on plan"}
                  </div>
                </div>
              </div>
              {loaded && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.6)", borderRadius: 8, fontSize: 13, color: "#475569" }}>
                  <strong>Context:</strong> {loaded.description}
                </div>
              )}
            </div>
          )}

          <button onClick={reset} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>
            🔄 Reset
          </button>
        </div>

        {/* JMUX Real Examples */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 17, color: "#1e3a5f" }}>📁 Real JMUX Project Examples</h2>
          <p style={{ margin: "0 0 16px", color: "#94a3b8", fontSize: 13 }}>Click any example to load the actual numbers from PRJ13797</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                      <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{ex.description}</div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 90 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: exStatus.color }}>{exSpi.toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: exStatus.color }}>{exStatus.label.split("—")[0].trim()}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8, fontSize: 12 }}>
                    <span style={{ background: "#dbeafe", color: "#2563eb", borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>PV: {ex.pv}</span>
                    <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>EV: {ex.ev}</span>
                    <span style={{ background: exStatus.bg, color: exStatus.color, borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>SPI: {exSpi.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SPI Scale Reference */}
        <div style={{ background: "white", borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 17, color: "#1e3a5f" }}>📊 SPI Scale Reference</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { range: "Above 1.10", color: "#2563eb", bg: "#dbeafe", label: "🔵 Ahead of Schedule", action: "Great — keep the pace, reallocate resources if needed" },
              { range: "0.90 – 1.10", color: "#16a34a", bg: "#dcfce7", label: "🟢 On Track", action: "All good — maintain current plan" },
              { range: "0.70 – 0.90", color: "#ca8a04", bg: "#fef9c3", label: "🟡 Yellow — Monitor", action: "Flag to PM. Identify what slipped and why. Recovery plan needed." },
              { range: "0.50 – 0.70", color: "#ea580c", bg: "#ffedd5", label: "🟠 Orange — Act Now", action: "Escalate to project leadership. Re-baseline or add resources." },
              { range: "Below 0.50", color: "#dc2626", bg: "#fee2e2", label: "🔴 Critical", action: "Immediate CIO/SVP escalation. Project in serious jeopardy." },
            ].map((item) => (
              <div key={item.range} style={{ display: "flex", alignItems: "center", gap: 12, background: item.bg, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ minWidth: 100, fontWeight: 700, color: item.color, fontSize: 13 }}>{item.range}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: item.color, fontSize: 13 }}>{item.label}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{item.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, paddingBottom: 24 }}>
          PRJ13797 JMUX Replacement — PSEG Long Island · Built by Sachi for Jay Gunaratne
        </div>

      </div>
    </div>
  );
}
