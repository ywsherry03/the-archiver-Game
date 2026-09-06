// Core type definitions for The Archiver

export type GameStage =
  | "start"
  | "onboarding"
  | "standardization"
  | "acceleration"
  | "alienation"
  | "finalChoice"
  | "ending";

export type EndingType = "perfectArchive" | "remainingError" | "refusal";

export type Lang = "en" | "zh";

export type Category = "TEXT" | "IMAGE" | "SOUND" | "ANOMALY";

export type ItemKind =
  | "poem"
  | "bird"
  | "childDrawing"
  | "soundwave"
  | "flower"
  | "blurredFace"
  | "unsentLetter"
  | "memory"
  | "lightball"
  | "symbol";

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface ArchiveTemplate {
  id: ItemKind;
  category: Category;
  hasText: boolean;
  text?: LocalizedText[];
  hue: number; // base hue 0-360
  irregularity: number; // 0-1, how organic the shape is
  minStage: number; // stage index it can start appearing from (0=onboarding)
  correctable: boolean; // whether a "standardize" reduction step applies (stage 2+)
}

export interface ArchiveInstance {
  uid: string;
  template: ArchiveTemplate;
  seed: number; // random seed for shape jitter, stable per-instance
  corrected: boolean;
  classified: Category | null;
  stamped: boolean;
  bornAt: number;
  autoTimeout?: number; // ms allowed before auto-processing (acceleration stage)
}

export interface GameState {
  stage: GameStage;
  ending: EndingType | null;
  lang: Lang;
  muted: boolean;
  reducedMotion: boolean;

  efficiency: number; // 0-100
  humanity: number; // 0-100 (internal, drives visuals; never shown by name)
  compliance: number; // 0-100
  hesitation: number; // count of slow/hesitant actions
  preservedVariation: number; // count of deliberate deviations
  processedFiles: number; // total processed
  stageProcessed: number; // processed within current stage
  seedIntegrity: number; // 0-100, used in finalChoice
  ruleBreakingActions: number;
  elapsedTime: number; // seconds, total
  stageElapsedTime: number; // seconds, within current stage
  leftIrregularity: boolean; // ending-B trigger
  attemptedEscape: boolean; // ending-C trigger

  current: ArchiveInstance | null;
  finalChoiceStep: number; // 0..2 within the seed sequence
}
