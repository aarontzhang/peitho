import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";
import { countUp } from "../../lib/animations";

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD", "BRL"];

export const S5_Global: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const h = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const count = countUp(frame, fps, 135, 0, 0.8);

  return (
    <div style={{ width: "100%", height: "100%", background: STRIPE.white, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: "0 0 48%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 110 }}>
        <div style={{
          opacity: interpolate(h, [0, 1], [0, 1]),
          fontFamily: inter.fontFamily, fontSize: 100, fontWeight: 700, color: STRIPE.purple, letterSpacing: -4, lineHeight: 1,
        }}>
          {count}+
        </div>
        <div style={{
          opacity: interpolate(h, [0, 1], [0, 1]),
          fontFamily: inter.fontFamily, fontSize: 22, fontWeight: 500, color: STRIPE.textSecondary, marginTop: 12, lineHeight: 1.4,
        }}>
          currencies supported.
          <br />
          <span style={{ color: STRIPE.navy, fontWeight: 700 }}>One dashboard.</span>
        </div>
      </div>
      <div style={{ flex: "0 0 52%", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 80 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 440 }}>
          {currencies.map((c, i) => {
            const p = spring({ frame, fps, delay: 2 + i * 3, config: { damping: 200 } });
            return (
              <div key={i} style={{
                opacity: interpolate(p, [0, 1], [0, 1]),
                transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
                background: STRIPE.bgLight, border: `1px solid ${STRIPE.border}`, borderRadius: 10,
                padding: "14px 28px", fontFamily: inter.fontFamily, fontSize: 18, fontWeight: 600, color: STRIPE.navy,
              }}>
                {c}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
