import { useEffect, useRef, useState } from "react";
import { useGame } from "./game/store";
import { staticIntensityFor, characterPhase } from "./visuals/corruption";
import { STAGES } from "./game/stages";
import { audioEngine } from "./audio/audioEngine";
import StartScreen from "./components/StartScreen";
import ArchiveDesk from "./components/ArchiveDesk";
import EfficiencyDisplay from "./components/EfficiencyDisplay";
import SystemMessage from "./components/SystemMessage";
import EndingScene from "./components/EndingScene";
import { pick, DICT } from "./i18n/dict";
import "./styles/tokens.css";
import "./styles/animations.css";
import "./styles/game.css";

if (import.meta.env.DEV) {
  // exposed only in dev builds, for automated playtesting / debugging
  (window as any).__game = useGame;
}

// The game is authored at a fixed canvas size and scaled to fit whatever
// surface it's actually rendered in — a full browser tab, a narrower
// artifact/side-panel embed, a smaller window. This keeps every layout
// number in the CSS meaningful instead of re-deriving a second responsive
// layout, and pointer coordinates keep working unmodified at any scale.
const BASE_W = 1440;
const BASE_H = 900;
// Below this scale the 10-11px system-copy labels stop being legible, so
// it's more honest to show the "needs a bigger workspace" message than a
// technically-interactive but unreadable miniature.
const MIN_SCALE = 0.32;

function useStageScale() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tooSmall, setTooSmall] = useState(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.min(1, w / BASE_W, h / BASE_H);
      setTooSmall(s < MIN_SCALE || w === 0 || h === 0);
      setScale(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return { viewportRef, scale, tooSmall };
}

export default function App() {
  const stage = useGame((s) => s.stage);
  const humanity = useGame((s) => s.humanity);
  const lang = useGame((s) => s.lang);
  const tick = useGame((s) => s.tick);
  const setReducedMotion = useGame((s) => s.setReducedMotion);
  const lastTick = useRef<number>(performance.now());
  const { viewportRef, scale, tooSmall } = useStageScale();

  // reduced-motion preference watcher
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [setReducedMotion]);

  // main game loop
  useEffect(() => {
    lastTick.current = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTick.current) / 1000;
      lastTick.current = now;
      tick(dt);
    }, 220);
    return () => clearInterval(id);
  }, [tick]);

  // ambient audio per stage
  useEffect(() => {
    if (stage === "start" || stage === "ending") {
      audioEngine.stopAmbience();
      return;
    }
    const idx =
      stage === "onboarding" ? 0 : stage === "standardization" ? 1 : stage === "acceleration" ? 2 : 3;
    audioEngine.startAmbience(idx);
  }, [stage]);

  // derived visual variables applied to the shell — the void itself never
  // changes color; only the static/noise and the scanline sweep intensify
  // as humanity drains, plus the room's proportions shift toward the panel.
  const stageCfg = STAGES[stage];
  const stageIndex = stageCfg ? stageCfg.index : -1;
  const staticOpacity = stage === "start" ? 0.03 : staticIntensityFor(humanity);
  const panelBorder = 1 + Math.max(0, stageIndex) * 1.4;
  const colCharacter = characterPhase(humanity) === "consumed" ? 70 : 210 - Math.max(0, stageIndex) * 34;
  const colPanel = 300 + Math.max(0, stageIndex) * 34;
  const scanlineOpacity = stageIndex >= 2 ? 0.6 : 0;

  const shellStyle: React.CSSProperties = {
    ["--static-opacity" as any]: staticOpacity,
    ["--panel-border" as any]: `${panelBorder}px`,
    ["--col-character" as any]: `${colCharacter}px`,
    ["--col-panel" as any]: `${colPanel}px`,
    ["--scanline-opacity" as any]: scanlineOpacity,
  };

  return (
    <div className="game-shell" style={shellStyle}>
      <div className="stage-viewport" ref={viewportRef}>
        {tooSmall ? (
          <div className="mobile-block">{pick(DICT.mobileBlock, lang)}</div>
        ) : (
          <div className="stage-canvas" style={{ transform: `scale(${scale})` }}>
            <div className="vignette" />
            <div className="static-overlay" />
            <div className="scanline-veil" />

            {stage === "start" && <StartScreen />}

            {stage !== "start" && stage !== "ending" && (
              <div className="layout">
                <EfficiencyDisplay />
                <ArchiveDesk />
              </div>
            )}

            {stage === "ending" && <EndingScene />}

            <SystemMessage />
          </div>
        )}
      </div>
    </div>
  );
}
