import * as Tone from "@src/tone";
import { z } from "zod";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

export const feedbackDelayConfig = createConfig(
  Tone.FeedbackDelay,
  zBaseSynthFx.extend({
    feedback: z.number().min(0).max(1),
    delayTime: z.number().min(0).max(MAX_SOUND_DURATION),
    maxDelay: z.number().min(0).max(MAX_SOUND_DURATION),
  }),
);