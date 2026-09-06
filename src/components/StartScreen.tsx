import { useGame } from "../game/store";
import { DICT, pick } from "../i18n/dict";
import { audioEngine } from "../audio/audioEngine";

export default function StartScreen() {
  const lang = useGame((s) => s.lang);
  const setLang = useGame((s) => s.setLang);
  const startGame = useGame((s) => s.startGame);

  function begin() {
    audioEngine.unlock();
    startGame();
  }

  return (
    <div className="start-screen">
      <div className="start-frame" />
      <div className="start-lang-toggle">
        <button className="icon-btn" data-active={lang === "en"} onClick={() => setLang("en")}>
          EN
        </button>
        <button className="icon-btn" data-active={lang === "zh"} onClick={() => setLang("zh")}>
          中
        </button>
      </div>

      <h1 className="start-title">
        {DICT.titleEn}
        <span className="cn">{DICT.titleZh}</span>
      </h1>

      <p className="start-subtitle">{pick(DICT.subtitle, lang)}</p>

      <div className="start-actions">
        <button className="begin-btn" onClick={begin}>
          {pick(DICT.begin, lang)}
        </button>
      </div>
    </div>
  );
}
