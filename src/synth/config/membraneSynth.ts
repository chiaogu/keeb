import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthSrc } from "./shared";
import { z } from "zod";

const zMembraneSynth = zBaseSynthSrc.extend({
  frequency: z.number().min(0).max(5000).catch(1125),
  octaves: z.number().min(0.5).max(8).catch(1),
  pitchDecay: z.number().min(0).max(0.5).catch(0.05),
});

export const membraneSynthConfig: SynthNodeConfig<
  Tone.MembraneSynth,
  typeof zMembraneSynth
> = {
  schema: zMembraneSynth,
  createNode: () => new Tone.MembraneSynth(),
  setState(node, state) {
    node.set({
      volume: state.volume,
      octaves: state.octaves,
      pitchDecay: state.pitchDecay,
    });
  },
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

export const setNoiseSynthState = membraneSynthConfig.setState;
