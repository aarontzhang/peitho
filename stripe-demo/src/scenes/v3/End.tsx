import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

export const End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tagline appears
  const tagProgress = spring({ frame, fps, delay: 3, config: { damping: 200 } });
  const tagOpacity = interpolate(tagProgress, [0, 1], [0, 1]);
  const tagY = interpolate(tagProgress, [0, 1], [14, 0]);

  // Logo
  const logoProgress = spring({ frame, fps, delay: 14, config: { damping: 200 } });
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.94, 1]);

  // CTA
  const ctaProgress = spring({ frame, fps, delay: 28, config: { damping: 200 } });
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);
  const ctaY = interpolate(ctaProgress, [0, 1], [8, 0]);

  // Ambient wash
  const washOpacity = interpolate(frame, [0, 25], [0, 0.2], {
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
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          top: "-10%",
          left: "-10%",
          opacity: washOpacity,
          background: `
            radial-gradient(ellipse at 50% 45%, ${STRIPE.gradientPurple}14 0%, transparent 50%)
          `,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          fontFamily: inter.fontFamily,
          fontSize: 32,
          fontWeight: 500,
          color: STRIPE.textOnDarkMuted,
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: 680,
          marginBottom: 52,
          zIndex: 1,
        }}
      >
        Bill like the SaaS companies
        <br />
        your clients already pay on time.
      </div>

      {/* Stripe logo — S mark + wordmark */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 40,
          zIndex: 1,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
          <path
            d="M19.6 16.4c0-1.2 1-1.7 2.6-1.7 2.3 0 5.3.7 7.6 2V10c-2.5-1-5-1.4-7.6-1.4-6.2 0-10.3 3.2-10.3 8.6 0 8.4 11.6 7.1 11.6 10.7 0 1.4-1.2 1.9-2.9 1.9-2.5 0-5.8-1-8.4-2.4v6.8c2.9 1.2 5.7 1.8 8.4 1.8 6.4 0 10.7-3.1 10.7-8.6-.1-9.1-11.7-7.5-11.7-10.9z"
            fill={STRIPE.purple}
          />
        </svg>
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 42,
            fontWeight: 600,
            color: STRIPE.white,
            letterSpacing: -1,
          }}
        >
          stripe
        </span>
      </div>

      {/* CTA + URL */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: STRIPE.purple,
            color: STRIPE.white,
            fontFamily: inter.fontFamily,
            fontSize: 16,
            fontWeight: 500,
            padding: "12px 36px",
            borderRadius: 100,
          }}
        >
          Start now →
        </div>
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 15,
            color: STRIPE.textOnDarkMuted,
          }}
        >
          stripe.com/billing
        </span>
      </div>
    </div>
  );
};
