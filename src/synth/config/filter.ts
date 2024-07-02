import { withInnerDefaults } from "@src/utils/schema";
import { z } from "zod";
import { zFrequency } from "./shared";
import withToneDefaults from "../withToneDefaults";
import * as Tone from '@src/tone';

const zInnerFilter = withToneDefaults(z.object({
  rolloff: z.number().min(-96).max(-12).catch(-24),
  Q: z.number().min(0).max(100),
  frequency: zFrequency,
  gain: z.number().min(-80).max(0),
  type: z.enum(["allpass", "bandpass", "highpass", "highshelf", "lowpass", "lowshelf", "notch", "peaking"]),
}), Tone.Filter);

export const zFilter = withInnerDefaults(zInnerFilter);

export type Filter = z.infer<typeof zFilter>;
