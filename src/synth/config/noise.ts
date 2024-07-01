import { MAX_SOUND_DURATION } from "@src/utils/constants";
import { withInnerDefaults } from "@src/utils/schema";
import { z } from "zod";

export const noiseTypeOptions = ["brown", "white", "pink"] as const;

const zInnerNoise = z.object({
  type: z.enum(noiseTypeOptions).catch("white"),
  playbackRate: z.number().min(0.001).max(1).catch(1),
  fadeIn: z
    .number()
    .min(0)
    .max(MAX_SOUND_DURATION / 2)
    .catch(0),
  fadeOut: z
    .number()
    .min(0)
    .max(MAX_SOUND_DURATION / 2)
    .catch(0),
});

export const zNoise = withInnerDefaults(zInnerNoise);

export type Noise = z.infer<typeof zInnerNoise>;