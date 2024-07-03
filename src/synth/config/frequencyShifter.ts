import * as Tone from "@src/tone";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";

export const frequencyShifterConfig = createConfig(
  Tone.FrequencyShifter,
  zBaseSynthFx.extend({
    frequency: z.number().min(-5000).max(5000).catch(0),
  }),
);
