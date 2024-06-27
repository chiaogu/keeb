import * as Tone from "@src/tone";
import { FxNodeType, SrcNodeType } from "./config";

const synthNodeToneClassMap = {
  metal: Tone.MetalSynth,
  noise: Tone.NoiseSynth,
  reverb: Tone.Reverb,
  bitCrusher: Tone.BitCrusher,
};

export type SupportedSrcToneNode = ReturnType<typeof createSrcNode>;

export function createSrcNode(type: SrcNodeType) {
  if (!synthNodeToneClassMap[type]) {
    throw new Error(`Unsupported type ${type}`);
  }
  return new synthNodeToneClassMap[type]();
}

export type SupportedFxToneNode = ReturnType<typeof createFxNode>;

export function createFxNode(type: FxNodeType) {
  if (!synthNodeToneClassMap[type]) {
    throw new Error(`Unsupported type ${type}`);
  }
  return new synthNodeToneClassMap[type]();
}
