import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  random,
  spring,
  Img,
  staticFile,
  Audio,
  Sequence,
} from "remotion";
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// Load fonts
const { fontFamily: notoSansKR } = loadNotoSansKR();

// Toss Design System Colors
const COLORS = {
  // Primary
  blue: "#3182F6",
  blueLight: "#4A9DFF",

  // Semantic
  red: "#F04452",
  green: "#30B979",
  orange: "#F59F00",

  // Grayscale
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F2F4F6",
  gray200: "#E5E8EB",
  gray300: "#D1D6DB",
  gray400: "#B0B8C1",
  gray500: "#8B95A1",
  gray600: "#6B7684",
  gray700: "#4E5968",
  gray800: "#333D4B",
  gray900: "#191F28",
  black: "#000000",

  // Backgrounds
  backgroundPrimary: "#FFFFFF",
  backgroundSecondary: "#F9FAFB",
  backgroundDark: "#191F28",

  // For compatibility
  warning: "#F04452",
  solution: "#30B979",
  premium: "#3182F6",
  overlay: "rgba(0,0,0,0.4)",
};

// ============================================
// Toss-style Subtle Gradient Background
// ============================================
const TossBackground: React.FC<{ variant?: "light" | "dark" | "blue" }> = ({
  variant = "light",
}) => {
  const backgrounds = {
    light: `linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.gray50} 100%)`,
    dark: `linear-gradient(180deg, ${COLORS.gray900} 0%, ${COLORS.black} 100%)`,
    blue: `linear-gradient(180deg, ${COLORS.blue} 0%, #1A5DC8 100%)`,
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: backgrounds[variant],
      }}
    />
  );
};

// ============================================
// SCENE 1: Hook (Frames 0-90)
// Rapid age progression with shock factor
// ============================================
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Image sequence: 20s → 30s only (40s is shown in Scene 2)
  const currentImage = frame < 50 ? "eyebrow-20s.png" : "eyebrow-30s.png";

  // Subtle zoom on each image
  const imagePhase = frame < 50 ? 0 : 1;
  const phaseFrame = frame < 50 ? frame : frame - 50;
  const zoom = interpolate(phaseFrame, [0, 50], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  // Flash effect disabled
  const flashOpacity = 0;

  // Text shake effect
  const shakeX = Math.sin(frame * 0.8) * 3;
  const shakeY = Math.cos(frame * 0.8) * 2;

  // Text fade in
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
      {/* Full screen image */}
      <Img
        src={staticFile(currentImage)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Hook text - Safe Zone: top 250px */}
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
            fontFamily: notoSansKR,
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.white,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            padding: "0 48px",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          30대 넘으면 눈썹이
          <br />
          <span style={{ color: "#FF6B6B" }}>이렇게</span> 됩니다
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2: Problem Visualization (Frames 90-210)
// Self-assessment trigger with callouts
// ============================================
const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom in
  const zoom = interpolate(frame, [0, 120], [1.0, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Callouts with staggered entry - positioned on eyebrow area
  const callouts = [
    { text: "눈썹 숱 감소", delay: 15, x: 550, y: 480 },
    { text: "눈썹 꼬리 소실", delay: 45, x: 580, y: 580 },
    { text: "색소 탈색", delay: 75, x: 520, y: 680 },
  ];

  return (
    <AbsoluteFill>
      {/* Full screen image */}
      <Img
        src={staticFile("eyebrow-40s-problem.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Callout boxes - Toss style chips */}
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
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Toss-style chip */}
            <div
              style={{
                fontFamily: notoSansKR,
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.white,
                backgroundColor: COLORS.red,
                padding: "16px 28px",
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
// Before/After crossfade transition
// ============================================
const Scene3Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Before shows first, then After fades in
  // 0-50: Before only
  // 50-70: Crossfade
  // 70+: After only
  const afterOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Zoom effect
  const zoom = interpolate(frame, [0, 130], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  // Text animations
  const text1Opacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Scale = spring({
    frame: frame - 75,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Label animations
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
      {/* Before image (base layer) */}
      <Img
        src={staticFile("before.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      {/* After image (fades in on top) */}
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

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Top text - Safe Zone: top 250px */}
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
            fontFamily: notoSansKR,
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          시술 전에 미리 확인
        </div>
      </div>

      {/* BEFORE label - Safe Zone: bottom 440px */}
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
            fontFamily: notoSansKR,
            fontSize: 40,
            fontWeight: 700,
            color: COLORS.white,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "18px 44px",
            borderRadius: 100,
          }}
        >
          BEFORE
        </div>
      </div>

      {/* AFTER label - Safe Zone: bottom 440px */}
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
            fontFamily: notoSansKR,
            fontSize: 40,
            fontWeight: 700,
            color: COLORS.white,
            backgroundColor: COLORS.blue,
            padding: "18px 44px",
            borderRadius: 100,
          }}
        >
          AFTER
        </div>
      </div>

      {/* Bottom text - Safe Zone: bottom 440px */}
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
              fontFamily: notoSansKR,
              fontSize: 52,
              fontWeight: 700,
              color: COLORS.white,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 30px rgba(0,0,0,0.7)",
            }}
          >
            자연스러운 복원
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 4: Result Impact (Frames 330-420)
// Transformation impact with confident image
// ============================================
const Scene4Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom out
  const zoom = interpolate(frame, [0, 90], [1.1, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Text animation
  const textScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      {/* Full screen confident image */}
      <Img
        src={staticFile("after-confident.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 0%, transparent 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Main text - Safe Zone: bottom 440px */}
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
            fontFamily: notoSansKR,
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 30px rgba(0,0,0,0.7)",
          }}
        >
          <span style={{ color: "#60A5FA" }}>10년</span> 젊어 보이는 비결
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 5: CTA (Frames 420-510)
// Call to action with pulsing button
// ============================================
const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Button pulse effect
  const buttonPulse = 1 + Math.sin(frame * 0.2) * 0.05;

  // Button scale animation
  const buttonScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Sub-text fade in
  const subTextOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Handle bounce
  const handBounce = Math.sin(frame * 0.25) * 8;

  // Handle tag fade in
  const handleOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Gradient background - shadcn style */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.gray900} 0%, #0a0a0a 100%)`,
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${COLORS.gray800} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.3,
        }}
      />

      {/* Glow effect */}
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

      {/* Content container */}
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
        {/* Logo */}
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

        {/* Main headline */}
        <div
          style={{
            opacity: subTextOpacity,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 60,
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            지금 바로
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueLight} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              무료 체험
            </span>
            해보세요
          </div>
        </div>

        {/* CTA Button - shadcn style */}
        <div
          style={{
            transform: `scale(${Math.max(0, buttonScale) * buttonPulse})`,
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 42,
              fontWeight: 700,
              color: COLORS.white,
              background: `linear-gradient(135deg, ${COLORS.blue} 0%, #2563eb 100%)`,
              padding: "28px 56px",
              borderRadius: 16,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px ${COLORS.blue}50`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            무료 시뮬레이션 시작
            <span style={{ fontSize: 38 }}>→</span>
          </div>
        </div>

        {/* Sub-text */}
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
              fontFamily: notoSansKR,
              fontSize: 32,
              fontWeight: 500,
              color: COLORS.gray400,
            }}
          >
            프로필 링크 클릭
          </div>
          <div
            style={{
              fontSize: 32,
              transform: `translateY(${handBounce}px)`,
            }}
          >
            👆
          </div>
        </div>
      </div>

      {/* Bottom handle tag */}
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
            fontFamily: notoSansKR,
            fontSize: 28,
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
          @previewapp.co.kr
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// Total: 510 frames (17 seconds @ 30fps)
// ============================================
export const EyebrowAgingReel: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background Music */}
      <Audio src={staticFile("bgm.mp3")} volume={0.25} />

      {/* TTS Narration */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("tts1_google.mp3")} volume={1} />
      </Sequence>
      <Sequence from={90} layout="none">
        <Audio src={staticFile("tts2_google.mp3")} volume={1} />
      </Sequence>
      <Sequence from={210} layout="none">
        <Audio src={staticFile("tts3_google.mp3")} volume={1} />
      </Sequence>
      <Sequence from={330} layout="none">
        <Audio src={staticFile("tts4_google.mp3")} volume={1} />
      </Sequence>
      <Sequence from={420} layout="none">
        <Audio src={staticFile("tts5_google.mp3")} volume={1} />
      </Sequence>

      {/* Scene Transitions */}
      <TransitionSeries>
        {/* Scene 1: Hook (0-90 frames / 0-3 seconds) */}
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 2: Problem (90-210 frames / 3-7 seconds) */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene2Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 3: Solution (210-330 frames / 7-11 seconds) */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene3Solution />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 4: Result (330-420 frames / 11-14 seconds) */}
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene4Result />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 5: CTA (420-510 frames / 14-17 seconds) */}
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
