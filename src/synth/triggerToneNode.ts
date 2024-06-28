import { SupportedSrcToneNode } from "./createSynthNode";
import { nodeConfig } from "./config";
import { SynthSrcNodeState } from ".";

export default function triggerToneNode(
  node: SupportedSrcToneNode,
  state: SynthSrcNodeState,
) {
  nodeConfig[state.type].trigger?.(node as never, state.data);
}
