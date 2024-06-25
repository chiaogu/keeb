import * as Tone from "tone";
import { SynthNodeControls } from ".";
import { denormalizeState } from "../normalizer";

export const noiseSynthConfig: SynthNodeControls = {
  volume: {
    defaultValue: 0.74,
    type: "range",
    range: [-80, -5],
  },
};

export function setNoiseSynthState(
  synth: Tone.NoiseSynth,
  state: Record<string, unknown>,
) {
  if (synth instanceof Tone.NoiseSynth) {
    const {
      volume,
    } = denormalizeState(noiseSynthConfig, state);

    synth.set({
      volume,
    });
  }
}