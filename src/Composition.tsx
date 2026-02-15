import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 페이드인: 0초 ~ 1초 (0 -> 1)
  // 페이드아웃: 4초 ~ 5초 (1 -> 0)
  const fadeInDuration = 1 * fps;
  const fadeOutStart = durationInFrames - 1 * fps;

  const opacity = interpolate(
    frame,
    [0, fadeInDuration, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          fontSize: 120,
          fontWeight: "bold",
          color: "black",
        }}
      >
        안녕
      </div>
    </div>
  );
};
