import * as Tone from "tone";

const synth = new Tone.MetalSynth().toDestination();
synth.set({ volume: -10 });

export function triggerKeyDown() {
  synth.triggerAttackRelease("C3", "64n");
}

export function triggerKeyUp() {
  synth.triggerAttackRelease("C2", "64n");
}
