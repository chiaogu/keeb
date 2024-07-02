import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc, zFrequency, zHarmonicity } from "./shared";
import { zEnvelope } from "./envelope";
import withToneDefaults from "../withToneDefaults";
import { zOmniOscillator } from "./omniOscillator";
import { z } from "zod";

const zFmSynth = withToneDefaults(zBaseSynthSrc.extend({
  frequency: zFrequency,
  oscillator: zOmniOscillator,
  envelope: zEnvelope,
  harmonicity: zHarmonicity,
  modulation: zOmniOscillator,
  modulationEnvelope: zEnvelope,
  modulationIndex: z.number().min(0.01).max(1000),
}), Tone.FMOscillator);

export const fmSynthConfig: SynthNodeConfig<
  Tone.FMSynth,
  typeof zFmSynth
> = {
  schema: zFmSynth,
  createNode: () => new Tone.FMSynth(),
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
