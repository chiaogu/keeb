import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

export const reverbConfig: SynthNodeConfig<Tone.Reverb> = {
  controls: {
    wet: {
      defaultValue: 0.5,
      type: "range",
      range: [0, 1],
    },
    decay: {
      defaultValue: 1,
      type: "range",
      range: [0.001, MAX_SOUND_DURATION],
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
  },
  ready: (node) => node.ready,
};

export const setReverbState = reverbConfig.setState;
