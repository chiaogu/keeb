import { SupportedSrcToneNode } from "./createSynthNode";
import { nodeConfig } from './config';

export default function triggerToneNode(node: SupportedSrcToneNode) {
  Object.values(nodeConfig).some((config) => {
    if (node instanceof config.ToneClass) {
      config.trigger?.(node as never);
      return true;
    }
  });
}
