import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { useMemo, useState } from 'react';
import useSynths from './useSynths';

export default function useSound(
  config: SoundConfig,
  channel: Tone.ToneAudioNode,
) {
  const synth = useSynths(config.synths, channel);
  const [id, setId] = useState(config.id);
  const [name, setName] = useState(config.name);

  return useMemo(
    () => ({
      id,
      name,
      setName,
      loadConfig(config: SoundConfig) {
        setId(config.id);
        setName(config.name);
        synth.reset(config.synths);
      },
      ...synth,
    }),
    [id, name, synth],
  );
}

export type Sound = ReturnType<typeof useSound>;
