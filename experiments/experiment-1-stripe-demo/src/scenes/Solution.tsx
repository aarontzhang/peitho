import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, GRADIENTS } from "../lib/constants";
import { sora, inter } from "../lib/fonts";
import { fadeInUp, slideInRight } from "../lib/animations";

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Code block typing animation
  const codeLines = [
    'const stripe = require("stripe")(key);',
    "",
    "const session = await stripe",
    "  .checkout.sessions.create({",
    '    mode: "payment",',
    "    line_items: [{ price, quantity: 1 }],",
    '    success_url: "https://...",',
    "  });",
  ];

  const totalChars = codeLines.join("\n").length;
  const typingProgress = interpolate(frame, [20, 80], [0, totalChars], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let charCount = 0;
  const visibleLines = codeLines.map((line) => {
    const lineStart = charCount;
    charCount += line.length + 1;
    const visible = Math.max(
      0,
      Math.min(line.length, typingProgress - lineStart)
    );
    return line.slice(0, visible);
  });

  // Cursor blink
  const cursorOpacity =
    typingProgress >= totalChars ? (frame % 30 < 15 ? 1 : 0) : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: GRADIENTS.dark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        padding: "0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.stripePurple}15 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(100px)",
        }}
      />

      {/* Left: text */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <div
          style={{
            ...fadeInUp({ frame, fps, delay: 0 }),
            fontFamily: inter.fontFamily,
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.stripeCyan,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 16,
          }}
        >
          The Solution
        </div>
        <div
          style={{
            ...fadeInUp({ frame, fps, delay: 5 }),
            fontFamily: sora.fontFamily,
            fontSize: 52,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          7 lines of code.
          <br />
          <span style={{ color: COLORS.stripePurple }}>Infinite scale.</span>
        </div>
        <div
          style={{
            ...fadeInUp({ frame, fps, delay: 10 }),
            fontFamily: inter.fontFamily,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.gray400,
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          Go live with a complete checkout experience in minutes — not months.
          Stripe handles the complexity so you can focus on your product.
        </div>
      </div>

      {/* Right: code editor */}
      <div
        style={{
          ...slideInRight({ frame, fps, delay: 8 }),
          flex: 1,
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "#1B2332",
            borderRadius: 16,
            padding: 0,
            border: `1px solid ${COLORS.gray600}30`,
            overflow: "hidden",
          }}
        >
          {/* Editor title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 20px",
              background: "#151D2B",
              borderBottom: `1px solid ${COLORS.gray600}20`,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#FF5F57",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#FEBC2E",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#28C840",
              }}
            />
            <span
              style={{
                fontFamily: inter.fontFamily,
                fontSize: 13,
                color: COLORS.gray400,
                marginLeft: 12,
              }}
            >
              checkout.js
            </span>
          </div>

          {/* Code content */}
          <div style={{ padding: "24px 28px", minHeight: 240 }}>
            <pre
              style={{
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: 16,
                lineHeight: 1.8,
                color: COLORS.gray200,
                margin: 0,
              }}
            >
              {visibleLines.map((line, i) => (
                <div key={i}>
                  <span style={{ color: COLORS.gray600, marginRight: 24 }}>
                    {i + 1}
                  </span>
                  <span>
                    {colorizeLine(line)}
                    {i ===
                      visibleLines.findIndex(
                        (_, idx) =>
                          visibleLines
                            .slice(0, idx + 1)
                            .join("")
                            .length >= typingProgress
                      ) && (
                      <span
                        style={{
                          opacity: cursorOpacity,
                          color: COLORS.stripeCyan,
                        }}
                      >
                        ▎
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

function colorizeLine(line: string): React.ReactNode {
  return line
    .split(/(["'][^"']*["']|const|await|require)/)
    .map((part, i) => {
      if (part === "const" || part === "await" || part === "require") {
        return (
          <span key={i} style={{ color: "#C792EA" }}>
            {part}
          </span>
        );
      }
      if (part.startsWith('"') || part.startsWith("'")) {
        return (
          <span key={i} style={{ color: "#C3E88D" }}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
}
