import { withInnerDefaults } from '@src/utils/schema';
import { z } from 'zod';

const zEnvelopeCurve = z
  .enum(['linear', 'exponential', 'bounce', 'cosine', 'sine', 'ripple', 'step'])
  .catch('linear');

export const zInnerEnvelope = z.object({
  attack: z.number().min(0).max(1).catch(0),
  decay: z.number().min(0).max(1).catch(0.25),
  sustain: z.number().min(0).max(1).catch(0),
  release: z.number().min(0).max(1).catch(0),
  // attackCurve: zEnvelopeCurve,
  // decayCurve: z.enum(['linear', 'exponential']).catch('linear'),
  // releaseCurve: zEnvelopeCurve,
});

export const zEnvelope = withInnerDefaults(zInnerEnvelope);

export type Envelope = z.infer<typeof zInnerEnvelope>;
