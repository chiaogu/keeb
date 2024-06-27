import * as Tone from "@src/tone";
import { FxNodeType, SrcNodeType } from "./config";

export type SupportedSrcToneNode = ReturnType<typeof createSrcNode>;

export function createSrcNode(type: SrcNodeType) {
  switch (type) {
    case 'metal':
      return new Tone.MetalSynth();
    case 'noise':
      return new Tone.NoiseSynth();
    default:
      throw new Error(`Unsupported type ${type}`);
  }
}

export type SupportedFxToneNode = ReturnType<typeof createFxNode>;

export function createFxNode(type: FxNodeType) {
  switch (type) {
    case 'reverb':
      return new Tone.Reverb();
    case 'bitCrusher':
      return new Tone.BitCrusher();
    default:
      throw new Error(`Unsupported type ${type}`);
  }
}