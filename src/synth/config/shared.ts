import { z } from "zod";

export const zBaseSynthSrc = z.object({
  volume: z.number().min(-80).max(-15).catch(-10),
  duration: z.number().min(0.001).max(0.2).catch(0.1),
  delay: z.number().min(0).max(0.2).catch(0),
});

export const zBaseSynthFx = z.object({
  wet: z.number().min(0).max(1).catch(0.5),
});

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

export const defauleEnvelope: Envelope = {
  attack: 0,
  decay: 0,
  sustain: 1,
  release: 0,
  attackCurve: "linear",
  decayCurve: "linear",
  releaseCurve: "linear",
};
