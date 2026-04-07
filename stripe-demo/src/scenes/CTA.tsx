import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, GRADIENTS } from "../lib/constants";
import { sora, inter } from "../lib/fonts";
import { fadeInUp, fadeInScale } from "../lib/animations";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing glow on the button
  const pulseProgress = interpolate(frame, [30, 90], [0, Math.PI * 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(pulseProgress) * 0.02;

  // Particle / floating dots
  const dots = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 300 + (i % 3) * 80;
    const speed = 0.3 + (i % 4) * 0.1;
    const x = Math.cos(angle + frame * speed * 0.01) * radius;
    const y = Math.sin(angle + frame * speed * 0.01) * radius;
    const size = 3 + (i % 3) * 2;
    const opacity = interpolate(
      spring({ frame, fps, delay: i * 2, config: { damping: 200 } }),
      [0, 1],
      [0, 0.15 + (i % 3) * 0.1]
    );
    return { x, y, size, opacity };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: GRADIENTS.hero,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating particles */}
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            background: COLORS.white,
            opacity: dot.opacity,
            left: `calc(50% + ${dot.x}px)`,
            top: `calc(50% + ${dot.y}px)`,
          }}
        />
      ))}

      {/* Central glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.stripePurple}30 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Headline */}
      <div
        style={{
          ...fadeInUp({ frame, fps, delay: 0 }),
          fontFamily: sora.fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: COLORS.white,
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 900,
          marginBottom: 24,
          zIndex: 1,
        }}
      >
        Start building
        <br />
        <span
          style={{
            background: GRADIENTS.cta,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          the future
        </span>
      </div>

      {/* Subline */}
      <div
        style={{
          ...fadeInUp({ frame, fps, delay: 8 }),
          fontFamily: inter.fontFamily,
          fontSize: 24,
          fontWeight: 400,
          color: COLORS.gray200,
          textAlign: "center",
          marginBottom: 48,
          zIndex: 1,
        }}
      >
        Create an account and start accepting payments today.
      </div>

      {/* CTA Button */}
      <div
        style={{
          ...fadeInScale({ frame, fps, delay: 16 }),
          zIndex: 1,
          transform: `${fadeInScale({ frame, fps, delay: 16 }).transform} scale(${pulse})`,
        }}
      >
        <div
          style={{
            background: COLORS.stripePurple,
            color: COLORS.white,
            fontFamily: sora.fontFamily,
            fontSize: 22,
            fontWeight: 700,
            padding: "20px 56px",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          Start now
          <span style={{ fontSize: 24 }}>→</span>
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          ...fadeInUp({ frame, fps, delay: 30 }),
          position: "absolute",
          bottom: 50,
          fontFamily: inter.fontFamily,
          fontSize: 16,
          color: COLORS.gray400,
          zIndex: 1,
        }}
      >
        No setup fees · No monthly fees · Start free
      </div>
    </div>
  );
};
