import * as Tone from '@src/tone';
import { removeDefault } from '@src/utils/schema';
import createConfig from '../createConfig';
import { zBaseSynthFx, zFrequency, zNormalRange } from './shared';

export const freeverbConfig = createConfig(
  Tone.Freeverb,
  zBaseSynthFx.extend({
    dampening: removeDefault(zFrequency),
    roomSize: zNormalRange,
  }),
);
