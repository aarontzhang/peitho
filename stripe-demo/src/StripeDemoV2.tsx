import React from "react";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Open } from "./scenes/v2/Open";
import { Headline } from "./scenes/v2/Headline";
import { Code } from "./scenes/v2/Code";
import { Stat } from "./scenes/v2/Stat";
import { Close } from "./scenes/v2/Close";

const TRANSITION = 15;

export const StripeDemoV2: React.FC = () => {
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: TRANSITION,
  });

  return (
    <TransitionSeries>
      {/* 1. Logo opens */}
      <TransitionSeries.Sequence durationInFrames={80}>
        <Open />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* 2. One headline */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <Headline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* 3. Code — start in minutes */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <Code />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* 4. One stat */}
      <TransitionSeries.Sequence durationInFrames={85}>
        <Stat />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      {/* 5. Logo + CTA close */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <Close />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
