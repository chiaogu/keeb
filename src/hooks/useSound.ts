import createSynth, { Synth, SynthState } from "@src/synth";

import { useMemo, useState } from "react";

export type Sound = {
  synths: Synth[];
  trigger: () => void;
};

export type SoundConfig = {
  id: string;
  synths: SynthState[];
};

export default function useSound(config: SoundConfig): Sound {
  const [synths, setSynths] = useState<Synth[]>(config.synths.map(createSynth));

  return useMemo(
    () => ({
      synths,
      trigger() {
        synths.forEach(({ trigger }) => trigger());
      },
    }),
    [synths],
  );
}
