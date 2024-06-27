import { SynthNodeType, nodeConfig } from "./config";

export default function getDefaultNodeState(type: SynthNodeType) {
  return Object.fromEntries(
    Object.entries(nodeConfig[type].controls).map(([key, { defaultValue }]) => [
      key,
      defaultValue,
    ]),
  );
}