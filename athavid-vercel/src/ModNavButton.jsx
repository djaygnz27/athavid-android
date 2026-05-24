// ⛔ LOCKED — ModNavButton.jsx
// DO NOT MODIFY unless fixing a Mod-nav-specific bug.
// Last verified working: 2026-05-24
// Renders the Mod (shield) nav button — visible to admins only.

import React from "react";

function ModNavButton({ activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab("admin")}
      style={{
        flex: 1,
        padding: "4px 8px 6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        WebkitTapHighlightColor: "transparent",
        borderRadius: 32,
        transition: "background 0.15s",
        marginBottom: 4,
      }}
    >
      <svg
        width="22" height="22" viewBox="0 0 24 24"
        fill="none"
        stroke={activeTab === "admin" ? "#F5C842" : "#4A4A6A"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <div style={{
        fontSize: 9,
        color: activeTab === "admin" ? "#F5C842" : "#4A4A6A",
        fontWeight: activeTab === "admin" ? 700 : 400,
        letterSpacing: 0.3,
      }}>
        Mod
      </div>
    </button>
  );
}

export default ModNavButton;
