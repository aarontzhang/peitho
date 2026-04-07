import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

const overdueInvoices = [
  { client: "Greenfield Labs", amount: "$12,400", days: "38 days overdue" },
  { client: "NovaPeak Inc", amount: "$8,750", days: "45 days overdue" },
  { client: "Ridgemont Co", amount: "$23,100", days: "29 days overdue" },
  { client: "Apex Digital", amount: "$6,200", days: "52 days overdue" },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline — appears fast
  const headProgress = spring({ frame, fps, delay: 3, config: { damping: 200 } });
  const headOpacity = interpolate(headProgress, [0, 1], [0, 1]);
  const headX = interpolate(headProgress, [0, 1], [-30, 0]);

  // "Again." hits separately
  const againProgress = spring({ frame, fps, delay: 18, config: { damping: 14, stiffness: 150 } });
  const againOpacity = interpolate(againProgress, [0, 1], [0, 1]);
  const againScale = interpolate(againProgress, [0, 1], [1.3, 1]);

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
      {/* Left side — headline */}
      <div
        style={{
          flex: "0 0 45%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 120,
          zIndex: 1,
        }}
      >
        <div
          style={{
            opacity: headOpacity,
            transform: `translateX(${headX}px)`,
            fontFamily: inter.fontFamily,
            fontSize: 62,
            fontWeight: 700,
            color: STRIPE.white,
            lineHeight: 1.15,
            letterSpacing: -2,
          }}
        >
          Your clients
          <br />
          pay late.
        </div>
        <div
          style={{
            opacity: againOpacity,
            transform: `scale(${againScale})`,
            transformOrigin: "left center",
            fontFamily: inter.fontFamily,
            fontSize: 62,
            fontWeight: 700,
            color: STRIPE.purple,
            letterSpacing: -2,
            marginTop: 4,
          }}
        >
          Again.
        </div>
      </div>

      {/* Right side — overdue invoice stack */}
      <div
        style={{
          flex: "0 0 55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: 80,
          gap: 12,
        }}
      >
        {overdueInvoices.map((inv, i) => {
          const delay = 8 + i * 6;
          const progress = spring({ frame, fps, delay, config: { damping: 20, stiffness: 160 } });
          const x = interpolate(progress, [0, 1], [60, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          // Red pulse on the overdue badge
          const badgeProgress = spring({ frame, fps, delay: delay + 10, config: { damping: 200 } });
          const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                transform: `translateX(${x}px)`,
                opacity,
                background: "#0F2D4A",
                borderRadius: 10,
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #1A3D5C",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontFamily: inter.fontFamily,
                    fontSize: 16,
                    fontWeight: 600,
                    color: STRIPE.white,
                  }}
                >
                  {inv.client}
                </span>
                <span
                  style={{
                    fontFamily: inter.fontFamily,
                    fontSize: 14,
                    color: STRIPE.textOnDarkMuted,
                  }}
                >
                  {inv.amount}
                </span>
              </div>
              <div
                style={{
                  opacity: badgeOpacity,
                  background: "#FF4C4C18",
                  border: "1px solid #FF4C4C40",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontFamily: inter.fontFamily,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#FF6B6B",
                }}
              >
                {inv.days}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
