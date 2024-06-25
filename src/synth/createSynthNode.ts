import * as Tone from 'tone';
import { SynthNodeType } from "./config";

export type SupportedToneNode = ReturnType<typeof createSynthNode>;

export default function createSynthNode(type: SynthNodeType) {
  switch (type) {
    case 'metal':
      return new Tone.MetalSynth();
    case 'noise':
      return new Tone.NoiseSynth();
    default:
      throw new Error(`Unsupported type ${type}`);
  }
}
