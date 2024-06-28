import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

export const bitCrusherConfig: SynthNodeConfig<Tone.BitCrusher> = {
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
  },
  createNode: () => new Tone.BitCrusher(),
  setState(node, state) {
    node.set({
      wet: state.wet as number,
      bits: state.bits as number,
    });
  }
};

export const setBitCrusherState = bitCrusherConfig.setState;
