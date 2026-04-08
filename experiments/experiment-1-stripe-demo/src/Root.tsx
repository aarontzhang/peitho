import { Composition } from "remotion";
import { StripeDemo } from "./StripeDemo";
import { StripeDemoV2 } from "./StripeDemoV2";
import { StripeDemoV3 } from "./StripeDemoV3";
import { StripeDemoV4 } from "./StripeDemoV4";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="StripeDemo"
        component={StripeDemo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StripeDemoV2"
        component={StripeDemoV2}
        durationInFrames={405}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StripeDemoV3"
        component={StripeDemoV3}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StripeDemoV4"
        component={StripeDemoV4}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
