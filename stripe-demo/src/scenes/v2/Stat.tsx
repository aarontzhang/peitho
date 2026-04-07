import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";
import { countUp } from "../../lib/animations";

export const Stat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Single big number — not a grid of 4 cards
  const numProgress = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 200 },
  });
  const numOpacity = interpolate(numProgress, [0, 1], [0, 1]);
  const numScale = interpolate(numProgress, [0, 1], [0.95, 1]);

  const count = countUp(frame, fps, 135, 5, 1.2);

  // Label below
  const labelProgress = spring({
    frame,
    fps,
    delay: 25,
    config: { damping: 200 },
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [10, 0]);

  // Thin line separator
  const lineProgress = spring({
    frame,
    fps,
    delay: 18,
    config: { damping: 200 },
  });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 80]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: STRIPE.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Big number */}
      <div
        style={{
          opacity: numOpacity,
          transform: `scale(${numScale})`,
          fontFamily: inter.fontFamily,
          fontSize: 140,
          fontWeight: 700,
          color: STRIPE.navy,
          letterSpacing: -6,
          lineHeight: 1,
        }}
      >
        {count}+
      </div>

      {/* Thin line */}
      <div
        style={{
          width: lineWidth,
          height: 2,
          background: STRIPE.purple,
          marginTop: 28,
          marginBottom: 28,
        }}
      />

      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontFamily: inter.fontFamily,
          fontSize: 24,
          fontWeight: 400,
          color: STRIPE.textSecondary,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        currencies and payment methods supported
      </div>
    </div>
  );
};
