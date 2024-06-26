import * as Tone from "tone";
import { SynthNodeControls } from ".";
import { denormalizeState } from "../normalizer";

export const reverbConfig: SynthNodeControls = {
  wet: {
    defaultValue: 1,
    type: "range",
    range: [0, 1],
  },
};

export function setReverbState(
  node: Tone.Reverb,
  state: Record<string, unknown>,
) {
  const { wet } = denormalizeState(reverbConfig, state);

  node.set({
    wet: wet as number,
  });
}
