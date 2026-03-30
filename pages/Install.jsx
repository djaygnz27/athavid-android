import { useState } from "react";

export default function Install() {
  const [copied, setCopied] = useState(false);
  const appUrl = "https://athavid-vercel.vercel.app";

  const copy = () => {
    navigator.clipboard?.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a14 0%, #12071a 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px 60px",
    }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <img src="https://media.base44.com/images/public/69b2ee18a8e6fb58c7f0261c/8fc06482b_generated_image.png"
          alt="AthaVid" style={{ width: 90, height: 90, borderRadius: 22, marginBottom: 14, boxShadow: "0 8px 32px rgba(255,107,107,0.4)" }} />
        <div style={{ fontSize: 36, fontWeight: 900, background: "linear-gradient(135deg,#ff6b6b,#ff8e53)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          AthaVid
        </div>
        <div style={{ color: "#888", fontSize: 15, marginTop: 4 }}>Short video. Big energy.</div>
      </div>

      {/* CTA Button */}
      <a href={appUrl} style={{
        display: "block", width: "100%", maxWidth: 400,
        background: "linear-gradient(135deg,#ff6b6b,#ff8e53)",
        color: "#fff", fontWeight: 800, fontSize: 18,
        padding: "16px 0", borderRadius: 16, textAlign: "center",
        textDecoration: "none", marginBottom: 32,
        boxShadow: "0 6px 24px rgba(255,107,107,0.4)"
      }}>
        🚀 Open AthaVid
      </a>

      {/* iPhone Card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 24, marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 32 }}>🍎</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>iPhone</div>
            <div style={{ color: "#888", fontSize: 13 }}>iOS · Safari required</div>
          </div>
        </div>
        {[
          { icon: "1️⃣", text: "Tap 🚀 Open AthaVid above — opens in Safari" },
          { icon: "2️⃣", text: "Tap the Share icon at the bottom ↑ (box with arrow)" },
          { icon: "3️⃣", text: 'Scroll down and tap "Add to Home Screen"' },
          { icon: "4️⃣", text: 'Name it AthaVid → tap Add ✅' },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ fontSize: 18, minWidth: 28 }}>{s.icon}</div>
            <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.5 }}>{s.text}</div>
          </div>
        ))}
        <div style={{ background: "rgba(255,142,83,0.1)", border: "1px solid rgba(255,142,83,0.3)", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
          <div style={{ color: "#ff8e53", fontSize: 13, fontWeight: 600 }}>⚠️ Must use Safari — Chrome on iPhone won't work</div>
        </div>
      </div>

      {/* Android Card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: 24, marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 32 }}>🤖</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Android</div>
            <div style={{ color: "#888", fontSize: 13 }}>Chrome browser</div>
          </div>
        </div>
        {[
          { icon: "1️⃣", text: "Tap 🚀 Open AthaVid above — opens in Chrome" },
          { icon: "2️⃣", text: "Tap the 3 dots menu ⋮ at the top right" },
          { icon: "3️⃣", text: 'Tap "Add to Home Screen"' },
          { icon: "4️⃣", text: "Tap Add — done! ✅" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ fontSize: 18, minWidth: 28 }}>{s.icon}</div>
            <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.5 }}>{s.text}</div>
          </div>
        ))}
        <div style={{ background: "rgba(107,255,107,0.07)", border: "1px solid rgba(107,255,107,0.2)", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
          <div style={{ color: "#6bff9a", fontSize: 13, fontWeight: 600 }}>✅ Opens full screen — just like a real app!</div>
        </div>
      </div>

      {/* Copy link */}
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ color: "#666", fontSize: 12, marginBottom: 8, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>Or share the link directly</div>
        <div onClick={copy} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: "12px 16px", cursor: "pointer"
        }}>
          <div style={{ flex: 1, color: "#ff8e53", fontSize: 14, fontWeight: 600, wordBreak: "break-all" }}>{appUrl}</div>
          <div style={{ color: copied ? "#6bff9a" : "#888", fontSize: 13, fontWeight: 700, minWidth: 60, textAlign: "right" }}>
            {copied ? "✅ Copied!" : "📋 Copy"}
          </div>
        </div>
      </div>

      <div style={{ color: "#444", fontSize: 12, marginTop: 40 }}>AthaVid Beta · No App Store needed 🎉</div>
    </div>
  );
}
