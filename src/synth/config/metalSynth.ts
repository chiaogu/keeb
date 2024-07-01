import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc } from "./shared";
import { z } from "zod";
import { zEnvelope } from "./envelope";
import assignToneDefaults from "../assignToneDefaults";

const zMetalSynth = assignToneDefaults(
  zBaseSynthSrc.extend({
    harmonicity: z.number().min(0.1).max(10),
    modulationIndex: z.number().min(1).max(100),
    frequency: z.number().min(0).max(5000).catch(1125),
    octaves: z.number().min(-10).max(10),
    resonance: z.number().min(0).max(7000),
    envelope: zEnvelope,
  }),
  Tone.MetalSynth,
);

export const metalSynthConfig: SynthNodeConfig<
  Tone.MetalSynth,
  typeof zMetalSynth
> = {
  schema: zMetalSynth,
  createNode: () => new Tone.MetalSynth(),
  trigger(node, state) {
    let frequency = state.frequency;
    frequency += Math.random() * 100;
    node.triggerAttackRelease(frequency, state.duration, `+${state.delay}`);
  },
};
