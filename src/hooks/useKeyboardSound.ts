import { SoundConfig } from '@src/types';
import useSound from './useSound';
import useSoundCache from './useSoundCache';
import { useEffect } from 'react';
import { keyModifier } from '@src/keyboard/keySoundModifier';

export default function useKeyboardSound(config: SoundConfig) {
  const soundCache = useSoundCache();
  const { synths, states, ...rest } = useSound(config);

  useEffect(() => {
    soundCache.clear();
  }, [soundCache, config.id, states]);
  
  return {
    ...rest,
    synths: states,
    trigger(key: string) {
      soundCache.trigger(key, synths, keyModifier[key]);
    },
  };
}
