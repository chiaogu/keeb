import * as Tone from 'tone';
import { SynthNodeType } from "./config";

export type SupportedToneNode = ReturnType<typeof createSynthNode>;

export default function createSynthNode(type: SynthNodeType) {
  switch (type) {
    case 'metal':
      return new Tone.MetalSynth();
    default:
      return new Tone.PolySynth();
  }
}
