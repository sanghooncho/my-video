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

// 폰트 로드
const { fontFamily: notoSansKR } = loadNotoSansKR();

// 디자인 시스템 컬러 팔레트
const COLORS = {
  background: "#000000",
  backgroundDark: "#1A1A2E",
  mainPink: "#F8C8DC",
  accentPink: "#FF4081",
  warningRed: "#FF3B30",
  white: "#FFFFFF",
  gray: "#B0B0B0",
  green: "#30B979",
};

// Safe Zone 상수
const SAFE_ZONE = {
  top: 250,
  bottom: 440,
  left: 35,
  right: 120,
};

// ============================================
// 공통 컴포넌트: 스파클 파티클
// ============================================
const SparkleParticles: React.FC<{
  count: number;
  color?: string;
}> = ({ count, color = "rgba(255,255,255,0.6)" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`sparkle-x-${i}`) * width;
        const y = random(`sparkle-y-${i}`) * height;
        const size = random(`sparkle-size-${i}`) * 8 + 4; // 크기 2배
        const delay = random(`sparkle-delay-${i}`) * 30;
        const duration = 40;

        const opacity = interpolate(
          (frame + delay) % duration,
          [0, duration * 0.3, duration * 0.7, duration],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

// ============================================
// 공통 컴포넌트: 돈 이모지 파티클
// ============================================
const MoneyParticles: React.FC<{ count: number }> = ({ count }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const startX = random(`money-x-${i}`) * width;
        const startY = random(`money-y-${i}`) * height * 0.8 + height * 0.1;
        const delay = i * 5;
        const floatSpeed = random(`money-speed-${i}`) * 0.5 + 0.3;
        const swayAmount = random(`money-sway-${i}`) * 30 + 10;

        const progress = Math.max(0, frame - delay);
        const y = startY - progress * floatSpeed;
        const x = startX + Math.sin(progress * 0.1) * swayAmount;

        const opacity = interpolate(
          progress,
          [0, 15, 40, 55],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: 72, // 40 → 72 (기획서 기준)
              opacity,
              transform: `rotate(${Math.sin(progress * 0.15) * 15}deg)`,
            }}
          >
            💸
          </div>
        );
      })}
    </>
  );
};

// ============================================
// Scene 1: Hook (0-2초 / 프레임 0-60)
// ============================================
const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "10만원" 텍스트 Spring 바운스
  const mainTextScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, mass: 1, stiffness: 150 },
  });

  const mainTextY = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, mass: 1, stiffness: 150 },
  });

  // "받아가세요" 텍스트 페이드 인
  const subTextOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subTextY = interpolate(frame, [15, 35], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 스파클 배경 */}
      <SparkleParticles count={30} color="rgba(248, 200, 220, 0.4)" />

      {/* 돈 이모지 파티클 */}
      <MoneyParticles count={10} />

      {/* 메인 텍스트 컨테이너 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* "10만원" 메인 텍스트 - 기획서: 80pt */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 120, // 80 → 120 (더 임팩트있게)
            fontWeight: 800,
            color: COLORS.accentPink,
            textShadow: `0 0 40px rgba(255,64,129,0.6), 0 0 80px rgba(255,64,129,0.4)`,
            transform: `scale(${Math.max(0, mainTextScale)}) translateY(${interpolate(mainTextY, [0, 1], [50, 0])}px)`,
            opacity: Math.max(0, mainTextScale),
          }}
        >
          10만원
        </div>

        {/* "받아가세요" 서브 텍스트 - 기획서: 48pt */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 64, // 48 → 64
            fontWeight: 600,
            color: COLORS.white,
            opacity: subTextOpacity,
            transform: `translateY(${subTextY}px)`,
          }}
        >
          받아가세요
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 2: 문제 제기 (2-5초 / 프레임 60-150)
// ============================================
const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 타이핑 효과
  const text1 = "눈썹 반영구";
  const text2 = "하고 싶은데...";
  const typingSpeed = 2;
  const visibleChars1 = Math.min(
    Math.floor((frame - 15) / typingSpeed),
    text1.length
  );
  const visibleChars2 = Math.min(
    Math.floor((frame - 15 - text1.length * typingSpeed) / typingSpeed),
    text2.length
  );

  // 하단 텍스트 페이드 인
  const bottomTextOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomTextY = interpolate(frame, [45, 65], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* 배경 이미지 */}
      <Img
        src={staticFile("preview_worried_woman.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 어두운 비네팅 오버레이 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* 상단 + 하단 그라디언트 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* 상단 텍스트 (타이핑 효과) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.top,
          width: "100%",
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 56, // 44 → 56 (기획서 기준)
            fontWeight: 600,
            color: COLORS.white,
            lineHeight: 1.4,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "20px 32px",
            borderRadius: 16,
            display: "inline-block",
          }}
        >
          {visibleChars1 > 0 && text1.slice(0, visibleChars1)}
          {visibleChars2 > 0 && (
            <>
              <br />
              {text2.slice(0, visibleChars2)}
            </>
          )}
          <span
            style={{
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
              color: COLORS.accentPink,
            }}
          >
            |
          </span>
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.bottom + 50,
          width: "100%",
          textAlign: "center",
          opacity: bottomTextOpacity,
          transform: `translateY(${bottomTextY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 52, // 40 → 52
            fontWeight: 600,
            color: COLORS.mainPink,
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          비용이 부담돼서
          <br />
          미뤘다면?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 3A: 미리보기 해결책 - 전체화면 Before/After
// 인스타 릴스 가이드: 전체화면 이미지 + 그라디언트 오버레이
// ============================================
const Scene3ASolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Before/After 슬라이더 애니메이션 (전체화면)
  const sliderPosition = interpolate(
    frame,
    [15, 50, 60, 85],
    [70, 30, 30, 70],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // 텍스트 페이드
  const textOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 줌 효과
  const zoom = interpolate(frame, [0, 90], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Before 이미지 (전체화면 배경) */}
      <Img
        src={staticFile("promo_before_woman.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
      />

      {/* After 이미지 (클립으로 일부만 표시) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: `${100 - sliderPosition}%`,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("promo_after_woman.png")}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 1080,
            height: 1920,
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* 슬라이더 라인 */}
      <div
        style={{
          position: "absolute",
          left: `${sliderPosition}%`,
          top: 0,
          bottom: 0,
          width: 8,
          backgroundColor: COLORS.white,
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        {/* 슬라이더 핸들 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 70,
            height: 70,
            borderRadius: "50%",
            backgroundColor: COLORS.white,
            boxShadow: "0 4px 25px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          ↔
        </div>
      </div>

      {/* 상단 + 하단 그라디언트 오버레이 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.6) 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* BEFORE 라벨 (좌상단) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.top,
          left: 60,
          fontFamily: notoSansKR,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.white,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: "18px 36px",
          borderRadius: 20,
          zIndex: 20,
          opacity: textOpacity,
        }}
      >
        BEFORE
      </div>

      {/* AFTER 라벨 (우상단) */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.top,
          right: 60,
          fontFamily: notoSansKR,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.white,
          backgroundColor: COLORS.accentPink,
          padding: "18px 36px",
          borderRadius: 20,
          zIndex: 20,
          opacity: textOpacity,
        }}
      >
        AFTER
      </div>

      {/* 하단 텍스트 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.bottom + 50,
          width: "100%",
          textAlign: "center",
          opacity: textOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 60,
            fontWeight: 700,
            color: COLORS.white,
            textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          }}
        >
          미리 보고 예약하면
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 3B: 혜택 강조 (7-10초 / 프레임 210-300)
// ============================================
const Scene3BBenefit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "시술비 최대" 페이드
  const text1Opacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "10만원" 바운스
  const mainTextScale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, mass: 1, stiffness: 200 },
  });

  // 글로우 펄스 (30프레임 주기)
  const glowIntensity = interpolate(
    Math.sin((frame * Math.PI * 2) / 30),
    [-1, 1],
    [0.5, 1]
  );

  // "지원!" 페이드
  const text3Opacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 배경 그라디언트 회전
  const gradientAngle = (frame * 0.5) % 360;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${COLORS.mainPink} 0%, #FFB6C1 50%, ${COLORS.mainPink} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 스파클 파티클 */}
      <SparkleParticles count={20} color="rgba(255,255,255,0.8)" />

      {/* 텍스트 컨테이너 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* "시술비 최대" - 기획서: 36pt */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 48, // 36 → 48
            fontWeight: 600,
            color: COLORS.white,
            opacity: text1Opacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          시술비 최대
        </div>

        {/* "10만원" 메인 - 기획서: 88pt */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 120, // 88 → 120 (더 임팩트있게)
            fontWeight: 800,
            color: COLORS.white,
            transform: `scale(${Math.max(0, mainTextScale)})`,
            textShadow: `0 0 ${50 * glowIntensity}px rgba(255,255,255,0.9), 0 0 ${100 * glowIntensity}px rgba(255,64,129,0.6)`,
          }}
        >
          10만원
        </div>

        {/* "지원!" - 기획서: 44pt */}
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 56, // 44 → 56
            fontWeight: 700,
            color: COLORS.accentPink,
            opacity: text3Opacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          지원!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 4: 조건 설명 - PreView 앱 참여 방법
// 인스타 릴스 가이드: 큰 텍스트 + 전체화면
// ============================================
const Scene4Conditions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 타이틀 페이드
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 체크 항목들 - PreView 시뮬레이션 사이트 흐름
  const items = [
    { text: "프리뷰 사이트에서 샵 예약", delay: 25, type: "check" as const },
    { text: "시술 완료 후 인증", delay: 50, type: "check" as const },
    { text: "샵 직접 연락 X", delay: 75, type: "warning" as const },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.backgroundDark} 0%, #0a0a1a 100%)`,
      }}
    >
      {/* 스파클 배경 */}
      <SparkleParticles count={15} color="rgba(248, 200, 220, 0.3)" />

      {/* 참여 방법 타이틀 */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.top,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 56,
            fontWeight: 800,
            color: COLORS.mainPink,
            backgroundColor: "rgba(248,200,220,0.15)",
            padding: "20px 48px",
            borderRadius: 30,
            display: "inline-block",
            border: `2px solid ${COLORS.mainPink}40`,
          }}
        >
          🎁 참여 방법
        </div>
      </div>

      {/* 체크리스트 */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {items.map((item, i) => {
          const slideProgress = interpolate(
            frame,
            [item.delay, item.delay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const translateX = interpolate(slideProgress, [0, 1], [-400, 0], {
            easing: Easing.out(Easing.cubic),
          });

          // 경고 항목 흔들림
          const shake =
            item.type === "warning" && frame > item.delay + 25
              ? Math.sin((frame - item.delay - 25) * 0.4) * 4
              : 0;

          // 체크 아이콘 팝
          const iconScale = spring({
            frame: frame - item.delay - 10,
            fps,
            config: { damping: 10, stiffness: 180 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: slideProgress,
                transform: `translateX(${translateX}px) rotate(${shake}deg)`,
                fontFamily: notoSansKR,
                fontSize: 56,
                fontWeight: 700,
                color: item.type === "warning" ? COLORS.warningRed : COLORS.white,
                backgroundColor:
                  item.type === "warning"
                    ? "rgba(255,59,48,0.25)"
                    : "rgba(255,255,255,0.1)",
                padding: "20px 36px",
                borderRadius: 20,
                border: item.type === "warning"
                  ? `2px solid ${COLORS.warningRed}60`
                  : "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* 아이콘 */}
              <span
                style={{
                  fontSize: 64,
                  transform: `scale(${Math.max(0, iconScale)})`,
                  display: "inline-block",
                }}
              >
                {item.type === "check" ? "✅" : "⚠️"}
              </span>
              {item.text}
            </div>
          );
        })}
      </div>

      {/* 하단 안내 텍스트 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.bottom + 50,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 36,
            fontWeight: 500,
            color: COLORS.gray,
          }}
        >
          조건 충족 시 최대 10만원 지원!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 5: CTA (13-15초 / 프레임 390-450)
// ============================================
const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 버튼 펄스 (15프레임 주기)
  const buttonPulse = 1 + Math.sin((frame * Math.PI * 2) / 15) * 0.05;

  // 버튼 글로우
  const glowIntensity = interpolate(
    Math.sin((frame * Math.PI * 2) / 15),
    [-1, 1],
    [0.4, 1]
  );

  // 버튼 스케일
  const buttonScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // 손가락 바운스 (20프레임 주기)
  const handBounce = Math.sin((frame * Math.PI * 2) / 20) * 20;

  // 긴급 텍스트 깜빡임 (20프레임 주기)
  const urgencyOpacity = interpolate(
    frame,
    [30, 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const urgencyBlink = interpolate(
    Math.sin((frame * Math.PI * 2) / 20),
    [-1, 1],
    [0.7, 1]
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.mainPink} 0%, #FFB6C1 50%, ${COLORS.accentPink} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 스파클 */}
      <SparkleParticles count={25} color="rgba(255,255,255,0.6)" />

      {/* 손가락 이모지 */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          fontSize: 100, // 60 → 100
          transform: `translateY(${handBounce}px)`,
        }}
      >
        👆
      </div>

      {/* CTA 버튼 - 기획서: 52pt */}
      <div
        style={{
          transform: `scale(${Math.max(0, buttonScale) * buttonPulse})`,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 64, // 52 → 64
            fontWeight: 800,
            color: COLORS.white,
            backgroundColor: COLORS.accentPink,
            padding: "28px 56px",
            borderRadius: 40,
            boxShadow: `0 12px ${40 * glowIntensity}px rgba(255,64,129,${0.5 * glowIntensity})`,
          }}
        >
          프로필 링크 클릭!
        </div>
      </div>

      {/* 긴급 텍스트 - 흰색 배경 + 어두운 텍스트로 가독성 확보 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.bottom + 100,
          opacity: urgencyOpacity * urgencyBlink,
        }}
      >
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: 40,
            fontWeight: 700,
            color: "#1a1a2e",
            backgroundColor: COLORS.white,
            padding: "16px 32px",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: 44 }}>⏰</span> 예산 소진 시 종료
        </div>
      </div>

      {/* 계정 태그 */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.bottom,
          fontFamily: notoSansKR,
          fontSize: 32, // 24 → 32
          color: "rgba(255,255,255,0.9)",
        }}
      >
        @previewapp.co.kr
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Main Composition
// TTS4가 330프레임에서 시작, 7.4초(222프레임) → 552프레임에 종료
// Scene5를 150프레임으로 늘려 영상이 TTS 종료 후 여유있게 끝나도록 함
// Scene1(90) + Scene2(105) + Scene3A(90) + Scene3B(90) + Scene4(120) + Scene5(150) = 645
// 전환 겹침: 15*5 = 75
// 실제 총: 645 - 75 = 570프레임 (19초)
// ============================================
export const PreviewPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* BGM */}
      <Audio src={staticFile("promo_bgm.mp3")} volume={0.3} />

      {/* TTS 나레이션 - 겹치지 않게 타이밍 조정 */}
      {/* TTS1: 1.5초 */}
      <Sequence from={5} layout="none">
        <Audio src={staticFile("promo_tts1.mp3")} volume={1} />
      </Sequence>
      {/* TTS2: 3.5초 (시작: 80, 끝: ~185) */}
      <Sequence from={80} layout="none">
        <Audio src={staticFile("promo_tts2.mp3")} volume={1} />
      </Sequence>
      {/* TTS3: 4.5초 (시작: 190, 끝: ~325) */}
      <Sequence from={190} layout="none">
        <Audio src={staticFile("promo_tts3.mp3")} volume={1} />
      </Sequence>
      {/* TTS4: 7.4초 - Scene4에서만 재생, TTS5 제거하고 TTS4가 CTA까지 커버 */}
      <Sequence from={330} layout="none">
        <Audio src={staticFile("promo_tts4.mp3")} volume={1} />
      </Sequence>

      {/* 씬 트랜지션 */}
      <TransitionSeries>
        {/* Scene 1: Hook - 3초 */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Problem - 3.5초 */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <Scene2Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3A: Solution Preview - 3초 */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <Scene3ASolution />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3B: Benefit - 3초 */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <Scene3BBenefit />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 4: Conditions - 4초 */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene4Conditions />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: CTA - 5초 (TTS4가 끝날 때까지 여유있게) */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene5CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
