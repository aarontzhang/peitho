import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

const clients = [
  { name: "Greenfield Labs", amount: "$12,400", type: "Monthly retainer" },
  { name: "NovaPeak Inc", amount: "$8,750", type: "Monthly retainer" },
  { name: "Ridgemont Co", amount: "$23,100", type: "Quarterly" },
];

export const S3_Solve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const h = spring({ frame, fps, delay: 0, config: { damping: 200 } });

  return (
    <div style={{ width: "100%", height: "100%", background: STRIPE.white, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 100 }}>
        <div style={{
          opacity: interpolate(h, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(h, [0, 1], [10, 0])}px)`,
          fontFamily: inter.fontFamily, fontSize: 46, fontWeight: 700, color: STRIPE.navy, lineHeight: 1.2, letterSpacing: -1.5, marginBottom: 28,
        }}>
          Stripe collects<br />so you don't<br /><span style={{ color: STRIPE.purple }}>chase.</span>
        </div>
        {["Automated invoicing", "Auto-reminders", "Instant payouts"].map((f, i) => {
          const p = spring({ frame, fps, delay: 5 + i * 4, config: { damping: 200 } });
          return (
            <div key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(p, [0, 1], [-12, 0])}px)`,
              display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: STRIPE.purple }} />
              <span style={{ fontFamily: inter.fontFamily, fontSize: 18, fontWeight: 500, color: STRIPE.textSecondary }}>{f}</span>
            </div>
          );
        })}
      </div>
      <div style={{ flex: "0 0 60%", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 70 }}>
        <div style={{ width: 520, background: STRIPE.white, borderRadius: 14, border: `1px solid ${STRIPE.border}`, overflow: "hidden", boxShadow: "0 6px 32px rgba(0,0,0,0.07)" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${STRIPE.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: inter.fontFamily, fontSize: 14, fontWeight: 600, color: STRIPE.navy }}>Billing</span>
            <span style={{ fontFamily: inter.fontFamily, fontSize: 12, color: STRIPE.textMuted }}>3 active</span>
          </div>
          {clients.map((c, i) => {
            const rp = spring({ frame, fps, delay: 3 + i * 4, config: { damping: 200 } });
            const bp = spring({ frame, fps, delay: 12 + i * 4, config: { damping: 14, stiffness: 120 } });
            return (
              <div key={i} style={{
                opacity: interpolate(rp, [0, 1], [0, 1]),
                padding: "16px 24px", borderBottom: i < 2 ? `1px solid ${STRIPE.border}` : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontFamily: inter.fontFamily, fontSize: 14, fontWeight: 600, color: STRIPE.navy }}>{c.name}</div>
                  <div style={{ fontFamily: inter.fontFamily, fontSize: 12, color: STRIPE.textMuted }}>{c.type} · {c.amount}</div>
                </div>
                <div style={{
                  opacity: interpolate(bp, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(bp, [0, 1], [0.5, 1])})`,
                  background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 6, padding: "4px 10px",
                  fontFamily: inter.fontFamily, fontSize: 12, fontWeight: 500, color: "#16A34A",
                }}>
                  ✓ Paid
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
