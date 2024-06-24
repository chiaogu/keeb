import * as Tone from "tone";

export type SynthState = {
  volume: number;
};

const defaultState: SynthState = {
  volume: 0.5,
};

const stateRange: Record<keyof SynthState, number[]> = {
  volume: [-80, -5],
};

const synth = new Tone.MetalSynth().toDestination();
setState(defaultState);

function normalize(key: keyof SynthState, value: number) {
  const [min, max] = stateRange[key];
  return (value - min) / (max - min);
}

function denormalize(key: keyof SynthState, value?: number) {
  if (value === undefined) return undefined;
  const [min, max] = stateRange[key];
  return min + (max - min) * value;
}

export function setState({ volume }: Partial<SynthState>) {
  synth.set({
    volume: denormalize('volume', volume),
  });
}

export function getState(): SynthState {
  const { volume } = synth.get();
  return {
    volume: normalize('volume', volume),
  };
}

export function triggerKeyDown() {
  synth.triggerAttackRelease("C1", "64n");
}

export function triggerKeyUp() {
  synth.triggerAttackRelease("C2", "64n");
}
