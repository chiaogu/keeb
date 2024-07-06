import * as Tone from '@src/tone';
import { z } from 'zod';
import { SynthNodeConfig } from '.';
import withToneDefaults from '../withToneDefaults';
import { zBaseSynthFx, zOversample } from './shared';

const zChebyshev = withToneDefaults(
  zBaseSynthFx.extend({
    order: z.number().min(0).max(100),
    oversample: zOversample,
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
