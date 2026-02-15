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
import { DynamicReel } from "./compositions/DynamicReel";
import type { ReelSpec } from "./spec/types";

export const RemotionRoot: React.FC = () => {
  const sampleSpec: ReelSpec = {
    version: 1,
    title: 'B2B | No-show reduction',
    lang: 'ko',
    fps: 30,
    width: 1080,
    height: 1920,
    captions: {
      safe: { leftRight: 80, top: 250, bottom: 400 },
      align: 'center',
      font: { title: 74, body: 44 },
    },
    bgm: { src: 'bgm.mp3', volume: 0.12 },
    scenes: [
      {
        id: 's1',
        kind: 'hook',
        duration: 90,
        background: {
          type: 'image',
          src: 'preview_worried_woman.png',
          fit: 'cover',
          overlay: 'gradientTopBottom',
        },
        text: { title: '예약 잡고도\n노쇼 나면\n멘탈 나가죠' },
        effects: ['kenburns'],
      },
      {
        id: 's2',
        kind: 'problem',
        duration: 120,
        background: {
          type: 'image',
          src: 'preview_worried_woman.png',
          fit: 'cover',
          overlay: 'gradientTopBottom',
        },
        text: { title: '문제는 확정이 아니라\n불안', body: '고객은 직전까지 흔들려요' },
        effects: ['kenburns'],
      },
      {
        id: 's3',
        kind: 'solution',
        duration: 150,
        background: {
          type: 'image',
          src: 'promo_before_woman.png',
          fit: 'cover',
          overlay: 'gradientBottom',
        },
        text: { title: '30초 안에 보내야 할 3가지', body: '시간/장소\n주의사항\n변경 링크' },
      },
      {
        id: 's4',
        kind: 'cta',
        duration: 120,
        background: {
          type: 'image',
          src: 'promo_after_woman.png',
          fit: 'cover',
          overlay: 'gradientBottom',
        },
        text: { title: '노쇼 줄이고\n상담만 하세요', ctaButton: '프로필 링크 →' },
        effects: ['glow'],
      },
    ],
  };

  const dynamicDuration = sampleSpec.scenes.reduce((acc, s) => acc + s.duration, 0);

  return (
    <>
      <Composition
        id="DynamicReelSample"
        component={() => <DynamicReel spec={sampleSpec} />}
        durationInFrames={dynamicDuration}
        fps={30}
        width={1080}
        height={1920}
      />

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
