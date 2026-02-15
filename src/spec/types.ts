export type Lang = 'ko' | 'en';

export type TransitionType = 'cut' | 'fade' | 'slide' | 'zoom';
export type EffectType =
  | 'none'
  | 'kenburns'
  | 'flash'
  | 'shake'
  | 'glow'
  | 'blurIn'
  | 'glitch';

export type CaptionStyle = {
  /** Safe zone in pixels */
  safe: { leftRight: number; top: number; bottom: number };
  /** Default text alignment in safe zone */
  align: 'center' | 'bottom';
  /** Base font sizes for readability */
  font: { title: number; body: number };
};

export type SceneSpec = {
  id: string;
  kind: 'hook' | 'problem' | 'proof' | 'solution' | 'cta' | 'custom';
  /** duration in frames */
  duration: number;
  /** full-bleed background image/video */
  background?: {
    type: 'image' | 'video' | 'color';
    src?: string; // public/ staticFile path
    color?: string;
    fit?: 'cover' | 'contain';
    overlay?: 'none' | 'gradientBottom' | 'gradientTopBottom' | 'glass';
  };
  text?: {
    title?: string;
    body?: string;
    ctaButton?: string;
  };
  transitionIn?: TransitionType;
  transitionOut?: TransitionType;
  effects?: EffectType[];
};

export type ReelSpec = {
  version: 1;
  title: string;
  lang: Lang;
  fps: 30;
  width: 1080;
  height: 1920;
  /** total duration is derived from scenes unless provided */
  scenes: SceneSpec[];

  /** optional VO lines (used to map to generated mp3 files) */
  voiceover?: {
    provider: 'gcp-tts';
    /** e.g. public/generated-tts/b2b_18_tts1_ko-KR.mp3 */
    tracks?: Array<{ atFrame: number; src: string; volume?: number }>;
  };

  bgm?: {
    src: string;
    volume: number;
  };

  captions: CaptionStyle;
};
