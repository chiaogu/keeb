import { SrcNodeType, FxNodeType, nodeConfig } from "./config";

export default function getDefaultNodeState(type: SrcNodeType | FxNodeType) {
  return Object.fromEntries(
    Object.entries(nodeConfig[type]).map(([key, { defaultValue }]) => [
      key,
      defaultValue,
    ]),
  );
}