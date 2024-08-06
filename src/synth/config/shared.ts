import { z } from 'zod';

export const zBaseSynthSrc = z.object({
  volume: z.number().min(-80).max(10).catch(0),
  duration: z.number().min(0.001).max(0.2).catch(0.1),
  delay: z.number().min(0).max(0.2).catch(0),
});

export const zBaseSynthFx = z.object({
  wet: z.number().min(0.0001).max(1).catch(0.5),
});

export const zHarmonicity = z.number().min(0.1).max(10);

export const zFrequency = z.number().min(0).max(5000).catch(1125);

export const zOversample = z.enum(['none', '2x', '4x']);

export const zNormalRange = z.number().min(0).max(1);
