import * as Tone from "@src/tone";
import { SynthConfig } from "./synth";

export type SoundConfig = {
  id: string;
  synths: SynthConfig[];
};

export type KeyboardConfig = {
  sound: {
    up: SoundConfig,
    down: SoundConfig,
  },
};

export type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  attackCurve: Tone.EnvelopeCurve;
  releaseCurve: Tone.EnvelopeCurve;
  decayCurve: 'linear' | 'exponential';
};
