import * as Tone from '@src/tone';
import { SynthConfig } from './synth';
import { KeySoundModifier } from './keyboard/keySoundModifier';

export type SoundConfig = {
  id: string;
  name: string;
  synths: SynthConfig[];
};

type CustomModifierLayer = {
  type: 'custom',
}

type RandomModifierLayer = {
  type: 'random',
}

export type ModifierLayer = {
  id: string;
  name: string;
  keys: KeySoundModifier;
} & (CustomModifierLayer | RandomModifierLayer);

export type ModifierLayerType = ModifierLayer['type'];

export type KeySoundConfig = {
  config: SoundConfig;
  modifiers: ModifierLayer[];
};

export type KeyboardConfig = {
  sound: {
    up: KeySoundConfig;
    down: KeySoundConfig;
  };
};

export type ToneClass<T extends Tone.ToneAudioNode> = {
  new (): T;
  getDefaults: (...args: unknown[]) => unknown;
};

export type Tab = 'config' | 'modifier';