import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";
import { countUp } from "../../lib/animations";

const emails = [
  "RE: Invoice #1847 — just checking in",
  "RE: RE: Invoice #1847 — following up",
  "RE: RE: RE: Invoice #1847 — any update?",
];

export const S2_Agitate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const n = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const spend = countUp(frame, fps, 47200, 0, 0.6);
  const lp = spring({ frame, fps, delay: 8, config: { damping: 200 } });
  const lineH = interpolate(spring({ frame, fps, delay: 2, config: { damping: 200 } }), [0, 1], [0, 360]);
  const sub = spring({ frame, fps, delay: 20, config: { damping: 200 } });

  return (
    <div style={{ width: "100%", height: "100%", background: STRIPE.navy, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          opacity: interpolate(n, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(n, [0, 1], [12, 0])}px)`,
          fontFamily: inter.fontFamily, fontSize: 80, fontWeight: 700, color: STRIPE.white, letterSpacing: -3,
        }}>
          ${spend.toLocaleString()}
        </div>
        <div style={{
          opacity: interpolate(lp, [0, 1], [0, 1]),
          fontFamily: inter.fontFamily, fontSize: 17, fontWeight: 400, color: STRIPE.textOnDarkMuted, marginTop: 6,
        }}>
          paid to Meta Ads this month
        </div>
      </div>
      <div style={{ width: 1, height: lineH, background: `linear-gradient(180deg, transparent, ${STRIPE.purple}60, transparent)`, alignSelf: "center" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 50, paddingRight: 70, gap: 10 }}>
        {emails.map((e, i) => {
          const p = spring({ frame, fps, delay: 5 + i * 6, config: { damping: 200 } });
          return (
            <div key={i} style={{
              opacity: interpolate(p, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
              background: "#0F2D4A", borderRadius: 8, padding: "14px 18px", border: "1px solid #1A3D5C",
              fontFamily: inter.fontFamily, fontSize: 14, color: STRIPE.textOnDarkMuted,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: i === 2 ? "#FF6B6B" : STRIPE.purple, flexShrink: 0 }} />
              {e}
            </div>
          );
        })}
        <div style={{
          opacity: interpolate(sub, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(sub, [0, 1], [8, 0])}px)`,
          fontFamily: inter.fontFamily, fontSize: 20, fontWeight: 600, color: STRIPE.white, marginTop: 10, lineHeight: 1.3,
        }}>
          They take 45 days<br />to pay you back.
        </div>
      </div>
    </div>
  );
};
