import { z } from "zod";

const zEnvelopeCurve = z
  .enum(["linear", "exponential", "bounce", "cosine", "sine", "ripple", "step"])
  .catch("linear");

const zEnvelopeWithoutDefaults = z.object({
  attack: z.number().min(0).max(1).catch(0),
  decay: z.number().min(0).max(1).catch(0),
  sustain: z.number().min(0).max(1).catch(1),
  release: z.number().min(0).max(1).catch(0),
  attackCurve: zEnvelopeCurve,
  decayCurve: z.enum(["linear", "exponential"]).catch("linear"),
  releaseCurve: zEnvelopeCurve,
});

export const zEnvelope = zEnvelopeWithoutDefaults
  .default({})
  .catch({} as z.infer<typeof zEnvelopeWithoutDefaults>);

export type Envelope = z.infer<typeof zEnvelope>;