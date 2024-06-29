import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import baseSrcControls from "./baseSrcControls";

export const metalSynthConfig: SynthNodeConfig<Tone.MetalSynth> = {
  controls: {
    ...baseSrcControls,
    harmonicity: {
      defaultValue: 6,
      type: "range",
      range: [0.1, 10],
    },
    modulationIndex: {
      defaultValue: 50,
      type: "range",
      range: [1, 100],
    },
    frequency: {
      defaultValue: 1125,
      type: "range",
      range: [0, 5000],
    },
    octaves: {
      defaultValue: -3,
      type: "range",
      range: [-10, 10],
    },
    resonance: {
      defaultValue: 7000,
      type: "range",
      range: [0, 7000],
    },
  },
  createNode: () => new Tone.MetalSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume as number,
      harmonicity: state.harmonicity as number,
      modulationIndex: state.modulationIndex as number,
      octaves: state.octaves as number,
      resonance: state.resonance as number,
    });
  },
  trigger(node, state) {
    let frequency = state.frequency as number;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(
      frequency as number,
      state.duration as number,
      `+${state.delay}`,
    );
  },
};

export const setMetalSynthState = metalSynthConfig.setState;
