import * as Tone from "@src/tone";
import { zBaseSynthFx, zFrequency } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";

export const phaserConfig = createConfig(
  Tone.Phaser,
  zBaseSynthFx.extend({
    Q: z.number().min(0).max(100),
    frequency: zFrequency,
    baseFrequency: zFrequency,
    octaves: z.number().min(0.5).max(8),
    stages: z.number().min(0).max(50),
  }),
);
