import React from "react";
import {
  TransitionSeries,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Hero } from "./scenes/Hero";
import { Problem } from "./scenes/Problem";
import { Solution } from "./scenes/Solution";
import { Features } from "./scenes/Features";
import { CTA } from "./scenes/CTA";

const TRANSITION_DURATION = 20;

export const StripeDemo: React.FC = () => {
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: TRANSITION_DURATION,
  });

  return (
    <TransitionSeries>
      {/* Scene 1: Hero - brand entrance */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <Hero />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />

      {/* Scene 2: Problem statement */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <Problem />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={timing}
      />

      {/* Scene 3: Solution with code */}
      <TransitionSeries.Sequence durationInFrames={115}>
        <Solution />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />

      {/* Scene 4: Features & stats */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <Features />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={timing}
      />

      {/* Scene 5: CTA */}
      <TransitionSeries.Sequence durationInFrames={110}>
        <CTA />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
