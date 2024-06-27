import createSynth, { Synth, SynthConfig } from "@src/synth";

import { useMemo, useState } from "react";

export type Sound = {
  synths: Synth[];
  trigger: () => void;
  remove: (index: number) => void;
};

export type SoundConfig = {
  id: string;
  synths: SynthConfig[];
};

export default function useSound(config: SoundConfig): Sound {
  const [synths, setSynths] = useState<Synth[]>(config.synths.map(createSynth));

  return useMemo(
    () => ({
      synths,
      trigger() {
        synths.forEach(({ trigger }) => trigger());
      },
      remove(index: number) {
        synths[index].dispose();
        setSynths((synths) => synths.filter((_, i) => i !== index));
      }
    }),
    [synths],
  );
}
