import { create } from "zustand";
import type {
  ArchiveInstance,
  Category,
  GameStage,
  GameState,
  LocalizedText,
} from "./types";
import { STAGE_ORDER, STAGES } from "./stages";
import {
  ACCEPT_MESSAGES,
  AUTO_MESSAGE,
  NONCOMPLIANT_MESSAGE,
  REJECT_MESSAGES,
  STANDARDIZE_MESSAGES,
} from "./stages";
import { mulberry32, nextUid, pickTemplate } from "./archiveData";
import { deriveEnding, clamp } from "./scoring";

let rng = mulberry32(Date.now() & 0xffffffff);

export interface MessageEvent {
  id: number;
  text: LocalizedText;
  tone: "neutral" | "cold" | "warm" | "glitch";
}

interface Timers {
  spawnTimeout: ReturnType<typeof setTimeout> | null;
}

interface Store extends GameState {
  message: MessageEvent | null;
  messageCounter: number;
  timers: Timers;

  setLang: (l: "en" | "zh") => void;
  toggleMute: () => void;
  setReducedMotion: (v: boolean) => void;

  startGame: () => void;
  resetGame: () => void;

  tick: (dtSeconds: number) => void;

  classify: (cat: Category) => void;
  standardizeCurrent: () => void;
  skipStandardizeAndArchive: () => void;
  stampCurrent: () => void;
  archiveCurrent: () => void;
  hesitate: () => void;

  // final choice / seed
  seedComply: () => void;
  seedProtect: () => void;
  seedEscape: () => void;
  seedPartial: () => void;

  pushMessage: (text: LocalizedText, tone?: MessageEvent["tone"]) => void;
}

function currentStageConfig(stage: GameStage) {
  return STAGES[stage] ?? STAGES.onboarding;
}

function initialState(): GameState {
  return {
    stage: "start",
    ending: null,
    lang: "en",
    muted: false,
    reducedMotion:
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,

    efficiency: 18,
    humanity: 100,
    compliance: 20,
    hesitation: 0,
    preservedVariation: 0,
    processedFiles: 0,
    stageProcessed: 0,
    seedIntegrity: 100,
    ruleBreakingActions: 0,
    elapsedTime: 0,
    stageElapsedTime: 0,
    leftIrregularity: false,
    attemptedEscape: false,

    current: null,
    finalChoiceStep: 0,
  };
}

export const useGame = create<Store>((set, get) => ({
  ...initialState(),
  message: null,
  messageCounter: 0,
  timers: { spawnTimeout: null },

  setLang: (l) => set({ lang: l }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setReducedMotion: (v) => set({ reducedMotion: v }),

  startGame: () => {
    const s = get();
    const lang = s.lang;
    const muted = s.muted;
    const reducedMotion = s.reducedMotion;
    if (s.timers.spawnTimeout) clearTimeout(s.timers.spawnTimeout);
    rng = mulberry32((Date.now() ^ 0x9e3779b9) & 0xffffffff);
    set({ ...initialState(), lang, muted, reducedMotion, stage: "onboarding" });
    get().pushMessage(STAGES.onboarding.greeting!, "neutral");
    spawnNext(set, get);
  },

  resetGame: () => {
    const s = get();
    if (s.timers.spawnTimeout) clearTimeout(s.timers.spawnTimeout);
    const lang = s.lang;
    set({ ...initialState(), lang });
  },

  tick: (dt) => {
    const s = get();
    if (s.stage === "start" || s.stage === "ending") return;
    const stageCfg = currentStageConfig(s.stage);
    let elapsedTime = s.elapsedTime + dt;
    let stageElapsedTime = s.stageElapsedTime + dt;

    // ambient system chatter, sparse
    if (Math.random() < dt * 0.02 && stageCfg.systemMessages.length) {
      const msg =
        stageCfg.systemMessages[Math.floor(rng() * stageCfg.systemMessages.length)];
      get().pushMessage(msg, "cold");
    }

    set({ elapsedTime, stageElapsedTime });

    // auto-processing of neglected items
    if (stageCfg.autoProcess && s.current) {
      const age = Date.now() - s.current.bornAt;
      if (age > (s.current.autoTimeout ?? stageCfg.autoTimeoutMs)) {
        autoProcessCurrent(set, get);
        return;
      }
    }

    // time-cap stage exit (mostly relevant for onboarding/standardization/acceleration)
    if (
      stageElapsedTime >= stageCfg.maxSeconds &&
      s.stage !== "alienation" &&
      s.stage !== "finalChoice"
    ) {
      advanceStage(set, get);
    }
  },

  classify: (cat) => {
    const s = get();
    if (!s.current) return;
    const item = s.current;
    const correctCat = item.template.category;
    const isMemoryLike = item.template.id === "memory";
    const acceptableCats: Category[] =
      correctCat === "ANOMALY" ? ["ANOMALY"] : [correctCat];

    if (isMemoryLike && cat === "TEXT") {
      // Memory forced into TEXT drawer: the system swallows it but names its unease.
      get().pushMessage(
        { en: "Memory is not a valid category.", zh: "记忆不是有效的分类。" },
        "cold"
      );
      set({ current: { ...item, classified: "TEXT" } });
      return;
    }

    if (acceptableCats.includes(cat)) {
      set({ current: { ...item, classified: cat } });
    } else {
      const msg = REJECT_MESSAGES[Math.floor(rng() * REJECT_MESSAGES.length)];
      get().pushMessage(msg, "warm");
      set((st) => ({
        hesitation: st.hesitation + 1,
        efficiency: clamp(st.efficiency - 1.5),
      }));
    }
  },

  standardizeCurrent: () => {
    const s = get();
    if (!s.current || s.current.corrected) return;
    const msg = STANDARDIZE_MESSAGES[Math.floor(rng() * STANDARDIZE_MESSAGES.length)];
    get().pushMessage(msg, "cold");
    set((st) => ({
      current: st.current ? { ...st.current, corrected: true } : null,
      humanity: clamp(st.humanity - 6),
      efficiency: clamp(st.efficiency + 2),
      compliance: clamp(st.compliance + 3),
    }));
  },

  skipStandardizeAndArchive: () => {
    const s = get();
    if (!s.current) return;
    get().pushMessage(NONCOMPLIANT_MESSAGE, "warm");
    set((st) => ({
      preservedVariation: st.preservedVariation + 1,
      hesitation: st.hesitation + 1,
      efficiency: clamp(st.efficiency - 1),
    }));
    get().archiveCurrent();
  },

  stampCurrent: () => {
    const s = get();
    if (!s.current || !s.current.classified) return;
    set({ current: { ...s.current, stamped: true } });
  },

  archiveCurrent: () => {
    const s = get();
    if (!s.current) return;
    if (!s.current.classified || !s.current.stamped) return;

    const msg = ACCEPT_MESSAGES[Math.floor(rng() * ACCEPT_MESSAGES.length)];
    get().pushMessage(msg, "neutral");

    const humanityLoss = s.current.corrected ? 3 : 1.2;
    set((st) => ({
      current: null,
      processedFiles: st.processedFiles + 1,
      stageProcessed: st.stageProcessed + 1,
      efficiency: clamp(st.efficiency + 4),
      humanity: clamp(st.humanity - humanityLoss),
      compliance: clamp(st.compliance + 2),
    }));

    maybeAdvanceOrSpawn(set, get);
  },

  hesitate: () => {
    set((s) => ({
      hesitation: s.hesitation + 1,
      efficiency: clamp(s.efficiency - 0.5),
    }));
  },

  seedComply: () => {
    const s = get();
    set({
      seedIntegrity: clamp(s.seedIntegrity - 30),
      compliance: clamp(s.compliance + 8),
      humanity: clamp(s.humanity - 4),
    });
    advanceFinalChoice(set, get);
  },

  seedProtect: () => {
    const s = get();
    set({
      preservedVariation: s.preservedVariation + 1,
      ruleBreakingActions: s.ruleBreakingActions + 1,
      seedIntegrity: clamp(s.seedIntegrity + 6),
    });
    advanceFinalChoice(set, get);
  },

  seedEscape: () => {
    set((s) => ({
      attemptedEscape: true,
      ruleBreakingActions: s.ruleBreakingActions + 3,
    }));
    resolveEnding(set, get);
  },

  seedPartial: () => {
    const s = get();
    set({
      leftIrregularity: true,
      preservedVariation: s.preservedVariation + 1,
      seedIntegrity: clamp(s.seedIntegrity - 10),
      compliance: clamp(s.compliance + 3),
    });
    advanceFinalChoice(set, get);
  },

  pushMessage: (text, tone = "neutral") => {
    const id = get().messageCounter + 1;
    set({ messageCounter: id, message: { id, text, tone } });
  },
}));

function spawnNext(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  if (s.stage === "start" || s.stage === "ending" || s.stage === "finalChoice") return;
  const stageCfg = currentStageConfig(s.stage);
  const template = pickTemplate(stageCfg.index, rng);
  const item: ArchiveInstance = {
    uid: nextUid(),
    template,
    seed: rng(),
    corrected: false,
    classified: null,
    stamped: false,
    bornAt: Date.now(),
    autoTimeout: stageCfg.autoTimeoutMs,
  };
  set({ current: item });
}

function scheduleSpawn(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  const stageCfg = currentStageConfig(s.stage);
  const [lo, hi] = stageCfg.spawnDelayMs;
  const delay = lo + rng() * (hi - lo);
  if (s.timers.spawnTimeout) clearTimeout(s.timers.spawnTimeout);
  const handle = setTimeout(() => spawnNext(set, get), delay);
  set({ timers: { spawnTimeout: handle } });
}

function maybeAdvanceOrSpawn(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  const stageCfg = currentStageConfig(s.stage);
  if (s.stageProcessed >= stageCfg.requiredProcessed) {
    advanceStage(set, get);
  } else {
    scheduleSpawn(set, get);
  }
}

function autoProcessCurrent(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  if (!s.current) return;
  get().pushMessage(AUTO_MESSAGE, "cold");
  set((st) => ({
    current: null,
    processedFiles: st.processedFiles + 1,
    stageProcessed: st.stageProcessed + 1,
    efficiency: clamp(st.efficiency + 6),
    humanity: clamp(st.humanity - 5),
    compliance: clamp(st.compliance + 5),
  }));
  maybeAdvanceOrSpawn(set, get);
}

function advanceStage(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  const idx = STAGE_ORDER.indexOf(s.stage as GameStage);
  const nextStage = STAGE_ORDER[idx + 1];
  if (s.timers.spawnTimeout) clearTimeout(s.timers.spawnTimeout);

  if (!nextStage) {
    // alienation finished -> move to the seed encounter
    set({ stage: "finalChoice", current: null, finalChoiceStep: 0 });
    get().pushMessage(
      { en: "UNCLASSIFIABLE OBJECT DETECTED.", zh: "检测到无法分类的物体。" },
      "glitch"
    );
    return;
  }

  set({ stage: nextStage, stageProcessed: 0, stageElapsedTime: 0, current: null });
  const cfg = currentStageConfig(nextStage);
  if (cfg.greeting) get().pushMessage(cfg.greeting, "neutral");
  scheduleSpawn(set, get);
}

function advanceFinalChoice(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  const step = s.finalChoiceStep + 1;
  if (step >= 3 || s.seedIntegrity <= 0) {
    resolveEnding(set, get);
  } else {
    set({ finalChoiceStep: step });
  }
}

function resolveEnding(
  set: (partial: Partial<Store> | ((s: Store) => Partial<Store>)) => void,
  get: () => Store
) {
  const s = get();
  const ending = deriveEnding(s);
  set({ stage: "ending", ending });
}
