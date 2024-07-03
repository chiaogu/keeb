import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { MAX_SOUND_DURATION } from "@src/utils/constants";
import { z } from "zod";
import { zBaseSynthFx, zFrequency } from "./shared";
import withToneDefaults from "../withToneDefaults";

const zAutoWah = withToneDefaults(zBaseSynthFx.extend({
  Q: z.number().min(0).max(100),
  baseFrequency: zFrequency,
  follower: z.number().min(0).max(MAX_SOUND_DURATION),
  gain: z.number().min(-80).max(2),
  octaves: z.number().min(0.5).max(8).catch(1),
  sensitivity: z.number().min(-80).max(0),
}), Tone.AutoWah);

export const autoWahConfig: SynthNodeConfig<Tone.AutoWah, typeof zAutoWah> = {
  schema: zAutoWah,
  createNode: () => new Tone.AutoWah(),
};
