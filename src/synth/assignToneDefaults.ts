import * as Tone from "@src/tone";
import { z } from "zod";

export default function assignToneDefaults(
  schema: z.ZodTypeAny,
  node: {
    new (): Tone.ToneAudioNode;
    getDefaults: (typeof Tone.ToneAudioNode)["getDefaults"];
  },
) {

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
  );
}
