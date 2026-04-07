import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";
import { StripeLogo } from "../../components/StripeLogo";

export const S8_End: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tag = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const logo = spring({ frame, fps, delay: 8, config: { damping: 200 } });
  const cta = spring({ frame, fps, delay: 18, config: { damping: 200 } });

  const washOpacity = interpolate(frame, [0, 15], [0, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      width: "100%", height: "100%", background: STRIPE.navy,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative",
    }}>
      <div style={{
        position: "absolute", width: "120%", height: "120%", top: "-10%", left: "-10%", opacity: washOpacity,
        background: `radial-gradient(ellipse at 50% 45%, ${STRIPE.gradientPurple}14 0%, transparent 50%)`,
      }} />

      {/* Tagline */}
      <div style={{
        opacity: interpolate(tag, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(tag, [0, 1], [10, 0])}px)`,
        fontFamily: inter.fontFamily, fontSize: 30, fontWeight: 500, color: STRIPE.textOnDarkMuted, textAlign: "center", lineHeight: 1.4, maxWidth: 620, marginBottom: 44, zIndex: 1,
      }}>
        Bill like the SaaS companies<br />your clients already pay on time.
      </div>

      {/* Stripe wordmark logo */}
      <div style={{
        opacity: interpolate(logo, [0, 1], [0, 1]),
        transform: `scale(${interpolate(logo, [0, 1], [0.94, 1])})`,
        marginBottom: 36, zIndex: 1,
      }}>
        <StripeLogo color={STRIPE.white} height={44} />
      </div>

      {/* CTA + URL */}
      <div style={{
        opacity: interpolate(cta, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(cta, [0, 1], [6, 0])}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 1,
      }}>
        <div style={{
          background: STRIPE.purple, color: STRIPE.white,
          fontFamily: inter.fontFamily, fontSize: 15, fontWeight: 500, padding: "11px 32px", borderRadius: 100,
        }}>Start now →</div>
        <span style={{ fontFamily: inter.fontFamily, fontSize: 14, color: STRIPE.textOnDarkMuted }}>stripe.com/billing</span>
      </div>
    </div>
  );
};
