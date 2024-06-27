import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";

export const metalSynthConfig: SynthNodeConfig<Tone.MetalSynth> = {
  ToneClass: Tone.MetalSynth,
  controls: {
    volume: {
      defaultValue: -30,
      type: "range",
      range: [-80, -15],
    },
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
  setState(node, state) {
    node.set({
      volume: state.volume as number,
      harmonicity: state.harmonicity as number,
      modulationIndex: state.modulationIndex as number,
      octaves: state.octaves as number,
      portamento: state.portamento as number,
      resonance: state.resonance as number,
    });

    if (state.frequency) {
      node.frequency.value = state.frequency as number;
    }
  },
  trigger(node) {
    node.triggerAttackRelease(node.frequency.value, "64n");
  }
};

export const setMetalSynthState = metalSynthConfig.setState;