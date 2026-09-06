import { useGame } from "../game/store";
import { pick, DICT } from "../i18n/dict";
import type { Category } from "../game/types";
import { STAGES } from "../game/stages";

export default function ClassificationPanel() {
  const lang = useGame((s) => s.lang);
  const stage = useGame((s) => s.stage);
  const processedFiles = useGame((s) => s.processedFiles);
  const classify = useGame((s) => s.classify);
  const archiveCurrent = useGame((s) => s.archiveCurrent);
  const cfg = STAGES[stage] ?? STAGES.onboarding;
  const categories: Category[] = cfg.categories;

  return (
    <div className="panel">
      <div className="panel-title">{lang === "zh" ? "分类抽屉" : "Classification"}</div>
      <div
        className="drawer-grid"
        style={{ gridTemplateColumns: categories.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr" }}
      >
        {categories.map((cat) => (
          <div
            key={cat}
            className="drawer"
            data-drop-zone={cat}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                classify(cat);
              }
            }}
          >
            {pick(DICT.categoryLabel[cat], lang)}
          </div>
        ))}
      </div>

      <div className="panel-title" style={{ marginTop: 4 }}>
        {lang === "zh" ? "档案柜" : "Cabinet"}
      </div>
      <div
        className="cabinet"
        data-drop-zone="cabinet"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            archiveCurrent();
          }
        }}
      >
        <span className="cabinet-label">{pick(DICT.archive, lang)}</span>
        <span className="cabinet-count">{String(processedFiles).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
