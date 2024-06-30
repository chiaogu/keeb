import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { MAX_SOUND_DURATION } from "@src/utils/constants";
import { z } from "zod";
import { baseFxControls, zBaseSynthFx } from "./shared";

const zReverb = zBaseSynthFx.extend({
  decay: z
    .number()
    .min(0.001)
    .max(MAX_SOUND_DURATION)
    .catch(MAX_SOUND_DURATION / 2),
  preDelay: z.number().min(0).max(0.5).catch(0.05),
});

export const reverbConfig: SynthNodeConfig<Tone.Reverb, typeof zReverb> = {
  schema: zReverb,
  controls: {
    ...baseFxControls,
    decay: {
      defaultValue: 1,
      type: "range",
      range: [0.001, MAX_SOUND_DURATION],
    },
    preDelay: {
      defaultValue: 0.05,
      type: "range",
      range: [0, 0.5],
    },
  },
  createNode: () => new Tone.Reverb(),
  setState(node, state) {
    node.set({
      wet: state.wet as number,
      decay: state.decay as number,
      preDelay: state.preDelay as number,
    });
  },
  ready: (node) => node.ready,
};

export const setReverbState = reverbConfig.setState;
