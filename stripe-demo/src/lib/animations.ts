import { spring, interpolate } from "remotion";

interface FadeInProps {
  frame: number;
  fps: number;
  delay?: number;
}

export function fadeInUp({ frame, fps, delay = 0 }: FadeInProps) {
  const progress = spring({ frame, fps, delay, config: { damping: 200 } });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
  };
}

export function fadeInScale({ frame, fps, delay = 0 }: FadeInProps) {
  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 120 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
  };
}

export function slideInLeft({ frame, fps, delay = 0 }: FadeInProps) {
  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 20, stiffness: 180 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateX(${interpolate(progress, [0, 1], [-80, 0])}px)`,
  };
}

export function slideInRight({ frame, fps, delay = 0 }: FadeInProps) {
  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 20, stiffness: 180 },
  });
  return {
    opacity: interpolate(progress, [0, 1], [0, 1]),
    transform: `translateX(${interpolate(progress, [0, 1], [80, 0])}px)`,
  };
}

export function countUp(
  frame: number,
  fps: number,
  target: number,
  delay: number = 0,
  duration: number = 2
) {
  const progress = interpolate(frame - delay, [0, duration * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(progress * target);
}

export function staggerDelay(index: number, baseDelay: number = 6): number {
  return index * baseDelay;
}
