import { z } from 'zod';
import { withInnerDefaults } from '@src/utils/schema';

export const zOmniOscillatorType = z
  .enum(['sawtooth', 'sine', 'square', 'triangle', 'pulse', 'pwm'])
  .catch('sine');

const zInnerOmniOscillator = z.object({
  type: zOmniOscillatorType,
});

export const zOmniOscillator = withInnerDefaults(zInnerOmniOscillator);

export type OmniOscillator = z.infer<typeof zOmniOscillator>;
