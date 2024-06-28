import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

export const reverbConfig: SynthNodeConfig<Tone.Reverb> = {
  controls: {
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
  },
  createNode: () => new Tone.Reverb(),
  setState(node, state) {
    node.set({
      wet: state.wet as number,
      decay: state.decay as number,
      preDelay: state.preDelay as number,
    });
  }
};

export const setReverbState = reverbConfig.setState;
