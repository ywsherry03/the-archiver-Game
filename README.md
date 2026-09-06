# The Archiver 归档者

A short (5–8 minute) surreal desk-work ritual about order, efficiency, and
what gets filed away in the process. Built with React + TypeScript + Vite —
zero external game engine, zero paid assets, zero backend.

一个 5–8 分钟的超现实办公室仪式：关于秩序、效率，以及在追求效率的过程中，
究竟是什么被悄悄归档、遗忘。用 React + TypeScript + Vite 构建——没有游戏引擎，
没有付费素材，没有后端。

**▶ Play now / 在线试玩：https://ywsherry03.github.io/the-archiver/**
**Source / 源代码：https://github.com/ywsherry03/the-archiver**

---

## How to play 简单玩法

**EN** — Files arrive on your desk one at a time: a poem, a bird, a child's
drawing, a letter never sent, a memory. Drag each one into the correct
drawer (`TEXT` / `IMAGE` / `SOUND`), click **STAMP** to approve it,
optionally click **STANDARDIZE** if the system asks you to trim away
whatever doesn't fit the template, then drag it into the **CABINET** to
file it away. Keyboard users can `Tab` to a drawer or the cabinet and press
`Enter`/`Space` instead of dragging.

Five stages play out automatically as you work: **Onboarding →
Standardization → Acceleration → Alienation → the Seed.** Each stage adds
a new rule and moves faster than the last. In the final stage, an object
the system cannot classify arrives — no name, no category, just color.
What you do with it (comply with the system's request, quietly leave one
part of it "wrong," hold onto it, or drag it far enough away to refuse
outright) decides which of three endings you reach. There is no "resist"
button. Refusing is just breaking the rules the game spent four stages
training you to follow.

Sound is procedural (Web Audio API, no samples) and starts after your
first click, per browser autoplay rules. Mute and an EN/中 toggle live in
the header.

**中文** — 文件会一件一件地出现在你的桌上：一首诗、一只鸟、一张孩子的画、
一封没有寄出的信、一段记忆。把它拖进正确的抽屉（`文本` / `图像` / `声音`），
点击 **盖章** 通过，如果系统要求，可以点击 **标准化** 来削掉它不符合模板的
部分，最后把它拖进 **档案柜** 归档。也可以用键盘：`Tab` 切换到抽屉或档案柜，
按 `Enter`/`Space` 代替拖拽。

游戏会自动经过五个阶段：**入职 → 标准化 → 提速 → 异化 → 种子。** 每个阶段
都会加一条新规则，节奏也会更快。到了最后一个阶段，会出现一个系统无法归类的
物体——没有名字，没有类别，只有颜色。你如何对待它（顺从系统的要求、悄悄留
下它「错误」的一部分、把它护在怀里、还是把它拖得足够远以彻底拒绝），决定了
你会走向三个结局中的哪一个。游戏里没有「反抗」按钮——拒绝，只是打破了前四个
阶段一直在训练你遵守的规则。

声音是纯程序生成的（Web Audio API，无采样素材），根据浏览器的自动播放规则，
会在你第一次点击后才开始。静音开关和中/英切换都在顶部。

## Core philosophy 核心哲学

**EN** — The premise is simple: you are the Archiver, and your job is to
process everything that arrives — sort it, correct it, file it. The
things that arrive happen to be alive: poems, birds, drawings, memories,
something that might just be a feeling. None of that matters to the job.
A poem and a memory are both just files that need a category and a stamp.

The game's real subject is a quieter equation: **rising efficiency and the
disappearance of individuality are not two separate trends — they are the
same process, seen from two angles.** Nothing in the game says this out
loud. There is no villain, no warning label, no dialogue explaining the
system's intentions. Instead the game tries to make you *feel* it happen,
the way it actually happens to people: gradually, through repetition,
until the repetition itself has become who you are. The stamping motion
that starts as a choice becomes a reflex. The "standardize" step that
starts as sanding one rough edge becomes automatic, then optional, then
something the system just does for you while you watch.

The hidden `humanity` value is the mechanism for this. It is never shown
as a number, an HP bar, or a percentage — because a system that measured
your remaining humanity for you would already have finished the job of
turning it into a stat. Instead it leaks out through everything else: the
saturation drains from every object you touch, corners that were once
soft and organic snap to right angles, your own on-screen body slowly
turns into filing-cabinet geometry — a barcode, straight seams, a face
that stops needing a face. By the time the unclassifiable "seed" arrives
at the end, refusing to be filed at all, you're the one who has to decide
whether anything is left in you that still recognizes it as a thing worth
protecting, rather than one more input.

That's also why there is no single "good" or "bad" ending, and no ending
determined by one dramatic final click. The three outcomes are the sum of
everything you already did — how completely you complied, how many small
rules you broke along the way, whether you ever quietly left one thing
imperfect rather than perfecting it. The system doesn't judge you at the
end. It just adds up who you already were.

**中文** — 设定很简单：你是「归档者」，工作是处理一切到来的东西——分类、
修正、归档。恰好，到来的这些东西是「活」的：诗、鸟、画、记忆，还有一些也
许只是一种感觉的东西。但这对这份工作而言并不重要。一首诗和一段记忆，都不
过是需要分类和盖章的文件而已。

这个游戏真正想说的，其实是一个更安静的等式：**效率的提升，和个性的消失，
并不是两件事——它们是同一个过程的两面。** 游戏里没有任何一句话会把这句话
直接说出来。没有反派，没有警示语，没有解释系统意图的对白。它想做的，是让
你「感受」到这个过程真实发生的方式——不是靠某个瞬间的剧变，而是靠重复：
重复到某一天，重复本身就变成了你是谁。盖章这个动作，一开始是一次选择，
后来变成了反射；「标准化」这一步，一开始只是磨掉一个不合规的边角，后来
变得自动，再后来变得可选，最后干脆变成系统替你完成、你只需要看着的动作。

隐藏的「人性值」就是承载这一切的机制。它从不以数字、血条或百分比的形式
出现——因为一个会替你精确计量「剩余人性」的系统，本身就已经完成了把人性
变成一项指标的工作。它只会渗透进其他一切之中：你碰过的每一个物体，色彩
会慢慢褪去；本来柔软有机的边角，会一点点收紧成直角；你在屏幕上的身体，
也会慢慢变成档案柜的几何构造——条形码、笔直的接缝、一张不再需要表情的
脸。等到最后那个无法被归类、拒绝被归档的「种子」出现时,真正需要判断的，
是你身上是否还剩下一点点东西，能认出它值得被保护，而不只是又一份待处理
的输入。

这也是为什么游戏没有单一的「好」或「坏」结局，也不存在靠最后一次戏剧性
点击就能扭转的结局。三种结局，都是你此前所有行为的总和——你顺从得有多
彻底、途中打破过多少条小规则、是否曾经悄悄留下过一处「不完美」而不是把
它修正到底。系统在最后不会评判你，它只是把「你已经是谁」加总了出来。

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
