import * as Tone from "@src/tone";
import { zBaseSynthFx, zNormalRange } from "./shared";
import createConfig from "../createConfig";

export const jcreverbConfig = createConfig(
  Tone.JCReverb,
  zBaseSynthFx.extend({
    roomSize: zNormalRange,
  }),
);
