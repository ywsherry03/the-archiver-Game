// Procedural, dependency-free audio engine using the Web Audio API.
// No external samples: everything here is synthesized so the game has
// zero asset weight and no licensing concerns.

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private ambientTimer: ReturnType<typeof setInterval> | null = null;
  private ambientStage = -1;
  private noiseBuffer: AudioBuffer | null = null;

  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);
      this.noiseBuffer = this.makeNoiseBuffer();
    }
    return this.ctx;
  }

  /** Call on first user gesture (click/keydown) to satisfy autoplay policies. */
  unlock() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.55, this.ctx.currentTime, 0.08);
    }
  }

  private makeNoiseBuffer(): AudioBuffer | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const len = ctx.sampleRate * 1.2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private noiseBurst(opts: {
    duration: number;
    filterFreq: number;
    filterType?: BiquadFilterType;
    gain?: number;
    q?: number;
  }) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.master || !this.noiseBuffer) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType ?? "bandpass";
    filter.frequency.value = opts.filterFreq;
    filter.Q.value = opts.q ?? 0.9;
    const gain = ctx.createGain();
    const g = opts.gain ?? 0.25;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(g, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + opts.duration);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    src.stop(ctx.currentTime + opts.duration + 0.05);
  }

  private tone(opts: {
    freq: number;
    duration: number;
    type?: OscillatorType;
    gain?: number;
    slideTo?: number;
    delay?: number;
  }) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const osc = ctx.createOscillator();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + opts.duration);
    const gain = ctx.createGain();
    const g = opts.gain ?? 0.15;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(g, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);
    osc.connect(gain).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + opts.duration + 0.05);
  }

  playPaper() {
    this.noiseBurst({ duration: 0.28, filterFreq: 2200, gain: 0.12, q: 0.6 });
  }

  playStamp() {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.tone({ freq: 90, duration: 0.18, type: "square", gain: 0.22, slideTo: 45 });
    this.noiseBurst({ duration: 0.1, filterFreq: 900, gain: 0.3, q: 1.2 });
  }

  playAccept() {
    this.tone({ freq: 520, duration: 0.12, type: "sine", gain: 0.1 });
    this.tone({ freq: 780, duration: 0.16, type: "sine", gain: 0.09, delay: 0.06 });
  }

  playReject() {
    this.tone({ freq: 160, duration: 0.22, type: "sawtooth", gain: 0.12, slideTo: 90 });
  }

  playTypewriterKey() {
    this.noiseBurst({ duration: 0.05, filterFreq: 4200, gain: 0.18, q: 2 });
  }

  playClockTick() {
    this.noiseBurst({ duration: 0.04, filterFreq: 3200, gain: 0.1, q: 4 });
  }

  playGlitch() {
    const freqs = [220, 440, 90, 660];
    freqs.forEach((f, i) =>
      this.tone({ freq: f, duration: 0.06, type: "square", gain: 0.08, delay: i * 0.045 })
    );
  }

  playSeedBreath(strength: number) {
    // strength 0..1 - shrinks toward a thin, irregular tone as integrity fades
    const base = 220 + strength * 90;
    this.tone({
      freq: base,
      duration: 0.9 + strength * 0.6,
      type: "sine",
      gain: 0.05 + strength * 0.05,
      slideTo: base * (0.85 + Math.random() * 0.1),
    });
  }

  playFreeDrawStroke(pitch: number) {
    this.tone({ freq: 300 + pitch * 260, duration: 0.09, type: "triangle", gain: 0.05 });
  }

  /** Ambient bed that evolves 0 (warm/melodic) -> 3 (mechanical/cold). */
  startAmbience(stageIndex: number) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    if (stageIndex === this.ambientStage) return;
    this.ambientStage = stageIndex;
    if (this.ambientTimer) clearInterval(this.ambientTimer);

    const intervalMs = [1400, 950, 620, 420][Math.min(stageIndex, 3)];
    const melodic = stageIndex === 0;
    const semiPool = melodic ? [0, 3, 5, 7, 10] : [0, 0, 7, 0];

    this.ambientTimer = setInterval(() => {
      if (this.muted) return;
      const semis = semiPool[Math.floor(Math.random() * semiPool.length)];
      const freq = 130 * Math.pow(2, semis / 12);
      this.tone({
        freq,
        duration: melodic ? 0.5 : 0.12,
        type: melodic ? "sine" : "square",
        gain: melodic ? 0.045 : 0.03,
      });
      if (stageIndex >= 2) this.playClockTick();
    }, intervalMs);
  }

  stopAmbience() {
    if (this.ambientTimer) clearInterval(this.ambientTimer);
    this.ambientTimer = null;
    this.ambientStage = -1;
  }
}

export const audioEngine = new AudioEngine();
