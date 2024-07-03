import * as Tone from "@src/tone";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

export const pingPongDelayConfig = createConfig(
  Tone.PingPongDelay,
  zBaseSynthFx.extend({
    feedback: z.number().min(0).max(1),
    delayTime: z.number().min(0).max(MAX_SOUND_DURATION),
    maxDelay: z.number().min(0).max(MAX_SOUND_DURATION),
  }),
);
