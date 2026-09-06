import type { Lang } from "../game/types";

export const DICT = {
  titleEn: "THE ARCHIVER",
  titleZh: "归档者",
  subtitle: {
    en: "Everything that arrives here will be kept in order.",
    zh: "抵达这里的一切，都会被妥善安置。",
  },
  begin: { en: "BEGIN SHIFT", zh: "开始工作" },
  restart: { en: "BEGIN AGAIN", zh: "重新开始" },
  categoryLabel: {
    TEXT: { en: "TEXT", zh: "文本" },
    IMAGE: { en: "IMAGE", zh: "影像" },
    SOUND: { en: "SOUND", zh: "声音" },
    ANOMALY: { en: "UNRESOLVED", zh: "未定义" },
  },
  stamp: { en: "STAMP", zh: "盖章" },
  standardize: { en: "STANDARDIZE", zh: "标准化" },
  archive: { en: "ARCHIVE", zh: "归档" },
  classify: { en: "CLASSIFY", zh: "分类" },
  correct: { en: "CORRECT", zh: "修正" },
  reduce: { en: "REDUCE", zh: "简化" },
  hintDrag: { en: "DRAG THE FILE INTO A DRAWER", zh: "将档案拖入抽屉" },
  hintStamp: { en: "CLICK STAMP TO CONFIRM", zh: "点击印章以确认" },
  hintArchive: { en: "DRAG TO THE CABINET", zh: "拖入档案柜" },
  hintStandardize: { en: "OPTIONAL: STANDARDIZE BEFORE ARCHIVING", zh: "可选：归档前先标准化" },
  efficiency: { en: "EFFICIENCY", zh: "效率" },
  processed: { en: "PROCESSED", zh: "已处理" },
  timeLabel: { en: "SHIFT TIME", zh: "工时" },
  mute: { en: "SOUND", zh: "声音" },
  lang: { en: "EN", zh: "中" },
  mobileBlock: { en: "THIS TERMINAL REQUIRES A LARGER WORKSPACE.", zh: "此终端需要更大的工作空间。" },
  seedPrompts: [
    { en: "CLASSIFY", zh: "分类" },
    { en: "STANDARDIZE", zh: "标准化" },
    { en: "ARCHIVE", zh: "归档" },
  ],
  seedUnclassifiable: { en: "UNCLASSIFIABLE OBJECT DETECTED.", zh: "检测到无法分类的物体。" },
  protectHint: { en: "HOLD TO SET ASIDE", zh: "长按以搁置" },
  escapeHint: { en: "DRAG BEYOND THE DESK TO REFUSE", zh: "拖出工作台以拒绝" },
  freeDrawHint: { en: "DRAW, IF YOU STILL CAN.", zh: "画吧，如果你还能。" },
  again: { en: "PLAY AGAIN", zh: "再玩一次" },
  soundOn: { en: "SOUND ON", zh: "声音开" },
  soundOff: { en: "SOUND OFF", zh: "声音关" },
};

export function pick(l: { en: string; zh: string }, lang: Lang): string {
  return lang === "zh" ? l.zh : l.en;
}
