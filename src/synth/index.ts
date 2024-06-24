import * as Tone from "tone";
import { config, SynthState } from "./config";
import { denormalizeState, normalizeState } from "./normalizer";
import { frequencyToHertz } from "@src/utils";

const synth = new Tone.MetalSynth().toDestination();
reset();

function reset() {
  setState(
    Object.fromEntries(
      Object.entries(config).map(([key, { defaultValue }]) => [
        key,
        defaultValue,
      ]),
    ),
  );
}

export function setState(state: Partial<SynthState>) {
  const {
    volume,
    harmonicity,
    frequency,
    modulationIndex,
    octaves,
    portamento,
    resonance,
  } = denormalizeState(state);
  synth.set({
    volume,
    harmonicity,
    modulationIndex,
    octaves,
    portamento,
    resonance,
  });

  if (frequency) {
    synth.frequency.value = frequency;
  }
}

export function getState(): SynthState {
  const { volume, harmonicity, modulationIndex, octaves, resonance } =
    synth.get();

  return normalizeState({
    volume,
    harmonicity,
    modulationIndex,
    frequency: frequencyToHertz(synth.frequency.value),
    octaves,
    resonance: frequencyToHertz(resonance),
  });
}

export function triggerKeyDown() {
  synth.triggerAttackRelease(synth.frequency.value, "64n");
}

export function triggerKeyUp() {
  synth.triggerAttackRelease(synth.frequency.value, "64n");
}
