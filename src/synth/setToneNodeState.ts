import * as Tone from '@src/tone';
import { SupportedSrcToneNode, SupportedFxToneNode } from "./createSynthNode";
import { setMetalSynthState } from './config/metalSynth';
import { setNoiseSynthState } from './config/noiseSynth';
import { setReverbState } from './config/reverb';

export default function setToneNodeState(
  node: SupportedSrcToneNode | SupportedFxToneNode,
  state: Record<string, unknown>,
) {
  if (node instanceof Tone.MetalSynth) {
    setMetalSynthState(node, state);
  } else if (node instanceof Tone.NoiseSynth) {
    setNoiseSynthState(node, state);
  } else if (node instanceof Tone.Reverb) {
    setReverbState(node, state);
  }
}
