import * as Tone from "@src/tone";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";
import createFxClass from "../createFxClass";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

export const gateConfig = createConfig(
  createFxClass(Tone.Gate),
  zBaseSynthFx.extend({
    smoothing: z.number().min(0.001).max(MAX_SOUND_DURATION),
    threshold: z.number().min(-80).max(0),
  }),
);
