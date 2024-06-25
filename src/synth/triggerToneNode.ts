import * as Tone from 'tone';
import { SupportedToneNode } from "./createSynthNode";

export default function triggerToneNode(node: SupportedToneNode) {
  if (node instanceof Tone.MetalSynth) {
    node.triggerAttackRelease(node.frequency.value, "64n");
  } else if (node instanceof Tone.NoiseSynth) {
    node.triggerAttackRelease("64n");
  }
}
