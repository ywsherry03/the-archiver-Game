import { useEffect, useState } from "react";
import { useGame } from "../game/store";
import { pick } from "../i18n/dict";

export default function SystemMessage() {
  const lang = useGame((s) => s.lang);
  const message = useGame((s) => s.message);
  const [visible, setVisible] = useState<typeof message>(null);

  useEffect(() => {
    if (!message) return;
    setVisible(message);
    const t = setTimeout(() => setVisible(null), 1700);
    return () => clearTimeout(t);
  }, [message]);

  if (!visible) return null;

  return (
    <div className="message-layer" aria-live="polite">
      <div key={visible.id} className={`message-banner tone-${visible.tone}`}>
        {pick(visible.text, lang)}
      </div>
    </div>
  );
}
