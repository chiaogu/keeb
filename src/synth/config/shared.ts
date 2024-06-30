import { z } from "zod";

export const zBaseSynthSrc = z.object({
  volume: z.number().min(-80).max(-15).catch(-20),
  duration: z.number().min(0.001).max(0.2).catch(0.1),
  delay: z.number().min(0).max(0.2).catch(0),
});

export const zBaseSynthFx = z.object({
  wet: z.number().min(0).max(1).catch(0.5),
});
