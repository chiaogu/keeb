import * as Tone from "@src/tone";
import { SynthNodeControls } from ".";

export const noiseSynthConfig: SynthNodeControls = {
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
