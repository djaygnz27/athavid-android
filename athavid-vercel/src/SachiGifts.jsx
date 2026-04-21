// SachiGifts.jsx — Sachi LIVE Gift System
// Unique aesthetic: deep cosmos with aurora glow — NOT TikTok pink/red
// Design language: dark jewel tones, aurora gradients, floating orbs

import React, { useState, useEffect, useRef, useCallback } from "react";

const APP_ID = "69e79122bcc8fb5a04cfb834";

// Lightweight toast — fires into App's ToastContainer via the shared bus
const _toastBus = typeof window !== "undefined" ? (window._sachiBus = window._sachiBus || { _l:[], emit(m,t){this._l.forEach(f=>f({msg:m,type:t,id:Date.now()+Math.random()}))}, on(f){this._l.push(f);return()=>{this._l=this._l.filter(l=>l!==f)}} }) : {emit:()=>{},on:()=>()=>{}};
const toast = { error:(m)=>_toastBus.emit(m,"error"), success:(m)=>_toastBus.emit(m,"success"), warn:(m)=>_toastBus.emit(m,"warn") };
const BASE_URL = "https://sachi-truth-sync.base44.app/api";
const APP_BASE = `/apps/${APP_ID}`;
const COINS_FN = "https://sachi-truth-sync.base44.app/functions/sachiCoins";

// ── Sachi Gift catalog — totally unique, not TikTok ─────────────────────────
export const GIFTS = [
  { id:"sakura",    name:"Sakura",       emoji:"🌸", icon:"🌸", coins:5,    color:"#e91e8c", glow:"rgba(233,30,140,0.6)",  rarity:"common",    anim:"float"   },
  { id:"crystal",   name:"Crystal",      emoji:"💎", icon:"💎", coins:15,   color:"#00bcd4", glow:"rgba(0,188,212,0.6)",   rarity:"common",    anim:"spin"    },
  { id:"aurora",    name:"Aurora",       emoji:"🌌", icon:"🌌", coins:30,   color:"#7c4dff", glow:"rgba(124,77,255,0.6)",  rarity:"rare",      anim:"wave"    },
  { id:"sunburst",  name:"Sunburst",     emoji:"☀️", icon:"☀️", coins:50,   color:"#FF9500", glow:"rgba(255,149,0,0.6)",   rarity:"rare",      anim:"pulse"   },
  { id:"moonstone", name:"Moonstone",    emoji:"🌙", icon:"🌙", coins:100,  color:"#b0bec5", glow:"rgba(176,190,197,0.7)", rarity:"epic",      anim:"orbit"   },
  { id:"phoenix",   name:"Phoenix",      emoji:"🔥", icon:"🦅", coins:200,  color:"#ff6d00", glow:"rgba(255,109,0,0.7)",   rarity:"epic",      anim:"rise"    },
  { id:"nebula",    name:"Nebula",       emoji:"✨", icon:"✨", coins:500,  color:"#aa00ff", glow:"rgba(170,0,255,0.8)",   rarity:"legendary", anim:"explode" },
  { id:"cosmos",    name:"Cosmos",       emoji:"🪐", icon:"🪐", coins:1000, color:"#F5C842", glow:"rgba(245,200,66,0.9)",  rarity:"legendary", anim:"nova"    },
];

const RARITY_COLORS = {
  common:    { bg:"rgba(255,255,255,0.06)", border:"rgba(255,255,255,0.12)", label:"#888" },
  rare:      { bg:"rgba(0,188,212,0.08)",   border:"rgba(0,188,212,0.25)",   label:"#00bcd4" },
  epic:      { bg:"rgba(124,77,255,0.1)",   border:"rgba(124,77,255,0.3)",   label:"#7c4dff" },
  legendary: { bg:"rgba(245,200,66,0.1)",   border:"rgba(245,200,66,0.4)",   label:"#F5C842" },
};

const COIN_PACKS = [
  { id:"pack_100",   coins:100,   price:"$0.99",  tag:"",          icon:"🪙",  price_id:"price_1TKVSjKB9bqKOOJ0Njg8IwVw" },
  { id:"pack_500",   coins:500,   price:"$3.99",  tag:"POPULAR",   icon:"🥈",  price_id:"price_1TKVSkKB9bqKOOJ02I2vMaHF" },
  { id:"pack_1200",  coins:1200,  price:"$7.99",  tag:"GREAT DEAL",icon:"🥇",  price_id:"price_1TKVSlKB9bqKOOJ0DultXMlu" },
  { id:"pack_3500",  coins:3500,  price:"$19.99", tag:"",          icon:"💠",  price_id:"price_1TKVSlKB9bqKOOJ0Ew1CcIQ7" },
  { id:"pack_10000", coins:10000, price:"$49.99", tag:"BEST VALUE", icon:"👑", price_id:"price_1TKVSmKB9bqKOOJ0fOjNzyQy" },
];

// ── API helpers ──────────────────────────────────────────────────────────────
async function apiReq(method, path, body) {
  const token = localStorage.getItem("sachi_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(BASE_URL + path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Error ${res.status}`);
  return data;
}

export async function getWallet(userId) {
  try {
    const d = await apiReq("GET", `${APP_BASE}/entities/SachiCoinWallet?user_id=${userId}&limit=1`);
    return Array.isArray(d) ? d[0] : d?.items?.[0];
  } catch { return null; }
}

async function sendGiftAPI(giftData) {
  try {
    const res = await fetch(COINS_FN, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send_gift", ...giftData }),
    });
    return res.json();
  } catch {
    // Fallback: direct entity write
    const wallet = await getWallet(giftData.sender_id);
    if (!wallet || wallet.coins < giftData.coin_cost) return { error: "Insufficient coins" };
    await apiReq("PUT", `${APP_BASE}/entities/SachiCoinWallet/${wallet.id}`, {
      coins: wallet.coins - giftData.coin_cost,
      total_spent_coins: (wallet.total_spent_coins || 0) + giftData.coin_cost,
    });
    const gift = await apiReq("POST", `${APP_BASE}/entities/SachiGift`, giftData);
    return { success: true, gift, coins_remaining: wallet.coins - giftData.coin_cost };
  }
}

// ── GIFT ANIMATION OVERLAY ────────────────────────────────────────────────────
// Shown to everyone in the room when a gift is sent
export function GiftAnimationOverlay({ gift, sender }) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState("enter"); // enter → peak → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("peak"), 300);
    const t2 = setTimeout(() => setPhase("exit"), 2500);
    const t3 = setTimeout(() => setVisible(false), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!visible) return null;

  const gDef = GIFTS.find(g => g.id === gift.gift_id) || GIFTS[0];
  const isLegendary = gDef.rarity === "legendary";
  const isEpic = gDef.rarity === "epic";

  return (
    <div style={{
      position: "fixed", bottom: 120, left: 16, zIndex: 9999,
      transform: phase === "enter" ? "translateX(-120px) scale(0.6)" :
                 phase === "exit"  ? "translateX(-120px) scale(0.6)" :
                 "translateX(0px) scale(1)",
      opacity: phase === "enter" || phase === "exit" ? 0 : 1,
      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      pointerEvents: "none",
    }}>
      {/* Main gift card */}
      <div style={{
        background: `linear-gradient(135deg, ${gDef.color}22, rgba(11,12,26,0.95))`,
        border: `2px solid ${gDef.color}88`,
        borderRadius: 20, padding: "12px 18px",
        boxShadow: `0 0 40px ${gDef.glow}, 0 8px 32px rgba(0,0,0,0.6)`,
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", gap: 12, minWidth: 220,
      }}>
        {/* Sender avatar */}
        <img src={sender?.avatar_url || `https://ui-avatars.com/api/?name=${gift.sender_username}&background=random&color=fff&size=80&bold=true`}
          style={{ width: 42, height: 42, borderRadius: "50%", border: `2px solid ${gDef.color}`, flexShrink: 0 }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>@{gift.sender_username}</div>
          <div style={{ color: "#aaa", fontSize: 11 }}>sent a gift</div>
        </div>

        {/* Gift icon with glow */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: `radial-gradient(circle, ${gDef.color}44, transparent)`,
          border: `2px solid ${gDef.color}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, flexShrink: 0,
          boxShadow: `0 0 20px ${gDef.glow}`,
          animation: isLegendary ? "legendaryPulse 0.6s ease infinite alternate" : undefined,
        }}>
          {gift.gift_emoji}
        </div>
      </div>

      {/* Gift name banner */}
      <div style={{
        textAlign: "center", marginTop: 6,
        background: `linear-gradient(90deg, ${gDef.color}cc, ${gDef.color}88)`,
        borderRadius: 20, padding: "4px 14px", display: "inline-block",
        marginLeft: 12,
      }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          {isLegendary ? "⭐ " : isEpic ? "✨ " : ""}{gift.gift_name}
          {gift.quantity > 1 ? ` ×${gift.quantity}` : ""}
        </span>
      </div>

      {/* Particle burst for legendary */}
      {isLegendary && [...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 8, height: 8, borderRadius: "50%",
          background: gDef.color,
          transform: `rotate(${i * 45}deg) translateX(${phase === "peak" ? 60 : 0}px)`,
          opacity: phase === "peak" ? 0 : 1,
          transition: `all 0.5s ease ${i * 0.05}s`,
          boxShadow: `0 0 8px ${gDef.glow}`,
          pointerEvents: "none",
        }} />
      ))}
    </div>
  );
}

// ── GIFT TRAY — the bottom sheet that slides up in the live room ──────────────
export function GiftTray({ room, currentUser, wallet, onWalletUpdate, onClose, onGiftSent }) {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("gifts"); // gifts | buy

  const totalCost = selected ? selected.coins * qty : 0;
  const canAfford = (wallet?.coins || 0) >= totalCost;

  const doSend = async () => {
    if (!selected || !currentUser || sending) return;
    if (!canAfford) { setTab("buy"); return; }
    setSending(true); setErr("");
    try {
      const result = await sendGiftAPI({
        sender_id: currentUser.id,
        sender_username: currentUser.username || currentUser.email?.split("@")[0] || "user",
        sender_avatar: currentUser.avatar_url || "",
        host_id: room.host_id,
        host_username: room.host_username,
        room_id: room.id,
        gift_id: selected.id,
        gift_name: selected.name,
        gift_emoji: selected.emoji,
        gift_icon: selected.icon,
        coin_cost: selected.coins,
        quantity: qty,
      });
      if (result.error) { setErr(result.error); setSending(false); return; }
      onWalletUpdate && onWalletUpdate(result.coins_remaining);
      onGiftSent && onGiftSent({ ...selected, sender_username: currentUser.username, gift_id: selected.id, gift_emoji: selected.emoji, gift_name: selected.name, quantity: qty });
      setSent(true);
      setTimeout(() => { setSent(false); setSelected(null); setQty(1); setSending(false); }, 1800);
    } catch (e) { setErr("Failed to send. Try again."); setSending(false); }
  };

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9500,
      background: "linear-gradient(180deg, rgba(11,12,26,0.0), rgba(11,12,26,0.95) 40px)",
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9499 }} />

      <div style={{
        position: "relative", zIndex: 9500,
        background: "linear-gradient(180deg, #0f0d1f, #0B0C1A)",
        borderRadius: "28px 28px 0 0",
        border: "1px solid rgba(124,77,255,0.2)",
        boxShadow: "0 -20px 60px rgba(124,77,255,0.15)",
        paddingBottom: 32,
      }}>
        {/* Handle */}
        <div style={{ width: 44, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "14px auto 0" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 17 }}>
            🎁 Send a Gift
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.05))",
              border: "1px solid rgba(245,200,66,0.3)",
              borderRadius: 20, padding: "5px 14px",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ fontSize: 14 }}>🪙</span>
              <span style={{ color: "#F5C842", fontWeight: 800, fontSize: 15 }}>{(wallet?.coins || 0).toLocaleString()}</span>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 34, height: 34, color: "#888", fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", padding: "0 20px", gap: 8, marginBottom: 16 }}>
          {[["gifts","🎁 Gifts"],["buy","🪙 Get Coins"]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, background: tab === key ? "rgba(124,77,255,0.2)" : "rgba(255,255,255,0.05)",
              border: tab === key ? "1.5px solid rgba(124,77,255,0.5)" : "1.5px solid transparent",
              borderRadius: 20, padding: "8px 0", color: tab === key ? "#b388ff" : "#666",
              fontWeight: tab === key ? 700 : 400, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>{label}</button>
          ))}
        </div>

        {/* GIFTS tab */}
        {tab === "gifts" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, padding: "0 16px 16px" }}>
              {GIFTS.map(g => {
                const rc = RARITY_COLORS[g.rarity];
                const isSel = selected?.id === g.id;
                return (
                  <button key={g.id} onClick={() => { setSelected(g); setQty(1); setErr(""); }} style={{
                    background: isSel ? `${g.color}22` : rc.bg,
                    border: isSel ? `2px solid ${g.color}` : `1.5px solid ${rc.border}`,
                    borderRadius: 16, padding: "12px 6px 10px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    boxShadow: isSel ? `0 0 20px ${g.glow}` : "none",
                    transform: isSel ? "scale(1.06)" : "scale(1)",
                    transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                  }}>
                    <div style={{ fontSize: 28, lineHeight: 1 }}>{g.emoji}</div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 10, textAlign: "center", lineHeight: 1.2 }}>{g.name}</div>
                    <div style={{ color: rc.label, fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", gap: 2 }}>
                      <span style={{ fontSize: 9 }}>🪙</span>{g.coins}
                    </div>
                    {g.rarity !== "common" && (
                      <div style={{ background: `${g.color}33`, borderRadius: 4, padding: "1px 5px", color: rc.label, fontSize: 8, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {g.rarity}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected gift actions */}
            {selected && (
              <div style={{ padding: "0 16px" }}>
                <div style={{
                  background: `linear-gradient(135deg, ${selected.color}15, rgba(11,12,26,0.8))`,
                  border: `1.5px solid ${selected.color}44`,
                  borderRadius: 18, padding: "14px 16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 32 }}>{selected.emoji}</span>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{selected.name}</div>
                        <div style={{ color: RARITY_COLORS[selected.rarity].label, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{selected.rarity}</div>
                      </div>
                    </div>
                    {/* Qty selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", fontSize: 18, cursor: "pointer" }}>−</button>
                      <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, minWidth: 24, textAlign: "center" }}>{qty}</span>
                      <button onClick={() => setQty(q => Math.min(99, q+1))} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#fff", fontSize: 18, cursor: "pointer" }}>+</button>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ color: "#888", fontSize: 13 }}>
                      Total: <span style={{ color: "#F5C842", fontWeight: 800 }}>🪙 {totalCost.toLocaleString()}</span>
                    </div>
                    {!canAfford && (
                      <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700 }}>Need {(totalCost - (wallet?.coins||0)).toLocaleString()} more coins</div>
                    )}
                  </div>

                  {err && <div style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{err}</div>}

                  <button onClick={doSend} disabled={sending || sent}
                    style={{
                      display: "block", width: "100%", padding: "14px 0",
                      background: sent ? "linear-gradient(135deg,#4caf50,#388e3c)" :
                                  canAfford ? `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)` :
                                  "linear-gradient(135deg,#7c4dff,#6200ea)",
                      border: "none", borderRadius: 14, color: "#fff",
                      fontWeight: 900, fontSize: 16, cursor: "pointer",
                      boxShadow: sent ? "0 0 20px rgba(76,175,80,0.5)" : `0 4px 20px ${selected.glow}`,
                      transition: "all 0.3s",
                    }}>
                    {sent ? "✓ Gift Sent!" : sending ? "Sending..." : canAfford ? `🎁 Send ${selected.name}` : "🪙 Get Coins First"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* BUY COINS tab */}
        {tab === "buy" && (
          <div style={{ padding: "0 16px" }}>
            <div style={{ color: "#888", fontSize: 12, textAlign: "center", marginBottom: 14 }}>
              100 coins = $1.00 · Hosts keep 80% of all gifts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COIN_PACKS.map(pack => (
                <button key={pack.id} onClick={() => handleBuyCoins(pack)}
                  style={{
                    background: pack.tag === "BEST VALUE" ? "linear-gradient(135deg,rgba(245,200,66,0.12),rgba(245,200,66,0.04))" :
                                pack.tag === "POPULAR" ? "linear-gradient(135deg,rgba(124,77,255,0.12),rgba(124,77,255,0.04))" :
                                "rgba(255,255,255,0.04)",
                    border: pack.tag === "BEST VALUE" ? "1.5px solid rgba(245,200,66,0.4)" :
                            pack.tag === "POPULAR" ? "1.5px solid rgba(124,77,255,0.4)" :
                            "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 16, padding: "14px 18px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 26 }}>{pack.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
                        🪙 {pack.coins.toLocaleString()} Coins
                      </div>
                      {pack.tag && (
                        <div style={{
                          background: pack.tag === "BEST VALUE" ? "rgba(245,200,66,0.2)" : "rgba(124,77,255,0.2)",
                          color: pack.tag === "BEST VALUE" ? "#F5C842" : "#b388ff",
                          borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 900,
                          display: "inline-block", marginTop: 3, letterSpacing: 0.5,
                        }}>{pack.tag}</div>
                      )}
                    </div>
                  </div>
                  <div style={{
                    background: "linear-gradient(135deg,#7c4dff,#651fff)",
                    borderRadius: 12, padding: "8px 18px",
                    color: "#fff", fontWeight: 800, fontSize: 15,
                    boxShadow: "0 4px 14px rgba(124,77,255,0.4)",
                  }}>{pack.price}</div>
                </button>
              ))}
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
              Payments processed securely by Stripe · All purchases are final
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Standalone buy coins handler — opens Stripe checkout
async function handleBuyCoins(pack) {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("sachi_user") || "null"); } catch {}
  if (!user) { toast.warn("Sign in to buy Sachi Coins"); return; }

  try {
    const res = await fetch(COINS_FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "buy_coins",
        pack_id: pack.id,
        user_id: user.id,
        username: user.username || user.email?.split("@")[0] || "user",
        success_url: window.location.href + "?coins=success&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: window.location.href + "?coins=cancel",
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else toast.error("Could not start checkout. Try again.");
  } catch {
    toast.info("Coin purchases coming soon! Payment system is being configured.");
  }
}

// ── HOST EARNINGS PANEL ───────────────────────────────────────────────────────
export function HostEarningsPanel({ currentUser, onClose }) {
  const [wallet, setWallet] = useState(null);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayout, setShowPayout] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [payoutSent, setPayoutSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      try {
        const w = await getWallet(currentUser.id);
        setWallet(w);
        const g = await apiReq("GET", `${APP_BASE}/entities/SachiGift?host_id=${currentUser.id}&sort=-created_date&limit=20`);
        setGifts(Array.isArray(g) ? g : g?.items || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const requestPayout = async () => {
    if (!paypalEmail.includes("@")) return;
    try {
      await fetch(COINS_FN, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_payout",
          host_id: currentUser.id,
          host_username: currentUser.username,
          host_email: currentUser.email,
          paypal_email: paypalEmail,
        }),
      });
      setPayoutSent(true);
      setShowPayout(false);
    } catch {
      // Direct entity write fallback
      await apiReq("POST", `${APP_BASE}/entities/SachiPayoutRequest`, {
        host_id: currentUser.id,
        host_username: currentUser.username || "host",
        host_email: currentUser.email,
        paypal_email: paypalEmail,
        usd_amount: wallet?.pending_payout_usd || 0,
        status: "pending",
      });
      setPayoutSent(true);
      setShowPayout(false);
    }
  };

  const pendingUsd = wallet?.pending_payout_usd || 0;
  const totalPaid = wallet?.total_paid_out_usd || 0;
  const totalEarned = wallet?.total_earned_coins || 0;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 7000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "relative", zIndex: 7001,
        background: "linear-gradient(180deg,#120f2a,#0B0C1A)",
        borderRadius: "28px 28px 0 0",
        border: "1px solid rgba(124,77,255,0.25)",
        boxShadow: "0 -20px 60px rgba(124,77,255,0.2)",
        width: "100%", maxWidth: 520,
        padding: "24px 24px 48px",
        maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 22px" }} />

        <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, marginBottom: 6 }}>💰 Creator Earnings</div>
        <div style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Your gift earnings from Sachi LIVE</div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#888" }}>Loading...</div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Pending Payout", value: `$${pendingUsd.toFixed(2)}`, icon: "💵", color: "#4caf50", sub: "Ready to withdraw" },
                { label: "Total Paid Out", value: `$${totalPaid.toFixed(2)}`, icon: "✅", color: "#F5C842", sub: "All time" },
                { label: "Coins Earned", value: totalEarned.toLocaleString(), icon: "🪙", color: "#7c4dff", sub: "From gifts" },
                { label: "Sachi's Cut", value: "20%", icon: "🏛️", color: "#888", sub: "Platform fee" },
              ].map(s => (
                <div key={s.label} style={{
                  background: `${s.color}11`, border: `1.5px solid ${s.color}33`,
                  borderRadius: 16, padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ color: s.color, fontWeight: 900, fontSize: 20 }}>{s.value}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{s.label}</div>
                  <div style={{ color: "#666", fontSize: 11 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Payout button */}
            {payoutSent ? (
              <div style={{ background: "rgba(76,175,80,0.15)", border: "1.5px solid rgba(76,175,80,0.4)", borderRadius: 16, padding: "16px", textAlign: "center", marginBottom: 24 }}>
                <div style={{ color: "#4caf50", fontWeight: 800, fontSize: 16 }}>✅ Payout Requested!</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>We'll process it within 3-5 business days via PayPal</div>
              </div>
            ) : pendingUsd >= 5 ? (
              showPayout ? (
                <div style={{ background: "rgba(124,77,255,0.1)", border: "1.5px solid rgba(124,77,255,0.3)", borderRadius: 16, padding: 16, marginBottom: 24 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Your PayPal email</div>
                  <input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)}
                    placeholder="you@paypal.com" type="email"
                    style={{ display: "block", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14, outline: "none", marginBottom: 12 }} />
                  <button onClick={requestPayout}
                    style={{ display: "block", width: "100%", padding: "13px 0", background: "linear-gradient(135deg,#4caf50,#388e3c)", border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                    💵 Request ${pendingUsd.toFixed(2)} Payout
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowPayout(true)} style={{
                  display: "block", width: "100%", padding: "15px 0", marginBottom: 24,
                  background: "linear-gradient(135deg,#4caf50,#388e3c)",
                  border: "none", borderRadius: 16, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(76,175,80,0.4)",
                }}>
                  💵 Withdraw ${pendingUsd.toFixed(2)} via PayPal
                </button>
              )
            ) : (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px 16px", marginBottom: 24, textAlign: "center" }}>
                <div style={{ color: "#888", fontSize: 13 }}>Minimum payout is <span style={{ color: "#F5C842", fontWeight: 700 }}>$5.00</span></div>
                <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>You need ${Math.max(0,(5-pendingUsd)).toFixed(2)} more in gifts to withdraw</div>
              </div>
            )}

            {/* Recent gifts */}
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Recent Gifts</div>
            {gifts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "28px 0", color: "#888" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎁</div>
                <div>No gifts yet — go live to start earning</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {gifts.map(g => {
                  const gDef = GIFTS.find(x => x.id === g.gift_id) || GIFTS[0];
                  return (
                    <div key={g.id} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: `${gDef.color}0d`, border: `1px solid ${gDef.color}22`,
                      borderRadius: 14, padding: "10px 14px",
                    }}>
                      <img src={g.sender_avatar || `https://ui-avatars.com/api/?name=${g.sender_username}&background=random&color=fff&size=60&bold=true`}
                        style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${gDef.color}66` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>@{g.sender_username}</div>
                        <div style={{ color: "#aaa", fontSize: 12 }}>sent {g.quantity > 1 ? `${g.quantity}× ` : ""}{g.gift_emoji} {g.gift_name}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#F5C842", fontWeight: 800, fontSize: 13 }}>🪙 {(g.coin_cost * (g.quantity||1)).toLocaleString()}</div>
                        <div style={{ color: "#4caf50", fontSize: 11 }}>+${((g.coin_cost*(g.quantity||1))*0.008).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── COIN WALLET WIDGET ────────────────────────────────────────────────────────
export function CoinWalletWidget({ userId, onBuyCoins }) {
  const [coins, setCoins] = useState(null);
  useEffect(() => {
    if (!userId) return;
    getWallet(userId).then(w => setCoins(w?.coins || 0)).catch(() => setCoins(0));
  }, [userId]);

  return (
    <button onClick={onBuyCoins} style={{
      background: "linear-gradient(135deg,rgba(245,200,66,0.15),rgba(245,200,66,0.05))",
      border: "1.5px solid rgba(245,200,66,0.3)",
      borderRadius: 20, padding: "6px 14px",
      display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
    }}>
      <span style={{ fontSize: 15 }}>🪙</span>
      <span style={{ color: "#F5C842", fontWeight: 800, fontSize: 14 }}>
        {coins === null ? "..." : coins.toLocaleString()}
      </span>
      <span style={{ color: "rgba(245,200,66,0.5)", fontSize: 12 }}>+</span>
    </button>
  );
}

export { RARITY_COLORS, COIN_PACKS };
