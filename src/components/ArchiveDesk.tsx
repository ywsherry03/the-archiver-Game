import { useGame } from "../game/store";
import { pick, DICT } from "../i18n/dict";
import { STAGES } from "../game/stages";
import ArchiveItem from "./ArchiveItem";
import StampTool from "./StampTool";
import ClassificationPanel from "./ClassificationPanel";
import Character from "./Character";
import SeedObject from "./SeedObject";

export default function ArchiveDesk() {
  const lang = useGame((s) => s.lang);
  const stage = useGame((s) => s.stage);
  const current = useGame((s) => s.current);
  const humanity = useGame((s) => s.humanity);

  const isFinal = stage === "finalChoice";

  return (
    <>
      <div className="character-col">
        <Character humanity={isFinal ? Math.min(humanity, 30) : humanity} />
      </div>

      {isFinal ? (
        <SeedObject />
      ) : (
        <div className="desk">
          <div className="item-stage">
            {current ? (
              <ArchiveItem key={current.uid} item={current} />
            ) : (
              <span className="item-empty-hint">
                {lang === "zh" ? "等待下一份档案…" : "AWAITING NEXT FILE…"}
              </span>
            )}
          </div>
          <StampTool />
        </div>
      )}

      <ClassificationPanel />

      <div className="hint-bar">{hintFor(stage, current, lang)}</div>
    </>
  );
}

function hintFor(stage: string, current: ReturnType<typeof useGame.getState>["current"], lang: "en" | "zh") {
  if (stage === "finalChoice") {
    return lang === "zh" ? "拖入系统接口以服从 · 长按以搁置 · 大幅拖动以拒绝" : "DRAG INTO THE INTERFACE TO COMPLY · HOLD TO SET ASIDE · DRAG FAR TO REFUSE";
  }
  if (!current) return "";
  if (!current.classified) return pick(DICT.hintDrag, lang);
  if (!current.stamped) return pick(DICT.hintStamp, lang);
  const cfg = STAGES[stage];
  if (cfg?.allowCorrection && current.template.correctable && !current.corrected) {
    return pick(DICT.hintStandardize, lang);
  }
  return pick(DICT.hintArchive, lang);
}
