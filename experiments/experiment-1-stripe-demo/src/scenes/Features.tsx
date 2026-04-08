import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../lib/constants";
import { sora, inter } from "../lib/fonts";
import { fadeInUp, staggerDelay, countUp } from "../lib/animations";

const stats = [
  { value: 99.999, suffix: "%", label: "Uptime SLA", decimals: 3 },
  { value: 135, suffix: "+", label: "Currencies supported", decimals: 0 },
  { value: 47, suffix: "+", label: "Countries", decimals: 0 },
  { value: 250, suffix: "M+", label: "API requests/day", decimals: 0 },
];

const features = [
  {
    title: "Payments",
    desc: "Accept cards, wallets, and local payment methods worldwide",
    color: COLORS.stripePurple,
  },
  {
    title: "Billing",
    desc: "Subscriptions, invoicing, and revenue recovery built-in",
    color: COLORS.stripeCyan,
  },
  {
    title: "Connect",
    desc: "Multi-party payments for platforms and marketplaces",
    color: COLORS.stripeGreen,
  },
];

export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 100px",
      }}
    >
      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginBottom: 70,
        }}
      >
        {stats.map((stat, i) => {
          const delay = staggerDelay(i, 6);
          const anim = fadeInUp({ frame, fps, delay });
          const count = countUp(frame, fps, stat.value, delay, 1.5);
          const displayValue =
            stat.decimals > 0
              ? (count / Math.pow(10, stat.decimals)).toFixed(stat.decimals)
              : count;

          return (
            <div key={i} style={{ ...anim, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: sora.fontFamily,
                  fontSize: 56,
                  fontWeight: 800,
                  color: COLORS.stripePurple,
                  lineHeight: 1,
                }}
              >
                {displayValue}
                {stat.suffix}
              </div>
              <div
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 16,
                  fontWeight: 500,
                  color: COLORS.gray600,
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature cards */}
      <div style={{ display: "flex", gap: 40, maxWidth: 1400 }}>
        {features.map((feat, i) => {
          const delay = 25 + staggerDelay(i, 10);
          const progress = spring({
            frame,
            fps,
            delay,
            config: { damping: 15, stiffness: 80 },
          });
          const y = interpolate(progress, [0, 1], [80, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                background: COLORS.gray100,
                borderRadius: 20,
                padding: "44px 36px",
                transform: `translateY(${y}px)`,
                opacity,
                border: `1px solid ${COLORS.gray200}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: feat.color,
                }}
              />

              <div
                style={{
                  fontFamily: sora.fontFamily,
                  fontSize: 30,
                  fontWeight: 700,
                  color: COLORS.stripeBlue,
                  marginBottom: 12,
                }}
              >
                {feat.title}
              </div>
              <div
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 18,
                  fontWeight: 400,
                  color: COLORS.gray600,
                  lineHeight: 1.5,
                }}
              >
                {feat.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
