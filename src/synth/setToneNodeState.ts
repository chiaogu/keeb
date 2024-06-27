import { SupportedSrcToneNode, SupportedFxToneNode } from "./createSynthNode";
import { nodeConfig } from './config';

export default function setToneNodeState(
  node: SupportedSrcToneNode | SupportedFxToneNode,
  state: Record<string, unknown>,
) {
  Object.values(nodeConfig).some((config) => {
    if (node instanceof config.ToneClass) {
      config.setState(node as never, state);
      return true;
    }
  });
}
