import { z } from 'zod';
import { MAX_SOUND_DURATION } from '@src/utils/constants';

export const noiseTypeOptions = ['brown', 'white', 'pink'] as const;

export const zNoise = z.object({
  type: z.enum(noiseTypeOptions).catch('white'),
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

export type Noise = z.infer<typeof zNoise>;
