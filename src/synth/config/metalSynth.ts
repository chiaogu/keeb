import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { baseSrcControls, zBaseSynthSrc } from "./shared";
import { z } from "zod";

const zMetalSynth = zBaseSynthSrc.extend({
  harmonicity: z.number().min(0.1).max(10).catch(6),
  modulationIndex: z.number().min(1).max(100).catch(50),
  frequency: z.number().min(0).max(5000).catch(1125),
  octaves: z.number().min(-10).max(10).catch(-3),
  resonance: z.number().min(0).max(7000).catch(7000),
});

export const metalSynthConfig: SynthNodeConfig<
  Tone.MetalSynth,
  typeof zMetalSynth
> = {
  schema: zMetalSynth,
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
      volume: state.volume,
      harmonicity: state.harmonicity,
      modulationIndex: state.modulationIndex,
      octaves: state.octaves,
      resonance: state.resonance,
    });
  },
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(
      frequency,
      state.duration,
      `+${state.delay}`,
    );
  },
};

export const setMetalSynthState = metalSynthConfig.setState;
