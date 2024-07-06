import * as Tone from "@src/tone";
import { zBaseSynthFx } from "./shared";
import createConfig from "../createConfig";
import { z } from "zod";
import createFxClass from "../createFxClass";

export const zCompressorSchema = z.object({
  attack: z.number().min(0).max(1),
  knee: z.number().min(0).max(40),
  ratio: z.number().min(1).max(20),
  release: z.number().min(0).max(1),
  threshold: z.number().min(-100).max(0),
});

export const compressorConfig = createConfig(
  createFxClass(Tone.Compressor),
  zBaseSynthFx.merge(zCompressorSchema),
);
