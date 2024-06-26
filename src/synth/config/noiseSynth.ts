import * as Tone from "@src/tone";
import { SynthNodeControls } from ".";
import { denormalizeState } from "../normalizer";

export const noiseSynthConfig: SynthNodeControls = {
  volume: {
    type: "range",
    defaultValue: 0.74,
    range: [-80, -5],
  },
  type: {
    type: "select",
    defaultValue: "brown",
    options: ["brown", "white", "pink"],
  },
};

export function setNoiseSynthState(
  synth: Tone.NoiseSynth,
  state: Record<string, unknown>,
) {
  const { volume, type } = denormalizeState(noiseSynthConfig, state);

  synth.set({
    volume: volume as number,
  });

  synth.noise.set({
    type: type as Tone.NoiseType,
  });
}
