import * as Tone from "@src/tone";
import { z } from "zod";
import { zBaseSynthFx, zFrequency } from "./shared";
import createConfig from "../createConfig";
import { zInnerFilter } from "./filter";

export const autoFilterConfig = createConfig(
  Tone.AutoFilter,
  zBaseSynthFx.extend({
    baseFrequency: zFrequency,
    depth: z.number().min(0).max(1),
    filter: zInnerFilter.omit({ gain: true, frequency: true }),
    frequency: zFrequency,
    octaves: z.number().min(0.5).max(8),
    type: z.enum(["sawtooth", "sine", "square", "triangle"]),
  }),
  {
    setState(node, state) {
      node.set({
        ...state,
        filter: {
          ...state.filter,
          rolloff: parseInt(state.filter.rolloff) as Tone.FilterRollOff,
        },
      });
    },
  },
);
