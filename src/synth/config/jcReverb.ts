import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zBaseSynthFx, zNormalRange } from './shared';

export const jcreverbConfig = createConfig(
  Tone.JCReverb,
  zBaseSynthFx.extend({
    roomSize: zNormalRange,
  }),
);
