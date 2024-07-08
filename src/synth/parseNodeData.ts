import { SynthFxNodeState, SynthSrcNodeState } from '.';
import { SynthNodeType, nodeConfig } from './config';

export default function parseNodeData(type: SynthNodeType, data: unknown) {
  const { data: prased, error } = nodeConfig[type].schema.safeParse(data);

  if (error) {
    console.error(error.issues);
    throw error;
  }

  return prased;
}

export function parseSrcNodeState(node: SynthSrcNodeState) {
  return { ...node, data: parseNodeData(node.type, node.data) };
}

export function parseFxNodeState(node: SynthFxNodeState) {
  return { ...node, data: parseNodeData(node.type, node.data) };
}
