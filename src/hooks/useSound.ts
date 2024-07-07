import { SoundConfig } from '@src/types';
import { Immutable } from 'immer';
import { useEffect, useMemo } from 'react';
import useSoundCache from './useSoundCache';
import useSynths from './useSynths';

export type UseSoundProps = {
  config: SoundConfig;
  onChange?: (sound: Immutable<SoundConfig>) => void;
};

export default function useSound({ config, onChange }: UseSoundProps) {
  const { states, synths, ...methods } = useSynths(config.synths);
  const soundCache = useSoundCache();

  useEffect(() => {
    soundCache.clear();
    onChange?.({
      id: config.id,
      synths: states,
    });
  }, [soundCache, onChange, config.id, states]);

  return useMemo(
    () => ({
      id: config.id,
      synths: states,
      trigger(key: string) {
        soundCache.trigger(key, synths);
      },
      ...methods,
    }),
    [config.id, states, methods, soundCache, synths],
  );
}

export type Sound = ReturnType<typeof useSound>;
