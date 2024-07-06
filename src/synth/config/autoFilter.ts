import { z } from 'zod';
import * as Tone from '@src/tone';
import { withInnerDefaults } from '@src/utils/schema';
import createConfig from '../createConfig';
import { zInnerFilter } from './filter';
import { zBaseSynthFx, zFrequency } from './shared';

export const autoFilterConfig = createConfig(
  Tone.AutoFilter,
  zBaseSynthFx.extend({
    baseFrequency: zFrequency,
    depth: z.number().min(0).max(1),
    filter: zInnerFilter.omit({ gain: true, frequency: true }),
    lfo: withInnerDefaults(
      z.object({
        frequency: z.number().min(0).max(500).catch(100),
        octaves: z.number().min(0.5).max(8).catch(1),
        type: z.enum(['sawtooth', 'sine', 'square', 'triangle']).catch('sine'),
      }),
    ),
  }),
  {
    createNode() {
      return new Tone.AutoFilter().start();
    },
    setState(node, state) {
      node.set({
        ...state,
        ...state.lfo,
        filter: {
          ...state.filter,
          rolloff: parseInt(state.filter.rolloff) as Tone.FilterRollOff,
        },
      });
    },
  },
);
