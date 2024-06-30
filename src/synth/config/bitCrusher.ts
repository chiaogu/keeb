import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { zBaseSynthFx } from "./shared";
import { z } from "zod";

const zBitCrusher = zBaseSynthFx.extend({
  bits: z.number().min(1).max(16).catch(8),
});

export const bitCrusherConfig: SynthNodeConfig<
  Tone.BitCrusher,
  typeof zBitCrusher
> = {
  schema: zBitCrusher,
  createNode: () => new Tone.BitCrusher(),
};

export const setBitCrusherState = bitCrusherConfig.setState;
