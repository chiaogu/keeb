import * as Tone from '@src/tone';
import { MAX_SOUND_DURATION } from '@src/utils/constants';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx } from './shared';

export const pitchShiftConfig = createConfig(
  Tone.PitchShift,
  zBaseSynthFx.extend({
    feedback: z.number().min(0).max(1),
    delayTime: z.number().min(0).max(MAX_SOUND_DURATION),
    pitch: z.number().min(-36).max(36),
    windowSize: z.number().min(0.003).max(1),
  }),
);
