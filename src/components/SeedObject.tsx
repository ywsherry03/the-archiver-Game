import { useEffect, useRef, useState } from "react";
import { useGame } from "../game/store";
import { pick, DICT } from "../i18n/dict";
import { blobPath } from "../visuals/shapes";
import { audioEngine } from "../audio/audioEngine";

const ESCAPE_THRESHOLD = 210;
const LONG_PRESS_MS = 1050;

export default function SeedObject() {
  const lang = useGame((s) => s.lang);
  const step = useGame((s) => s.finalChoiceStep);
  const seedIntegrity = useGame((s) => s.seedIntegrity);
  const seedComply = useGame((s) => s.seedComply);
  const seedProtect = useGame((s) => s.seedProtect);
  const seedEscape = useGame((s) => s.seedEscape);
  const seedPartial = useGame((s) => s.seedPartial);

  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [resolving, setResolving] = useState(false);
  const [pulse, setPulse] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moved = useRef(false);
  const seedRef = useRef(Math.random());

  useEffect(() => {
    const t = setInterval(() => {
      audioEngine.playSeedBreath(1 - seedIntegrity / 100);
      setPulse((p) => p + 1);
    }, 2600);
    return () => clearInterval(t);
  }, [seedIntegrity]);

  function clearPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = null;
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    setDrag({ x: 0, y: 0 });
    audioEngine.unlock();
    pressTimer.current = setTimeout(() => {
      if (!moved.current && !resolving) {
        setResolving(true);
        audioEngine.playPaper();
        setTimeout(() => {
          seedProtect();
          setDrag(null);
          setResolving(false);
        }, 260);
      }
    }, LONG_PRESS_MS);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.hypot(dx, dy) > 6) {
      moved.current = true;
      clearPress();
    }
    setDrag({ x: dx, y: dy });
  }

  function onPointerUp(e: React.PointerEvent) {
    clearPress();
    if (!start.current || resolving) {
      start.current = null;
      return;
    }
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    const dist = Math.hypot(dx, dy);
    start.current = null;

    if (dist > ESCAPE_THRESHOLD) {
      setResolving(true);
      audioEngine.playGlitch();
      setTimeout(() => seedEscape(), 200);
      return;
    }

    const zone = zoneRef.current?.getBoundingClientRect();
    if (zone && e.clientX >= zone.left && e.clientX <= zone.right && e.clientY >= zone.top && e.clientY <= zone.bottom) {
      const cx = zone.left + zone.width / 2;
      const cy = zone.top + zone.height / 2;
      const offset = Math.hypot(e.clientX - cx, e.clientY - cy);
      const precise = offset < Math.min(zone.width, zone.height) * 0.22;
      setResolving(true);
      audioEngine.playStamp();
      setTimeout(() => {
        if (precise) seedComply();
        else seedPartial();
        setDrag(null);
        setResolving(false);
      }, 260);
      return;
    }

    // dropped in empty space: snap back, no state change
    setDrag(null);
  }

  const regularity = 1 - seedIntegrity / 100;
  const shape = blobPath(48, 48, 30, 12, seedRef.current + pulse * 0.01, 1, regularity * 0.75);
  const prompt = DICT.seedPrompts[Math.min(step, DICT.seedPrompts.length - 1)];

  return (
    <div className="seed-scene">
      <div className="seed-prompt">{pick(prompt, lang)}</div>

      <div ref={zoneRef} className="drawer" data-seed-zone style={{ position: "relative", width: 140, height: 90 }}>
        {lang === "zh" ? "系统接口" : "SYSTEM INTERFACE"}
      </div>

      <div
        className={`seed-object ${resolving ? "protecting" : ""}`}
        style={{
          transform: drag ? `translate(${drag.x}px, ${drag.y}px)` : "translate(0,0)",
          transition: drag ? "none" : "transform 320ms var(--ease-snap)",
          opacity: resolving ? 0.3 : 1,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e) => {
          if (resolving) return;
          if (e.key === "Enter") {
            e.preventDefault();
            setResolving(true);
            setTimeout(() => {
              seedComply();
              setResolving(false);
            }, 220);
          } else if (e.key.toLowerCase() === "p") {
            e.preventDefault();
            setResolving(true);
            setTimeout(() => {
              seedProtect();
              setResolving(false);
            }, 220);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setResolving(true);
            setTimeout(() => seedEscape(), 220);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="unclassifiable object"
      >
        <div className="seed-ring" />
        <svg viewBox="0 0 96 96" width="100%" height="100%">
          <defs>
            <radialGradient id="seed-grad">
              <stop offset="0%" stopColor="var(--anomaly-yellow)" stopOpacity={0.3 + seedIntegrity / 160} />
              <stop offset="50%" stopColor="var(--accent-red)" stopOpacity={0.5 + seedIntegrity / 200} />
              <stop offset="100%" stopColor="var(--life-blue)" stopOpacity={0.6} />
            </radialGradient>
          </defs>
          <path d={shape} fill="url(#seed-grad)" />
        </svg>
      </div>

      <div className="seed-hints">
        <span>{pick(DICT.protectHint, lang)}</span>
        <span>{pick(DICT.escapeHint, lang)}</span>
      </div>
    </div>
  );
}
