import * as Tone from '@src/tone';
import { SoundStructure } from './components/sound/SoundStructure';
import { KeySoundModifier } from './keyboard/keySoundModifier';
import { SynthConfig } from './synth';

export type SoundConfig = {
  id: string;
  name: string;
  synths: SynthConfig[];
};

type CustomModifierLayer = {
  type: 'custom';
};

export type FieldRandomConfig = {
  min?: number;
  max?: number;
  options?: string[];
};

export type RandomizationConfig = SoundStructure<FieldRandomConfig>;

type RandomModifierLayer = {
  type: 'random';
  config: RandomizationConfig;
  randomSeed: { [key: string]: number };
};

export type ModifierLayer = {
  id: string;
  name: string;
  keys: KeySoundModifier;
} & (CustomModifierLayer | RandomModifierLayer);

export type ModifierLayerType = ModifierLayer['type'];

export type KeySoundConfig = {
  config: SoundConfig;
};

export type KeyboardConfig = {
  id: string;
  name: string;
  created: number;
  sound: {
    up: KeySoundConfig;
    down: KeySoundConfig;
    modifiers: ModifierLayer[];
  };
};

export type ToneClass<T extends Tone.ToneAudioNode> = {
  new (): T;
  getDefaults: (...args: unknown[]) => unknown;
};
