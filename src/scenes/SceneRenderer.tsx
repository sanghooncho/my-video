import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import type { ReelSpec, SceneSpec } from '../spec/types';
import { fadeIn, kenBurnsScale, shake as shakeFn } from '../effects/motion';

const overlayStyle = (overlay?: SceneSpec['background'] extends infer B
  ? B extends { overlay?: infer O }
    ? O
    : never
  : never) => {
  switch (overlay) {
    case 'gradientBottom':
      return {
        background:
          'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
      } as const;
    case 'gradientTopBottom':
      return {
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)',
      } as const;
    default:
      return null;
  }
};

const SafeCaptionBlock: React.FC<{
  spec: ReelSpec;
  scene: SceneSpec;
  sceneStart: number;
  sceneEnd: number;
}> = ({ spec, scene, sceneStart, sceneEnd }) => {
  const frame = useCurrentFrame();
  const safe = spec.captions.safe;

  // Convert to local scene frame for predictable animation
  const local = frame - sceneStart;
  const opacity = fadeIn(local, 3, Math.min(12, scene.duration / 4));

  const align = spec.captions.align;
  const justifyContent = align === 'bottom' ? 'flex-end' : 'center';

  return (
    <AbsoluteFill
      style={{
        position: 'absolute',
        left: safe.leftRight,
        right: safe.leftRight,
        top: safe.top,
        bottom: safe.bottom,
        display: 'flex',
        justifyContent,
        alignItems: 'center',
        textAlign: 'center',
        opacity,
        paddingBottom: align === 'bottom' ? 40 : 0,
      }}
    >
      <div style={{ maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
        {scene.text?.title ? (
          <div
            style={{
              fontSize: spec.captions.font.title,
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.08,
              textShadow: '0 8px 24px rgba(0,0,0,0.45)',
              whiteSpace: 'pre-line',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {scene.text.title}
          </div>
        ) : null}
        {scene.text?.body ? (
          <div
            style={{
              marginTop: 18,
              fontSize: spec.captions.font.body,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.25,
              textShadow: '0 8px 24px rgba(0,0,0,0.45)',
              whiteSpace: 'pre-line',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {scene.text.body}
          </div>
        ) : null}
        {scene.kind === 'cta' && scene.text?.ctaButton ? (
          <div
            style={{
              marginTop: 26,
              display: 'inline-block',
              padding: '18px 28px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.16)',
              border: '2px solid rgba(255,255,255,0.28)',
              fontSize: 40,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {scene.text.ctaButton}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const SceneRenderer: React.FC<{ spec: ReelSpec; scene: SceneSpec; start: number }> = ({
  spec,
  scene,
  start,
}) => {
  const frame = useCurrentFrame();
  const end = start + scene.duration;

  const bg = scene.background;
  const fit = bg?.fit ?? 'cover';

  const wantsKenBurns = scene.effects?.includes('kenburns');
  const wantsShake = scene.effects?.includes('shake');

  const scale = wantsKenBurns ? kenBurnsScale(frame, start, end) : 1;
  const shake = wantsShake ? shakeFn(frame, 10) : { x: 0, y: 0 };

  return (
    <AbsoluteFill>
      {/* Background */}
      {bg?.type === 'image' && bg.src ? (
        <AbsoluteFill
          style={{
            transform: `translate(${shake.x}px, ${shake.y}px) scale(${scale})`,
          }}
        >
          <Img
            src={staticFile(bg.src)}
            style={{ width: '100%', height: '100%', objectFit: fit }}
          />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ backgroundColor: bg?.color ?? '#000' }} />
      )}

      {/* Overlay */}
      {overlayStyle(bg?.overlay) ? <AbsoluteFill style={overlayStyle(bg?.overlay)!} /> : null}

      {/* Captions */}
      <SafeCaptionBlock spec={spec} scene={scene} sceneStart={start} sceneEnd={end} />

      {/* Optional VO */}
      {spec.voiceover?.tracks?.map((t, idx) => (
        <Sequence key={idx} from={t.atFrame}>
          <Audio src={staticFile(t.src)} volume={t.volume ?? 1} />
        </Sequence>
      ))}

      {/* Optional BGM */}
      {spec.bgm?.src ? <Audio src={staticFile(spec.bgm.src)} volume={spec.bgm.volume} /> : null}
    </AbsoluteFill>
  );
};
