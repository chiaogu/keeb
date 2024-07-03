import * as Tone from "@src/tone";
import { z } from "zod";
import { SynthNodeConfig } from "./config";
import withToneDefaults from "./withToneDefaults";
import { ToneClass } from "@src/types";

export default function createConfig<
  T extends Tone.ToneAudioNode,
  Z extends z.ZodTypeAny,
>(
  ToneClass: ToneClass<T>,
  schema: Z,
  override?: Partial<SynthNodeConfig<T, Z>>,
): SynthNodeConfig<T, Z> {
  return {
    schema: withToneDefaults(schema, ToneClass),
    createNode: () => new ToneClass(),
    ...override,
  };
}
