import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

const invoices = [
  { client: "Greenfield Labs", amount: "$12,400", days: "38 days overdue" },
  { client: "NovaPeak Inc", amount: "$8,750", days: "45 days overdue" },
  { client: "Ridgemont Co", amount: "$23,100", days: "29 days overdue" },
];

export const S1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const h = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const a = spring({ frame, fps, delay: 10, config: { damping: 14, stiffness: 150 } });

  return (
    <div style={{ width: "100%", height: "100%", background: STRIPE.navy, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: "0 0 44%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 110 }}>
        <div style={{
          opacity: interpolate(h, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(h, [0, 1], [-20, 0])}px)`,
          fontFamily: inter.fontFamily, fontSize: 58, fontWeight: 700, color: STRIPE.white, lineHeight: 1.15, letterSpacing: -2,
        }}>
          Your clients<br />pay late.
        </div>
        <div style={{
          opacity: interpolate(a, [0, 1], [0, 1]),
          transform: `scale(${interpolate(a, [0, 1], [1.2, 1])})`,
          transformOrigin: "left center",
          fontFamily: inter.fontFamily, fontSize: 58, fontWeight: 700, color: STRIPE.purple, letterSpacing: -2, marginTop: 2,
        }}>
          Again.
        </div>
      </div>
      <div style={{ flex: "0 0 56%", display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 80, gap: 10 }}>
        {invoices.map((inv, i) => {
          const p = spring({ frame, fps, delay: 3 + i * 4, config: { damping: 200 } });
          return (
            <div key={i} style={{
              transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)`,
              opacity: interpolate(p, [0, 1], [0, 1]),
              background: "#0F2D4A", borderRadius: 10, padding: "16px 22px",
              display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #1A3D5C",
            }}>
              <div>
                <div style={{ fontFamily: inter.fontFamily, fontSize: 15, fontWeight: 600, color: STRIPE.white }}>{inv.client}</div>
                <div style={{ fontFamily: inter.fontFamily, fontSize: 13, color: STRIPE.textOnDarkMuted }}>{inv.amount}</div>
              </div>
              <div style={{
                background: "#FF4C4C18", border: "1px solid #FF4C4C40", borderRadius: 6, padding: "5px 11px",
                fontFamily: inter.fontFamily, fontSize: 12, fontWeight: 500, color: "#FF6B6B",
              }}>{inv.days}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
