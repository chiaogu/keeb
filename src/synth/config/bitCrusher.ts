import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { baseFxControls, zBaseSynthFx } from "./shared";
import { z } from "zod";

const zBitCrusher = zBaseSynthFx.extend({
  bits: z.number().min(1).max(16).catch(8),
});

export const bitCrusherConfig: SynthNodeConfig<
  Tone.BitCrusher,
  typeof zBitCrusher
> = {
  schema: zBitCrusher,
  controls: {
    ...baseFxControls,
    bits: { type: "range" },
  },
  createNode: () => new Tone.BitCrusher(),
  setState(node, state) {
    node.set({
      wet: state.wet as number,
      bits: state.bits as number,
    });
  },
};

export const setBitCrusherState = bitCrusherConfig.setState;
