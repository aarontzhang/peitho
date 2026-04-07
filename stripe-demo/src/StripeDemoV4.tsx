import React from "react";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { S1_Hook } from "./scenes/v4/S1_Hook";
import { S2_Agitate } from "./scenes/v4/S2_Agitate";
import { S3_Solve } from "./scenes/v4/S3_Solve";
import { S4_Autopilot } from "./scenes/v4/S4_Autopilot";
import { S5_Global } from "./scenes/v4/S5_Global";
import { S6_Proof } from "./scenes/v4/S6_Proof";
import { S7_Scale } from "./scenes/v4/S7_Scale";
import { S8_End } from "./scenes/v4/S8_End";

const T = 8; // Very snappy transitions

export const StripeDemoV4: React.FC = () => {
  const timing = springTiming({
    config: { damping: 200 },
    durationInFrames: T,
  });

  // 8 scenes, 7 transitions of 8 frames = 56 overlap
  // Sum of sequences = 600 + 56 = 656
  // ~82 frames per scene avg = ~2.7s each
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={78}>
        <S1_Hook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={82}>
        <S2_Agitate />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={85}>
        <S3_Solve />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={78}>
        <S4_Autopilot />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={78}>
        <S5_Global />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={80}>
        <S6_Proof />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={78}>
        <S7_Scale />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={97}>
        <S8_End />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
