import * as Tone from "@src/tone";
import { SynthNodeConfig } from ".";
import { z } from "zod";
import { zBaseSynthFx } from "./shared";
import withToneDefaults from "../withToneDefaults";

const zChebyshev = withToneDefaults(
  zBaseSynthFx.extend({
    order: z.number().min(0).max(100),
    oversample: z.enum(["none", "2x", "4x"]),
  }),
  Tone.Chebyshev,
);

export const chebyshevConfig: SynthNodeConfig<
  Tone.Chebyshev,
  typeof zChebyshev
> = {
  schema: zChebyshev,
  setState(node, state) {
    node.set({
      ...state,
      order: Math.round(state.order),
    });
  },
  createNode: () => new Tone.Chebyshev(),
};
