import * as Tone from "tone";
import { SynthNodeControls } from ".";
import { denormalizeState } from "../normalizer";

export const reverbConfig: SynthNodeControls = {
  wet: {
    defaultValue: 0.5,
    type: "range",
    range: [0, 1],
  },
  decay: {
    defaultValue: 0.5,
    type: "range",
    range: [0.001, 5],
  },
  preDelay: {
    defaultValue: 0.1,
    type: "range",
    range: [0, 0.5],
  },
};

export function setReverbState(
  node: Tone.Reverb,
  state: Record<string, unknown>,
) {
  const { wet, decay, preDelay } = denormalizeState(reverbConfig, state);

  node.set({
    wet: wet as number,
    decay: decay as number,
    preDelay: preDelay as number,
  });
}
