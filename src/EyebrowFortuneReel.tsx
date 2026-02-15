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
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// Load fonts
const { fontFamily: notoSansKR } = loadNotoSansKR();

// Color Palette (Based on prompt spec)
const COLORS = {
  // Primary
  background: "#0D0D0D",
  backgroundAlt: "#1A1A1A",

  // Accent
  danger: "#FF3B3B",
  warning: "#FFB800",
  success: "#00D26A",
  gold: "#FFD700",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textHighlight: "#FF6B6B",

  // Toss style
  blue: "#3182F6",
  blueLight: "#4A9DFF",
  gray800: "#333D4B",
  gray700: "#4E5968",
  gray500: "#8B95A1",
  gray400: "#B0B8C1",
  gray900: "#191F28",
};

// ============================================
// SVG Eyebrow Illustrations
// ============================================

// Broken Eyebrow (gap in middle)
const BrokenEyebrowSVG: React.FC<{ frame: number }> = ({ frame }) => {
  // Stroke animation
  const strokeProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Gap flash effect
  const gapFlash = interpolate(
    Math.sin(frame * 0.3),
    [-1, 1],
    [0.3, 1]
  );

  return (
    <svg width="600" height="120" viewBox="0 0 600 120">
      {/* Left part of eyebrow */}
      <path
        d="M 50 60 Q 100 40, 180 50 Q 220 55, 240 60"
        fill="none"
        stroke={COLORS.textPrimary}
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray="200"
        strokeDashoffset={200 * (1 - strokeProgress)}
      />
      {/* Gap indicator (red glow) */}
      <circle
        cx="280"
        cy="60"
        r="15"
        fill={COLORS.danger}
        opacity={gapFlash}
      />
      {/* Right part of eyebrow */}
      <path
        d="M 320 60 Q 360 55, 420 50 Q 500 40, 550 60"
        fill="none"
        stroke={COLORS.textPrimary}
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray="250"
        strokeDashoffset={250 * (1 - strokeProgress)}
      />
    </svg>
  );
};

// Drooping Eyebrow (tail drooping down)
const DroopingEyebrowSVG: React.FC<{ frame: number }> = ({ frame }) => {
  const strokeProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tail droop animation
  const droopAmount = interpolate(frame, [20, 40], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width="600" height="150" viewBox="0 0 600 150">
      <path
        d={`M 50 60 Q 150 35, 300 45 Q 450 50, 500 ${60 + droopAmount} Q 530 ${70 + droopAmount}, 550 ${80 + droopAmount}`}
        fill="none"
        stroke={COLORS.textPrimary}
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray="550"
        strokeDashoffset={550 * (1 - strokeProgress)}
      />
      {/* Droop indicator arrow */}
      <path
        d={`M 530 ${90 + droopAmount} L 550 ${110 + droopAmount} L 510 ${100 + droopAmount}`}
        fill={COLORS.danger}
        opacity={interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </svg>
  );
};

// Thin/Sparse Eyebrow (dotted appearance)
const ThinEyebrowSVG: React.FC<{ frame: number }> = ({ frame }) => {
  const dots = [
    { x: 80, delay: 0 },
    { x: 140, delay: 3 },
    { x: 200, delay: 6 },
    { x: 260, delay: 9 },
    { x: 320, delay: 12 },
    { x: 380, delay: 15 },
    { x: 440, delay: 18 },
    { x: 500, delay: 21 },
  ];

  return (
    <svg width="600" height="120" viewBox="0 0 600 120">
      {dots.map((dot, i) => {
        const opacity = interpolate(
          frame,
          [dot.delay, dot.delay + 10],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <circle
            key={i}
            cx={dot.x}
            cy={60}
            r="8"
            fill={COLORS.textPrimary}
            opacity={opacity * 0.6}
          />
        );
      })}
    </svg>
  );
};

// Premium Eyebrow (perfect shape with glow)
const PremiumEyebrowSVG: React.FC<{ frame: number }> = ({ frame }) => {
  const strokeProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Golden glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <svg width="600" height="120" viewBox="0 0 600 120">
      {/* Glow effect */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Perfect eyebrow shape */}
      <path
        d="M 50 65 Q 120 40, 250 45 Q 380 48, 480 52 Q 530 55, 550 58"
        fill="none"
        stroke={COLORS.gold}
        strokeWidth="18"
        strokeLinecap="round"
        strokeDasharray="550"
        strokeDashoffset={550 * (1 - strokeProgress)}
        filter="url(#glow)"
        opacity={0.5 + glowIntensity * 0.5}
      />
    </svg>
  );
};

// ============================================
// Sparkle Particles Component
// ============================================
const SparkleParticles: React.FC<{ count: number; color: string }> = ({
  count,
  color,
}) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = ((i * 137.5) % 100) / 100 * width;
        const startY = ((i * 89.3) % 100) / 100 * height;
        const size = ((i * 23.7) % 4) + 2;
        const speed = ((i * 17.9) % 0.5) + 0.3;
        const opacity = ((i * 31.1) % 0.4) + 0.2;

        const y = (startY - frame * speed * 2) % height;
        const adjustedY = y < 0 ? height + y : y;

        const twinkle = Math.sin(frame * 0.2 + i) * 0.5 + 0.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: adjustedY,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: opacity * twinkle,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

// ============================================
// SCENE 1: Hook (Frames 0-90)
// "이 눈썹, 재물운 최악입니다"
// ============================================
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background fade in
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Image scale with spring
  const imageScale = spring({
    frame,
    fps,
    config: { damping: 180, stiffness: 100 },
    from: 0.8,
    to: 1,
  });

  // Zoom effect
  const zoom = interpolate(frame, [10, 90], [1.0, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text typewriter effect for "이 눈썹,"
  const text1 = "이 눈썹,";
  const text1CharsVisible = Math.floor(
    interpolate(frame, [30, 50], [0, text1.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Text pop in with shake for "재물운 최악입니다"
  const text2Opacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Scale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  // Shake effect
  const shakeX = frame > 60 && frame < 90 ? Math.sin(frame * 0.8) * 5 : 0;
  const shakeY = frame > 60 && frame < 90 ? Math.cos(frame * 0.8) * 3 : 0;

  // Pointing finger slide in
  const fingerX = interpolate(frame, [25, 45], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const fingerOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: bgOpacity }}>
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 100%)`,
        }}
      />

      {/* Placeholder for physiognomy chart image */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${imageScale * zoom})`,
          width: 700,
          height: 450,
          backgroundColor: COLORS.backgroundAlt,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${COLORS.gray700}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Face silhouette with eyebrow focus */}
        <svg width="400" height="300" viewBox="0 0 400 300">
          {/* Simple face outline */}
          <ellipse cx="200" cy="180" rx="120" ry="150" fill="none" stroke={COLORS.gray500} strokeWidth="2" />
          {/* Eyebrows highlighted */}
          <path d="M 100 120 Q 140 100, 180 115" fill="none" stroke={COLORS.danger} strokeWidth="8" strokeLinecap="round" />
          <path d="M 220 115 Q 260 100, 300 120" fill="none" stroke={COLORS.danger} strokeWidth="8" strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="140" cy="145" rx="25" ry="15" fill="none" stroke={COLORS.gray500} strokeWidth="2" />
          <ellipse cx="260" cy="145" rx="25" ry="15" fill="none" stroke={COLORS.gray500} strokeWidth="2" />
        </svg>

        {/* Pointing finger overlay */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 100,
            fontSize: 60,
            transform: `translateX(${fingerX}px) rotate(-30deg)`,
            opacity: fingerOpacity,
          }}
        >
          👆
        </div>
      </div>

      {/* Main hook text */}
      <div
        style={{
          position: "absolute",
          bottom: 500,
          width: "100%",
          textAlign: "center",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Line 1: Typewriter */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 68,
            fontWeight: 900,
            color: COLORS.textPrimary,
            textShadow: `0 0 20px rgba(255, 59, 59, 0.5)`,
            marginBottom: 10,
          }}
        >
          {text1.slice(0, text1CharsVisible)}
        </div>

        {/* Line 2: Pop in */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 68,
            fontWeight: 900,
            color: COLORS.danger,
            textShadow: `0 0 30px rgba(255, 59, 59, 0.6)`,
            opacity: text2Opacity,
            transform: `scale(${Math.max(0, text2Scale)})`,
          }}
        >
          재물운 최악입니다
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2A: Broken Eyebrow (Frames 90-150)
// ============================================
const Scene2ABroken: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text slide in
  const textSlideX = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sub text fade in
  const subTextOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subTextScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 100%)`,
        }}
      />

      {/* Bad eyebrow card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Eyebrow illustration */}
        <div
          style={{
            background: "rgba(255, 59, 59, 0.1)",
            border: "2px solid rgba(255, 59, 59, 0.3)",
            borderRadius: 24,
            padding: "40px 60px",
          }}
        >
          <BrokenEyebrowSVG frame={frame} />
        </div>

        {/* Main text */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateX(${(1 - textSlideX) * -100}px)`,
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 52,
              fontWeight: 700,
              color: COLORS.textPrimary,
              textAlign: "center",
            }}
          >
            눈썹 중간이 <span style={{ color: COLORS.danger }}>끊겼다면</span>
          </div>
        </div>

        {/* Sub text with emoji */}
        <div
          style={{
            opacity: subTextOpacity,
            transform: `scale(${Math.max(0, subTextScale)})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: "rgba(255, 59, 59, 0.15)",
            padding: "20px 40px",
            borderRadius: 100,
          }}
        >
          <span style={{ fontSize: 40 }}>💸</span>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 40,
              fontWeight: 600,
              color: COLORS.textSecondary,
            }}
          >
            재물 손실, 건강 주의
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2B: Drooping Eyebrow (Frames 150-210)
// ============================================
const Scene2BDrooping: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text slide in from right
  const textSlideX = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sub text with downward motion
  const subTextOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subTextY = interpolate(frame, [25, 45], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 100%)`,
        }}
      />

      {/* Bad eyebrow card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Eyebrow illustration */}
        <div
          style={{
            background: "rgba(255, 59, 59, 0.1)",
            border: "2px solid rgba(255, 59, 59, 0.3)",
            borderRadius: 24,
            padding: "40px 60px",
          }}
        >
          <DroopingEyebrowSVG frame={frame} />
        </div>

        {/* Main text */}
        <div
          style={{
            opacity: textOpacity,
            transform: `translateX(${(1 - textSlideX) * 100}px)`,
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 52,
              fontWeight: 700,
              color: COLORS.textPrimary,
              textAlign: "center",
            }}
          >
            눈썹 꼬리가 <span style={{ color: COLORS.danger }}>처졌다면</span>
          </div>
        </div>

        {/* Sub text with emoji */}
        <div
          style={{
            opacity: subTextOpacity,
            transform: `translateY(${subTextY}px)`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: "rgba(255, 59, 59, 0.15)",
            padding: "20px 40px",
            borderRadius: 100,
          }}
        >
          <span style={{ fontSize: 40 }}>😢</span>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 40,
              fontWeight: 600,
              color: COLORS.textSecondary,
            }}
          >
            우울, 의지력 약함
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 2C: Thin Eyebrow (Frames 210-270)
// ============================================
const Scene2CThin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text fade in with scale
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textScale = interpolate(frame, [15, 35], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sub text fade in
  const subTextOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundAlt} 100%)`,
        }}
      />

      {/* Bad eyebrow card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Eyebrow illustration */}
        <div
          style={{
            background: "rgba(255, 59, 59, 0.1)",
            border: "2px solid rgba(255, 59, 59, 0.3)",
            borderRadius: 24,
            padding: "40px 60px",
          }}
        >
          <ThinEyebrowSVG frame={frame} />
        </div>

        {/* Main text */}
        <div
          style={{
            opacity: textOpacity,
            transform: `scale(${textScale})`,
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 52,
              fontWeight: 700,
              color: COLORS.textPrimary,
              textAlign: "center",
            }}
          >
            눈썹이 너무 <span style={{ color: COLORS.danger }}>얇다면</span>
          </div>
        </div>

        {/* Sub text with emoji */}
        <div
          style={{
            opacity: subTextOpacity,
            display: "flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: "rgba(255, 59, 59, 0.15)",
            padding: "20px 40px",
            borderRadius: 100,
          }}
        >
          <span style={{ fontSize: 40 }}>💔</span>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 40,
              fontWeight: 600,
              color: COLORS.textSecondary,
            }}
          >
            인복 부족, 고독
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 3: Plot Twist (Frames 270-330)
// "근데요... 바꾸면 되잖아요"
// ============================================
const Scene3PlotTwist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "근데요" pop in with overshoot
  const text1Scale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8, stiffness: 150, overshootClamping: false },
  });

  const text1Opacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "근데요" fade out
  const text1FadeOut = interpolate(frame, [35, 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "바꾸면 되잖아요" slide up
  const text2Y = interpolate(frame, [45, 60], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const text2Opacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.background,
        }}
      />

      {/* Sparkle particles (only after text2 appears) */}
      {frame > 45 && <SparkleParticles count={20} color={COLORS.gold} />}

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* "근데요" */}
        {frame < 50 && (
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.textPrimary,
              opacity: text1Opacity * text1FadeOut,
              transform: `scale(${Math.max(0, text1Scale)})`,
            }}
          >
            근데요
          </div>
        )}

        {/* "바꾸면 되잖아요" */}
        {frame >= 45 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: text2Opacity,
              transform: `translateY(${text2Y}px)`,
            }}
          >
            <div
              style={{
                fontFamily: notoSansKR,
                fontSize: 56,
                fontWeight: 800,
                color: COLORS.gold,
                textShadow: `0 0 30px rgba(255, 215, 0, 0.4)`,
              }}
            >
              바꾸면 되잖아요
            </div>
            <span style={{ fontSize: 50 }}>✨</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 4: Good Eyebrow (Frames 330-450)
// 관상학적 명품 눈썹
// ============================================
const Scene4GoodEyebrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient shift
  const goldTint = interpolate(frame, [0, 20], [0, 0.15], {
    extrapolateRight: "clamp",
  });

  // Title scale in
  const titleScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Checklist items stagger
  const checklistItems = [
    { text: "눈썹 머리→꼬리 자연스럽게", delay: 40 },
    { text: "눈보다 살짝 긴 꼬리", delay: 55 },
    { text: "적당한 숱과 농도", delay: 70 },
  ];

  return (
    <AbsoluteFill>
      {/* Background with gold tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.background} 0%, rgba(26, 26, 46, 1) 100%)`,
        }}
      />

      {/* Gold overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 30%, rgba(255, 215, 0, ${goldTint}) 0%, transparent 60%)`,
        }}
      />

      <SparkleParticles count={15} color={COLORS.gold} />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 250,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `scale(${Math.max(0, titleScale)})`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 44 }}>✨</span>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 56,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, #FFA500 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            관상학적 명품 눈썹
          </div>
          <span style={{ fontSize: 44 }}>✨</span>
        </div>
      </div>

      {/* Premium eyebrow illustration */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, 0)",
          background: `linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)`,
          border: `2px solid rgba(255, 215, 0, 0.3)`,
          borderRadius: 24,
          padding: "50px 70px",
        }}
      >
        <PremiumEyebrowSVG frame={frame - 20} />
      </div>

      {/* Checklist */}
      <div
        style={{
          position: "absolute",
          bottom: 500,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {checklistItems.map((item, i) => {
          const itemOpacity = interpolate(
            frame,
            [item.delay, item.delay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const itemSlide = interpolate(
            frame,
            [item.delay, item.delay + 20],
            [-30, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          const checkScale = spring({
            frame: frame - item.delay - 5,
            fps,
            config: { damping: 10, stiffness: 150 },
          });

          const checkRotation = interpolate(
            frame,
            [item.delay + 5, item.delay + 20],
            [-45, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateX(${itemSlide}px)`,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: COLORS.success,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${Math.max(0, checkScale)}) rotate(${checkRotation}deg)`,
                }}
              >
                <span
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
              </div>
              <div
                style={{
                  fontFamily: notoSansKR,
                  fontSize: 36,
                  fontWeight: 500,
                  color: COLORS.textPrimary,
                }}
              >
                {item.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// SCENE 5: CTA (Frames 450-540)
// ============================================
const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline word-by-word fade
  const words = ["관상", "바꾸는", "가장", "쉬운", "방법"];

  // CTA button scale
  const buttonScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Button pulse
  const buttonPulse = 1 + Math.sin(frame * 0.15) * 0.03;

  // Button glow
  const buttonGlow = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.3, 0.6]);

  // Finger bounce
  const fingerBounce = Math.sin(frame * 0.2) * 10;

  // Profile link slide up
  const profileOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo fade in
  const logoOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Dark gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.gray900} 0%, #0a0a0a 100%)`,
        }}
      />

      {/* Grid pattern */}
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
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${COLORS.gold}20 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        {/* Headline - word by word */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px 16px",
            padding: "0 60px",
          }}
        >
          {words.map((word, i) => {
            const wordOpacity = interpolate(
              frame,
              [5 + i * 5, 15 + i * 5],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  fontFamily: notoSansKR,
                  fontSize: 52,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  opacity: wordOpacity,
                }}
              >
                {word}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
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
              color: COLORS.gray900,
              background: `linear-gradient(135deg, ${COLORS.gold} 0%, #FFA500 100%)`,
              padding: "24px 48px",
              borderRadius: 20,
              border: "3px solid white",
              boxShadow: `0 0 ${30 * buttonGlow}px rgba(255, 215, 0, ${buttonGlow})`,
            }}
          >
            시술 전 무료 시뮬레이션
          </div>
        </div>

        {/* Finger + Profile link */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: profileOpacity,
          }}
        >
          <div
            style={{
              fontSize: 48,
              transform: `translateY(${fingerBounce}px)`,
            }}
          >
            👆
          </div>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 32,
              fontWeight: 500,
              color: COLORS.textSecondary,
            }}
          >
            프로필 링크
          </div>
        </div>
      </div>

      {/* Logo at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: logoOpacity,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            height: 80,
            objectFit: "contain",
            borderRadius: 16,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// MAIN COMPOSITION
// Total: 540 frames (18 seconds @ 30fps)
// ============================================
export const EyebrowFortuneReel: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background Music */}
      <Audio src={staticFile("bgm.mp3")} volume={0.2} />

      {/* TTS Narration - 7 segments for this video */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("fortune_tts1_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={90} layout="none">
        <Audio src={staticFile("fortune_tts2_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={150} layout="none">
        <Audio src={staticFile("fortune_tts3_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={210} layout="none">
        <Audio src={staticFile("fortune_tts4_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={270} layout="none">
        <Audio src={staticFile("fortune_tts5_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={330} layout="none">
        <Audio src={staticFile("fortune_tts6_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={450} layout="none">
        <Audio src={staticFile("fortune_tts7_ko.mp3")} volume={1} />
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

        {/* Scene 2A: Broken Eyebrow (90-150 frames / 3-5 seconds) */}
        <TransitionSeries.Sequence durationInFrames={70}>
          <Scene2ABroken />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 2B: Drooping Eyebrow (150-210 frames / 5-7 seconds) */}
        <TransitionSeries.Sequence durationInFrames={70}>
          <Scene2BDrooping />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 2C: Thin Eyebrow (210-270 frames / 7-9 seconds) */}
        <TransitionSeries.Sequence durationInFrames={70}>
          <Scene2CThin />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 3: Plot Twist (270-330 frames / 9-11 seconds) */}
        <TransitionSeries.Sequence durationInFrames={70}>
          <Scene3PlotTwist />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 4: Good Eyebrow (330-450 frames / 11-15 seconds) */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene4GoodEyebrow />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* Scene 5: CTA (450-540 frames / 15-18 seconds) */}
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
