import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

export const noiseSynthConfig: SynthNodeConfig = {
  ToneClass: Tone.NoiseSynth,
  controls: {
    volume: {
      type: "range",
      defaultValue: -15,
      range: [-80, -15],
    },
    type: {
      type: "select",
      defaultValue: "brown",
      options: ["brown", "white", "pink"],
    },
  },
};

export function setNoiseSynthState(
  synth: Tone.NoiseSynth,
  { volume, type }: Record<string, unknown>,
) {
  synth.set({
    volume: volume as number,
  });

  synth.noise.set({
    type: type as Tone.NoiseType,
  });
}
