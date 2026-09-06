import { useEffect, useRef, useState } from "react";
import { useGame } from "../game/store";
import { ENDINGS } from "../game/endings";
import { pick, DICT } from "../i18n/dict";
import { setupCrispCanvas, drawSegment } from "../visuals/drawingCanvas";
import { audioEngine } from "../audio/audioEngine";
import Character from "./Character";

export default function EndingScene() {
  const lang = useGame((s) => s.lang);
  const ending = useGame((s) => s.ending);
  const resetGame = useGame((s) => s.resetGame);
  const [phase, setPhase] = useState<0 | 1>(0);

  const cfg = ending ? ENDINGS[ending] : null;

  useEffect(() => {
    if (!cfg) return;
    audioEngine.stopAmbience();
    if (ending === "perfectArchive") {
      const t = setTimeout(() => setPhase(1), cfg.delayMs);
      return () => clearTimeout(t);
    }
    if (ending === "remainingError") {
      const t = setTimeout(() => setPhase(1), cfg.delayMs);
      return () => clearTimeout(t);
    }
    if (ending === "refusal") {
      audioEngine.playGlitch();
    }
  }, [ending]);

  if (!ending || !cfg) return null;

  const bg =
    ending === "perfectArchive"
      ? "#000000"
      : ending === "remainingError"
      ? "#0b0d11"
      : "#070b0d";

  return (
    <div className="ending-screen" style={{ backgroundColor: bg }}>
      {ending === "perfectArchive" && <PerfectArchiveVisual />}
      {ending === "remainingError" && <RemainingErrorVisual />}
      {ending === "refusal" && <RefusalVisual />}

      <div className="ending-line">{pick(cfg.line1, lang)}</div>
      {cfg.line2 && (phase === 1 || ending === "refusal") && (
        <div className="ending-line line2">{pick(cfg.line2, lang)}</div>
      )}

      {ending === "refusal" && <FreeDrawArea />}

      <div className="ending-actions">
        <button className="begin-btn" onClick={resetGame}>
          {pick(DICT.again, lang)}
        </button>
      </div>
    </div>
  );
}

function PerfectArchiveVisual() {
  return (
    <div className="ending-motif" style={{ opacity: 0.6 }}>
      <div
        style={{
          width: 88,
          height: 132,
          border: "2px solid var(--ink-black)",
          background: "var(--file-beige)",
        }}
      >
        <div style={{ borderBottom: "1px solid var(--ink-black)", height: "33%" }} />
        <div style={{ borderBottom: "1px solid var(--ink-black)", height: "33%" }} />
      </div>
    </div>
  );
}

function RemainingErrorVisual() {
  return (
    <div className="ending-motif">
      <div style={{ position: "relative", width: 88, height: 132, border: "2px solid var(--ink-black)", background: "var(--file-beige)", overflow: "hidden" }}>
        <div style={{ borderBottom: "1px solid var(--ink-black)", height: "33%" }} />
        <div style={{ borderBottom: "1px solid var(--ink-black)", height: "33%", position: "relative" }}>
          <div
            className="ending-breath"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "radial-gradient(circle, var(--anomaly-yellow), var(--accent-red))",
              animation: "breathe-fast 2.4s ease-in-out infinite",
              boxShadow: "0 0 12px 3px rgba(225,75,75,0.45)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function RefusalVisual() {
  return (
    <div className="ending-motif" style={{ opacity: 0.9 }}>
      <Character humanity={8} compact />
    </div>
  );
}

function FreeDrawArea() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokeIndex = useRef(0);
  const lang = useGame((s) => s.lang);

  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = setupCrispCanvas(canvasRef.current);
    }
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    (e.target as Element).setPointerCapture(e.pointerId);
    last.current = pos(e);
    strokeIndex.current += 1;
    audioEngine.unlock();
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!last.current || !ctxRef.current) return;
    const p = pos(e);
    drawSegment(ctxRef.current, last.current.x, last.current.y, p.x, p.y, strokeIndex.current);
    audioEngine.playFreeDrawStroke(Math.random());
    last.current = p;
  }

  function onUp() {
    last.current = null;
  }

  return (
    <div className="free-draw-wrap">
      <canvas
        ref={canvasRef}
        className="free-draw-canvas"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      />
      <div style={{ position: "absolute", bottom: -26, left: 0, right: 0, textAlign: "center", fontSize: 10, letterSpacing: "0.12em", opacity: 0.5 }}>
        {pick(DICT.freeDrawHint, lang)}
      </div>
    </div>
  );
}
