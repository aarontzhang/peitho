import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

const steps = [
  { label: "Invoice sent", time: "Day 0" },
  { label: "Reminder sent", time: "Day 7" },
  { label: "Auto-collected", time: "Day 8" },
];

export const S4_Autopilot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const h = spring({ frame, fps, delay: 0, config: { damping: 200 } });

  return (
    <div style={{ width: "100%", height: "100%", background: STRIPE.navy, display: "flex", overflow: "hidden" }}>
      <div style={{ flex: "0 0 45%", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 110 }}>
        <div style={{
          opacity: interpolate(h, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(h, [0, 1], [10, 0])}px)`,
          fontFamily: inter.fontFamily, fontSize: 46, fontWeight: 700, color: STRIPE.white, lineHeight: 1.2, letterSpacing: -1.5,
        }}>
          Set it once.
          <br />
          <span style={{ color: STRIPE.textOnDarkMuted }}>Every invoice, on autopilot.</span>
        </div>
      </div>
      <div style={{ flex: "0 0 55%", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => {
            const p = spring({ frame, fps, delay: 3 + i * 6, config: { damping: 200 } });
            const opacity = interpolate(p, [0, 1], [0, 1]);
            const x = interpolate(p, [0, 1], [30, 0]);
            // Connector line
            const lp = spring({ frame, fps, delay: 6 + i * 6, config: { damping: 200 } });
            const lineH = i < steps.length - 1 ? interpolate(lp, [0, 1], [0, 40]) : 0;

            return (
              <React.Fragment key={i}>
                <div style={{
                  opacity, transform: `translateX(${x}px)`,
                  display: "flex", alignItems: "center", gap: 20,
                }}>
                  {/* Dot */}
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: i === 2 ? "#16A34A" : STRIPE.purple,
                    border: `3px solid ${i === 2 ? "#16A34A40" : STRIPE.purple + "40"}`,
                    flexShrink: 0,
                  }} />
                  {/* Content */}
                  <div style={{
                    background: "#0F2D4A", borderRadius: 10, padding: "16px 24px",
                    border: "1px solid #1A3D5C", minWidth: 300,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontFamily: inter.fontFamily, fontSize: 16, fontWeight: 600, color: STRIPE.white }}>{step.label}</span>
                    <span style={{ fontFamily: inter.fontFamily, fontSize: 13, color: STRIPE.textOnDarkMuted }}>{step.time}</span>
                  </div>
                </div>
                {/* Connector */}
                {i < steps.length - 1 && (
                  <div style={{ marginLeft: 6, width: 2, height: lineH, background: `${STRIPE.purple}40` }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
