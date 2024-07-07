import * as Tone from '@src/tone';
import { SynthConfig } from './synth';

export type SoundConfig = {
  id: string;
  name: string;
  synths: SynthConfig[];
};

export type KeyboardConfig = {
  sound: {
    up: SoundConfig;
    down: SoundConfig;
  };
};

export type ToneClass<T extends Tone.ToneAudioNode> = {
  new (): T;
  getDefaults: (...args: unknown[]) => unknown;
};
