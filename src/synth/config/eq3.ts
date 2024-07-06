import * as Tone from "@src/tone";
import { zBaseSynthFx, zFrequency } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";
import createFxClass from "../createFxClass";

export const eq3Config = createConfig(
  createFxClass(Tone.EQ3),
  zBaseSynthFx.extend({
    low: z.number().min(-80).max(10),
    mid: z.number().min(-80).max(10),
    high: z.number().min(-80).max(10),
    lowFrequency: zFrequency,
    highFrequency: zFrequency,
  }),
);
