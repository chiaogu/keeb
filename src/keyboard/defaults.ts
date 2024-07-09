import { KeySoundModifier } from '@src/keyboard/keySoundModifier';
import { SynthConfig } from '@src/synth';
import { KeyboardConfig, KeySoundConfig, SoundConfig } from '@src/types';
import { v4 as uuid } from 'uuid';

export function getDefaultSynth(): SynthConfig {
  return {
    id: uuid(),
    src: { id: uuid(), type: 'mono', data: {} },
    fxs: [],
  };
}

export function getDefaultSound(): SoundConfig {
  return {
    id: uuid(),
    name: 'untitled',
    synths: [getDefaultSynth()],
  };
}

function getDefaultKeySound(): KeySoundConfig {
  const config = getDefaultSound();
  const modifier: KeySoundModifier = {
    KeyQ: {
      [config.synths[0].id]: {
        [config.synths[0].src.id]: {
          frequency: ['add', 300],
        },
      },
    },
    KeyW: {
      [config.synths[0].id]: {
        [config.synths[0].src.id]: {
          frequency: ['add', -300],
        },
      },
    },
  };
  return {
    config,
    modifier,
  };
}

export function getDefaultKeyboard(): KeyboardConfig {
  return {
    sound: {
      up: getDefaultKeySound(),
      down: getDefaultKeySound(),
    },
  };
}
