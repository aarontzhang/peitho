import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";
import { countUp } from "../../lib/animations";

export const S7_Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const h = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const fiveCount = countUp(frame, fps, 5, 0, 0.3);
  const fiftyCount = countUp(frame, fps, 50, 8, 0.6);

  // Arrow between numbers
  const arrowP = spring({ frame, fps, delay: 8, config: { damping: 200 } });

  const sub = spring({ frame, fps, delay: 16, config: { damping: 200 } });

  return (
    <div style={{
      width: "100%", height: "100%", background: STRIPE.navy,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative",
    }}>
      {/* Subtle glow */}
      <div style={{
        position: "absolute", width: "100%", height: "100%",
        background: `radial-gradient(ellipse at 50% 50%, ${STRIPE.gradientPurple}10 0%, transparent 50%)`,
      }} />

      <div style={{
        opacity: interpolate(h, [0, 1], [0, 1]),
        display: "flex", alignItems: "baseline", gap: 30, zIndex: 1,
      }}>
        <div style={{ fontFamily: inter.fontFamily, fontSize: 120, fontWeight: 700, color: STRIPE.white, letterSpacing: -4 }}>{fiveCount}</div>
        <div style={{
          opacity: interpolate(arrowP, [0, 1], [0, 1]),
          fontFamily: inter.fontFamily, fontSize: 40, color: STRIPE.purple,
        }}>→</div>
        <div style={{ fontFamily: inter.fontFamily, fontSize: 120, fontWeight: 700, color: STRIPE.purple, letterSpacing: -4 }}>{fiftyCount}</div>
      </div>

      <div style={{
        opacity: interpolate(h, [0, 1], [0, 1]),
        fontFamily: inter.fontFamily, fontSize: 18, fontWeight: 500, color: STRIPE.textOnDarkMuted, letterSpacing: 1, textTransform: "uppercase", marginTop: 12, zIndex: 1,
      }}>clients</div>

      <div style={{
        opacity: interpolate(sub, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(sub, [0, 1], [8, 0])}px)`,
        fontFamily: inter.fontFamily, fontSize: 28, fontWeight: 600, color: STRIPE.white, marginTop: 32, textAlign: "center", lineHeight: 1.3, zIndex: 1,
      }}>
        Same ops team: you.
      </div>
    </div>
  );
};
