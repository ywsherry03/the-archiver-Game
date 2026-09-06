// Central place translating the hidden humanity/efficiency values into
// concrete visual parameters. Nothing here is shown to the player as a
// number — only as color, shape, and motion.
//
// The world itself is a constant cold, near-black void from frame one —
// nothing warms it up as a "before" state. Corruption instead reads as
// living color being drained out of the objects and the character until
// they're absorbed into that same void.

export function saturationFor(humanity: number): number {
  // 0..1, never fully zero so the seed's contrast still reads
  return 0.06 + 0.66 * (humanity / 100);
}

// Colors sink toward this lightness (the surface/void tone) as humanity
// drops, rather than bleaching out toward white.
const VOID_FLOOR_LIGHT = 13;

export function hslColor(hue: number, humanity: number, baseSat = 62, baseLight = 52): string {
  const sat = Math.max(3, baseSat * saturationFor(humanity));
  const light = VOID_FLOOR_LIGHT + (baseLight - VOID_FLOOR_LIGHT) * Math.max(0, humanity / 100);
  return `hsl(${hue}deg ${sat}% ${light}%)`;
}

export function cornerRadiusFor(humanity: number, irregularity: number): number {
  // organic rounded blobs -> perfect right angles
  const maxR = 34 * irregularity;
  return Math.max(1, maxR * (humanity / 100));
}

export function jitterFor(humanity: number, seed: number, irregularity: number): number {
  // rotation / offset jitter in degrees, collapses to 0 as humanity drops
  const amp = 6 * irregularity * (humanity / 100);
  return (seed - 0.5) * 2 * amp;
}

// Intensity of the ambient scanline sweep / monitoring-static overlay —
// the room was always watching; it just gets harder to ignore.
export function staticIntensityFor(humanity: number): number {
  return Math.min(0.85, 0.05 + (1 - humanity / 100) * 0.8);
}

export type CharacterPhase = "whole" | "labeled" | "merging" | "consumed";

export function characterPhase(humanity: number): CharacterPhase {
  if (humanity > 70) return "whole";
  if (humanity > 40) return "labeled";
  if (humanity > 12) return "merging";
  return "consumed";
}
