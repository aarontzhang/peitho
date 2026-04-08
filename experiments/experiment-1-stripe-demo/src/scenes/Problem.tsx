import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../lib/constants";
import { sora, inter } from "../lib/fonts";
import { fadeInUp, staggerDelay } from "../lib/animations";

const painPoints = [
  {
    icon: "🔧",
    title: "Complex integrations",
    desc: "Months building payment plumbing",
  },
  {
    icon: "🌍",
    title: "Global headaches",
    desc: "135+ currencies, local methods",
  },
  {
    icon: "🛡️",
    title: "Fraud & compliance",
    desc: "PCI, SCA, PSD2 requirements",
  },
  {
    icon: "📊",
    title: "Revenue leakage",
    desc: "Failed payments, churn, disputes",
  },
];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineAnim = fadeInUp({ frame, fps, delay: 0 });

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
      }}
    >
      {/* Subtle dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `radial-gradient(${COLORS.stripeBlue} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Section label */}
      <div
        style={{
          ...fadeInUp({ frame, fps, delay: 0 }),
          fontFamily: inter.fontFamily,
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.stripePurple,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 16,
        }}
      >
        The Problem
      </div>

      {/* Headline */}
      <div
        style={{
          ...headlineAnim,
          fontFamily: sora.fontFamily,
          fontSize: 56,
          fontWeight: 700,
          color: COLORS.stripeBlue,
          textAlign: "center",
          marginBottom: 60,
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        Payments are hard.
        <br />
        <span style={{ color: COLORS.gray400 }}>
          They shouldn&apos;t have to be.
        </span>
      </div>

      {/* Pain point cards */}
      <div
        style={{
          display: "flex",
          gap: 30,
          maxWidth: 1400,
        }}
      >
        {painPoints.map((point, i) => {
          const delay = 15 + staggerDelay(i, 8);
          const progress = spring({
            frame,
            fps,
            delay,
            config: { damping: 15, stiffness: 100 },
          });
          const y = interpolate(progress, [0, 1], [60, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);
          const scale = interpolate(progress, [0, 1], [0.9, 1]);

          return (
            <div
              key={i}
              style={{
                background: COLORS.gray100,
                borderRadius: 16,
                padding: "36px 32px",
                width: 280,
                transform: `translateY(${y}px) scale(${scale})`,
                opacity,
                border: `1px solid ${COLORS.gray200}`,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{point.icon}</div>
              <div
                style={{
                  fontFamily: sora.fontFamily,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.stripeBlue,
                  marginBottom: 8,
                }}
              >
                {point.title}
              </div>
              <div
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 16,
                  fontWeight: 400,
                  color: COLORS.gray600,
                  lineHeight: 1.4,
                }}
              >
                {point.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
