export function setupCrispCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  return ctx;
}

// Drawn on the dark void canvas in the refusal ending — colors chosen to
// glow against near-black rather than read as ink on paper.
const STROKE_COLORS = ["#e14b4b", "#33d6f2", "#dbff5c", "#e4e9ef"];

export function drawSegment(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  strokeIndex: number
) {
  const speed = Math.hypot(x1 - x0, y1 - y0);
  ctx.strokeStyle = STROKE_COLORS[strokeIndex % STROKE_COLORS.length];
  ctx.lineWidth = Math.max(1.4, 4.2 - speed * 0.08);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}
