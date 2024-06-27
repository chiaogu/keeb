import createSynth, { Synth, SynthConfig } from "@src/synth";
import defaultSoundLayer from "@src/presets/synth/defaultSoundLayer.json";

import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

export type Sound = {
  synths: Synth[];
  trigger: () => void;
  removeLayer: (index: number) => void;
  addLayer: () => void;
};

export type SoundConfig = {
  id: string;
  synths: SynthConfig[];
};

export default function useSound(config: SoundConfig): Sound {
  const initSynths = useMemo(
    () => config.synths.map(createSynth),
    [config.synths],
  );
  const [synths, setSynths] = useState<Synth[]>(initSynths);

  return useMemo(
    () => ({
      synths,
      trigger() {
        synths.forEach(({ trigger }) => trigger());
      },
      removeLayer(index: number) {
        synths[index].dispose();
        setSynths((synths) => synths.filter((_, i) => i !== index));
      },
      addLayer() {
        setSynths((synths) => [
          ...synths,
          createSynth({
            ...(defaultSoundLayer as SynthConfig),
            id: uuid(),
          }),
        ]);
      },
    }),
    [synths],
  );
}
