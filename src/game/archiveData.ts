import type { ArchiveTemplate, ItemKind } from "./types";

// The pool of "living" objects the Archiver must process.
// Text drawn from private, unfinished, unpolished registers on purpose —
// it should read like something a person actually wrote, not copy.

export const ARCHIVE_TEMPLATES: Record<ItemKind, ArchiveTemplate> = {
  poem: {
    id: "poem",
    category: "TEXT",
    hasText: true,
    text: [
      { en: "I remember the curtains were blue that afternoon.", zh: "我记得那天下午的窗帘是蓝色的。" },
      { en: "Please don't rewrite this line for me.", zh: "这句话不要替我改。" },
    ],
    hue: 8, // vermillion
    irregularity: 0.8,
    minStage: 0,
    correctable: true,
  },
  bird: {
    id: "bird",
    category: "IMAGE",
    hasText: false,
    hue: 205, // cobalt
    irregularity: 0.9,
    minStage: 0,
    correctable: true,
  },
  childDrawing: {
    id: "childDrawing",
    category: "IMAGE",
    hasText: false,
    hue: 62, // acid yellow
    irregularity: 1,
    minStage: 1,
    correctable: true,
  },
  soundwave: {
    id: "soundwave",
    category: "SOUND",
    hasText: false,
    hue: 265,
    irregularity: 0.7,
    minStage: 0,
    correctable: true,
  },
  flower: {
    id: "flower",
    category: "IMAGE",
    hasText: false,
    hue: 330,
    irregularity: 0.85,
    minStage: 1,
    correctable: true,
  },
  blurredFace: {
    id: "blurredFace",
    category: "IMAGE",
    hasText: false,
    hue: 25,
    irregularity: 0.5,
    minStage: 1,
    correctable: true,
  },
  unsentLetter: {
    id: "unsentLetter",
    category: "TEXT",
    hasText: true,
    text: [
      { en: "If being preserved means being changed, is it still preserved?", zh: "如果被保存意味着被改变，那还算保存吗？" },
    ],
    hue: 12,
    irregularity: 0.6,
    minStage: 1,
    correctable: true,
  },
  memory: {
    id: "memory",
    category: "TEXT",
    hasText: true,
    text: [
      { en: "It had no name, but I loved it once.", zh: "它没有名字，但我曾经很喜欢它。" },
    ],
    hue: 220,
    irregularity: 0.75,
    minStage: 1,
    correctable: true,
  },
  lightball: {
    id: "lightball",
    category: "ANOMALY",
    hasText: false,
    hue: 45,
    irregularity: 1,
    minStage: 2,
    correctable: false,
  },
  symbol: {
    id: "symbol",
    category: "ANOMALY",
    hasText: true,
    text: [
      { en: "I made this before I learned to make useful things.", zh: "我做这个的时候，还不懂什么叫'有用'。" },
      { en: "Please leave one part unfinished.", zh: "请留一部分，别做完。" },
    ],
    hue: 95,
    irregularity: 0.95,
    minStage: 2,
    correctable: false,
  },
};

export function pickTemplate(stageIndex: number, rng: () => number): ArchiveTemplate {
  const pool = Object.values(ARCHIVE_TEMPLATES).filter(
    (t) => t.minStage <= stageIndex && t.id !== "lightball" && t.id !== "symbol"
  );
  return pool[Math.floor(rng() * pool.length)];
}

let uidCounter = 0;
export function nextUid(): string {
  uidCounter += 1;
  return `item-${uidCounter}-${Date.now().toString(36)}`;
}

// simple deterministic-ish RNG helper (mulberry32) so a session can be seeded later if desired
export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
