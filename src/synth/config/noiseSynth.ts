import * as Tone from "tone";
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
  if (synth instanceof Tone.NoiseSynth) {
    const { volume, type } = denormalizeState(noiseSynthConfig, state);

    synth.set({
      volume,
    });

    synth.noise.set({
      type,
    });
  }
}
