import * as Tone from 'tone';
import { SupportedToneNode } from "./createSynthNode";
import { setMetalSynthState } from './config/metalSynth';

export default function setToneNodeState(
  node: SupportedToneNode,
  state: Record<string, unknown>,
) {
  if (node instanceof Tone.MetalSynth) {
    setMetalSynthState(node, state);
  }
}
