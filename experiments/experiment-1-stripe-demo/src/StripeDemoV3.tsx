import React from "react";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Hook } from "./scenes/v3/Hook";
import { Agitate } from "./scenes/v3/Agitate";
import { Solve } from "./scenes/v3/Solve";
import { Proof } from "./scenes/v3/Proof";
import { End } from "./scenes/v3/End";

const T = 10; // Snappy transitions

export const StripeDemoV3: React.FC = () => {
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: T,
  });

  // Total = sum(sequences) - sum(transitions) = 640 - 40 = 600 frames = 20s
  return (
    <TransitionSeries>
      {/* Hook: "Your clients pay late. Again." */}
      <TransitionSeries.Sequence durationInFrames={115}>
        <Hook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* Agitate: money out vs. chasing emails */}
      <TransitionSeries.Sequence durationInFrames={125}>
        <Agitate />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />

      {/* Solve: Stripe collects so you don't chase */}
      <TransitionSeries.Sequence durationInFrames={140}>
        <Solve />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* Proof: 30 → 2 days */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Proof />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* End: logo + CTA */}
      <TransitionSeries.Sequence durationInFrames={140}>
        <End />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
