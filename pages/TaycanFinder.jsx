import { useState } from "react";

const TRIMS = [
  {
    name: "Taycan (Base)",
    year: "2025",
    msrp: 100300,
    usedPrice: { low: 48000, high: 62000 },
    hp: 402,
    range: 274,
    drive: "RWD",
    zeroSixty: 4.5,
    highlight: "💡 Best Depreciation Value",
    notes: "Steepest depreciation of the lineup — 2021–2023 used examples can be found under $50K. RWD only. Great entry point.",
    valueScore: 95,
    bestBuy: "2021–2022 used",
    tag: "best_value",
  },
  {
    name: "Taycan 4",
    year: "2025",
    msrp: 109900,
    usedPrice: { low: 55000, high: 72000 },
    hp: 469,
    range: 262,
    drive: "AWD",
    zeroSixty: 4.4,
    highlight: "🏆 Best All-Rounder",
    notes: "AWD adds confidence in all conditions. Only slightly more expensive than base used. Great sweet spot between value and capability.",
    valueScore: 90,
    bestBuy: "2022–2023 used",
    tag: "all_rounder",
  },
  {
    name: "Taycan 4S",
    year: "2025",
    msrp: 118500,
    usedPrice: { low: 63000, high: 82000 },
    hp: 536,
    range: 280,
    drive: "AWD",
    zeroSixty: 3.5,
    highlight: "⚡ Best Performance Value",
    notes: "Originally stickered $115K+ new. Now $65–80K used. Massive performance jump over base. Most popular used Taycan on the market.",
    valueScore: 88,
    bestBuy: "2022–2023 used",
    tag: "performance_value",
  },
  {
    name: "Taycan GTS",
    year: "2025",
    msrp: 145000,
    usedPrice: { low: 82000, high: 105000 },
    hp: 690,
    range: 254,
    drive: "AWD",
    zeroSixty: 3.1,
    highlight: "🎯 Driver's Choice",
    notes: "GTS is the driver-focused sweet spot — more power than 4S, less money than Turbo. Available as Sport Turismo wagon. Lower range trade-off.",
    valueScore: 78,
    bestBuy: "2022–2023 used",
    tag: "drivers_pick",
  },
  {
    name: "Taycan Turbo",
    year: "2025",
    msrp: 185000,
    usedPrice: { low: 95000, high: 130000 },
    hp: 871,
    range: 280,
    drive: "AWD",
    zeroSixty: 2.8,
    highlight: "🚀 Supercar Territory",
    notes: "Insane performance but used prices are still high. Diminishing returns on value vs GTS unless you need the extra power.",
    valueScore: 60,
    bestBuy: "2022 used if under $100K",
    tag: "performance",
  },
  {
    name: "Taycan Turbo S",
    year: "2025",
    msrp: 220000,
    usedPrice: { low: 115000, high: 160000 },
    hp: 938,
    range: 270,
    drive: "AWD",
    zeroSixty: 2.4,
    highlight: "👑 Flagship",
    notes: "Rarely makes financial sense unless you need the absolute fastest EV money can buy. Depreciation is steep but used prices remain high.",
    valueScore: 45,
    bestBuy: "2021–2022 used if under $120K",
    tag: "flagship",
  },
];

const TIPS = [
  { icon: "📅", title: "Best Model Years", text: "2021–2023 are the sweet spot. 2020 was 4S/Turbo/Turbo S only. 2025 refresh adds more range and power but at a premium." },
  { icon: "🔋", title: "Battery Health", text: "Always check battery state of health (SoH). Taycans hold battery well but ask for a Porsche dealer report before buying." },
  { icon: "📉", title: "Depreciation Reality", text: "EVs lose value fast. A 2021 base Taycan that cost $85K new can be found under $50K today. Use that to your advantage." },
  { icon: "🔧", title: "Watch Out For", text: "Air suspension issues, software bugs on pre-2022 cars, and high optional pricing on new. Pre-purchase inspection is a must." },
  { icon: "🏪", title: "Where to Shop", text: "Check Carvana, CarGurus, PorscheApproved CPO, and AutoTempest. CPO adds warranty but costs more." },
  { icon: "⚡", title: "Charging", text: "Taycan uses CCS. 800V architecture means very fast charging (270kW+). Factor in home charger install (~$1,500) if you don't have one." },
];

const SCORE_COLOR = (score) => {
  if (score >= 88) return "#16a34a";
  if (score >= 70) return "#d97706";
  return "#dc2626";
};

export default function TaycanFinder() {
  const [budget, setBudget] = useState(80000);
  const [preference, setPreference] = useState("value");
  const [newOrUsed, setNewOrUsed] = useState("used");
  const [selected, setSelected] = useState(null);

  const filtered = TRIMS.filter((t) => {
    const price = newOrUsed === "new" ? t.msrp : t.usedPrice.low;
    return price <= budget;
  }).sort((a, b) => {
    if (preference === "value") return b.valueScore - a.valueScore;
    if (preference === "performance") return a.zeroSixty - b.zeroSixty;
    if (preference === "range") return b.range - a.range;
    return b.valueScore - a.valueScore;
  });

  const top = filtered[0];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#fff", padding: "0 0 60px 0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d1a00 100%)", padding: "40px 24px 30px", borderBottom: "1px solid #333" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 40 }}>🏎️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#fff" }}>Porsche Taycan Value Finder</h1>
              <p style={{ margin: 0, color: "#aaa", fontSize: 14 }}>Find your best Taycan deal — new or used</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {/* Filters */}
        <div style={{ background: "#1a1a1a", borderRadius: 16, padding: 24, marginBottom: 24, border: "1px solid #333" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 16, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1 }}>🎯 Your Preferences</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {/* Budget */}
            <div>
              <label style={{ fontSize: 13, color: "#aaa", display: "block", marginBottom: 8 }}>
                Max Budget: <strong style={{ color: "#fff" }}>${budget.toLocaleString()}</strong>
              </label>
              <input
                type="range"
                min={45000}
                max={225000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666" }}>
                <span>$45K</span><span>$225K</span>
              </div>
            </div>

            {/* New or Used */}
            <div>
              <label style={{ fontSize: 13, color: "#aaa", display: "block", marginBottom: 8 }}>New or Used?</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["used", "new"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setNewOrUsed(opt)}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid",
                      borderColor: newOrUsed === opt ? "#f59e0b" : "#444",
                      background: newOrUsed === opt ? "#f59e0b22" : "transparent",
                      color: newOrUsed === opt ? "#f59e0b" : "#888",
                      cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize"
                    }}
                  >{opt}</button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label style={{ fontSize: 13, color: "#aaa", display: "block", marginBottom: 8 }}>Priority</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { key: "value", label: "💰 Value" },
                  { key: "performance", label: "⚡ Speed" },
                  { key: "range", label: "🔋 Range" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPreference(opt.key)}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid",
                      borderColor: preference === opt.key ? "#f59e0b" : "#444",
                      background: preference === opt.key ? "#f59e0b22" : "transparent",
                      color: preference === opt.key ? "#f59e0b" : "#888",
                      cursor: "pointer", fontSize: 12, fontWeight: 600
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Pick */}
        {top && (
          <div style={{ background: "linear-gradient(135deg, #1a2e0a, #0a1a00)", border: "1px solid #4ade80", borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>✨ Top Pick For You</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>{top.name}</h2>
                <div style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>{top.highlight}</div>
                <p style={{ color: "#ccc", fontSize: 13, margin: "8px 0 0", maxWidth: 480 }}>{top.notes}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#4ade80" }}>
                  ${newOrUsed === "new" ? top.msrp.toLocaleString() : `${top.usedPrice.low.toLocaleString()}–${top.usedPrice.high.toLocaleString()}`}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{newOrUsed === "new" ? "MSRP" : "Typical used market range"}</div>
                <div style={{ marginTop: 8, fontSize: 13, color: "#f59e0b" }}>🎯 Best buy: {top.bestBuy}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              {[
                { label: "Horsepower", value: `${top.hp} hp` },
                { label: "0–60 mph", value: `${top.zeroSixty}s` },
                { label: "Range", value: `${top.range} mi` },
                { label: "Drive", value: top.drive },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#ffffff11", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!top && (
          <div style={{ background: "#1a1a1a", border: "1px solid #444", borderRadius: 16, padding: 32, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "#888" }}>No Taycan trims fit this budget. Try increasing your budget or switching to used.</p>
          </div>
        )}

        {/* All Trims */}
        <h2 style={{ fontSize: 16, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>📊 All Trims — Ranked</h2>
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {TRIMS.map((trim, i) => {
            const price = newOrUsed === "new" ? trim.msrp : trim.usedPrice.low;
            const inBudget = price <= budget;
            const isSelected = selected === i;
            return (
              <div
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                style={{
                  background: inBudget ? "#1a1a1a" : "#111",
                  border: `1px solid ${isSelected ? "#f59e0b" : inBudget ? "#333" : "#222"}`,
                  borderRadius: 12, padding: 16, cursor: "pointer", opacity: inBudget ? 1 : 0.45,
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", background: "#222",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: SCORE_COLOR(trim.valueScore),
                      border: `2px solid ${SCORE_COLOR(trim.valueScore)}`
                    }}>{trim.valueScore}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{trim.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{trim.highlight}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: inBudget ? "#fff" : "#666" }}>
                      {newOrUsed === "new"
                        ? `$${trim.msrp.toLocaleString()}`
                        : `$${trim.usedPrice.low.toLocaleString()}+`}
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>{newOrUsed === "new" ? "MSRP" : "used from"}</div>
                  </div>
                </div>
                {isSelected && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #333" }}>
                    <p style={{ color: "#ccc", fontSize: 13, margin: "0 0 12px" }}>{trim.notes}</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[
                        { label: "HP", value: `${trim.hp}` },
                        { label: "0–60", value: `${trim.zeroSixty}s` },
                        { label: "Range", value: `${trim.range}mi` },
                        { label: "Drive", value: trim.drive },
                        { label: "New MSRP", value: `$${trim.msrp.toLocaleString()}` },
                        { label: "Used Range", value: `$${trim.usedPrice.low.toLocaleString()}–$${trim.usedPrice.high.toLocaleString()}` },
                      ].map((s) => (
                        <div key={s.label} style={{ background: "#ffffff0a", borderRadius: 6, padding: "6px 12px" }}>
                          <span style={{ color: "#888", fontSize: 11 }}>{s.label}: </span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: "#f59e0b" }}>🎯 Best buy: {trim.bestBuy}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Buying Tips */}
        <h2 style={{ fontSize: 16, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>💡 Buying Tips</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{tip.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>{tip.text}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, color: "#555", fontSize: 12 }}>
          Prices based on market data as of March 2026 · Used prices vary by mileage, condition & location
        </div>
      </div>
    </div>
  );
}
