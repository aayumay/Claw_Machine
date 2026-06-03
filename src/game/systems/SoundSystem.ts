// ============================================================
// SoundSystem — Synthesized Audio via Web Audio API
// ============================================================
// All sounds are generated programmatically using oscillators
// and gain envelopes. No external audio files required.

import { Howl, Howler } from 'howler';

type OscType = OscillatorType;

interface NoteSpec {
  freq: number;
  type: OscType;
  start: number;   // seconds offset
  duration: number; // seconds
  volume: number;   // 0-1
}

/** Pre-rendered sound buffer cache */
const bufferCache = new Map<string, AudioBuffer>();

/**
 * Render a sequence of oscillator notes into an AudioBuffer.
 */
function renderSynthBuffer(
  ctx: OfflineAudioContext,
  notes: NoteSpec[]
): Promise<AudioBuffer> {
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = note.type;
    osc.frequency.setValueAtTime(note.freq, note.start);

    // Quick attack, sustain, quick release envelope
    const attackEnd = note.start + 0.01;
    const releaseStart = note.start + note.duration - 0.02;
    const releaseEnd = note.start + note.duration;

    gain.gain.setValueAtTime(0, note.start);
    gain.gain.linearRampToValueAtTime(note.volume, attackEnd);
    gain.gain.setValueAtTime(note.volume, Math.max(attackEnd, releaseStart));
    gain.gain.linearRampToValueAtTime(0, releaseEnd);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(note.start);
    osc.stop(releaseEnd);
  }

  return ctx.startRendering();
}

/**
 * Convert an AudioBuffer to a WAV blob data URI.
 */
function audioBufferToWavDataUri(buffer: AudioBuffer): string {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  const numSamples = buffer.length;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;

  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write interleaved samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  // Convert to base64 data URI
  const bytes = new Uint8Array(wavBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

/** Sound definition recipes */
const SOUND_RECIPES: Record<string, () => NoteSpec[]> = {
  coinInsert: () => [
    { freq: 1200, type: 'sine', start: 0, duration: 0.06, volume: 0.4 },
    { freq: 1800, type: 'sine', start: 0.06, duration: 0.08, volume: 0.35 },
    { freq: 2400, type: 'sine', start: 0.12, duration: 0.1, volume: 0.3 },
  ],

  clawMove: () => [
    { freq: 120, type: 'sawtooth', start: 0, duration: 0.15, volume: 0.12 },
    { freq: 140, type: 'sawtooth', start: 0.05, duration: 0.15, volume: 0.1 },
    { freq: 100, type: 'square', start: 0, duration: 0.2, volume: 0.06 },
  ],

  clawDrop: () => {
    const notes: NoteSpec[] = [];
    for (let i = 0; i < 8; i++) {
      notes.push({
        freq: 600 - i * 60,
        type: 'sine',
        start: i * 0.04,
        duration: 0.06,
        volume: 0.25 - i * 0.02,
      });
    }
    return notes;
  },

  clawGrab: () => [
    { freq: 200, type: 'square', start: 0, duration: 0.05, volume: 0.3 },
    { freq: 350, type: 'square', start: 0.04, duration: 0.06, volume: 0.25 },
    { freq: 150, type: 'sawtooth', start: 0, duration: 0.1, volume: 0.15 },
    { freq: 80, type: 'triangle', start: 0.05, duration: 0.08, volume: 0.2 },
  ],

  clawRise: () => {
    const notes: NoteSpec[] = [];
    for (let i = 0; i < 6; i++) {
      notes.push({
        freq: 200 + i * 50,
        type: 'sine',
        start: i * 0.05,
        duration: 0.07,
        volume: 0.2,
      });
    }
    return notes;
  },

  prizeWin: () => [
    { freq: 523, type: 'sine', start: 0, duration: 0.15, volume: 0.35 },     // C5
    { freq: 659, type: 'sine', start: 0.12, duration: 0.15, volume: 0.35 },  // E5
    { freq: 784, type: 'sine', start: 0.24, duration: 0.15, volume: 0.35 },  // G5
    { freq: 1047, type: 'sine', start: 0.36, duration: 0.3, volume: 0.4 },   // C6
    { freq: 784, type: 'triangle', start: 0.36, duration: 0.3, volume: 0.15 }, // harmony
    { freq: 1047, type: 'triangle', start: 0.5, duration: 0.4, volume: 0.2 }, // sustain
  ],

  prizeFail: () => [
    { freq: 400, type: 'sine', start: 0, duration: 0.2, volume: 0.3 },
    { freq: 350, type: 'sine', start: 0.15, duration: 0.2, volume: 0.25 },
    { freq: 280, type: 'sine', start: 0.3, duration: 0.3, volume: 0.2 },
    { freq: 200, type: 'triangle', start: 0.3, duration: 0.4, volume: 0.15 },
  ],

  buttonPress: () => [
    { freq: 800, type: 'sine', start: 0, duration: 0.04, volume: 0.25 },
    { freq: 600, type: 'sine', start: 0.03, duration: 0.04, volume: 0.15 },
  ],
};

export class SoundSystem {
  private sounds: Map<string, Howl> = new Map();
  private _muted = false;
  private _volume = 0.7;
  private _initialized = false;
  private _initPromise: Promise<void> | null = null;

  /** Lazily initialize all sounds */
  async init(): Promise<void> {
    if (this._initialized) return;
    if (this._initPromise) return this._initPromise;

    this._initPromise = this._buildAllSounds();
    await this._initPromise;
    this._initialized = true;
  }

  private async _buildAllSounds(): Promise<void> {
    const sampleRate = 44100;

    for (const [name, recipe] of Object.entries(SOUND_RECIPES)) {
      // Check cache first
      if (bufferCache.has(name)) {
        const cached = bufferCache.get(name)!;
        const dataUri = audioBufferToWavDataUri(cached);
        this.sounds.set(name, new Howl({ src: [dataUri], volume: this._volume }));
        continue;
      }

      const notes = recipe();
      const totalDuration = Math.max(...notes.map((n) => n.start + n.duration)) + 0.05;
      const totalSamples = Math.ceil(totalDuration * sampleRate);

      const offlineCtx = new OfflineAudioContext(1, totalSamples, sampleRate);
      const buffer = await renderSynthBuffer(offlineCtx, notes);
      bufferCache.set(name, buffer);

      const dataUri = audioBufferToWavDataUri(buffer);
      this.sounds.set(name, new Howl({ src: [dataUri], volume: this._volume }));
    }
  }

  /** Play a named sound effect */
  play(name: string): void {
    if (this._muted) return;
    const howl = this.sounds.get(name);
    if (howl) {
      howl.volume(this._volume);
      howl.play();
    }
  }

  /** Set global mute state */
  set muted(value: boolean) {
    this._muted = value;
    Howler.mute(value);
  }

  get muted(): boolean {
    return this._muted;
  }

  /** Set global volume (0-1) */
  set volume(value: number) {
    this._volume = Math.max(0, Math.min(1, value));
    Howler.volume(this._volume);
  }

  get volume(): number {
    return this._volume;
  }

  /** Toggle mute on/off */
  toggleMute(): boolean {
    this.muted = !this._muted;
    return this._muted;
  }
}

// Howler is imported from 'howler' at the top of the file

/** Singleton instance */
export const soundSystem = new SoundSystem();
