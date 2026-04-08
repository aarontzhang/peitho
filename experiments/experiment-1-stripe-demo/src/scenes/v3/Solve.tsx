import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

const clients = [
  { name: "Greenfield Labs", amount: "$12,400", retainer: "Monthly retainer" },
  { name: "NovaPeak Inc", amount: "$8,750", retainer: "Monthly retainer" },
  { name: "Ridgemont Co", amount: "$23,100", retainer: "Quarterly" },
];

const features = ["Automated invoicing", "Auto-reminders", "Instant payouts"];

export const Solve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline
  const headProgress = spring({ frame, fps, delay: 0, config: { damping: 200 } });
  const headOpacity = interpolate(headProgress, [0, 1], [0, 1]);
  const headY = interpolate(headProgress, [0, 1], [16, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: STRIPE.white,
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left — text */}
      <div
        style={{
          flex: "0 0 42%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 100,
        }}
      >
        <div
          style={{
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
            fontFamily: inter.fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: STRIPE.navy,
            lineHeight: 1.2,
            letterSpacing: -1.5,
            marginBottom: 36,
          }}
        >
          Stripe collects
          <br />
          so you don't
          <br />
          <span style={{ color: STRIPE.purple }}>chase.</span>
        </div>

        {/* Feature list — three items, staggered */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {features.map((feat, i) => {
            const delay = 15 + i * 8;
            const progress = spring({ frame, fps, delay, config: { damping: 200 } });
            const opacity = interpolate(progress, [0, 1], [0, 1]);
            const x = interpolate(progress, [0, 1], [-20, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: STRIPE.purple,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: inter.fontFamily,
                    fontSize: 20,
                    fontWeight: 500,
                    color: STRIPE.textSecondary,
                  }}
                >
                  {feat}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — mock dashboard */}
      <div
        style={{
          flex: "0 0 58%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 80,
        }}
      >
        <div
          style={{
            width: 560,
            background: STRIPE.white,
            borderRadius: 16,
            border: `1px solid ${STRIPE.border}`,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Dashboard header */}
          <div
            style={{
              padding: "20px 28px",
              borderBottom: `1px solid ${STRIPE.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: inter.fontFamily,
                fontSize: 15,
                fontWeight: 600,
                color: STRIPE.navy,
              }}
            >
              Billing
            </span>
            <span
              style={{
                fontFamily: inter.fontFamily,
                fontSize: 13,
                color: STRIPE.textMuted,
              }}
            >
              3 active subscriptions
            </span>
          </div>

          {/* Client rows */}
          {clients.map((client, i) => {
            const delay = 10 + i * 8;
            const rowProgress = spring({ frame, fps, delay, config: { damping: 200 } });
            const rowOpacity = interpolate(rowProgress, [0, 1], [0, 1]);

            // Green badge animates in after the row
            const badgeDelay = delay + 15;
            const badgeProgress = spring({ frame, fps, delay: badgeDelay, config: { damping: 14, stiffness: 120 } });
            const badgeScale = interpolate(badgeProgress, [0, 1], [0.5, 1]);
            const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  opacity: rowOpacity,
                  padding: "20px 28px",
                  borderBottom: i < clients.length - 1 ? `1px solid ${STRIPE.border}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span
                    style={{
                      fontFamily: inter.fontFamily,
                      fontSize: 15,
                      fontWeight: 600,
                      color: STRIPE.navy,
                    }}
                  >
                    {client.name}
                  </span>
                  <span
                    style={{
                      fontFamily: inter.fontFamily,
                      fontSize: 13,
                      color: STRIPE.textMuted,
                    }}
                  >
                    {client.retainer} · {client.amount}
                  </span>
                </div>
                <div
                  style={{
                    opacity: badgeOpacity,
                    transform: `scale(${badgeScale})`,
                    background: "#DCFCE7",
                    border: "1px solid #BBF7D0",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontFamily: inter.fontFamily,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 11 }}>✓</span> Paid
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
