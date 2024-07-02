import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc, zFrequency } from "./shared";
import { zEnvelope } from "./envelope";
import withToneDefaults from "../withToneDefaults";
import { zOmniOscillator } from "./omniOscillator";

const zBaseSynth = withToneDefaults(zBaseSynthSrc.extend({
  frequency: zFrequency,
  oscillator: zOmniOscillator,
  envelope: zEnvelope,
}), Tone.Synth);

export const baseSynthConfig: SynthNodeConfig<
  Tone.Synth,
  typeof zBaseSynth
> = {
  schema: zBaseSynth,
  createNode: () => new Tone.Synth(),
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
