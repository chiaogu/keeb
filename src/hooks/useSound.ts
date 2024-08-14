import * as Tone from '@src/tone';
import { SoundConfig } from '@src/types';
import { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
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
        setId(uuid());
        setName(config.name);
        synth.reset(
          config.synths.map((s) => ({
            ...s,
            id: uuid(),
            src: { ...s.src, id: uuid() },
            fxs: s.fxs.map((fx) => ({ ...fx, id: uuid() })),
          })),
        );
      },
      ...synth,
    }),
    [id, name, synth],
  );
}

export type Sound = ReturnType<typeof useSound>;
