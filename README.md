# The Archiver 归档者

A short (5–8 minute) surreal desk-work ritual about order, efficiency, and what
gets filed away in the process. Built with React + TypeScript + Vite, zero
external game engine, zero paid assets, zero backend.

## Run it

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

## How to play

Drag each arriving file into the correct drawer (`TEXT` / `IMAGE` / `SOUND`),
click **STAMP** to approve it, optionally click **STANDARDIZE** to comply with
the system's request to sanitize it, then drag it into the **CABINET** to
archive it. Keyboard users can `Tab` to a drawer or the cabinet and press
`Enter`/`Space` instead of dragging.

Five stages play out automatically as you process files: **Onboarding →
Standardization → Acceleration → Alienation → the Seed**. In the final
stage an object the system cannot classify appears. What you do with it —
comply, quietly leave one part of it wrong, hold onto it, or drag it far
enough to refuse outright — decides which of three endings you reach.
There's no "resist" button; resistance is just breaking the rules the game
otherwise trained you to follow.

Sound is procedural (Web Audio API, no samples) and starts after your first
click, per browser autoplay rules. Mute and an EN/中 toggle live in the header.

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
    corruption.ts    humanity/efficiency -> color, radius, jitter, grid opacity
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
rotation jitter and grid opacity, which is what actually communicates the
decay to the player.

## Design notes / what's implemented

- Five staged difficulty/tone curve, each adding a new mechanic
  (standardize step, then auto-processing of neglected files, then a 4th
  "UNRESOLVED" drawer and the seed encounter).
- All corruption is visual/behavioural: desaturation, grid snapping,
  rounded → right-angle corners, the character's body turning into file
  tabs / a barcode / cabinet seams, the ambience losing melody for a beat.
- Three endings, derived from accumulated behaviour (compliance, rule
  breaking, whether you ever left the seed imperfect, whether you ever
  dragged it out of bounds) rather than a single final click.
- Procedural audio and visuals throughout — no external images/audio
  files, so there's nothing to license and nothing to fetch at runtime
  except the Google Fonts stylesheet (IBM Plex Mono / Noto Sans SC), which
  degrades gracefully to system monospace fonts if blocked.
- `prefers-reduced-motion` is honored globally (animations collapse to
  ~0ms). A sub-1280×720ish window shows a plain
  `THIS TERMINAL REQUIRES A LARGER WORKSPACE.` message instead of a broken
  layout.

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
