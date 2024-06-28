import createSynth, { Synth, SynthConfig } from "@src/synth";
import defaultSoundLayer from "@src/presets/synth/defaultSoundLayer.json";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { SoundConfig } from "@src/types";

export type Sound = {
  synths: Synth[];
  trigger: () => void;
  removeLayer: (index: number) => void;
  addLayer: () => void;
};

export type UseSoundProps = {
  config: SoundConfig;
  onChange?: (sound: SoundConfig) => void;
}

export default function useSound({ config, onChange }: UseSoundProps): Sound {
  const initSynths = useMemo(
    () => config.synths.map(createSynth),
    [config.synths],
  );
  const [synths, setSynths] = useState<Synth[]>(initSynths);
  
  const handleChange = useCallback(() => {
    onChange?.({
      id: config.id,
      synths: synths.map((synth) => synth.getState()),
    });
  }, [config.id, onChange, synths]);
  
  useEffect(() => {
    synths.forEach((synth) => synth.setOnChangeListener(handleChange));
    handleChange();
  }, [handleChange, synths]);

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
