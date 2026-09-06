import { useState } from "react";
import { useGame } from "../game/store";
import { DICT, pick } from "../i18n/dict";
import { STAGES } from "../game/stages";
import { audioEngine } from "../audio/audioEngine";

export default function StampTool() {
  const lang = useGame((s) => s.lang);
  const stage = useGame((s) => s.stage);
  const current = useGame((s) => s.current);
  const stampCurrent = useGame((s) => s.stampCurrent);
  const standardizeCurrent = useGame((s) => s.standardizeCurrent);
  const [stampAnim, setStampAnim] = useState(false);

  if (!current) return <div className="tool-row" aria-hidden="true" />;

  const cfg = STAGES[stage] ?? STAGES.onboarding;
  const canStamp = !!current.classified && !current.stamped;
  const canStandardize = cfg.allowCorrection && current.template.correctable && !current.corrected;

  function handleStamp() {
    if (!canStamp) return;
    audioEngine.unlock();
    audioEngine.playStamp();
    setStampAnim(true);
    stampCurrent();
    setTimeout(() => setStampAnim(false), 420);
  }

  function handleStandardize() {
    if (!canStandardize) return;
    audioEngine.unlock();
    audioEngine.playTypewriterKey();
    standardizeCurrent();
  }

  return (
    <div className="tool-row">
      {cfg.allowCorrection && current.template.correctable && (
        <button
          className={`tool-btn ${current.corrected ? "" : "ghost"}`}
          onClick={handleStandardize}
          disabled={current.corrected}
        >
          {current.corrected ? (lang === "zh" ? "已标准化" : "STANDARDIZED") : pick(DICT.standardize, lang)}
        </button>
      )}
      <button
        className={`tool-btn stamp ${stampAnim ? "stamped-flash" : ""}`}
        onClick={handleStamp}
        disabled={!canStamp && !current.stamped}
      >
        {current.stamped ? (lang === "zh" ? "已盖章" : "STAMPED") : pick(DICT.stamp, lang)}
      </button>
    </div>
  );
}
