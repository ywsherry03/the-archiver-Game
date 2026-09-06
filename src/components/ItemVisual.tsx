import type { ArchiveTemplate } from "../game/types";
import { hslColor } from "../visuals/corruption";
import { blobPath, waveformPoints, wavyLinePath } from "../visuals/shapes";

interface Props {
  template: ArchiveTemplate;
  seed: number;
  humanity: number;
  corrected: boolean;
}

export default function ItemVisual({ template, seed, humanity, corrected }: Props) {
  const regularity = corrected ? Math.min(1, 0.55 + (1 - humanity / 100)) : 1 - humanity / 100;
  const color = hslColor(template.hue, humanity, 68, 50);
  const colorDeep = hslColor(template.hue, humanity, 68, 34);
  const irregularity = template.irregularity;

  switch (template.id) {
    case "bird": {
      const body = blobPath(58, 66, 34, 9, seed, irregularity, regularity);
      const wing = blobPath(72, 60, 18, 7, seed * 1.7, irregularity, regularity);
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          <path d={body} fill={color} stroke={colorDeep} strokeWidth={1.5} />
          <path d={wing} fill={colorDeep} opacity={0.55} />
          <path
            d={`M 90 60 L 108 ${54 + (1 - regularity) * 6} L 92 70 Z`}
            fill={colorDeep}
          />
          <circle cx={44} cy={58} r={2.6} fill="var(--ink-black)" />
        </svg>
      );
    }
    case "childDrawing": {
      const sun = blobPath(64, 64, 30, 10, seed, irregularity, regularity);
      const rays = Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + seed;
        const r1 = 36;
        const r2 = 52 + (1 - regularity) * 8;
        return (
          <line
            key={i}
            x1={64 + Math.cos(a) * r1}
            y1={64 + Math.sin(a) * r1}
            x2={64 + Math.cos(a) * r2}
            y2={64 + Math.sin(a) * r2}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      });
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          {rays}
          <path d={sun} fill={color} stroke={colorDeep} strokeWidth={2} />
        </svg>
      );
    }
    case "soundwave": {
      const pts = waveformPoints(120, 70, seed, irregularity, regularity);
      return (
        <svg viewBox="0 0 120 70" width="100%" height="80">
          <polyline points={pts} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
        </svg>
      );
    }
    case "flower": {
      const petals = Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const petal = blobPath(
          64 + Math.cos(a) * 20 * (1 - regularity * 0.3),
          64 + Math.sin(a) * 20 * (1 - regularity * 0.3),
          16,
          7,
          seed + i * 0.31,
          irregularity,
          regularity
        );
        return <path key={i} d={petal} fill={color} opacity={0.85} />;
      });
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          {petals}
          <circle cx={64} cy={64} r={12} fill={colorDeep} />
        </svg>
      );
    }
    case "blurredFace": {
      const blur = 1.2 + (humanity / 100) * 2.2;
      const face = blobPath(64, 64, 34, 8, seed, irregularity * 0.5, regularity);
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          <filter id={`blur-${seed}`}>
            <feGaussianBlur stdDeviation={blur} />
          </filter>
          <g filter={`url(#blur-${seed})`}>
            <path d={face} fill={hslColor(30, humanity, 20, 78)} stroke={colorDeep} strokeWidth={1} />
            <circle cx={52} cy={60} r={3.4} fill="var(--ink-black)" opacity={0.6} />
            <circle cx={76} cy={60} r={3.4} fill="var(--ink-black)" opacity={0.6} />
            <path d={wavyLinePath(50, 80, 28, seed, 6, regularity)} stroke="var(--ink-black)" strokeWidth={1.4} fill="none" opacity={0.5} />
          </g>
        </svg>
      );
    }
    case "unsentLetter": {
      return (
        <svg viewBox="0 0 128 96" width="100%" height="88">
          <rect x={10} y={14} width={108} height={72} fill={color} stroke={colorDeep} strokeWidth={1.5} />
          <path
            d={`M 10 14 L 64 ${58 + (1 - regularity) * 6} L 118 14`}
            fill="none"
            stroke={colorDeep}
            strokeWidth={1.5}
          />
        </svg>
      );
    }
    case "memory": {
      const halo = blobPath(64, 64, 38, 10, seed, irregularity, regularity);
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          <defs>
            <radialGradient id={`mem-${seed}`}>
              <stop offset="0%" stopColor={color} stopOpacity={0.9} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </radialGradient>
          </defs>
          <path d={halo} fill={`url(#mem-${seed})`} />
          <path d={halo} fill="none" stroke={colorDeep} strokeWidth={1} opacity={0.4} />
        </svg>
      );
    }
    case "poem": {
      const page = blobPath(64, 64, 40, 4, seed * 0.3, 0.15, regularity);
      const lines = [0, 1, 2].map((i) => (
        <path
          key={i}
          d={wavyLinePath(34, 48 + i * 16, 60, seed + i, 5, regularity)}
          stroke="var(--ink-black)"
          strokeWidth={1.6}
          fill="none"
          opacity={0.7}
        />
      ));
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          <path d={page} fill="var(--paper-bone)" stroke={colorDeep} strokeWidth={1.5} />
          {lines}
        </svg>
      );
    }
    case "lightball":
    case "symbol":
    default: {
      const shape = blobPath(64, 64, 32, 11, seed, 1, 0);
      return (
        <svg viewBox="0 0 128 128" width="100%" height="100%">
          <defs>
            <radialGradient id={`anom-${seed}`}>
              <stop offset="0%" stopColor="var(--anomaly-yellow)" />
              <stop offset="55%" stopColor="var(--accent-red)" />
              <stop offset="100%" stopColor="var(--life-blue)" />
            </radialGradient>
          </defs>
          <path d={shape} fill={`url(#anom-${seed})`} />
        </svg>
      );
    }
  }
}
