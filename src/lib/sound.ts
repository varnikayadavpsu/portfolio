"use client";

/*
 * Every sound on the site is synthesised live with the Web Audio API: no audio
 * files, nothing to license, a few KB of code. Browsers only allow audio after
 * the visitor's first click, tap or key press, so nothing plays before that.
 *
 * Use it two ways:
 *   • sfx.ring(), sfx.clack() … from code, or
 *   • data-sfx="clack" (on click) / data-sfx-hover="flutter" (on hover) on any element;
 *     <SoundLayer /> wires those up for the whole page.
 */

const KEY = "vy-sound";
let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled = true;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    enabled = localStorage.getItem(KEY) !== "off";
  } catch {
    /* storage blocked: keep the default */
  }
}

export const soundState = {
  get: () => enabled,
  getServer: () => true,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  set(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (!on) stopVinyl();
    listeners.forEach((f) => f());
  },
};

/** Call from a user gesture: creates/resumes the audio context. */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    out = ctx.createGain();
    out.gain.value = 0.6;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    out.connect(comp).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

/** True once audio has been unlocked by a gesture and sound is switched on. */
export function audioReady() {
  return enabled && ctx?.state === "running";
}

/** Run a sound if audio is allowed and switched on. */
function run(fn: (c: AudioContext, t: number) => void) {
  if (!enabled || !ctx || !out) return;
  const c = ctx;
  if (c.state === "running") fn(c, c.currentTime + 0.005);
  else void c.resume().then(() => fn(c, c.currentTime + 0.005));
}

/* ── primitives ─────────────────────────────────────────────────────────── */

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function noise(c: AudioContext) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

type NoiseOpts = { type?: BiquadFilterType; f?: number; f2?: number; q?: number; gain?: number; attack?: number; dest?: AudioNode };
/** A filtered noise burst with an exponential decay. */
function hiss(c: AudioContext, t: number, dur: number, o: NoiseOpts = {}) {
  const s = c.createBufferSource();
  s.buffer = noise(c);
  const filt = c.createBiquadFilter();
  filt.type = o.type ?? "bandpass";
  filt.frequency.setValueAtTime(o.f ?? 1000, t);
  if (o.f2) filt.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
  filt.Q.value = o.q ?? 1;
  const g = c.createGain();
  const a = o.attack ?? 0.002;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.3, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, a + 0.005));
  s.connect(filt).connect(g).connect(o.dest ?? out!);
  s.start(t, Math.random() * 1.5);
  s.stop(t + dur + 0.05);
}

type ToneOpts = { type?: OscillatorType; f?: number; f2?: number; gain?: number; attack?: number; dest?: AudioNode; detune?: number };
/** An oscillator note with an exponential decay (optionally gliding in pitch). */
function tone(c: AudioContext, t: number, dur: number, o: ToneOpts = {}) {
  const osc = c.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.f ?? 440, t);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + dur);
  if (o.detune) osc.detune.value = o.detune;
  const g = c.createGain();
  const a = o.attack ?? 0.004;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain ?? 0.2, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, a + 0.005));
  osc.connect(g).connect(o.dest ?? out!);
  osc.start(t);
  osc.stop(t + dur + 0.05);
  return osc;
}

/* ── the sounds ─────────────────────────────────────────────────────────── */

/** A small, dry UI click. */
function click(c: AudioContext, t: number) {
  hiss(c, t, 0.025, { type: "highpass", f: 4200, gain: 0.18 });
  tone(c, t, 0.035, { f: 2100, f2: 1300, gain: 0.06 });
}

/** A bubbly pop. */
function pop(c: AudioContext, t: number, gain = 0.32) {
  tone(c, t, 0.12, { f: 880, f2: 170, gain });
  hiss(c, t, 0.02, { f: 2600, q: 2, gain: gain * 0.3 });
}

/** Masking tape torn off the roll: a run of tiny crackles rising in pitch. */
function tape(c: AudioContext, t: number) {
  for (let i = 0; i < 20; i++) {
    hiss(c, t + i * 0.0105 + rnd(0, 0.004), 0.014, { f: 1600 + i * 190, q: 2.5, gain: rnd(0.08, 0.22) });
  }
  hiss(c, t, 0.24, { f: 2200, f2: 5200, q: 0.8, gain: 0.05, attack: 0.03 });
}

/** Laptop keys: a burst of clacky keystrokes, ending on the space bar. */
function keys(c: AudioContext, t: number) {
  let tt = t;
  for (let i = 0; i < 7; i++) {
    tt += rnd(0.05, 0.11);
    hiss(c, tt, 0.03, { f: rnd(2400, 4200), q: 3, gain: rnd(0.16, 0.26) });
    tone(c, tt, 0.035, { f: rnd(160, 220), gain: 0.07 });
  }
  tt += 0.13;
  hiss(c, tt, 0.05, { f: 1400, q: 1.5, gain: 0.22 });
  tone(c, tt, 0.06, { f: 120, gain: 0.12 });
}

/** Notebook pages flicking. */
function pages(c: AudioContext, t: number) {
  for (let i = 0; i < 3; i++) {
    const tt = t + i * 0.12 + rnd(0, 0.03);
    hiss(c, tt, 0.15, { f: 1500, f2: 5200, q: 0.7, gain: 0.2, attack: 0.04 });
    hiss(c, tt + 0.12, 0.015, { type: "highpass", f: 6000, gain: 0.12 });
  }
}

/** A struck metal trophy: inharmonic bell partials ringing out. */
function trophy(c: AudioContext, t: number) {
  const base = 1046;
  [
    [1, 0.22, 1.9],
    [2.76, 0.11, 1.1],
    [5.4, 0.06, 0.6],
    [8.93, 0.035, 0.35],
  ].forEach(([r, g, d]) => tone(c, t, d, { f: base * r, gain: g }));
  hiss(c, t, 0.02, { type: "highpass", f: 5000, gain: 0.15 });
}

/** Two billiard balls: the clack, a short roll on the felt, then a cushion knock. */
function clack(c: AudioContext, t: number) {
  tone(c, t, 0.05, { f: 2650, gain: 0.34, attack: 0.001 });
  tone(c, t, 0.035, { f: 3900, gain: 0.17, attack: 0.001 });
  hiss(c, t, 0.015, { type: "highpass", f: 3500, gain: 0.3 });
  hiss(c, t + 0.03, 0.55, { type: "lowpass", f: 420, gain: 0.07, attack: 0.08 });
  tone(c, t + 0.42, 0.09, { f: 210, f2: 150, gain: 0.16 });
  tone(c, t + 0.42, 0.03, { f: 2400, gain: 0.08, attack: 0.001 });
}

/** A cash-register "cha-ching" for the trading chart. */
function coin(c: AudioContext, t: number) {
  hiss(c, t, 0.05, { f: 900, q: 1.5, gain: 0.25 });
  tone(c, t + 0.01, 0.07, { type: "square", f: 1318, gain: 0.07 });
  tone(c, t + 0.09, 0.6, { type: "square", f: 1760, gain: 0.08 });
  tone(c, t + 0.09, 0.7, { f: 2637, gain: 0.06 });
  hiss(c, t + 0.09, 0.35, { type: "highpass", f: 6000, gain: 0.06 });
}

/** One "brrring": a hammer hitting two detuned bells ~22 times a second. */
function bell(c: AudioContext, t: number, dur: number, gain = 0.2) {
  const strikes = Math.floor(dur * 22);
  for (let i = 0; i < strikes; i++) {
    const tt = t + i / 22;
    const f = i % 2 ? 1180 : 1262;
    const fade = i > strikes - 4 ? (strikes - i) / 4 : 1;
    tone(c, tt, 0.11, { f, gain: gain * fade, attack: 0.001 });
    tone(c, tt, 0.07, { f: f * 2.15, gain: gain * 0.35 * fade, attack: 0.001 });
    tone(c, tt, 0.05, { f: f * 3.4, gain: gain * 0.15 * fade, attack: 0.001 });
  }
}

/** An old rotary phone ringing: two double-rings. */
function ring(c: AudioContext, t: number) {
  bell(c, t, 0.42);
  bell(c, t + 0.62, 0.42);
  bell(c, t + 1.6, 0.42);
  bell(c, t + 2.22, 0.42);
}

/** Picking the handset up off the cradle. */
function pickup(c: AudioContext, t: number) {
  tone(c, t, 0.14, { f: 95, f2: 70, gain: 0.4 });
  hiss(c, t, 0.04, { f: 1300, q: 1, gain: 0.25 });
  hiss(c, t + 0.06, 0.03, { f: 2200, q: 3, gain: 0.12 });
  tone(c, t + 0.05, 0.02, { f: 3100, gain: 0.05, attack: 0.001 });
}

/** The rotary dial winding back: a run of clicks over a little whirr. */
function dial(c: AudioContext, t: number) {
  for (let i = 0; i < 6; i++) hiss(c, t + i * 0.065, 0.012, { f: 3000, q: 4, gain: 0.2 });
  hiss(c, t, 0.42, { type: "lowpass", f: 700, gain: 0.04, attack: 0.05 });
}

/** A sticker peeled off its backing. */
function peel(c: AudioContext, t: number) {
  for (let i = 0; i < 14; i++) hiss(c, t + i * 0.016 + rnd(0, 0.006), 0.018, { f: 900 + i * 320, q: 2, gain: rnd(0.05, 0.14) });
  hiss(c, t, 0.28, { f: 800, f2: 5000, q: 0.8, gain: 0.05, attack: 0.05 });
}

/** A sticker slapped down. */
function slap(c: AudioContext, t: number) {
  tone(c, t, 0.1, { f: 150, f2: 70, gain: 0.35 });
  hiss(c, t, 0.05, { type: "lowpass", f: 1900, gain: 0.3 });
}

/** The gift box bursting: a big pop, torn paper and a spray of confetti. */
function burst(c: AudioContext, t: number) {
  tone(c, t, 0.26, { f: 420, f2: 55, gain: 0.5 });
  hiss(c, t, 0.22, { type: "lowpass", f: 3000, gain: 0.4 });
  tape(c, t + 0.03);
  for (let i = 0; i < 34; i++) hiss(c, t + rnd(0.06, 0.75), 0.012, { type: "highpass", f: rnd(4500, 8000), gain: rnd(0.03, 0.11) });
  [0.12, 0.2, 0.31].forEach((d, i) => pop(c, t + d, 0.14 - i * 0.03));
}

/** Air rushing past. */
function whoosh(c: AudioContext, t: number) {
  hiss(c, t, 0.4, { f: 280, f2: 2600, q: 0.7, gain: 0.22, attack: 0.15 });
}

/** A bright "copied!" ding. */
function ding(c: AudioContext, t: number) {
  tone(c, t, 0.55, { f: 1568, gain: 0.17 });
  tone(c, t + 0.07, 0.45, { f: 2349, gain: 0.09 });
}

/** Moth wings: soft, fast flutters. */
function flutter(c: AudioContext, t: number) {
  for (let i = 0; i < 11; i++) hiss(c, t + i * 0.033, 0.028, { f: rnd(450, 800), q: 1, gain: 0.1 });
}

/** A cartoon cat's meow: a gliding sawtooth through vowel-like filters. */
function meow(c: AudioContext, t: number) {
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(480, t);
  osc.frequency.linearRampToValueAtTime(780, t + 0.16);
  osc.frequency.linearRampToValueAtTime(560, t + 0.42);
  osc.frequency.linearRampToValueAtTime(420, t + 0.6);
  const vib = c.createOscillator();
  vib.frequency.value = 6;
  const vibG = c.createGain();
  vibG.gain.value = 12;
  vib.connect(vibG).connect(osc.frequency);
  const f1 = c.createBiquadFilter();
  f1.type = "bandpass";
  f1.Q.value = 3;
  f1.frequency.setValueAtTime(900, t);
  f1.frequency.linearRampToValueAtTime(1500, t + 0.2);
  f1.frequency.linearRampToValueAtTime(800, t + 0.6);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.4, t + 0.06);
  g.gain.setValueAtTime(0.4, t + 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
  osc.connect(f1).connect(g).connect(out!);
  osc.start(t);
  vib.start(t);
  osc.stop(t + 0.7);
  vib.stop(t + 0.7);
}

/** A cartoon horse whinny: a trembling, falling squeal. */
function neigh(c: AudioContext, t: number) {
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(950, t);
  osc.frequency.linearRampToValueAtTime(1350, t + 0.18);
  osc.frequency.exponentialRampToValueAtTime(420, t + 1.0);
  const lfo = c.createOscillator();
  lfo.frequency.setValueAtTime(14, t);
  lfo.frequency.linearRampToValueAtTime(22, t + 1);
  const lfoG = c.createGain();
  lfoG.gain.value = 90;
  lfo.connect(lfoG).connect(osc.frequency);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1500;
  bp.Q.value = 1.4;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.3, t + 0.05);
  g.gain.setValueAtTime(0.3, t + 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.05);
  osc.connect(bp).connect(g).connect(out!);
  osc.start(t);
  lfo.start(t);
  osc.stop(t + 1.1);
  lfo.stop(t + 1.1);
  hiss(c, t + 0.95, 0.25, { type: "lowpass", f: 900, gain: 0.12, attack: 0.03 }); // the snort
}

/** Little "talking" blips for the speech bubbles. */
function blips(c: AudioContext, t: number) {
  const n = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) tone(c, t + i * 0.075, 0.06, { type: "square", f: rnd(380, 720), gain: 0.07 });
}

/** Data beeps for the neural network. */
function beeps(c: AudioContext, t: number) {
  [880, 1318, 1760, 1318, 2093].forEach((f, i) => tone(c, t + i * 0.07, 0.06, { type: "triangle", f, gain: 0.12 }));
}

/** A springy boing. */
function boing(c: AudioContext, t: number) {
  const osc = tone(c, t, 0.55, { type: "triangle", f: 180, f2: 620, gain: 0.3 });
  const lfo = c.createOscillator();
  lfo.frequency.value = 11;
  const lg = c.createGain();
  lg.gain.setValueAtTime(80, t);
  lg.gain.exponentialRampToValueAtTime(1, t + 0.55);
  lfo.connect(lg).connect(osc.frequency);
  lfo.start(t);
  lfo.stop(t + 0.6);
}

/** A film camera shutter: two mechanical clicks and a little wind-on. */
function shutter(c: AudioContext, t: number) {
  hiss(c, t, 0.02, { f: 3200, q: 2, gain: 0.3 });
  tone(c, t, 0.03, { f: 900, f2: 500, gain: 0.12, attack: 0.001 });
  hiss(c, t + 0.075, 0.025, { f: 2400, q: 2, gain: 0.25 });
  for (let i = 0; i < 5; i++) hiss(c, t + 0.2 + i * 0.045, 0.02, { f: 1800, q: 5, gain: 0.08 });
}

/** A bright little chime. */
function plink(c: AudioContext, t: number) {
  tone(c, t, 0.25, { type: "triangle", f: 1975, gain: 0.08 });
  tone(c, t, 0.18, { f: 2960, gain: 0.04 });
}

/* ── the record player: needle drop, crackle and an original lo-fi loop ──── */

let vinyl: { stop: () => void } | null = null;

function startVinyl(c: AudioContext, t: number) {
  if (vinyl) return;
  const bus = c.createGain();
  bus.gain.setValueAtTime(0.0001, t);
  bus.gain.exponentialRampToValueAtTime(0.9, t + 0.8);
  const warm = c.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 2400;
  bus.connect(warm).connect(out!);

  // needle drop
  tone(c, t, 0.12, { f: 110, f2: 60, gain: 0.35 });
  hiss(c, t, 0.08, { type: "lowpass", f: 2000, gain: 0.25 });

  const bpm = 78;
  const beat = 60 / bpm;
  // Fmaj7 · Em7 · Dm7 · Cmaj7, two beats each (an original progression)
  const chords = [
    [174.6, 220.0, 261.6, 329.6],
    [164.8, 196.0, 246.9, 293.7],
    [146.8, 174.6, 220.0, 261.6],
    [130.8, 164.8, 196.0, 246.9],
  ];
  const melody = [659.3, 587.3, 523.3, 587.3, 523.3, 493.9, 440.0, 493.9];
  let next = t + 0.25;
  let step = 0;

  const schedule = () => {
    while (next < c.currentTime + 0.6) {
      const s = step % 8;
      if (step % 4 === 0) {
        // keys: soft, slightly detuned triangles (a worn record), two beats long
        chords[Math.floor(step / 4) % 4].forEach((f) =>
          tone(c, next, beat * 2.1, { type: "triangle", f, gain: 0.045, attack: 0.03, dest: bus, detune: rnd(-7, 7) }),
        );
      }
      if (s % 2 === 0 && Math.random() > 0.35) {
        tone(c, next + beat * 0.02, beat * 0.9, { f: melody[(step / 2) % 8], gain: 0.035, attack: 0.02, dest: bus, detune: rnd(-5, 5) });
      }
      // drums: kick on 1 and 3, soft snare on 2 and 4, hats on the eighths
      if (s === 0 || s === 4) tone(c, next, 0.28, { f: 120, f2: 42, gain: 0.32, dest: bus });
      if (s === 2 || s === 6) hiss(c, next, 0.14, { f: 1900, q: 0.8, gain: 0.07, dest: bus });
      hiss(c, next + (s % 2 ? beat * 0.06 : 0), 0.03, { type: "highpass", f: 7000, gain: s % 2 ? 0.025 : 0.04, dest: bus });
      next += beat / 2;
      step++;
    }
    // vinyl crackle between beats
    for (let i = 0; i < 6; i++) hiss(c, c.currentTime + rnd(0, 0.25), 0.006, { type: "highpass", f: rnd(2500, 6000), gain: rnd(0.02, 0.08), dest: bus });
  };
  schedule();
  const timer = window.setInterval(schedule, 120);

  vinyl = {
    stop() {
      window.clearInterval(timer);
      const now = c.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      // needle lift
      hiss(c, now, 0.05, { type: "lowpass", f: 1500, gain: 0.18 });
      window.setTimeout(() => bus.disconnect(), 800);
      vinyl = null;
    },
  };
}

function stopVinyl() {
  vinyl?.stop();
}

/* ── public API ─────────────────────────────────────────────────────────── */

const table = {
  click,
  pop,
  tape,
  keys,
  pages,
  trophy,
  clack,
  coin,
  ring,
  pickup,
  dial,
  peel,
  slap,
  burst,
  whoosh,
  ding,
  flutter,
  meow,
  neigh,
  blips,
  beeps,
  boing,
  plink,
  shutter,
} as const;

export type SfxName = keyof typeof table;

export const sfx = Object.fromEntries(
  (Object.keys(table) as SfxName[]).map((k) => [k, () => run(table[k])]),
) as Record<SfxName, () => void>;

export function isSfxName(name: string | undefined): name is SfxName {
  return !!name && name in table;
}

export const recordPlayer = {
  start: () => run(startVinyl),
  stop: stopVinyl,
  get playing() {
    return vinyl !== null;
  },
};
