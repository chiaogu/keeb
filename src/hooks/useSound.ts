import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { useMemo, useState } from 'react';
import useSynths from './useSynths';

export default function useSound(
  config: SoundConfig,
  channel: Tone.ToneAudioNode,
) {
  const { states, synths, reset, ...methods } = useSynths(
    config.synths,
    channel,
  );
  const [id, setId] = useState(config.id);
  const [name, setName] = useState(config.name);

  return useMemo(
    () => ({
      id,
      name,
      setName,
      synths,
      states,
      loadConfig(config: SoundConfig) {
        setId(config.id);
        setName(config.name);
        reset(config.synths);
      },
      ...methods,
    }),
    [id, name, synths, states, methods, reset],
  );
}

export type Sound = ReturnType<typeof useSound>;
