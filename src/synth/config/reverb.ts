import * as Tone from "@src/tone";
import { SynthNodeControls } from ".";

export const reverbConfig: SynthNodeControls = {
  wet: {
    defaultValue: 0.5,
    type: "range",
    range: [0, 1],
  },
  decay: {
    defaultValue: 3,
    type: "range",
    range: [0.001, 5],
  },
  preDelay: {
    defaultValue: 0.05,
    type: "range",
    range: [0, 0.5],
  },
};

export function setReverbState(
  node: Tone.Reverb,
  { wet, decay, preDelay }: Record<string, unknown>,
) {
  node.set({
    wet: wet as number,
    decay: decay as number,
    preDelay: preDelay as number,
  });
}
