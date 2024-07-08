import { SoundConfig } from '@src/types';
import { useMemo, useState } from 'react';
import useSynths from './useSynths';

export default function useSound(config: SoundConfig) {
  const { states, synths, reset, ...methods } = useSynths(config.synths);
  const [name, setName] = useState(config.name);

  return useMemo(
    () => ({
      id: config.id,
      name,
      setName,
      synths,
      states,
      loadConfig(config: SoundConfig) {
        setName(config.name);
        reset(config.synths);
      },
      ...methods,
    }),
    [config.id, name, states, methods, synths, reset],
  );
}

export type Sound = ReturnType<typeof useSound>;
