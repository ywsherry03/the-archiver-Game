import type { EndingType, LocalizedText } from "./types";

export interface EndingConfig {
  id: EndingType;
  line1: LocalizedText;
  line2?: LocalizedText;
  delayMs: number; // pause before line2
  allowFreeDraw: boolean;
}

export const ENDINGS: Record<EndingType, EndingConfig> = {
  perfectArchive: {
    id: "perfectArchive",
    line1: { en: "ALL MATERIAL HAS BEEN SUCCESSFULLY ARCHIVED.", zh: "全部材料已成功归档。" },
    line2: { en: "INCLUDING THE ARCHIVER.", zh: "包括归档者本人。" },
    delayMs: 2600,
    allowFreeDraw: false,
  },
  remainingError: {
    id: "remainingError",
    line1: { en: "ARCHIVE COMPLETE.", zh: "归档完成。" },
    line2: { en: "ONE ERROR REMAINS.", zh: "仍有一处误差。" },
    delayMs: 2200,
    allowFreeDraw: false,
  },
  refusal: {
    id: "refusal",
    line1: { en: "THE SYSTEM COULD NOT NAME IT.", zh: "系统无法为它命名。" },
    delayMs: 1600,
    allowFreeDraw: true,
  },
};
