import * as Tone from 'tone';
import { SynthState } from './type';
import { config } from './config';
import { denormalizeState, normalizeState } from './normalizer';

const synth = new Tone.MetalSynth().toDestination();
reset();

function reset() {
  setState(
    Object.fromEntries(
      Object.entries(config).map(([key, { defaultValue }]) => [
        key,
        defaultValue,
      ])
    )
  );
}

export function setState(state: Partial<SynthState>) {
  const { volume, harmonicity } = denormalizeState(state);
  synth.set({ volume, harmonicity });
}

export function getState(): SynthState {
  const { volume, harmonicity } = synth.get();
  return normalizeState({ volume, harmonicity });
}

export function triggerKeyDown() {
  synth.triggerAttackRelease('C1', '64n');
}

export function triggerKeyUp() {
  synth.triggerAttackRelease('C2', '64n');
}
