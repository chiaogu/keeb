import { KeySoundConfig, ModifierLayer } from '@src/types';
import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import useSound from './useSound';
import useSoundCache from './useSoundCache';
import { getDefaultModifierLayer } from '@src/keyboard/defaults';

export default function useKeyboardSound(keySound: KeySoundConfig) {
  const soundCache = useSoundCache();
  const { synths, states, ...rest } = useSound(keySound.config);
  const [modifiers, setModifiers] = useImmer(keySound.modifiers);

  useEffect(() => {
    soundCache.clear();
  }, [soundCache, states]);

  return useMemo(
    () => ({
      sound: {
        ...rest,
        synths: states,
        trigger(key: string) {
          // TODO: Apply multiple layers
          soundCache.trigger(key, synths, modifiers[0].keys[key]);
        },
      },
      modifiers,
      addModifierLayer() {
        setModifiers((draft) => {
          draft.push(getDefaultModifierLayer(synths[0].state));
        });
      },
      removeModifierLayer(index: number) {
        setModifiers((draft) => {
          draft.splice(index, 1);
        });
      },
    }),
    [modifiers, rest, setModifiers, soundCache, states, synths],
  );
}

export type KeyboardSound = ReturnType<typeof useKeyboardSound>;