import { useRef, useState } from "react";
import { useGame } from "../game/store";
import type { ArchiveInstance } from "../game/types";
import ItemVisual from "./ItemVisual";
import { pick } from "../i18n/dict";
import { jitterFor } from "../visuals/corruption";
import { audioEngine } from "../audio/audioEngine";

interface Props {
  item: ArchiveInstance;
}

export default function ArchiveItem({ item }: Props) {
  const lang = useGame((s) => s.lang);
  const humanity = useGame((s) => s.humanity);
  const classify = useGame((s) => s.classify);
  const archiveCurrent = useGame((s) => s.archiveCurrent);

  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [resisting, setResisting] = useState(false);
  const [flying, setFlying] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const jitter = jitterFor(humanity, item.seed, item.template.irregularity);
  const ready = !!item.classified && item.stamped;

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0 });
    audioEngine.unlock();
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setDrag({ x: dx, y: dy });
    updateHoverTargets(e.clientX, e.clientY);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!start.current) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    clearHoverTargets();
    const dropZone = target?.closest<HTMLElement>("[data-drop-zone]");
    start.current = null;

    if (dropZone) {
      const kind = dropZone.dataset.dropZone;
      if (kind === "cabinet") {
        if (ready) {
          const cabinetEl = dropZone.getBoundingClientRect();
          const itemEl = rootRef.current?.getBoundingClientRect();
          if (itemEl) {
            setFlying(true);
            setDrag({
              x: cabinetEl.left + cabinetEl.width / 2 - (itemEl.left + itemEl.width / 2),
              y: cabinetEl.top + cabinetEl.height / 2 - (itemEl.top + itemEl.height / 2),
            });
          }
          audioEngine.playAccept();
          setTimeout(() => archiveCurrent(), 240);
          return;
        } else {
          triggerResist();
        }
      } else if (kind && ["TEXT", "IMAGE", "SOUND", "ANOMALY"].includes(kind)) {
        const before = item.classified;
        classify(kind as any);
        const cur = useGame.getState().current;
        if (!cur || cur.classified === before) {
          triggerResist();
        } else {
          audioEngine.playPaper();
        }
      }
    }
    setDrag(null);
  }

  function triggerResist() {
    setResisting(true);
    audioEngine.playReject();
    setTimeout(() => setResisting(false), 340);
  }

  function updateHoverTargets(x: number, y: number) {
    const el = document.elementFromPoint(x, y);
    document.querySelectorAll("[data-drop-zone]").forEach((z) => z.classList.remove("hover-target"));
    const zone = el?.closest("[data-drop-zone]");
    if (zone) zone.classList.add("hover-target");
  }

  function clearHoverTargets() {
    document.querySelectorAll("[data-drop-zone]").forEach((z) => z.classList.remove("hover-target"));
  }

  const translate = drag ? `translate(${drag.x}px, ${drag.y}px)` : "translate(0,0)";
  const rot = drag ? jitter * 0.4 : jitter;

  return (
    <div
      ref={rootRef}
      className={[
        "archive-item",
        drag ? "dragging" : "",
        resisting ? "resisting" : "",
        flying ? "flying" : "",
      ].join(" ")}
      style={{
        transform: `${translate} rotate(${rot}deg)`,
        transition: drag && !flying ? "none" : "transform 260ms var(--ease-snap), opacity 260ms",
        opacity: flying ? 0.15 : 1,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      role="group"
      aria-label={item.template.id}
      tabIndex={0}
    >
      <div
        className="item-card"
        style={{ borderRadius: Math.max(2, 14 * (humanity / 100) * item.template.irregularity) }}
      >
        <div className="item-badges">
          <span className={`item-badge ${item.classified ? "on" : ""}`} title="classified" />
          <span className={`item-badge ${item.stamped ? "on" : ""}`} title="stamped" />
        </div>
        {item.stamped && (
          <div className="ink-stamp-mark" style={{ ["--stamp-rot" as any]: `${jitter}deg` }}>
            {lang === "zh" ? "已核准" : "APPROVED"}
          </div>
        )}
        <div className="item-visual">
          <ItemVisual
            template={item.template}
            seed={item.seed}
            humanity={humanity}
            corrected={item.corrected}
          />
        </div>
        {item.template.hasText && item.template.text && (
          <div className={`item-text ${item.corrected ? "corrected" : ""}`}>
            “{pick(item.template.text[0], lang)}”
          </div>
        )}
      </div>
    </div>
  );
}
