import * as Tone from '@src/tone';
import { z } from 'zod';
import createConfig from '../createConfig';
import { zBaseSynthFx, zOversample } from './shared';

export const chebyshevConfig = createConfig(
  Tone.Chebyshev,
  zBaseSynthFx.extend({
    order: z.number().min(0).max(100),
    oversample: zOversample,
  }),
  {
    setState(node, state) {
      node.set({
        ...state,
        order: Math.round(state.order),
      });
    },
  },
);
