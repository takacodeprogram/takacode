const MUTE_KEY = "takacode-muted";
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!audioCtx) {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

export function isMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(value: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    // ignore
  }
}

function tone(ctx: AudioContext, freq: number, startOffset: number, duration: number, type: OscillatorType = "sine", gain: number = 0.08): void {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g);
  g.connect(ctx.destination);
  const t = ctx.currentTime + startOffset;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

function prepare(): AudioContext | null {
  if (isMuted()) return null;
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function playSuccess(): void {
  const ctx = prepare();
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => tone(ctx, freq, index * 0.09, 0.28, "triangle", 0.09));
}

export function playFail(): void {
  const ctx = prepare();
  if (!ctx) return;
  tone(ctx, 311.13, 0, 0.3, "sine", 0.07);
  tone(ctx, 233.08, 0.13, 0.36, "sine", 0.06);
}

export function playPop(): void {
  const ctx = prepare();
  if (!ctx) return;
  tone(ctx, 880, 0, 0.09, "square", 0.045);
}
