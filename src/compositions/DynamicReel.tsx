import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import type { ReelSpec } from '../spec/types';
import { SceneRenderer } from '../scenes/SceneRenderer';

export const DynamicReel: React.FC<{ spec: ReelSpec }> = ({ spec }) => {
  const total = spec.scenes.reduce((acc, s) => acc + s.duration, 0);

  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {spec.scenes.map((scene) => {
        const start = cursor;
        cursor += scene.duration;
        return (
          <Sequence key={scene.id} from={start} durationInFrames={scene.duration}>
            <SceneRenderer spec={spec} scene={scene} start={start} />
          </Sequence>
        );
      })}
      {/* total frames: {total} */}
    </AbsoluteFill>
  );
};
