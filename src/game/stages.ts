import type { Category, GameStage, LocalizedText } from "./types";

export interface StageConfig {
  key: GameStage;
  index: number; // ordinal among playable stages
  requiredProcessed: number; // exit condition: items processed in-stage
  maxSeconds: number; // exit condition: time cap in-stage
  categories: Category[]; // visible drawers
  allowCorrection: boolean; // "standardize" step available
  autoProcess: boolean; // system starts auto-processing neglected items
  autoTimeoutMs: number; // how long before an item is auto-processed
  spawnDelayMs: [number, number]; // min,max gap before next item appears
  systemMessages: LocalizedText[]; // ambient messages shown between actions
  greeting?: LocalizedText;
}

export const STAGE_ORDER: GameStage[] = [
  "onboarding",
  "standardization",
  "acceleration",
  "alienation",
];

export const STAGES: Record<string, StageConfig> = {
  onboarding: {
    key: "onboarding",
    index: 0,
    requiredProcessed: 4,
    maxSeconds: 85,
    categories: ["TEXT", "IMAGE", "SOUND"],
    allowCorrection: false,
    autoProcess: false,
    autoTimeoutMs: 999999,
    spawnDelayMs: [900, 1400],
    greeting: { en: "Welcome, Archiver.", zh: "欢迎，归档者。" },
    systemMessages: [
      { en: "Preserve order.", zh: "维持秩序。" },
      { en: "Every object has its place.", zh: "万物皆有其位。" },
      { en: "Thank you for your contribution.", zh: "感谢你的贡献。" },
    ],
  },
  standardization: {
    key: "standardization",
    index: 1,
    requiredProcessed: 6,
    maxSeconds: 120,
    categories: ["TEXT", "IMAGE", "SOUND"],
    allowCorrection: true,
    autoProcess: false,
    autoTimeoutMs: 999999,
    spawnDelayMs: [800, 1200],
    systemMessages: [
      { en: "Remove unnecessary detail.", zh: "删除不必要的细节。" },
      { en: "Variation detected.", zh: "检测到偏差。" },
      { en: "Correction is care.", zh: "修正即关怀。" },
      { en: "Order prevents loss.", zh: "秩序防止流失。" },
    ],
  },
  acceleration: {
    key: "acceleration",
    index: 2,
    requiredProcessed: 7,
    maxSeconds: 110,
    categories: ["TEXT", "IMAGE", "SOUND"],
    allowCorrection: true,
    autoProcess: true,
    autoTimeoutMs: 6000,
    spawnDelayMs: [450, 750],
    systemMessages: [
      { en: "Hesitation detected.", zh: "检测到犹豫。" },
      { en: "Individual variation reduces efficiency.", zh: "个体差异降低效率。" },
      { en: "Delay reduces output.", zh: "延迟降低产出。" },
      { en: "Memory is not a valid category.", zh: "记忆不是有效的分类。" },
    ],
  },
  alienation: {
    key: "alienation",
    index: 3,
    requiredProcessed: 4,
    maxSeconds: 999999,
    categories: ["TEXT", "IMAGE", "SOUND", "ANOMALY"],
    allowCorrection: true,
    autoProcess: true,
    autoTimeoutMs: 4200,
    spawnDelayMs: [350, 600],
    systemMessages: [
      { en: "Personal expression has been corrected.", zh: "个人表达已被修正。" },
      { en: "You are becoming consistent.", zh: "你正变得一致。" },
      { en: "Emotion exceeds permitted range.", zh: "情绪超出允许范围。" },
      { en: "You are becoming useful.", zh: "你正变得有用。" },
    ],
  },
};

export const ACCEPT_MESSAGES: LocalizedText[] = [
  { en: "ACCEPTED", zh: "已接受" },
  { en: "FILE SUCCESSFULLY ARCHIVED", zh: "档案已成功归档" },
];

export const STANDARDIZE_MESSAGES: LocalizedText[] = [
  { en: "STANDARDIZED", zh: "已标准化" },
  { en: "OPTIMIZED", zh: "已优化" },
  { en: "REDUNDANCY REMOVED", zh: "冗余已清除" },
  { en: "EMOTION REDUCED", zh: "情绪已降低" },
];

export const REJECT_MESSAGES: LocalizedText[] = [
  { en: "MISCLASSIFIED", zh: "分类错误" },
  { en: "RETURN TO SENDER", zh: "退回重处理" },
];

export const AUTO_MESSAGE: LocalizedText = { en: "AUTO-PROCESSED", zh: "已自动处理" };
export const NONCOMPLIANT_MESSAGE: LocalizedText = { en: "REJECTED: NONCOMPLIANT", zh: "拒收：不合规" };
