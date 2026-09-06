import { characterPhase } from "../visuals/corruption";

interface Props {
  humanity: number;
  compact?: boolean;
}

export default function Character({ humanity, compact }: Props) {
  const phase = characterPhase(humanity);
  const w = compact ? 96 : 132;
  const h = compact ? 176 : 246;

  // corner radius softens from a rounded human figure to hard right angles
  const rx = phase === "whole" ? 10 : phase === "labeled" ? 5 : phase === "merging" ? 1.5 : 0;
  const limbSpread = phase === "whole" ? 1 : phase === "labeled" ? 0.85 : phase === "merging" ? 0.5 : 0;
  const fill = phase === "consumed" ? "var(--file-beige)" : "var(--ink-black)";
  const stroke = "var(--ink-black)";

  return (
    <div className={`character-figure phase-${phase}`} style={{ width: w, height: h }} aria-hidden="true">
      <svg viewBox="0 0 100 190" width="100%" height="100%">
        {/* legs */}
        <rect x={38 - limbSpread * 6} y={140} width={10} height={44} rx={rx} fill={fill} />
        <rect x={52 + limbSpread * 6} y={140} width={10} height={44} rx={rx} fill={fill} />

        {/* arms */}
        <rect
          x={17 - limbSpread * 10}
          y={62}
          width={9}
          height={54}
          rx={rx}
          fill={fill}
          transform={`rotate(${limbSpread * 8} 21 62)`}
        />
        <rect
          x={74 + limbSpread * 10}
          y={62}
          width={9}
          height={54}
          rx={rx}
          fill={fill}
          transform={`rotate(${-limbSpread * 8} 79 62)`}
        />

        {/* torso */}
        <rect x={30} y={58} width={40} height={86} rx={rx * 1.6} fill={fill} stroke={phase === "consumed" ? stroke : "none"} strokeWidth={2} />

        {/* head */}
        <circle cx={50} cy={34} r={20} fill={fill} />

        {/* seams once fully consumed: reads as a cabinet, not a body */}
        {phase === "consumed" && (
          <>
            <line x1={30} y1={90} x2={70} y2={90} stroke={stroke} strokeWidth={1.4} />
            <line x1={30} y1={118} x2={70} y2={118} stroke={stroke} strokeWidth={1.4} />
            <rect x={44} y={98} width={12} height={4} fill={stroke} />
          </>
        )}

        {/* grid snapping onto the figure as it merges with the system */}
        {(phase === "merging" || phase === "consumed") && (
          <g opacity={phase === "consumed" ? 0.85 : 0.5}>
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`h${i}`} x1={30} y1={58 + i * 17} x2={70} y2={58 + i * 17} stroke="var(--cold-grey-1)" strokeWidth={0.8} />
            ))}
          </g>
        )}

        {/* file-tab label appears once the process starts labeling the body */}
        {(phase === "labeled" || phase === "merging") && (
          <rect x={38} y={50} width={24} height={9} fill="var(--paper-bone)" stroke={stroke} strokeWidth={0.6} />
        )}

        {/* barcode across the chest, intensifies over time, gone once consumed (no chest left) */}
        {(phase === "labeled" || phase === "merging") && (
          <g transform="translate(36,96)">
            {barcodeBars(phase === "merging" ? 12 : 7).map((bar, i) => (
              <rect key={i} x={bar.x} y={0} width={bar.w} height={16} fill="var(--paper-bone)" />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

function barcodeBars(count: number): { x: number; w: number }[] {
  const bars = [];
  let x = 0;
  for (let i = 0; i < count; i++) {
    const w = i % 3 === 0 ? 2.4 : 1.2;
    bars.push({ x, w });
    x += w + 1.6;
  }
  return bars;
}
