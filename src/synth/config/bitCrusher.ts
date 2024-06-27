import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

export const bitCrusherConfig: SynthNodeConfig = {
  ToneClass: Tone.BitCrusher,
  controls: {
    wet: {
      defaultValue: 0.5,
      type: "range",
      range: [0, 1],
    },
    bits: {
      defaultValue: 8,
      type: "range",
      range: [1, 16],
    }
  }
};

export function setBitCrusherState(
  node: Tone.BitCrusher,
  { wet, bits }: Record<string, unknown>,
) {
  node.set({
    wet: wet as number,
    bits: bits as number,
  });
}
