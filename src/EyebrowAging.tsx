import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  random,
  spring,
} from "remotion";
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

// Load fonts
const { fontFamily: notoSansKR } = loadNotoSansKR();

// Colors
const COLORS = {
  background: "#FDF8F5",
  backgroundEnd: "#F5EBE0",
  accent: "#C4A484",
  text: "#2D2D2D",
  highlight: "#E8D5C4",
  cta: "#8B6914",
  white: "#FFFFFF",
};

// Floating Particles Component
const FloatingParticles: React.FC<{ count: number; color: string }> = ({
  count,
  color,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`x-${i}`) * 100;
        const startY = random(`y-${i}`) * height;
        const size = random(`size-${i}`) * 6 + 2;
        const speed = random(`speed-${i}`) * 0.5 + 0.3;
        const opacity = random(`opacity-${i}`) * 0.5 + 0.2;

        const y = (startY - frame * speed) % height;
        const adjustedY = y < 0 ? height + y : y;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: adjustedY,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Scene 1: Hook
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textScale = spring({
    frame,
    fps,
    config: { damping: 180 },
  });

  const arrowOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowBounce = Math.sin(frame * 0.3) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.backgroundEnd} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles count={30} color={COLORS.accent} />

      <div
        style={{
          transform: `scale(${interpolate(textScale, [0, 1], [0.8, 1])})`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 72,
            fontWeight: 700,
            color: COLORS.text,
            textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            lineHeight: 1.2,
          }}
        >
          30대 이후, 눈썹에
          <br />
          <span style={{ color: COLORS.accent }}>이런 변화</span>가 생깁니다
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 200,
          opacity: arrowOpacity,
          transform: `translateY(${arrowBounce}px)`,
        }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill={COLORS.accent}>
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Before
const BeforeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const imageScale = interpolate(frame, [0, 120], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const indicators = [
    { label: "듬성듬성", x: 300, y: 700 },
    { label: "비대칭", x: 540, y: 650 },
    { label: "옅어짐", x: 780, y: 700 },
  ];

  // Typewriter effect
  const fullText = "점점 얇아지고 빈약해지는 눈썹";
  const charsToShow = Math.floor(frame / 2);
  const displayText = fullText.slice(0, charsToShow);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* BEFORE Label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          opacity: labelOpacity,
          backgroundColor: "rgba(0,0,0,0.1)",
          padding: "12px 24px",
          borderRadius: 20,
          fontFamily: notoSansKR,
          fontSize: 24,
          fontWeight: 500,
          color: COLORS.text,
        }}
      >
        BEFORE
      </div>

      {/* Image Placeholder */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${imageScale})`,
          width: 800,
          height: 600,
          backgroundColor: COLORS.highlight,
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 32,
            color: COLORS.text,
            opacity: 0.5,
          }}
        >
[눈썹 클로즈업 이미지]
        </div>

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)",
          }}
        />
      </div>

      {/* Animated Indicators */}
      {indicators.map((indicator, i) => {
        const delay = i * 10;
        const circleOpacity = interpolate(frame, [30 + delay, 45 + delay], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const circleScale = spring({
          frame: frame - 30 - delay,
          fps,
          config: { damping: 12 },
        });
        const labelOpacityAnim = interpolate(
          frame,
          [45 + delay, 60 + delay],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        const pulse = 1 + Math.sin(frame * 0.15) * 0.1;

        return (
          <div key={i} style={{ position: "absolute", left: indicator.x, top: indicator.y }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `3px solid ${COLORS.accent}`,
                backgroundColor: "rgba(196, 164, 132, 0.3)",
                opacity: circleOpacity,
                transform: `scale(${circleScale * pulse})`,
              }}
            />
            <div
              style={{
                marginTop: 10,
                fontFamily: notoSansKR,
                fontSize: 20,
                color: COLORS.accent,
                fontWeight: 500,
                opacity: labelOpacityAnim,
                textAlign: "center",
              }}
            >
              {indicator.label}
            </div>
          </div>
        );
      })}

      {/* Bottom Text - Typewriter */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "100%",
          textAlign: "center",
          fontFamily: notoSansKR,
          fontSize: 36,
          color: COLORS.text,
          fontWeight: 500,
        }}
      >
        {displayText}
        <span
          style={{
            opacity: frame % 30 < 15 ? 1 : 0,
            marginLeft: 2,
          }}
        >
          |
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Treatment
const TreatmentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fillProgress = interpolate(frame, [0, durationInFrames - 30], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const titleOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleX = interpolate(frame, [10, 30], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const icons = [
    { label: "정밀함", icon: "🎯", frame: 20 },
    { label: "자연스러움", icon: "✨", frame: 40 },
    { label: "오래 지속", icon: "⏰", frame: 60 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient Sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, transparent ${fillProgress - 20}%, ${COLORS.highlight}40 ${fillProgress}%, transparent ${fillProgress + 20}%)`,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          마이크로블레이딩 시술
        </div>
      </div>

      {/* Eyebrow Progress Fill */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 120,
        }}
      >
        {/* Eyebrow outline */}
        <svg viewBox="0 0 700 120" width="700" height="120">
          <defs>
            <clipPath id="eyebrowClip">
              <path d="M50 80 Q150 20 350 30 Q550 40 650 70 Q600 90 350 85 Q100 80 50 80Z" />
            </clipPath>
          </defs>
          {/* Background */}
          <path
            d="M50 80 Q150 20 350 30 Q550 40 650 70 Q600 90 350 85 Q100 80 50 80Z"
            fill={COLORS.highlight}
            stroke={COLORS.accent}
            strokeWidth="3"
          />
          {/* Fill Progress */}
          <rect
            x="0"
            y="0"
            width={`${fillProgress}%`}
            height="120"
            fill={COLORS.accent}
            clipPath="url(#eyebrowClip)"
          />
        </svg>
      </div>

      {/* Icons */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 80,
        }}
      >
        {icons.map((item, i) => {
          const iconScale = spring({
            frame: frame - item.frame,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                transform: `scale(${Math.max(0, iconScale)})`,
              }}
            >
              <div style={{ fontSize: 60 }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: notoSansKR,
                  fontSize: 24,
                  color: COLORS.text,
                  marginTop: 10,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Circle */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          right: 100,
          width: 120,
          height: 120,
        }}
      >
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={COLORS.highlight}
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth="8"
            strokeDasharray={`${fillProgress * 3.14} 314`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: notoSansKR,
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          {Math.round(fillProgress)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: After Reveal
const AfterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const confettiOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Sparkles
  const sparkles = Array.from({ length: 5 }).map((_, i) => ({
    x: 300 + random(`sparkle-x-${i}`) * 480,
    y: 600 + random(`sparkle-y-${i}`) * 200,
    delay: i * 8,
  }));

  // Stats
  const stats = [
    { text: "12-18개월 유지", delay: 45 },
    { text: "100% 자연스러운 결과", delay: 60 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Confetti */}
      <div style={{ opacity: confettiOpacity }}>
        {Array.from({ length: 50 }).map((_, i) => {
          const x = random(`confetti-x-${i}`) * 100;
          const startY = -20 - random(`confetti-start-${i}`) * 100;
          const speed = random(`confetti-speed-${i}`) * 3 + 2;
          const rotation = random(`confetti-rot-${i}`) * 360;
          const color = [COLORS.accent, COLORS.cta, COLORS.highlight][
            Math.floor(random(`confetti-color-${i}`) * 3)
          ];

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: startY + frame * speed,
                width: 10,
                height: 10,
                backgroundColor: color,
                transform: `rotate(${rotation + frame * 5}deg)`,
                borderRadius: random(`confetti-round-${i}`) > 0.5 ? "50%" : 0,
              }}
            />
          );
        })}
      </div>

      {/* AFTER Label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 60,
          backgroundColor: COLORS.accent,
          padding: "12px 24px",
          borderRadius: 20,
          fontFamily: notoSansKR,
          fontSize: 24,
          fontWeight: 500,
          color: COLORS.white,
        }}
      >
        AFTER
      </div>

      {/* Image */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(revealScale, [0, 1], [0.9, 1])})`,
          width: 800,
          height: 600,
          backgroundColor: COLORS.highlight,
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 32,
            color: COLORS.text,
            opacity: 0.5,
          }}
        >
          [시술 후 이미지]
        </div>

        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Sparkles */}
      {sparkles.map((sparkle, i) => {
        const sparkleOpacity =
          Math.sin((frame - sparkle.delay) * 0.2) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sparkle.x,
              top: sparkle.y,
              fontSize: 30,
              opacity: frame > sparkle.delay ? sparkleOpacity : 0,
            }}
          >
            ✨
          </div>
        );
      })}

      {/* Main Text */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          width: "100%",
          textAlign: "center",
          transform: `scale(${Math.max(0, textScale)})`,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          자연스럽고 풍성한 눈썹
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        {stats.map((stat, i) => {
          const slideX = interpolate(
            frame,
            [stat.delay, stat.delay + 20],
            [i === 0 ? -100 : 100, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );
          const statOpacity = interpolate(
            frame,
            [stat.delay, stat.delay + 20],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <div
              key={i}
              style={{
                fontFamily: notoSansKR,
                fontSize: 24,
                color: COLORS.accent,
                fontWeight: 500,
                opacity: statOpacity,
                transform: `translateX(${slideX}px)`,
                backgroundColor: COLORS.white,
                padding: "12px 24px",
                borderRadius: 30,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              {stat.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainTextScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const secondaryOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonPulse = 1 + Math.sin(frame * 0.1) * 0.03;
  const handBounce = Math.sin(frame * 0.2) * 5;

  const logoOpacity = interpolate(frame, [10, 25], [0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.cta} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Floating Particles */}
      <FloatingParticles count={20} color="rgba(255,255,255,0.3)" />

      {/* Main CTA Text */}
      <div
        style={{
          transform: `scale(${interpolate(mainTextScale, [0, 1], [0.5, 1])})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.white,
            marginBottom: 30,
            textShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          무료 상담
          <br />
          예약하세요
        </div>
      </div>

      {/* Secondary Text */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          opacity: secondaryOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 32,
            color: COLORS.white,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          프로필 링크 클릭
          <span style={{ transform: `translateY(${handBounce}px)` }}>👆</span>
        </div>
      </div>

      {/* Button */}
      <div
        style={{
          position: "absolute",
          top: "68%",
          transform: `scale(${buttonPulse})`,
          opacity: secondaryOpacity,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.cta,
            backgroundColor: COLORS.white,
            padding: "20px 60px",
            borderRadius: 50,
            boxShadow: `0 0 30px rgba(255,255,255,0.5), 0 10px 40px rgba(0,0,0,0.2)`,
          }}
        >
          지금 예약하기
        </div>
      </div>

      {/* Logo Placeholder */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: 60,
          opacity: logoOpacity,
          fontFamily: notoSansKR,
          fontSize: 24,
          color: COLORS.white,
          fontStyle: "italic",
        }}
      >
[로고]
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
// Total: 450 frames (15 seconds at 30fps)
// Transitions overlap: 20+20+15+15 = 70 frames
// Scene durations must sum to: 450 + 70 = 520 frames
export const EyebrowAging: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <BeforeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <TreatmentScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={100}>
          <AfterScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
