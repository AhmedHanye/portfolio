"use client";

import { useSyncExternalStore } from "react";

export type SoundEffect =
  | "click"
  | "open"
  | "close"
  | "minimize"
  | "lamp"
  | "startup"
  | "error";

const STORAGE_KEY = "portfolio_sound_enabled";

let audioCtx: AudioContext | null = null;
let isMutedState = false;
const listeners = new Set<(muted: boolean) => void>();

let startupAudioBuffer: AudioBuffer | null = null;
let isFetchingStartupBuffer = false;
let activeStartupAudio: HTMLAudioElement | null = null;
let activeStartupSource: AudioBufferSourceNode | null = null;

function createAudioContextInstance(): AudioContext | null {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return AudioContextClass ? new AudioContextClass() : null;
}

function ensureAudioContextResumed(ctx: AudioContext): void {
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = createAudioContextInstance();
  }
  if (audioCtx) {
    ensureAudioContextResumed(audioCtx);
  }
  return audioCtx;
}

async function fetchAndDecodeAudio(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
  } catch {
    return null;
  }
}

// Preload startup buffer in browser environment
async function loadStartupAudioBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  if (startupAudioBuffer) return startupAudioBuffer;
  if (isFetchingStartupBuffer) return null;
  isFetchingStartupBuffer = true;
  startupAudioBuffer = await fetchAndDecodeAudio(ctx, "/audio/win95_startup.mp3");
  isFetchingStartupBuffer = false;
  return startupAudioBuffer;
}

// Initialize mute state from localStorage if available
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      isMutedState = stored === "false";
    }
  } catch {
    // Ignore storage errors
  }
}

function isMuted(): boolean {
  return isMutedState;
}

function stopActiveStartupSound(): void {
  if (activeStartupAudio) {
    activeStartupAudio.pause();
    activeStartupAudio.currentTime = 0;
    activeStartupAudio = null;
  }
  if (activeStartupSource) {
    try {
      activeStartupSource.stop();
    } catch {
      // Ignore stop errors
    }
    activeStartupSource = null;
  }
}

function persistMuteState(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, String(!muted));
  } catch {
    // Ignore storage errors
  }
}

function setMuted(muted: boolean): void {
  isMutedState = muted;
  if (muted) {
    stopActiveStartupSound();
  }
  persistMuteState(muted);
  listeners.forEach((fn) => fn(isMutedState));
}

function toggleMute(): boolean {
  setMuted(!isMutedState);
  return isMutedState;
}

function subscribeMuteChange(listener: (muted: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Generate a short noise buffer for mechanical click textures
 */
function createNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * durationSeconds;
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function synthLampFx(ctx: AudioContext, now: number): void {
  const noiseBuf = createNoiseBuffer(ctx, 0.04);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuf;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(3200, now);
  bandpass.Q.setValueAtTime(3.5, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  noiseSource.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSource.start(now);

  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thudOsc.type = "sine";
  thudOsc.frequency.setValueAtTime(220, now + 0.008);
  thudOsc.frequency.exponentialRampToValueAtTime(70, now + 0.035);

  thudGain.gain.setValueAtTime(0.001, now);
  thudGain.gain.setValueAtTime(0.3, now + 0.008);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudOsc.start(now + 0.008);
  thudOsc.stop(now + 0.045);
}

function synthClickFx(ctx: AudioContext, now: number): void {
  const noiseBuf = createNoiseBuffer(ctx, 0.02);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuf;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(4500, now);
  bandpass.Q.setValueAtTime(2.0, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.15, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

  noiseSource.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSource.start(now);

  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = "triangle";
  clickOsc.frequency.setValueAtTime(850, now);
  clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.01);
  clickGain.gain.setValueAtTime(0.1, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.015);
}

function synthOpenFx(ctx: AudioContext, now: number): void {
  const freqs = [523.25, 783.99]; // C5 -> G5
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.035;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.13);
  });
}

function synthCloseFx(ctx: AudioContext, now: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, now);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(650, now);
  osc.frequency.exponentialRampToValueAtTime(280, now + 0.045);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}

function synthMinimizeFx(ctx: AudioContext, now: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(580, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.05);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}

function playStartupViaAudioElement(): void {
  const audio = new Audio("/audio/win95_startup.mp3");
  audio.volume = 0.85;
  activeStartupAudio = audio;
  audio.play().catch(() => {});
  audio.onended = () => {
    if (activeStartupAudio === audio) {
      activeStartupAudio = null;
    }
  };
}

function synthStartupFx(ctx: AudioContext, now: number): void {
  if (startupAudioBuffer) {
    try {
      const source = ctx.createBufferSource();
      source.buffer = startupAudioBuffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.85, now);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      activeStartupSource = source;
      source.onended = () => {
        if (activeStartupSource === source) {
          activeStartupSource = null;
        }
      };
    } catch {
      playStartupViaAudioElement();
    }
  } else {
    playStartupViaAudioElement();
    loadStartupAudioBuffer(ctx).catch(() => {});
  }
}

function synthErrorFx(ctx: AudioContext, now: number): void {
  const freqs = [440, 554.37]; // A4 + C#5
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  });
}

const EFFECT_SYNTHESIZERS: Record<SoundEffect, (ctx: AudioContext, now: number) => void> = {
  lamp: synthLampFx,
  click: synthClickFx,
  open: synthOpenFx,
  close: synthCloseFx,
  minimize: synthMinimizeFx,
  startup: synthStartupFx,
  error: synthErrorFx,
};

function canPlayAudio(): boolean {
  return !isMutedState && typeof window !== "undefined";
}

// fallow-ignore-next-line complexity
export function playFx(effect: SoundEffect): void {
  if (!canPlayAudio()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const synth = EFFECT_SYNTHESIZERS[effect];
    if (synth) {
      synth(ctx, ctx.currentTime);
    }
  } catch {
    // Suppress audio execution errors
  }
}

export function useSoundState(): { muted: boolean; toggle: () => void } {
  const muted = useSyncExternalStore(
    subscribeMuteChange,
    isMuted,
    () => false,
  );
  return { muted, toggle: toggleMute };
}
