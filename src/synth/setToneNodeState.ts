import { SupportedSrcToneNode, SupportedFxToneNode } from "./createSynthNode";
import { nodeConfig } from './config';
import { SynthNodeState } from ".";

export default function setToneNodeState(
  node: SupportedSrcToneNode | SupportedFxToneNode,
  state: SynthNodeState
) {
  nodeConfig[state.type].setState(node as never, state.data);
}
