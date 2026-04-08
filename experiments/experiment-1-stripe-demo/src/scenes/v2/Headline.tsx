import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

export const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline fades in
  const headProgress = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 200 },
  });
  const headOpacity = interpolate(headProgress, [0, 1], [0, 1]);
  const headY = interpolate(headProgress, [0, 1], [20, 0]);

  // Subline follows
  const subProgress = spring({
    frame,
    fps,
    delay: 20,
    config: { damping: 200 },
  });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [14, 0]);

  // Ambient wash
  const washOpacity = interpolate(frame, [0, 30], [0, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: STRIPE.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient gradient */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          top: "-10%",
          left: "-10%",
          opacity: washOpacity,
          background: `
            radial-gradient(ellipse at 60% 40%, ${STRIPE.gradientPurple}15 0%, transparent 55%)
          `,
        }}
      />

      {/* One headline */}
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontFamily: inter.fontFamily,
          fontSize: 68,
          fontWeight: 600,
          color: STRIPE.white,
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 900,
          letterSpacing: -2,
        }}
      >
        Financial infrastructure
        <br />
        for the internet
      </div>

      {/* One subline */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontFamily: inter.fontFamily,
          fontSize: 22,
          fontWeight: 400,
          color: STRIPE.textOnDarkMuted,
          textAlign: "center",
          maxWidth: 560,
          lineHeight: 1.5,
          marginTop: 28,
        }}
      >
        Millions of businesses of every size use Stripe to
        accept payments and grow revenue online.
      </div>
    </div>
  );
};
