import * as Tone from '@src/tone';
import { z } from 'zod';
import { SynthNodeConfig } from '.';
import { zBaseSynthFx } from './shared';

const zBitCrusher = zBaseSynthFx.extend({
  bits: z.number().min(1).max(16).catch(8),
});

export const bitCrusherConfig: SynthNodeConfig<
  Tone.BitCrusher,
  typeof zBitCrusher
> = {
  schema: zBitCrusher,
  createNode: () => new Tone.BitCrusher(),
};
