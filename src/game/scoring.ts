import type { EndingType, GameState } from "./types";

// The final ending is a function of accumulated behaviour, not the last click.
export function deriveEnding(s: GameState): EndingType {
  const escaped = s.attemptedEscape;
  const highRebellion = s.ruleBreakingActions >= 4;
  const seedMostlyIntact = s.seedIntegrity >= 55;

  if (escaped || highRebellion || seedMostlyIntact) {
    return "refusal";
  }

  const seedFullyProcessed = s.seedIntegrity <= 12;
  const highCompliance = s.compliance >= 62;
  const lowRebellion = s.ruleBreakingActions <= 1;

  if (seedFullyProcessed && highCompliance && lowRebellion && !s.leftIrregularity) {
    return "perfectArchive";
  }

  return "remainingError";
}

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}
