import * as Tone from '@src/tone';
import { SupportedSrcToneNode } from "./createSynthNode";

export default function triggerToneNode(node: SupportedSrcToneNode) {
  if (node instanceof Tone.MetalSynth) {
    node.triggerAttackRelease(node.frequency.value, "64n");
  } else if (node instanceof Tone.NoiseSynth) {
    node.triggerAttackRelease("64n");
  }
}
