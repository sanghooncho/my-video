import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
  Img,
  staticFile,
  Audio,
  Sequence,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// Load fonts - Inter for English (clean, modern)
const { fontFamily: inter } = loadInter();

// Color Palette
const COLORS = {
  blue: "#3182F6",
  blueLight: "#4A9DFF",
  red: "#F04452",
  green: "#30B979",
  white: "#FFFFFF",
  gray400: "#B0B8C1",
  gray500: "#8B95A1",
  gray700: "#4E5968",
  gray800: "#333D4B",
  gray900: "#191F28",
  black: "#000000",
};

// ============================================
// SCENE 1: Hook (Frames 0-90)
// "After 30, this happens to your brows"
// ============================================
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image sequence: 20s → 30s only
  const currentImage = frame < 50 ? "eyebrow-20s.png" : "eyebrow-30s.png";

  const phaseFrame = frame < 50 ? frame : frame - 50;
  const zoom = interpolate(phaseFrame, [0, 50], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const textScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(currentImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 250,
          width: "100%",
          textAlign: "center",
          opacity: textOpacity,
          transform: `scale(${textScale})`,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 68,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            padding: "0 48px",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          After 30, your brows
          <br />
          start <span style={{ color: "#FF6B6B" }}>fading</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2: Problem (Frames 90-210)
// Common aging signs
// ============================================
const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 120], [1.0, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Localized callouts for English audience
  const callouts = [
    { text: "Thinning", delay: 15, x: 580, y: 480 },
    { text: "Sparse Tails", delay: 45, x: 560, y: 580 },
    { text: "Fading Color", delay: 75, x: 540, y: 680 },
  ];

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("eyebrow-40s-problem.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {callouts.map((callout, i) => {
        const opacity = interpolate(
          frame,
          [callout.delay, callout.delay + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const slideY = interpolate(
          frame,
          [callout.delay, callout.delay + 20],
          [20, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: callout.x,
              top: callout.y,
              opacity,
              transform: `translateY(${slideY}px)`,
            }}
          >
            <div
              style={{
                fontFamily: inter,
                fontSize: 34,
                fontWeight: 700,
                color: COLORS.white,
                backgroundColor: COLORS.red,
                padding: "14px 28px",
                borderRadius: 100,
                boxShadow: "0 4px 20px rgba(240, 68, 82, 0.4)",
              }}
            >
              {callout.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 3: Solution (Frames 210-330)
// Preview before committing
// ============================================
const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const afterOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(frame, [0, 130], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  const text1Opacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Scale = spring({
    frame: frame - 75,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const beforeLabelOpacity = interpolate(frame, [50, 65], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const afterLabelOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("before.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      <Img
        src={staticFile("after.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          opacity: afterOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 250,
          width: "100%",
          textAlign: "center",
          opacity: text1Opacity,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 60,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          See it before you do it
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 500,
          width: "100%",
          textAlign: "center",
          opacity: beforeLabelOpacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: inter,
            fontSize: 38,
            fontWeight: 700,
            color: COLORS.white,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "16px 40px",
            borderRadius: 100,
          }}
        >
          BEFORE
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 500,
          width: "100%",
          textAlign: "center",
          opacity: afterLabelOpacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: inter,
            fontSize: 38,
            fontWeight: 700,
            color: COLORS.white,
            backgroundColor: COLORS.blue,
            padding: "16px 40px",
            borderRadius: 100,
          }}
        >
          AFTER
        </div>
      </div>

      {frame > 75 && (
        <div
          style={{
            position: "absolute",
            bottom: 580,
            width: "100%",
            textAlign: "center",
            transform: `scale(${Math.max(0, text2Scale)})`,
          }}
        >
          <div
            style={{
              fontFamily: inter,
              fontSize: 48,
              fontWeight: 700,
              color: COLORS.white,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 30px rgba(0,0,0,0.7)",
            }}
          >
            Natural-looking results
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 4: Result (Frames 330-420)
// The transformation impact
// ============================================
const Scene4Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 90], [1.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const textScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("after-confident.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 0%, transparent 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 500,
          width: "100%",
          textAlign: "center",
          transform: `scale(${Math.max(0, textScale)})`,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 60,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          Look <span style={{ color: "#60A5FA" }}>10 years</span> younger
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 5: CTA (Frames 420-510)
// Call to action
// ============================================
const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const buttonPulse = 1 + Math.sin(frame * 0.2) * 0.05;

  const buttonScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const subTextOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const handBounce = Math.sin(frame * 0.25) * 8;

  const handleOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.gray900} 0%, #0a0a0a 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${COLORS.gray800} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${COLORS.blue}20 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            transform: `scale(${logoScale})`,
            marginBottom: 30,
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{
              height: 180,
              objectFit: "contain",
              borderRadius: 36,
            }}
          />
        </div>

        <div
          style={{
            opacity: subTextOpacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: inter,
              fontSize: 56,
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            Try it{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueLight} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              free
            </span>
            <br />
            No commitment
          </div>
        </div>

        <div
          style={{
            transform: `scale(${Math.max(0, buttonScale) * buttonPulse})`,
          }}
        >
          <div
            style={{
              fontFamily: inter,
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.white,
              background: `linear-gradient(135deg, ${COLORS.blue} 0%, #2563eb 100%)`,
              padding: "26px 52px",
              borderRadius: 16,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px ${COLORS.blue}50`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            Start Free Preview
            <span style={{ fontSize: 36 }}>→</span>
          </div>
        </div>

        <div
          style={{
            opacity: subTextOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 20,
          }}
        >
          <div
            style={{
              fontFamily: inter,
              fontSize: 30,
              fontWeight: 500,
              color: COLORS.gray400,
            }}
          >
            Link in bio
          </div>
          <div
            style={{
              fontSize: 30,
              transform: `translateY(${handBounce}px)`,
            }}
          >
            👆
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          textAlign: "center",
          opacity: handleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontSize: 26,
            fontWeight: 500,
            color: COLORS.gray500,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 28px",
            backgroundColor: COLORS.gray800,
            borderRadius: 100,
            border: `1px solid ${COLORS.gray700}`,
          }}
        >
          @previewapp.global
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// Total: 510 frames (17 seconds @ 30fps)
// ============================================
export const EyebrowAgingReelEN: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background Music */}
      <Audio src={staticFile("bgm.mp3")} volume={0.25} />

      {/* TTS Narration - English versions */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("tts1_en.mp3")} volume={1} />
      </Sequence>
      <Sequence from={90} layout="none">
        <Audio src={staticFile("tts2_en.mp3")} volume={1} />
      </Sequence>
      <Sequence from={210} layout="none">
        <Audio src={staticFile("tts3_en.mp3")} volume={1} />
      </Sequence>
      <Sequence from={330} layout="none">
        <Audio src={staticFile("tts4_en.mp3")} volume={1} />
      </Sequence>
      <Sequence from={420} layout="none">
        <Audio src={staticFile("tts5_en.mp3")} volume={1} />
      </Sequence>

      {/* Scene Transitions */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene2Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene3Solution />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene4Result />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
