import { useGame } from "../game/store";
import { DICT, pick } from "../i18n/dict";
import { audioEngine } from "../audio/audioEngine";

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function EfficiencyDisplay() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const muted = useGame((s) => s.muted);
  const toggleMute = useGame((s) => s.toggleMute);
  const efficiency = useGame((s) => s.efficiency);
  const processedFiles = useGame((s) => s.processedFiles);
  const elapsedTime = useGame((s) => s.elapsedTime);

  return (
    <div className="header">
      <div className="header-brand">
        <span className="mark" />
        {lang === "zh" ? "归档者" : "THE ARCHIVER"}
      </div>
      <div className="header-readout">
        <div className="readout-block">
          <span className="readout-label">{pick(DICT.processed, lang)}</span>
          <span className="readout-value">{String(processedFiles).padStart(3, "0")}</span>
        </div>
        <div className="readout-block">
          <span className="readout-label">{pick(DICT.timeLabel, lang)}</span>
          <span className="readout-value">{formatTime(elapsedTime)}</span>
        </div>
        <div className="readout-block">
          <span className="readout-label">{pick(DICT.efficiency, lang)}</span>
          <span className="readout-value">{Math.round(efficiency)}%</span>
          <div className="efficiency-bar">
            <span style={{ ["--pct" as any]: `${Math.min(100, efficiency)}%` }} />
          </div>
        </div>
      </div>
      <div className="header-controls">
        <button
          className="icon-btn"
          data-active={muted}
          onClick={() => {
            audioEngine.unlock();
            toggleMute();
            audioEngine.setMuted(!muted);
          }}
        >
          {muted ? pick(DICT.soundOff, lang) : pick(DICT.soundOn, lang)}
        </button>
        <button className="icon-btn" onClick={() => setLang(lang === "en" ? "zh" : "en")}>
          {lang === "en" ? "中" : "EN"}
        </button>
      </div>
    </div>
  );
}
