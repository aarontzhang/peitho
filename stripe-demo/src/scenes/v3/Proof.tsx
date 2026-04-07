import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "30" appears
  const thirtyProgress = spring({ frame, fps, delay: 3, config: { damping: 200 } });
  const thirtyOpacity = interpolate(thirtyProgress, [0, 1], [0, 1]);

  // Arrow / line animates across
  const lineProgress = spring({ frame, fps, delay: 12, config: { damping: 200 } });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, 100]);

  // "2" appears with a slight bounce
  const twoProgress = spring({ frame, fps, delay: 20, config: { damping: 12, stiffness: 120 } });
  const twoOpacity = interpolate(twoProgress, [0, 1], [0, 1]);
  const twoScale = interpolate(twoProgress, [0, 1], [0.7, 1]);

  // "days" labels
  const daysProgress = spring({ frame, fps, delay: 28, config: { damping: 200 } });
  const daysOpacity = interpolate(daysProgress, [0, 1], [0, 1]);

  // Subline
  const subProgress = spring({ frame, fps, delay: 35, config: { damping: 200 } });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [10, 0]);

  // Timeline tick marks compressing
  const tickProgress = interpolate(frame, [12, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        overflow: "hidden",
      }}
    >
      {/* Main number comparison */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 50,
          marginBottom: 16,
        }}
      >
        {/* 30 days */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              opacity: thirtyOpacity,
              fontFamily: inter.fontFamily,
              fontSize: 160,
              fontWeight: 700,
              color: STRIPE.textMuted,
              letterSpacing: -8,
              lineHeight: 1,
              textDecoration: twoOpacity > 0.5 ? "line-through" : "none",
              textDecorationColor: "#FF4C4C80",
              textDecorationThickness: 4,
            }}
          >
            30
          </div>
        </div>

        {/* Arrow */}
        <div style={{ position: "relative", width: 120 }}>
          <div
            style={{
              width: `${lineWidth}%`,
              height: 3,
              background: STRIPE.purple,
              borderRadius: 2,
            }}
          />
          {lineWidth > 90 && (
            <div
              style={{
                position: "absolute",
                right: -6,
                top: -5,
                width: 0,
                height: 0,
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                borderLeft: `10px solid ${STRIPE.purple}`,
                opacity: interpolate(lineWidth, [90, 100], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            />
          )}
        </div>

        {/* 2 days */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              opacity: twoOpacity,
              transform: `scale(${twoScale})`,
              fontFamily: inter.fontFamily,
              fontSize: 160,
              fontWeight: 700,
              color: STRIPE.purple,
              letterSpacing: -8,
              lineHeight: 1,
            }}
          >
            2
          </div>
        </div>
      </div>

      {/* "days" label */}
      <div
        style={{
          opacity: daysOpacity,
          fontFamily: inter.fontFamily,
          fontSize: 20,
          fontWeight: 500,
          color: STRIPE.textSecondary,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        days to get paid
      </div>

      {/* Timeline bar visualization */}
      <div
        style={{
          width: 700,
          height: 8,
          background: STRIPE.bgLight,
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          marginBottom: 32,
        }}
      >
        {/* Old bar (30 days - full width, fades) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${interpolate(tickProgress, [0, 1], [100, 100], {
              extrapolateRight: "clamp",
            })}%`,
            height: "100%",
            background: `${STRIPE.textMuted}30`,
            borderRadius: 4,
          }}
        />
        {/* New bar (2 days - small, fills purple) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${interpolate(tickProgress, [0, 1], [0, 7], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}%`,
            height: "100%",
            background: STRIPE.purple,
            borderRadius: 4,
          }}
        />
      </div>

      {/* Subline */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          fontFamily: inter.fontFamily,
          fontSize: 18,
          fontWeight: 400,
          color: STRIPE.textMuted,
          textAlign: "center",
        }}
      >
        Average time-to-payment with Stripe Billing
      </div>
    </div>
  );
};
