import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { STRIPE } from "../../lib/stripe-brand";
import { inter } from "../../lib/fonts";

const codeLines = [
  { text: "const session = await stripe", color: "#C4C8CC" },
  { text: "  .checkout.sessions.create({", color: "#C4C8CC" },
  { text: '    mode: "payment",', color: "#C4C8CC" },
  { text: "    line_items: [{ price, qty: 1 }],", color: "#C4C8CC" },
  { text: "  });", color: "#C4C8CC" },
];

export const Code: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label
  const labelProgress = spring({
    frame,
    fps,
    delay: 0,
    config: { damping: 200 },
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Code block fades in
  const blockProgress = spring({
    frame,
    fps,
    delay: 12,
    config: { damping: 200 },
  });
  const blockOpacity = interpolate(blockProgress, [0, 1], [0, 1]);
  const blockY = interpolate(blockProgress, [0, 1], [16, 0]);

  // Lines type in one by one
  const totalChars = codeLines.reduce((sum, l) => sum + l.text.length, 0);
  const typeStart = 20;
  const typeEnd = 75;
  const typingProgress = interpolate(frame, [typeStart, typeEnd], [0, totalChars], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let charsSoFar = 0;
  const renderedLines = codeLines.map((line) => {
    const lineStart = charsSoFar;
    charsSoFar += line.text.length;
    const visibleChars = Math.max(0, Math.min(line.text.length, typingProgress - lineStart));
    return line.text.slice(0, visibleChars);
  });

  // Cursor
  const cursorOn = typingProgress < totalChars || frame % 30 < 15;

  // Find which line the cursor is on
  let cursorLine = 0;
  let count = 0;
  for (let i = 0; i < codeLines.length; i++) {
    count += codeLines[i].text.length;
    if (typingProgress <= count) {
      cursorLine = i;
      break;
    }
    if (i === codeLines.length - 1) cursorLine = i;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: STRIPE.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          fontFamily: inter.fontFamily,
          fontSize: 18,
          fontWeight: 500,
          color: STRIPE.purple,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        Start in minutes
      </div>

      {/* Code block — no fake editor chrome, just clean code */}
      <div
        style={{
          opacity: blockOpacity,
          transform: `translateY(${blockY}px)`,
          background: "#0D2F4F",
          borderRadius: 12,
          padding: "40px 48px",
          border: `1px solid #1A3A5C`,
          minWidth: 620,
        }}
      >
        <pre
          style={{
            fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: 18,
            lineHeight: 1.9,
            margin: 0,
            color: "#C4C8CC",
          }}
        >
          {renderedLines.map((line, i) => (
            <div key={i} style={{ minHeight: 34 }}>
              {colorize(line)}
              {i === cursorLine && cursorOn && (
                <span style={{ color: STRIPE.purple, fontWeight: 300 }}>|</span>
              )}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

function colorize(text: string): React.ReactNode {
  return text.split(/(["'][^"']*["']|const|await|stripe)/).map((part, i) => {
    if (part === "const" || part === "await") {
      return (
        <span key={i} style={{ color: "#B4A0FF" }}>
          {part}
        </span>
      );
    }
    if (part === "stripe") {
      return (
        <span key={i} style={{ color: STRIPE.purple }}>
          {part}
        </span>
      );
    }
    if (part.startsWith('"') || part.startsWith("'")) {
      return (
        <span key={i} style={{ color: STRIPE.gradientCyan }}>
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
