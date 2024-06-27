import * as Tone from "@src/tone";
import { SynthNodeControls } from ".";

export const metalSynthConfig: SynthNodeControls = {
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
};

export function setMetalSynthState(
  synth: Tone.MetalSynth,
  {
    volume,
    harmonicity,
    frequency,
    modulationIndex,
    octaves,
    portamento,
    resonance,
  }: Record<string, unknown>,
) {
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
