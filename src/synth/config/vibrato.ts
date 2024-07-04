import * as Tone from "@src/tone";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

export const vibratoConfig = createConfig(
  Tone.Vibrato,
  zBaseSynthFx.extend({
    depth: z.number().min(0).max(1),
    frequency: z.number().min(0).max(100),
    maxDelay: z.number().min(0).max(MAX_SOUND_DURATION),
    type: z.enum(["sawtooth", "sine", "square", "triangle"]),
  }),
);
