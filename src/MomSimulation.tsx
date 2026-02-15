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

const { fontFamily: notoSansKR } = loadNotoSansKR();

// 컬러 팔레트
const COLORS = {
  kakaoBackground: "#B2C7D9",
  chatBubbleSelf: "#FEE500",
  chatBubbleOther: "#FFFFFF",
  momAngry: "#E74C3C",
  darkNavy: "#1A1A2E",
  coralPink: "#FF6B6B",
  successGreen: "#2ECC71",
  textPrimary: "#333333",
  textSecondary: "#666666",
  white: "#FFFFFF",
  gray800: "#333D4B",
  gray900: "#191F28",
  blue: "#3182F6",
};

// Safe Zone
const SAFE_ZONE = {
  top: 250,
  bottom: 500,
};

// ============================================
// 카카오톡 채팅 컴포넌트
// ============================================
const ChatBubble: React.FC<{
  message: string;
  isSelf: boolean;
  isAngry?: boolean;
  delay?: number;
}> = ({ message, isSelf, isAngry, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const opacity = interpolate(frame - delay, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < delay) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isSelf ? "flex-end" : "flex-start",
        width: "100%",
        padding: "0 30px",
        marginBottom: 12,
        opacity,
        transform: `translateX(${isSelf ? (1 - slideIn) * 100 : (slideIn - 1) * 100}px)`,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "18px 24px",
          borderRadius: 20,
          backgroundColor: isSelf ? COLORS.chatBubbleSelf : COLORS.chatBubbleOther,
          fontFamily: notoSansKR,
          fontSize: 36,
          fontWeight: 500,
          color: isAngry ? COLORS.momAngry : COLORS.textPrimary,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {message}
      </div>
    </div>
  );
};

const TypingIndicator: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const dotFrame = (frame - delay) % 30;

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", padding: "0 30px", marginBottom: 12 }}>
      <div style={{ padding: "18px 24px", borderRadius: 20, backgroundColor: COLORS.chatBubbleOther, display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: COLORS.textSecondary,
              opacity: interpolate((dotFrame + i * 10) % 30, [0, 15, 30], [0.3, 1, 0.3]),
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// Scene 1: Hook - 카카오톡 (유지)
// ============================================
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.kakaoBackground }}>
      {/* 카카오톡 헤더 */}
      <div style={{ position: "absolute", top: 80, width: "100%", padding: "20px 30px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 48, color: COLORS.textPrimary }}>←</div>
        <div style={{ fontFamily: notoSansKR, fontSize: 42, fontWeight: 700, color: COLORS.textPrimary }}>엄마 👩</div>
      </div>

      {/* 상단 텍스트 */}
      <div style={{ position: "absolute", top: SAFE_ZONE.top, width: "100%", textAlign: "center", opacity: titleOpacity, transform: `scale(${titleScale})` }}>
        <div style={{ fontFamily: notoSansKR, fontSize: 64, fontWeight: 800, color: COLORS.white, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          엄마한테 눈썹문신
          <br />한다고 하면?
        </div>
      </div>

      {/* 채팅 */}
      <div style={{ position: "absolute", top: "50%", width: "100%" }}>
        <ChatBubble message="엄마 나 눈썹문신 하려고" isSelf={true} delay={15} />
        <TypingIndicator delay={50} />
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 2: Mom's Reaction - 카카오톡 (유지)
// ============================================
const MomReactionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const shakeX = frame > 80 ? Math.sin(frame * 2) * 5 : 0;

  const messages = [
    { text: "뭐??????", delay: 0, angry: false },
    { text: "미쳤어?", delay: 15, angry: false },
    { text: "그거 하면 평생이야", delay: 35, angry: true },
    { text: "지워지지도 않아", delay: 55, angry: true },
    { text: "당장 전화해", delay: 80, angry: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.kakaoBackground, transform: `translateX(${shakeX}px)` }}>
      <div style={{ position: "absolute", top: 80, width: "100%", padding: "20px 30px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 48, color: COLORS.textPrimary }}>←</div>
        <div style={{ fontFamily: notoSansKR, fontSize: 42, fontWeight: 700, color: COLORS.textPrimary }}>엄마 👩</div>
      </div>

      <div style={{ position: "absolute", top: 200, width: "100%" }}>
        <ChatBubble message="엄마 나 눈썹문신 하려고" isSelf={true} delay={-100} />
      </div>

      <div style={{ position: "absolute", top: 320, width: "100%" }}>
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg.text} isSelf={false} isAngry={msg.angry} delay={msg.delay} />
        ))}
      </div>

      <div style={{ position: "absolute", bottom: SAFE_ZONE.bottom, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: notoSansKR, fontSize: 48, fontWeight: 700, color: COLORS.white, textShadow: "0 4px 20px rgba(0,0,0,0.5)", backgroundColor: "rgba(0,0,0,0.5)", padding: "16px 32px", borderRadius: 16, display: "inline-block" }}>
          이런 반응 예상되죠? 😱
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 3: Transition - 인스타 스타일
// ============================================
const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const text1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const text2Opacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });

  const fullText = "시술 결과를 미리 보여줄 수 있다면?";
  const visibleChars = Math.floor(interpolate(frame, [25, 55], [0, fullText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.gray900} 0%, #0a0a0a 100%)`, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontFamily: notoSansKR, fontSize: 56, fontWeight: 600, color: COLORS.white, opacity: text1Opacity, marginBottom: 30 }}>
          근데 만약...
        </div>
        <div style={{ fontFamily: notoSansKR, fontSize: 52, fontWeight: 700, color: COLORS.coralPink, opacity: text2Opacity }}>
          {fullText.slice(0, visibleChars)}
          {visibleChars < fullText.length && <span style={{ opacity: frame % 15 < 8 ? 1 : 0, color: COLORS.white }}>|</span>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 4: Simulation Reveal - 인스타 릴스 스타일 (전체화면 이미지)
// ============================================
const SimulationRevealScene: React.FC = () => {
  const frame = useCurrentFrame();

  const revealProgress = interpolate(frame, [30, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const zoom = interpolate(frame, [0, 150], [1, 1.05], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const bottomTextOpacity = interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* 전체화면 Before 이미지 */}
      <Img
        src={staticFile("mom_before.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }}
      />

      {/* After 이미지 슬라이드 인 */}
      <div style={{ position: "absolute", width: `${revealProgress}%`, height: "100%", overflow: "hidden", right: 0 }}>
        <Img
          src={staticFile("mom_after.png")}
          style={{ width: 1080, height: "100%", objectFit: "cover", position: "absolute", right: 0 }}
        />
      </div>

      {/* 슬라이드 라인 */}
      <div style={{ position: "absolute", left: `${100 - revealProgress}%`, top: 0, bottom: 0, width: 4, backgroundColor: COLORS.white, boxShadow: "0 0 20px rgba(255,255,255,0.8)" }} />

      {/* 그라데이션 오버레이 */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)" }} />

      {/* BEFORE/AFTER 라벨 */}
      {revealProgress < 50 && (
        <div style={{ position: "absolute", top: SAFE_ZONE.top + 50, left: 60, fontFamily: notoSansKR, fontSize: 40, fontWeight: 700, color: COLORS.white, backgroundColor: "rgba(0,0,0,0.6)", padding: "14px 32px", borderRadius: 100 }}>
          BEFORE
        </div>
      )}
      {revealProgress > 50 && (
        <div style={{ position: "absolute", top: SAFE_ZONE.top + 50, right: 60, fontFamily: notoSansKR, fontSize: 40, fontWeight: 700, color: COLORS.white, backgroundColor: COLORS.coralPink, padding: "14px 32px", borderRadius: 100 }}>
          AFTER
        </div>
      )}

      {/* 상단 텍스트 */}
      <div style={{ position: "absolute", top: SAFE_ZONE.top, width: "100%", textAlign: "center", opacity: textOpacity }}>
        <div style={{ fontFamily: notoSansKR, fontSize: 56, fontWeight: 800, color: COLORS.white, textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>
          내 얼굴에 미리 적용해보고
        </div>
      </div>

      {/* 하단 텍스트 */}
      <div style={{ position: "absolute", bottom: SAFE_ZONE.bottom, width: "100%", textAlign: "center", opacity: bottomTextOpacity }}>
        <div style={{ fontFamily: notoSansKR, fontSize: 52, fontWeight: 700, color: COLORS.coralPink, textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>
          이 사진을 엄마한테 보내면? 📱
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 5: Reversal - 카카오톡 + 인스타 스타일 믹스
// ============================================
const ReversalScene: React.FC = () => {
  const frame = useCurrentFrame();

  const positiveMessages = [
    { text: "어?", delay: 30 },
    { text: "이쁜데?", delay: 50 },
    { text: "이거 한거야?", delay: 75 },
    { text: "자연스럽네", delay: 100 },
  ];

  const punchlineOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punchlineScale = interpolate(frame, [90, 110, 115], [0.8, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.kakaoBackground }}>
      <div style={{ position: "absolute", top: 80, width: "100%", padding: "20px 30px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ fontSize: 48, color: COLORS.textPrimary }}>←</div>
        <div style={{ fontFamily: notoSansKR, fontSize: 42, fontWeight: 700, color: COLORS.textPrimary }}>엄마 👩</div>
      </div>

      {/* 딸이 사진 전송 */}
      <div style={{ position: "absolute", top: 200, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 30px", marginBottom: 12 }}>
          <div style={{ width: 200, height: 280, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
            <Img src={staticFile("mom_after.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <ChatBubble message="이거 어때?" isSelf={true} delay={10} />
      </div>

      {/* 타이핑 */}
      <div style={{ position: "absolute", top: 560, width: "100%" }}>
        {frame >= 15 && frame < 30 && <TypingIndicator delay={0} />}
      </div>

      {/* 긍정 반응 */}
      <div style={{ position: "absolute", top: 560, width: "100%" }}>
        {positiveMessages.map((msg, i) => (
          <ChatBubble key={i} message={msg.text} isSelf={false} delay={msg.delay} />
        ))}
      </div>

      {/* 펀치라인 */}
      <div style={{ position: "absolute", bottom: SAFE_ZONE.bottom, width: "100%", textAlign: "center", opacity: punchlineOpacity, transform: `scale(${punchlineScale})` }}>
        <div style={{ display: "inline-block", backgroundColor: "rgba(0,0,0,0.85)", padding: "24px 48px", borderRadius: 24 }}>
          <div style={{ fontFamily: notoSansKR, fontSize: 48, fontWeight: 800, color: COLORS.white }}>
            아직 안 했어요 😏
          </div>
          <div style={{ fontFamily: notoSansKR, fontSize: 36, fontWeight: 600, color: COLORS.successGreen, marginTop: 12 }}>
            시뮬레이션이에요 ㅎㅎ
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 6: CTA - 인스타 릴스 스타일 (다크 테마)
// ============================================
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const headlineOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });
  const buttonScale = spring({ frame: frame - 35, fps, config: { damping: 12, stiffness: 100 } });
  const buttonPulse = 1 + Math.sin(frame * 0.15) * 0.03;
  const subTextOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* 다크 배경 */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #191F28 0%, #0a0a0a 100%)" }} />

      {/* 그리드 패턴 */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#333D4B 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.3 }} />

      {/* Glow 효과 */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: "radial-gradient(circle, #3182F620 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* 로고 */}
      <div style={{ position: "absolute", top: SAFE_ZONE.top + 30, width: "100%", display: "flex", justifyContent: "center", transform: `scale(${logoScale})` }}>
        <Img src={staticFile("logo.png")} style={{ height: 140, borderRadius: 28 }} />
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
        {/* 헤드라인 */}
        <div style={{ textAlign: "center", opacity: headlineOpacity, marginTop: 80 }}>
          <div style={{ fontFamily: notoSansKR, fontSize: 56, fontWeight: 800, color: COLORS.white, lineHeight: 1.3 }}>
            엄마 설득하는
            <br />
            <span style={{ background: "linear-gradient(135deg, #3182F6 0%, #4A9DFF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              가장 쉬운 방법
            </span>
          </div>
        </div>

        {/* CTA 버튼 */}
        <div style={{ transform: `scale(${Math.max(0, buttonScale) * buttonPulse})` }}>
          <div style={{ fontFamily: notoSansKR, fontSize: 44, fontWeight: 700, color: COLORS.white, background: "linear-gradient(135deg, #3182F6 0%, #2563eb 100%)", padding: "26px 52px", borderRadius: 16, boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 40px #3182F650", display: "flex", alignItems: "center", gap: 16 }}>
            무료 시뮬레이션 시작
            <span style={{ fontSize: 40 }}>→</span>
          </div>
        </div>

        {/* 서브 텍스트 */}
        <div style={{ opacity: subTextOpacity, fontFamily: notoSansKR, fontSize: 32, fontWeight: 500, color: "#B0B8C1" }}>
          프로필 링크 클릭 👆
        </div>
      </div>

      {/* 하단 계정 */}
      <div style={{ position: "absolute", bottom: SAFE_ZONE.bottom - 50, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: notoSansKR, fontSize: 28, fontWeight: 500, color: "#8B95A1", display: "inline-flex", padding: "14px 28px", backgroundColor: "#333D4B", borderRadius: 100, border: "1px solid #4E5968" }}>
          @previewapp.co.kr
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================
// Main Composition
// ============================================
export const MomSimulation: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 배경음악 */}
      <Audio src={staticFile("mom_bgm_new.mp3")} volume={0.35} />

      {/* TTS */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("mom_tts1_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={90} layout="none">
        <Audio src={staticFile("mom_tts2_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={210} layout="none">
        <Audio src={staticFile("mom_tts3_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={350} layout="none">
        <Audio src={staticFile("mom_tts4_ko.mp3")} volume={1} />
      </Sequence>
      <Sequence from={570} layout="none">
        <Audio src={staticFile("mom_tts5_ko.mp3")} volume={1} />
      </Sequence>

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <MomReactionScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={60}>
          <TransitionScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <SimulationRevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <ReversalScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={140}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
