import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { LAtoNY } from "./LAtoNY";
import { EyebrowAging } from "./EyebrowAging";
import { MaleEyebrowAging } from "./MaleEyebrowAging";
import { EyebrowAgingReel } from "./EyebrowAgingReel";
import { EyebrowAgingReelEN } from "./EyebrowAgingReelEN";
import { MomSimulation } from "./MomSimulation";
import { MomSimulationEN } from "./MomSimulationEN";
import { EyebrowFortuneReel } from "./EyebrowFortuneReel";
import { PreviewPromo } from "./PreviewPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LAtoNY"
        component={LAtoNY}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EyebrowAging"
        component={EyebrowAging}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MaleEyebrowAging"
        component={MaleEyebrowAging}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EyebrowAgingReel"
        component={EyebrowAgingReel}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EyebrowAgingReelEN"
        component={EyebrowAgingReelEN}
        durationInFrames={510}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MomSimulation"
        component={MomSimulation}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MomSimulationEN"
        component={MomSimulationEN}
        durationInFrames={660}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="EyebrowFortuneReel"
        component={EyebrowFortuneReel}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PreviewPromo"
        component={PreviewPromo}
        durationInFrames={570}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
