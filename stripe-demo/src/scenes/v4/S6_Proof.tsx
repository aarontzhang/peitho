import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

export const S6_Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t30 = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const arrow = spring({ frame, fps, delay: 6, config: { damping: 200 } });
  const t2 = spring({ frame, fps, delay: 10, config: { damping: 12, stiffness: 120 } });
  const sub = spring({ frame, fps, delay: 18, config: { damping: 200 } });
  const bar = interpolate(frame, [6, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      width: "100%", height: "100%", background: STRIPE.white,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 20 }}>
        <div style={{
          opacity: interpolate(t30, [0, 1], [0, 1]),
          fontFamily: inter.fontFamily, fontSize: 140, fontWeight: 700, color: STRIPE.textMuted, letterSpacing: -6, lineHeight: 1,
          textDecoration: interpolate(t2, [0, 1], [0, 1]) > 0.5 ? "line-through" : "none",
          textDecorationColor: "#FF4C4C80", textDecorationThickness: 4,
        }}>30</div>
        <div style={{ position: "relative", width: 100 }}>
          <div style={{ width: `${interpolate(arrow, [0, 1], [0, 100])}%`, height: 3, background: STRIPE.purple, borderRadius: 2 }} />
          {interpolate(arrow, [0, 1], [0, 100]) > 85 && (
            <div style={{
              position: "absolute", right: -6, top: -5,
              borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `9px solid ${STRIPE.purple}`,
            }} />
          )}
        </div>
        <div style={{
          opacity: interpolate(t2, [0, 1], [0, 1]),
          transform: `scale(${interpolate(t2, [0, 1], [0.7, 1])})`,
          fontFamily: inter.fontFamily, fontSize: 140, fontWeight: 700, color: STRIPE.purple, letterSpacing: -6, lineHeight: 1,
        }}>2</div>
      </div>
      <div style={{
        opacity: interpolate(sub, [0, 1], [0, 1]),
        fontFamily: inter.fontFamily, fontSize: 18, fontWeight: 500, color: STRIPE.textSecondary, letterSpacing: 1, textTransform: "uppercase",
      }}>days to get paid</div>
      <div style={{ width: 500, height: 6, background: STRIPE.bgLight, borderRadius: 3, marginTop: 24, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: `${bar * 7}%`, height: "100%", background: STRIPE.purple, borderRadius: 3 }} />
      </div>
      <div style={{
        opacity: interpolate(sub, [0, 1], [0, 1]),
        fontFamily: inter.fontFamily, fontSize: 15, color: STRIPE.textMuted, marginTop: 16,
      }}>Average time-to-payment with Stripe Billing</div>
    </div>
  );
};
