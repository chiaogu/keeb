import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc, zFrequency } from "./shared";
import { zEnvelope } from "./envelope";
import withToneDefaults from "../withToneDefaults";
import { zOmniOscillator } from "./omniOscillator";
import { z } from "zod";

const zMonoSynth = withToneDefaults(zBaseSynthSrc.extend({
  frequency: zFrequency,
  oscillator: zOmniOscillator,
  envelope: zEnvelope,
  // filter: 
  filterEnvelope: zEnvelope,
  
}), Tone.AMOscillator);

export const monoSynthConfig: SynthNodeConfig<
  Tone.MonoSynth,
  typeof zMonoSynth
> = {
  schema: zMonoSynth,
  createNode: () => new Tone.MonoSynth(),
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
