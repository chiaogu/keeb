import * as Tone from "@src/tone";
import { SynthNodeControls } from ".";
import { denormalizeState } from "../normalizer";

export const bitCrusherConfig: SynthNodeControls = {
  wet: {
    defaultValue: 0.5,
    type: "range",
    range: [0, 1],
  },
  bits: {
    defaultValue: 0.5,
    type: "range",
    range: [1, 16],
  }
};

export function setBitCrusherState(
  node: Tone.BitCrusher,
  state: Record<string, unknown>,
) {
  const { wet, bits } = denormalizeState(bitCrusherConfig, state);

  node.set({
    wet: wet as number,
    bits: bits as number,
  });
}
