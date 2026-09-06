# The Archiver 归档者

A surreal 5–8 minute desk-work ritual, built with React + TypeScript +
Vite — no game engine, no paid assets, no backend.

一个 5–8 分钟的超现实办公室仪式。用 React + TypeScript + Vite 构建——没有
游戏引擎，没有付费素材，没有后端。

**▶ Play now / 在线试玩：https://ywsherry03.github.io/the-archiver/**
**Source / 源代码：https://github.com/ywsherry03/the-archiver**

*Bored? Come clock in and stamp things for a while.*
*无聊的话，欢迎来这里上班盖章。*

---

## How to play 玩法

**EN** — Sort what arrives into the right drawer, stamp it, standardize it
if asked, file it in the cabinet. Five stages, each faster than the last.
Near the end, something arrives that resists all of it — what you do with
it decides which of three endings you reach. There's no resist button.
(Keyboard: `Tab` + `Enter`/`Space` works everywhere a drag does.)

**中文** — 把到来的东西分类、盖章、按要求标准化，再归档。五个阶段，一次
比一次快。临近结尾时，会出现一样拒绝被归类的东西——你如何对待它，决定了
三个结局中的哪一个。游戏里没有「反抗」按钮。（键盘操作：`Tab` + `Enter`
/`Space` 可以代替所有拖拽。）

## 留白 · a blank space

**EN** — Everything that arrives on this desk was alive, once. The job
never asks you to notice that.

**中文** — 到达这张桌上的一切，都曾经是活的。这份工作，从不要求你注意到
这一点。

## Run it 运行方法

```bash
npm install
npm run dev
```

Open the printed local URL (Chrome/Safari, desktop, 1280px+ wide). For a
production build:

```bash
npm run build
npm run preview
```

Pushing to `main` on GitHub also triggers an Actions workflow
(`.github/workflows/deploy.yml`) that rebuilds and redeploys the live
Pages link above automatically.

## Project structure

```
src/
  game/
    types.ts        state & domain types
    store.ts         zustand store — all game logic/transitions live here
    stages.ts        per-stage config: thresholds, drawers, copy, auto-process
    archiveData.ts   the pool of "living" objects (poem, bird, letter, ...)
    endings.ts       the three ending configs
    scoring.ts       deriveEnding(state) — behavioural, not last-click
  components/
    ArchiveDesk.tsx        composes the whole in-game screen
    ArchiveItem.tsx        the draggable file card (pointer-events based)
    ItemVisual.tsx          procedural SVG per object type
    Character.tsx           the Archiver's body, morphs with `humanity`
    ClassificationPanel.tsx drawers + cabinet drop targets
    StampTool.tsx            stamp / standardize buttons
    EfficiencyDisplay.tsx    header HUD
    SystemMessage.tsx        transient system-copy banner
    SeedObject.tsx           the final unclassifiable object + its 3 prompts
    EndingScene.tsx          all 3 endings + the free-draw canvas
    StartScreen.tsx
  visuals/
    corruption.ts    humanity/efficiency -> color, radius, jitter, static opacity
    shapes.ts        organic blob / wavy-line / waveform SVG path generators
    drawingCanvas.ts canvas helpers for the refusal ending's free draw
  audio/
    audioEngine.ts   procedural Web Audio engine (stamps, paper, clock, seed breath, ambience)
  i18n/dict.ts       EN/ZH UI copy
  styles/            tokens.css (design tokens) / animations.css / game.css
```

State is intentionally centralized in `game/store.ts` (zustand): every
component reads derived values and calls actions, none of them own game
logic. `humanity` is tracked internally and never shown as a number — only
`visuals/corruption.ts` translates it into saturation, corner radius,
rotation jitter and static/grain opacity, which is what actually
communicates the decay to the player.

## Design notes / what's implemented

- Five staged difficulty/tone curve, each adding a new mechanic
  (standardize step, then auto-processing of neglected files, then a 4th
  "UNRESOLVED" drawer and the seed encounter).
- All corruption is visual/behavioural: desaturation toward a near-black
  void, soft → right-angle corners, the character's body turning into file
  tabs / a barcode / cabinet seams, the ambience losing melody for a beat.
- Three endings, derived from accumulated behaviour (compliance, rule
  breaking, whether you ever left the seed imperfect, whether you ever
  dragged it out of bounds) rather than a single final click.
- Procedural audio and visuals throughout — no external images/audio
  files, so there's nothing to license and nothing to fetch at runtime
  except the Google Fonts stylesheet (IBM Plex Mono / Noto Sans SC), which
  degrades gracefully to system monospace fonts if blocked.
- `prefers-reduced-motion` is honored globally (animations collapse to
  ~0ms). A window that's too small to play in shows a plain
  `THIS TERMINAL REQUIRES A LARGER WORKSPACE.` message instead of a broken
  layout — the game scales to fit any workspace above that floor.

## Ideas for further iteration

- More archive object templates in `archiveData.ts` (the pool is easy to
  extend — add a template + a `case` in `ItemVisual.tsx`).
- A fourth "ambiguous" ending variant for behaviour that sits right on a
  threshold boundary.
- Per-item pointer-drag crop tool for `STANDARDIZE`, instead of the current
  click-to-reduce, if you want the trim gesture to be tactile too.
- A subtle seeded RNG per run (the hook is already in `archiveData.ts` —
  `mulberry32`) so a "shift number" could be shown and shared/replayed.
- Real recorded ambience/foley to layer under the procedural audio for
  extra texture, kept behind the same `audioEngine` interface.
