import { FxNodeType, SrcNodeType, nodeConfig } from "./config";

export type SupportedSrcToneNode = ReturnType<typeof createSrcNode>;

export function createSrcNode(type: SrcNodeType) {
  if (!nodeConfig[type]) {
    throw new Error(`Unsupported type ${type}`);
  }
  return nodeConfig[type].createNode();
}

export type SupportedFxToneNode = ReturnType<typeof createFxNode>;

export function createFxNode(type: FxNodeType) {
  if (!nodeConfig[type]) {
    throw new Error(`Unsupported type ${type}`);
  }
  return nodeConfig[type].createNode();
}
