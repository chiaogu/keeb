import { SynthConfig } from '@src/synth';
import { KeyboardConfig, KeySoundConfig, SoundConfig } from '@src/types';
import { v4 as uuid } from 'uuid';
import { KeySoundModifier } from './keySoundModifier';
import { Immutable } from 'immer';

export function getDefaultSynth(): SynthConfig {
  return {
    id: uuid(),
    name: 'layer 0',
    src: { id: uuid(), type: 'mono', data: {} },
    fxs: [],
  };
}

export function getDefaultSound(): SoundConfig {
  const id = uuid();
  return {
    id,
    name: `sound ${id.slice(0, 5)}`,
    synths: [getDefaultSynth()],
  };
}

export function getDefaultModifierLayer(synth: Immutable<SynthConfig>) {
  return {
    id: uuid(),
    name: 'layer 0',
    type: 'custom' as const,
    keys: {
      KeyQ: {
        [synth.id]: {
          [synth.src.id]: {
            frequency: ['add', -0.1],
          },
        },
      },
      KeyW: {
        [synth.id]: {
          [synth.src.id]: {
            frequency: ['add', 0.1],
          },
        },
      },
    } as KeySoundModifier,
  };
}

function getDefaultKeySound(): KeySoundConfig {
  const config = getDefaultSound();

  return {
    config,
    modifiers: [
      getDefaultModifierLayer(config.synths[0]),
    ],
  };
}

export function getDefaultKeyboard(): KeyboardConfig {
  return {
    name: `keyboard ${uuid().slice(0, 5)}`,
    sound: {
      up: getDefaultKeySound(),
      down: getDefaultKeySound(),
      modifiers: [],
    },
  };
}
