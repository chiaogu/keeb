import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { MAX_SOUND_DURATION } from "@src/utils/constants";
import { z } from "zod";
import { zBaseSynthFx } from "./shared";

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
  createNode: () => new Tone.Reverb(),
  ready: (node) => node.ready,
};
