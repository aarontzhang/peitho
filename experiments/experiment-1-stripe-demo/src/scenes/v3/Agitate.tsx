import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";
import { countUp } from "../../lib/animations";

const emails = [
  "RE: Invoice #1847 — just checking in",
  "RE: RE: Invoice #1847 — following up",
  "RE: RE: RE: Invoice #1847 — any update?",
];

export const Agitate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left side: money going out
  const numProgress = spring({ frame, fps, delay: 3, config: { damping: 200 } });
  const numOpacity = interpolate(numProgress, [0, 1], [0, 1]);
  const numY = interpolate(numProgress, [0, 1], [20, 0]);
  const spend = countUp(frame, fps, 47200, 3, 1.0);

  // Label
  const labelProgress = spring({ frame, fps, delay: 15, config: { damping: 200 } });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Divider line
  const lineProgress = spring({ frame, fps, delay: 5, config: { damping: 200 } });
  const lineHeight = interpolate(lineProgress, [0, 1], [0, 400]);

  // Subline
  const subProgress = spring({ frame, fps, delay: 25, config: { damping: 200 } });
  const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);
  const subY = interpolate(subProgress, [0, 1], [12, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: STRIPE.navy,
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left: money out */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: numOpacity,
            transform: `translateY(${numY}px)`,
            fontFamily: inter.fontFamily,
            fontSize: 86,
            fontWeight: 700,
            color: STRIPE.white,
            letterSpacing: -3,
          }}
        >
          ${spend.toLocaleString()}
        </div>
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: inter.fontFamily,
            fontSize: 18,
            fontWeight: 400,
            color: STRIPE.textOnDarkMuted,
            marginTop: 8,
          }}
        >
          paid to Meta Ads this month
        </div>
      </div>

      {/* Center divider */}
      <div
        style={{
          width: 1,
          height: lineHeight,
          background: `linear-gradient(180deg, transparent, ${STRIPE.purple}60, transparent)`,
          alignSelf: "center",
        }}
      />

      {/* Right: chasing emails */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 60,
          paddingRight: 80,
          gap: 14,
        }}
      >
        {emails.map((email, i) => {
          const delay = 12 + i * 10;
          const progress = spring({ frame, fps, delay, config: { damping: 20, stiffness: 140 } });
          const y = interpolate(progress, [0, 1], [30, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                background: "#0F2D4A",
                borderRadius: 8,
                padding: "16px 20px",
                border: "1px solid #1A3D5C",
                fontFamily: inter.fontFamily,
                fontSize: 15,
                color: STRIPE.textOnDarkMuted,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: i === emails.length - 1 ? "#FF6B6B" : STRIPE.purple,
                  flexShrink: 0,
                }}
              />
              {email}
            </div>
          );
        })}

        {/* Bottom line */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontFamily: inter.fontFamily,
            fontSize: 22,
            fontWeight: 600,
            color: STRIPE.white,
            marginTop: 16,
            lineHeight: 1.3,
          }}
        >
          They take 45 days
          <br />
          to pay you back.
        </div>
      </div>
    </div>
  );
};
