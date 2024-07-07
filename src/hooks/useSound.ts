import { SoundConfig } from '@src/types';
import { useEffect, useMemo, useState } from 'react';
import useSoundCache from './useSoundCache';
import useSynths from './useSynths';

export default function useSound(config: SoundConfig) {
  const soundCache = useSoundCache();
  const { states, synths, ...methods } = useSynths(config.synths);
  const [name, setName] = useState(config.name ?? 'untitled');

  useEffect(() => {
    soundCache.clear();
  }, [soundCache, config.id, states]);

  return useMemo(
    () => ({
      id: config.id,
      name,
      setName,
      synths: states,
      trigger(key: string) {
        soundCache.trigger(key, synths);
      },
      ...methods,
    }),
    [config.id, name, states, methods, soundCache, synths],
  );
}

export type Sound = ReturnType<typeof useSound>;
