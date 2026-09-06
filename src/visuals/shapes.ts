import { mulberry32 } from "../game/archiveData";

/** Builds a closed, organic-looking blob path that can be "regularized"
 * toward a perfect polygon as `regularity` approaches 1. */
export function blobPath(
  cx: number,
  cy: number,
  baseR: number,
  points: number,
  seed: number,
  irregularity: number,
  regularity: number
): string {
  const rng = mulberry32(Math.floor(seed * 1e6));
  const jitterAmt = irregularity * (1 - regularity);
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const rJitter = 1 + (rng() - 0.5) * 0.55 * jitterAmt;
    const angleJitter = (rng() - 0.5) * (0.35 * jitterAmt);
    const r = baseR * rJitter;
    const a = angle + angleJitter;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
  for (let i = 0; i < points; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % points];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += `Q ${x0.toFixed(2)} ${y0.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)} `;
  }
  d += "Z";
  return d;
}

/** A hand-drawn-ish wavy line path, straightening as `regularity` -> 1. */
export function wavyLinePath(
  x0: number,
  y: number,
  width: number,
  seed: number,
  amplitude: number,
  regularity: number
): string {
  const rng = mulberry32(Math.floor(seed * 1e6) + 7);
  const segs = 6;
  const amp = amplitude * (1 - regularity);
  let d = `M ${x0} ${y} `;
  for (let i = 1; i <= segs; i++) {
    const x = x0 + (width * i) / segs;
    const yy = y + (rng() - 0.5) * amp;
    d += `L ${x.toFixed(2)} ${yy.toFixed(2)} `;
  }
  return d;
}

export function waveformPoints(
  width: number,
  height: number,
  seed: number,
  irregularity: number,
  regularity: number
): string {
  const rng = mulberry32(Math.floor(seed * 1e6) + 13);
  const n = 22;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = (width / n) * i;
    const regular = Math.sin((i / n) * Math.PI * 4) * (height * 0.32);
    const chaotic = (rng() - 0.5) * height * 0.9 * irregularity;
    const y = height / 2 + regular * regularity + chaotic * (1 - regularity);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}
