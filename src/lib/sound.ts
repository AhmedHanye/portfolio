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

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Preload startup buffer in browser environment
async function loadStartupAudioBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  if (startupAudioBuffer) return startupAudioBuffer;
  if (isFetchingStartupBuffer) return null;
  isFetchingStartupBuffer = true;
  try {
    const response = await fetch("/audio/win95_startup.mp3");
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    startupAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return startupAudioBuffer;
  } catch {
    return null;
  } finally {
    isFetchingStartupBuffer = false;
  }
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

function setMuted(muted: boolean): void {
  isMutedState = muted;
  if (muted) {
    if (activeStartupAudio) {
      activeStartupAudio.pause();
      activeStartupAudio.currentTime = 0;
    }
    if (activeStartupSource) {
      try {
        activeStartupSource.stop();
      } catch {
        // Ignore stop errors if already stopped
      }
      activeStartupSource = null;
    }
  }
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, String(!muted));
    } catch {
      // Ignore storage errors
    }
  }
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

export function playFx(effect: SoundEffect): void {
  if (isMutedState || typeof window === "undefined") return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    switch (effect) {
      case "lamp": {
        // --- REALISTIC MECHANICAL LAMP TOGGLE SWITCH ---
        // 1. High-frequency spring latch snap (metallic click)
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

        // 2. Physical enclosure body thud (low plastic/metallic impact 12ms later)
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
        break;
      }

      case "click": {
        // --- REALISTIC PLASTIC BUTTON CLICK ---
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

        // Subtle low body click
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
        break;
      }

      case "open": {
        // --- WARM RETRO WINDOW OPEN CHIME ---
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
        break;
      }

      case "close": {
        // --- SOFT DAMPENED WINDOW CLOSE ---
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
        break;
      }

      case "minimize": {
        // --- DOWNWARD MINIMIZE CHIME ---
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
        break;
      }

      case "startup": {
        // --- OFFICIAL WIN95 STARTUP SOUND (Brian Eno - The Microsoft Sound) ---
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
        } else {
          // Play via HTMLAudioElement immediately while triggering background buffer decode
          const audio = new Audio("/audio/win95_startup.mp3");
          audio.volume = 0.85;
          activeStartupAudio = audio;
          audio.play().catch(() => {});
          audio.onended = () => {
            if (activeStartupAudio === audio) {
              activeStartupAudio = null;
            }
          };
          loadStartupAudioBuffer(ctx).catch(() => {});
        }
        break;
      }

      case "error": {
        // --- AUTHENTIC WIN95 ERROR DING ---
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
        break;
      }
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
