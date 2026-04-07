import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

export const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // S mark draws in
  const markProgress = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 200 },
  });
  const markOpacity = interpolate(markProgress, [0, 1], [0, 1]);
  const markScale = interpolate(markProgress, [0, 1], [0.92, 1]);

  // Wordmark fades in after the S mark
  const wordProgress = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 200 },
  });
  const wordOpacity = interpolate(wordProgress, [0, 1], [0, 1]);
  const wordY = interpolate(wordProgress, [0, 1], [12, 0]);

  // Ambient gradient wash — very subtle
  const washOpacity = interpolate(frame, [0, 40], [0, 0.35], {
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
      {/* Ambient gradient — subtle, atmospheric, not loud */}
      <div
        style={{
          position: "absolute",
          width: "140%",
          height: "140%",
          top: "-20%",
          left: "-20%",
          opacity: washOpacity,
          background: `
            radial-gradient(ellipse at 30% 50%, ${STRIPE.gradientPurple}18 0%, transparent 60%),
            radial-gradient(ellipse at 70% 30%, ${STRIPE.gradientCyan}12 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, ${STRIPE.gradientPink}10 0%, transparent 50%)
          `,
        }}
      />

      {/* Stripe S mark */}
      <div
        style={{
          opacity: markOpacity,
          transform: `scale(${markScale})`,
          marginBottom: 32,
        }}
      >
        <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
          <path
            d="M19.6 16.4c0-1.2 1-1.7 2.6-1.7 2.3 0 5.3.7 7.6 2V10c-2.5-1-5-1.4-7.6-1.4-6.2 0-10.3 3.2-10.3 8.6 0 8.4 11.6 7.1 11.6 10.7 0 1.4-1.2 1.9-2.9 1.9-2.5 0-5.8-1-8.4-2.4v6.8c2.9 1.2 5.7 1.8 8.4 1.8 6.4 0 10.7-3.1 10.7-8.6-.1-9.1-11.7-7.5-11.7-10.9z"
            fill={STRIPE.purple}
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div
        style={{
          opacity: wordOpacity,
          transform: `translateY(${wordY}px)`,
          fontFamily: inter.fontFamily,
          fontSize: 52,
          fontWeight: 600,
          color: STRIPE.white,
          letterSpacing: -1,
        }}
      >
        stripe
      </div>
    </div>
  );
};
