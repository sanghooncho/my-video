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
import { slide } from "@remotion/transitions/slide";

// Load fonts
const { fontFamily: notoSansKR } = loadNotoSansKR();

// Colors
const COLORS = {
  background: "#1a1a2e",
  backgroundGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  accent: "#4ECDC4",
  warning: "#FF6B6B",
  gold: "#FFD93D",
  white: "#FFFFFF",
  ctaGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

// Floating Particles
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
        const size = random(`size-${i}`) * 4 + 2;
        const speed = random(`speed-${i}`) * 0.5 + 0.2;
        const opacity = random(`opacity-${i}`) * 0.4 + 0.1;

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

// Scene 1: Hook - 충격적 오프닝
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 20대 → 30대 → 40대 전환 (0.8초씩 = 24프레임씩)
  const agePhase = Math.floor(frame / 24);
  const ages = ["20대", "30대", "40대"];
  const currentAge = ages[Math.min(agePhase, 2)];

  // 텍스트 흔들림 효과
  const shakeX = Math.sin(frame * 0.8) * 3;
  const shakeY = Math.cos(frame * 0.8) * 2;

  // 메인 텍스트 등장
  const textScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 심장박동 효과 (프레임 기반)
  const heartbeat = Math.sin(frame * 0.3) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.backgroundGradient,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 나이 전환 이미지 플레이스홀더 */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          width: "100%",
          height: "40%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${heartbeat})`,
        }}
      >
        <div
          style={{
            width: 600,
            height: 300,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 80,
              fontWeight: 700,
              color: agePhase >= 2 ? COLORS.warning : COLORS.white,
            }}
          >
            {currentAge}
          </div>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 24,
              color: "rgba(255,255,255,0.6)",
              marginTop: 10,
            }}
          >
            [눈썹 클로즈업 이미지]
          </div>
        </div>
      </div>

      {/* 메인 텍스트 */}
      <div
        style={{
          position: "absolute",
          top: "70%",
          transform: `scale(${textScale}) translate(${shakeX}px, ${shakeY}px)`,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.white,
            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
            lineHeight: 1.3,
          }}
        >
          30대 넘으면 눈썹이
          <br />
          <span style={{ color: COLORS.warning }}>이렇게</span> 됩니다
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: 문제 시각화
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 천천히 줌인
  const zoom = interpolate(frame, [0, 120], [1, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 문제점들 순차적 등장
  const problems = [
    { label: "눈썹 숱 감소", x: 200, y: 500, delay: 15 },
    { label: "눈썹 꼬리 소실", x: 700, y: 450, delay: 40 },
    { label: "색소 탈색", x: 450, y: 650, delay: 65 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.backgroundGradient,
      }}
    >
      {/* 이미지 플레이스홀더 */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${zoom})`,
          width: 700,
          height: 400,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          [40대 눈썹 클로즈업]
        </div>
      </div>

      {/* 문제점 표시 */}
      {problems.map((problem, i) => {
        const opacity = interpolate(
          frame,
          [problem.delay, problem.delay + 15],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const slideX = interpolate(
          frame,
          [problem.delay, problem.delay + 15],
          [-30, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        // 펄스 효과
        const pulse = 1 + Math.sin((frame - problem.delay) * 0.15) * 0.1;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: problem.x,
              top: problem.y,
              opacity,
              transform: `translateX(${slideX}px) scale(${frame > problem.delay ? pulse : 1})`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* 경고 원 */}
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: COLORS.warning,
                boxShadow: `0 0 15px ${COLORS.warning}`,
              }}
            />
            {/* 화살표 */}
            <div
              style={{
                width: 30,
                height: 2,
                backgroundColor: COLORS.warning,
              }}
            />
            {/* 텍스트 박스 */}
            <div
              style={{
                fontFamily: notoSansKR,
                fontSize: 28,
                fontWeight: 600,
                color: COLORS.warning,
                backgroundColor: "rgba(0,0,0,0.7)",
                padding: "10px 20px",
                borderRadius: 10,
              }}
            >
              {problem.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Scene 3: 해결책 제시 (Before → After)
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Split screen → After 전체 화면 전환
  const splitProgress = interpolate(frame, [0, 45], [50, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const afterReveal = interpolate(frame, [50, 90], [50, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // 텍스트 등장
  const text1Opacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Opacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 반짝 효과
  const sparkle = frame > 70 ? Math.sin((frame - 70) * 0.3) * 0.3 + 0.7 : 0;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.backgroundGradient,
      }}
    >
      {/* Before/After 컨테이너 */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: 800,
          height: 500,
          borderRadius: 20,
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Before */}
        <div
          style={{
            width: `${100 - afterReveal}%`,
            height: "100%",
            backgroundColor: "rgba(100,100,100,0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "4px solid white",
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            [Before 이미지]
          </div>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 20,
              color: COLORS.warning,
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            BEFORE
          </div>
        </div>

        {/* After */}
        <div
          style={{
            width: `${afterReveal}%`,
            height: "100%",
            backgroundColor: "rgba(78, 205, 196, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: sparkle > 0 ? `inset 0 0 50px rgba(255,255,255,${sparkle})` : "none",
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 24,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            [After 이미지]
          </div>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 20,
              color: COLORS.accent,
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            AFTER
          </div>
        </div>
      </div>

      {/* 텍스트 1 */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          width: "100%",
          textAlign: "center",
          opacity: text1Opacity,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 40,
            fontWeight: 700,
            color: COLORS.white,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          시술 전에 <span style={{ color: COLORS.accent }}>미리 확인</span>
        </div>
      </div>

      {/* 텍스트 2 */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          width: "100%",
          textAlign: "center",
          opacity: text2Opacity,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.accent,
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          ✨ 자연스러운 복원 ✨
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: 결과 강조
const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 줌 아웃 효과
  const zoom = interpolate(frame, [0, 90], [1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 텍스트 등장
  const textScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // 골드 반짝임
  const goldShimmer = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.backgroundGradient,
      }}
    >
      <FloatingParticles count={20} color={COLORS.gold} />

      {/* 이미지 플레이스홀더 */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${zoom})`,
          width: 600,
          height: 700,
          backgroundColor: "rgba(78, 205, 196, 0.15)",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: `3px solid ${COLORS.accent}`,
          boxShadow: `0 0 40px rgba(78, 205, 196, 0.3)`,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          [자신감 있는 표정의]
        </div>
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 28,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          [남성 상반신 이미지]
        </div>
      </div>

      {/* 메인 텍스트 */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          width: "100%",
          textAlign: "center",
          transform: `scale(${Math.max(0, textScale)})`,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 52,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${COLORS.gold} 0%, #FFA500 50%, ${COLORS.gold} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: `brightness(${goldShimmer})`,
          }}
        >
          10년 젊어 보이는 비결
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 버튼 펄스
  const buttonPulse = 1 + Math.sin(frame * 0.15) * 0.05;

  // 텍스트 등장
  const mainTextScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const subTextOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 손가락 바운스
  const handBounce = Math.sin(frame * 0.25) * 8;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.ctaGradient,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FloatingParticles count={25} color="rgba(255,255,255,0.3)" />

      {/* 로고 플레이스홀더 */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          fontFamily: notoSansKR,
          fontSize: 36,
          fontWeight: 700,
          color: COLORS.white,
          opacity: 0.9,
        }}
      >
        [PreView 로고]
      </div>

      {/* 메인 CTA 버튼 */}
      <div
        style={{
          transform: `scale(${mainTextScale * buttonPulse})`,
          marginTop: 50,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 42,
            fontWeight: 800,
            color: "#667eea",
            backgroundColor: COLORS.white,
            padding: "24px 50px",
            borderRadius: 50,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.3)",
          }}
        >
          무료 시뮬레이션 체험
        </div>
      </div>

      {/* 서브 텍스트 */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          opacity: subTextOpacity,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.white,
          }}
        >
          프로필 링크 클릭
        </div>
        <div
          style={{
            fontSize: 36,
            transform: `translateY(${handBounce}px)`,
          }}
        >
          👆
        </div>
      </div>

      {/* 계정 태그 */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          opacity: subTextOpacity,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 24,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          @previewapp.co.kr
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main Composition
// Total: 510 frames (17 seconds at 30fps)
// Transitions: 4 x 15 = 60 frames overlap
// Scene durations sum: 510 + 60 = 570 frames
export const MaleEyebrowAging: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* 배경음악 */}
      <Audio src={staticFile("bgm.mp3")} volume={0.3} />

      {/* TTS 나레이션 (Google Cloud TTS - ko-KR-Wavenet-C 남성 목소리) */}
      {/* tts1: "30대 넘으면 눈썹이 이렇게 됩니다" */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("tts1_google.mp3")} volume={1} />
      </Sequence>

      {/* tts2: "숱 감소, 꼬리 소실, 색소 탈색" */}
      <Sequence from={110} layout="none">
        <Audio src={staticFile("tts2_google.mp3")} volume={1} />
      </Sequence>

      {/* tts3: "시술 전에 미리 확인하세요" */}
      <Sequence from={230} layout="none">
        <Audio src={staticFile("tts3_google.mp3")} volume={1} />
      </Sequence>

      {/* tts4: "10년 젊어 보이는 비결" */}
      <Sequence from={330} layout="none">
        <Audio src={staticFile("tts4_google.mp3")} volume={1} />
      </Sequence>

      {/* tts5: "무료 시뮬레이션 체험하세요" */}
      <Sequence from={420} layout="none">
        <Audio src={staticFile("tts5_google.mp3")} volume={1} />
      </Sequence>

      <TransitionSeries>
        {/* Scene 1: Hook (0-3초) = 90 frames */}
        <TransitionSeries.Sequence durationInFrames={100}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: 문제 (3-7초) = 120 frames */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: 해결 (7-11초) = 120 frames */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <SolutionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 4: 결과 (11-14초) = 90 frames */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <ResultScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: CTA (14-17초) = 90 frames */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
