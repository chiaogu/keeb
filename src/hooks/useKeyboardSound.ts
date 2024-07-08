import { KeySoundConfig } from '@src/types';
import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import useSound from './useSound';
import useSoundCache from './useSoundCache';

export default function useKeyboardSound(keySound: KeySoundConfig) {
  const soundCache = useSoundCache();
  const { synths, states, ...rest } = useSound(keySound.config);
  const [modifier, setModifier] = useImmer(keySound.modifier);

  useEffect(() => {
    soundCache.clear();
  }, [soundCache, states]);

  return useMemo(
    () => ({
      sound: {
        ...rest,
        synths: states,
        trigger(key: string) {
          soundCache.trigger(key, synths, modifier[key]);
        },
      },
      modifier,
      setModifier,
    }),
    [modifier, rest, setModifier, soundCache, states, synths],
  );
}
