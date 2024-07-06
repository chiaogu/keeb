import * as Tone from '@src/tone';
import { ToneClass } from '@src/types';
import { z } from 'zod';

export default function withToneDefaults<Z extends z.ZodTypeAny>(
  schema: Z,
  node: ToneClass<Tone.ToneAudioNode>,
): Z {
  if (!(schema instanceof z.ZodObject)) {
    throw new Error(`assignToneDefaults cannot be used for ${schema}`);
  }

  const defaults = node.getDefaults() as unknown as Record<string, unknown>;

  return z.object(
    Object.fromEntries(
      Object.entries(schema.shape).map(([key, field]) => {
        if (field instanceof z.ZodCatch) {
          return [key, field];
        }

        const newField = (field as z.ZodTypeAny).catch(defaults[key]);
        return [key, newField];
      }),
    ),
  ) as unknown as Z;
}
