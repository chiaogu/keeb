import * as Tone from '@src/tone';
import { ToneClass } from '@src/types';
import { z } from 'zod';
import { SynthNodeConfig } from './config';
import withToneDefaults from './withToneDefaults';

export default function createConfig<
  T extends Tone.ToneAudioNode,
  Z extends z.ZodTypeAny,
>(
  ToneClass: ToneClass<T>,
  schema: Z,
  override?: Partial<SynthNodeConfig<T, Z>>,
): SynthNodeConfig<T, Z> {
  return {
    ToneClass,
    schema: withToneDefaults(schema, ToneClass),
    createNode: () => new ToneClass(),
    ...override,
  };
}
