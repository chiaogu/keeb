import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

export const membraneSynthConfig: SynthNodeConfig<Tone.MembraneSynth> = {
  controls: {
    volume: {
      defaultValue: -15,
      type: "range",
      range: [-80, -15],
    },
    frequency: {
      defaultValue: 1125,
      type: "range",
      range: [0, 5000],
    },
    octaves: {
      defaultValue: 1,
      type: "range",
      range: [0.5, 8],
    },
    pitchDecay: {
      defaultValue: 0.05,
      type: "range",
      range: [0, 0.5],
    },
  },
  createNode: () => new Tone.MembraneSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume as number,
      octaves: state.octaves as number,
      pitchDecay: state.pitchDecay as number,
    });
  },
  trigger(node, state) {
    let frequency = state.frequency as number;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, "64n");
  },
};

export const setNoiseSynthState = membraneSynthConfig.setState;
