import { z } from 'zod';
import * as Tone from '@src/tone';
import { withInnerDefaults } from '@src/utils/schema';
import withToneDefaults from '../withToneDefaults';
import { zFrequency } from './shared';

export const zInnerFilter = z.object({
  rolloff: z.enum(['-12', '-24', '-48', '-96']),
  Q: z.number().min(0).max(100),
  frequency: zFrequency,
  gain: z.number().min(-80).max(0),
  type: z.enum([
    'allpass',
    'bandpass',
    'highpass',
    'highshelf',
    'lowpass',
    'lowshelf',
    'notch',
    'peaking',
  ]),
});

export const zFilter = withInnerDefaults(
  withToneDefaults(zInnerFilter, Tone.Filter),
);

export type Filter = z.infer<typeof zInnerFilter>;
