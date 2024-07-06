import * as Tone from "@src/tone";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";
import createFxClass from "../createFxClass";

export const limiterConfig = createConfig(
  createFxClass(Tone.Limiter),
  zBaseSynthFx.extend({
    threshold: z.number().min(-100).max(0),
  }),
);
