import * as Tone from "@src/tone";
import { zBaseSynthFx, zFrequency, zNormalRange } from "./shared";
import createConfig from "../createConfig";
import { removeDefault } from "@src/utils/schema";

export const freeverbConfig = createConfig(
  Tone.Freeverb,
  zBaseSynthFx.extend({
    dampening: removeDefault(zFrequency),
    roomSize: zNormalRange,
  }),
);
