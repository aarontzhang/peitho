import React from "react";

interface StripeLogoProps {
  color?: string;
  height?: number;
}

// Stripe wordmark SVG — the actual "stripe" logotype
export const StripeLogo: React.FC<StripeLogoProps> = ({
  color = "#FFFFFF",
  height = 40,
}) => {
  const aspectRatio = 282 / 117;
  const width = height * aspectRatio;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 282 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stripe wordmark paths */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.3 47.6c0-4.8 4-6.7 10.5-6.7 9.4 0 21.3 2.8 30.7 7.9V18.5c-10.3-4.1-20.4-5.7-30.7-5.7C17.5 12.8 0 25.8 0 49.2c0 36.3 49.9 30.5 49.9 46.2 0 5.7-5 7.5-11.9 7.5-10.3 0-23.5-4.2-34-9.9v31.2c11.6 5 23.3 7.1 34 7.1 26.2 0 44.2-13 44.2-35.3-.1-39.2-50.2-32.2-50.2-47.4h.3z"
        fill={color}
      />
      <path
        d="M117.9 2.1l-25.6 5.4V34h25.6V2.1z"
        fill={color}
      />
      <path
        d="M117.9 39.9H92.3v72.5h25.6V39.9z"
        fill={color}
      />
      <path
        d="M155.6 39.9l-1.6-7.2h-22.4v79.7h25.6V67.2c6-7.9 16.3-6.4 19.5-5.3V39.9c-3.3-1.2-15.5-3.5-21.1 0z"
        fill={color}
      />
      <path
        d="M202.3 8.3l-25 5.3-.1 72.8c0 13.4 10.1 23.3 23.5 23.3 7.4 0 12.9-1.4 15.9-3V84.8c-2.9 1.2-17.2 5.3-17.2-8V55.4h17.2V39.9h-17.2l.9-31.6z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M253.7 39.9c-17.7 0-29.5 14-29.5 36.3 0 23.9 13.1 35.4 31.9 35.4 9.2 0 16.1-2.1 21.3-5l-1.2-20c-4.7 2.4-10.1 3.9-17 3.9-6.7 0-12.7-2.4-13.4-10.5h33.8c.1-1 .3-5.1.3-7 0-24.1-11.6-33.1-26.2-33.1zm-3.8 29.1c0-7.8 4.8-11.1 9.3-11.1 4.4 0 8.9 3.3 8.9 11.1h-18.2z"
        fill={color}
      />
    </svg>
  );
};
