import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, GRADIENTS } from "../lib/constants";
import { sora, inter } from "../lib/fonts";
import { fadeInUp, fadeInScale, staggerDelay } from "../lib/animations";

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated grid background
  const gridOpacity = interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 0.08]
  );

  // Stripe logo / wordmark entrance
  const logoAnim = fadeInScale({ frame, fps, delay: 5 });

  // Headline words stagger
  const words = ["Financial", "infrastructure", "for", "the", "internet"];

  // Subline
  const subAnim = fadeInUp({ frame, fps, delay: 25 });

  // Decorative gradient orb
  const orbProgress = spring({
    frame,
    fps,
    delay: 0,
    config: { damping: 100, stiffness: 40 },
  });
  const orbScale = interpolate(orbProgress, [0, 1], [0, 1]);
  const orbRotate = interpolate(frame, [0, 150], [0, 360], {
    extrapolateRight: "extend",
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
      {/* Animated gradient orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.stripePurple}40 0%, transparent 70%)`,
          transform: `scale(${orbScale}) rotate(${orbRotate}deg)`,
          top: -100,
          right: -100,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.stripeCyan}30 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
          bottom: -50,
          left: -50,
          filter: "blur(80px)",
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(${COLORS.white}20 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.white}20 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Stripe wordmark */}
      <div
        style={{
          ...logoAnim,
          fontFamily: sora.fontFamily,
          fontSize: 42,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: 8,
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        stripe
      </div>

      {/* Headline with staggered words */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          maxWidth: 1200,
          marginBottom: 30,
        }}
      >
        {words.map((word, i) => {
          const delay = 10 + staggerDelay(i, 5);
          const progress = spring({
            frame,
            fps,
            delay,
            config: { damping: 18, stiffness: 120 },
          });
          const y = interpolate(progress, [0, 1], [60, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <span
              key={i}
              style={{
                fontFamily: sora.fontFamily,
                fontSize: 80,
                fontWeight: 800,
                color: COLORS.white,
                transform: `translateY(${y}px)`,
                opacity,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subline */}
      <div
        style={{
          ...subAnim,
          fontFamily: inter.fontFamily,
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.gray200,
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Millions of companies use Stripe to accept payments, grow revenue, and
        accelerate new business opportunities.
      </div>
    </div>
  );
};
