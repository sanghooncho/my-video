import { Easing, interpolate } from 'remotion';

export const fadeIn = (frame: number, start: number, duration: number) => {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
};

export const fadeOut = (frame: number, end: number, duration: number) => {
  return interpolate(frame, [end - duration, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.quad),
  });
};

export const kenBurnsScale = (frame: number, start: number, end: number, from = 1.05, to = 1.15) => {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });
};

export const shake = (frame: number, intensity = 6) => {
  const x = (Math.sin(frame * 11.3) + Math.sin(frame * 7.7)) * intensity * 0.25;
  const y = (Math.cos(frame * 9.1) + Math.cos(frame * 5.9)) * intensity * 0.25;
  return { x, y };
};
