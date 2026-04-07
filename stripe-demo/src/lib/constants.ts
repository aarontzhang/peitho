// Stripe brand colors
export const COLORS = {
  stripePurple: "#635BFF",
  stripeBlue: "#0A2540",
  stripeCyan: "#00D4FF",
  stripeGreen: "#00D924",
  stripePink: "#FF6B6B",
  white: "#FFFFFF",
  gray100: "#F6F9FC",
  gray200: "#E3E8EE",
  gray400: "#8898AA",
  gray600: "#525F7F",
  gray900: "#1A1F36",
} as const;

// Gradient presets
export const GRADIENTS = {
  hero: `linear-gradient(135deg, ${COLORS.stripeBlue} 0%, #1B3A5C 50%, ${COLORS.stripePurple} 100%)`,
  purple: `linear-gradient(135deg, ${COLORS.stripePurple} 0%, #7A73FF 100%)`,
  dark: `linear-gradient(180deg, ${COLORS.stripeBlue} 0%, #0D2F4F 100%)`,
  cta: `linear-gradient(135deg, ${COLORS.stripePurple} 0%, ${COLORS.stripeCyan} 100%)`,
} as const;
