import * as Tone from "@src/tone";
import createConfig from "../createConfig";
import { zEnvelope } from "./envelope";
import { removeDefault } from "@src/utils/schema";
import { zBaseSynthFx } from "./shared";
import { z } from "zod";
import createFxClass from "../createFxClass";

export const amplitudeEnvelopeConfig = createConfig(
  createFxClass(Tone.AmplitudeEnvelope),
  zBaseSynthFx.merge(removeDefault(zEnvelope) as z.AnyZodObject),
  {
    trigger(node, _state, src) {
      node.triggerAttackRelease(src.duration, src.delay);
    },
  },
);
