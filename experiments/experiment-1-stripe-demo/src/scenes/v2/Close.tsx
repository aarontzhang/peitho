import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo mark
  const markProgress = spring({
    frame,
    fps,
    delay: 5,
    config: { damping: 200 },
  });
  const markOpacity = interpolate(markProgress, [0, 1], [0, 1]);
  const markScale = interpolate(markProgress, [0, 1], [0.9, 1]);

  // Wordmark
  const wordProgress = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });
  const wordOpacity = interpolate(wordProgress, [0, 1], [0, 1]);

  // CTA
  const ctaProgress = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 200 },
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);
  const ctaY = interpolate(ctaProgress, [0, 1], [8, 0]);

  // URL
  const urlProgress = spring({
    frame,
    fps,
    delay: 40,
    config: { damping: 200 },
  });
  const urlOpacity = interpolate(urlProgress, [0, 1], [0, 1]);

  // Ambient wash
  const washOpacity = interpolate(frame, [0, 30], [0, 0.25], {
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
          width: "150%",
          height: "150%",
          top: "-25%",
          left: "-25%",
          opacity: washOpacity,
          background: `
            radial-gradient(ellipse at 40% 50%, ${STRIPE.gradientPurple}12 0%, transparent 50%),
            radial-gradient(ellipse at 65% 60%, ${STRIPE.gradientCyan}08 0%, transparent 45%)
          `,
        }}
      />

      {/* S mark + wordmark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            opacity: markOpacity,
            transform: `scale(${markScale})`,
          }}
        >
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
            <path
              d="M19.6 16.4c0-1.2 1-1.7 2.6-1.7 2.3 0 5.3.7 7.6 2V10c-2.5-1-5-1.4-7.6-1.4-6.2 0-10.3 3.2-10.3 8.6 0 8.4 11.6 7.1 11.6 10.7 0 1.4-1.2 1.9-2.9 1.9-2.5 0-5.8-1-8.4-2.4v6.8c2.9 1.2 5.7 1.8 8.4 1.8 6.4 0 10.7-3.1 10.7-8.6-.1-9.1-11.7-7.5-11.7-10.9z"
              fill={STRIPE.purple}
            />
          </svg>
        </div>
        <div
          style={{
            opacity: wordOpacity,
            fontFamily: inter.fontFamily,
            fontSize: 48,
            fontWeight: 600,
            color: STRIPE.white,
            letterSpacing: -1,
          }}
        >
          stripe
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          background: STRIPE.purple,
          color: STRIPE.white,
          fontFamily: inter.fontFamily,
          fontSize: 18,
          fontWeight: 500,
          padding: "14px 40px",
          borderRadius: 100,
          marginBottom: 24,
        }}
      >
        Start now →
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          fontFamily: inter.fontFamily,
          fontSize: 16,
          fontWeight: 400,
          color: STRIPE.textOnDarkMuted,
        }}
      >
        stripe.com
      </div>
    </div>
  );
};
