import createSynth, { Synth, SynthConfig } from "@src/synth";
import defaultSoundLayer from "@src/presets/synth/defaultSoundLayer.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { SoundConfig } from "@src/types";
import useSoundCache from "./useSoundCache";

export type UseSoundProps = {
  config: SoundConfig;
  onChange?: (sound: SoundConfig) => void;
}

export default function useSound({ config, onChange }: UseSoundProps) {
  const initSynths = useMemo(
    () => config.synths.map(createSynth),
    [config.synths],
  );
  const [synths, setSynths] = useState<Synth[]>(initSynths);
  const soundCache = useSoundCache();
  
  const handleChange = useCallback(() => {
    soundCache.clear();
    onChange?.({
      id: config.id,
      synths: synths.map((synth) => synth.getState()),
    });
  }, [soundCache, onChange, config.id, synths]);
  
  useEffect(() => {
    synths.forEach((synth) => synth.setOnChangeListener(handleChange));
    handleChange();
  }, [handleChange, synths]);

  return useMemo(
    () => ({
      synths,
      trigger(key: string) {
        soundCache.trigger(key, synths);
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
    [soundCache, synths],
  );
}

export type Sound = ReturnType<typeof useSound>;
