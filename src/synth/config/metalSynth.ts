import * as Tone from "@src/tone";
import { SynthNodeControls } from ".";
import { denormalizeState } from "../normalizer";

export const metalSynthConfig: SynthNodeControls = {
  volume: {
    defaultValue: 0.74,
    type: "range",
    range: [-80, -5],
  },
  harmonicity: {
    defaultValue: 0.5,
    type: "range",
    range: [0.1, 10],
  },
  modulationIndex: {
    defaultValue: 0.5,
    type: "range",
    range: [1, 100],
  },
  frequency: {
    defaultValue: 0.225,
    type: "range",
    range: [0, 5000],
  },
  octaves: {
    defaultValue: 0.333,
    type: "range",
    range: [-10, 10],
  },
  resonance: {
    defaultValue: 1,
    type: "range",
    range: [0, 7000],
  },
};

export function setMetalSynthState(
  synth: Tone.MetalSynth,
  state: Record<string, unknown>,
) {
  const {
    volume,
    harmonicity,
    frequency,
    modulationIndex,
    octaves,
    portamento,
    resonance,
  } = denormalizeState(metalSynthConfig, state);

  synth.set({
    volume: volume as number,
    harmonicity: harmonicity as number,
    modulationIndex: modulationIndex as number,
    octaves: octaves as number,
    portamento: portamento as number,
    resonance: resonance as number,
  });

  if (frequency) {
    synth.frequency.value = frequency as number;
  }
}
