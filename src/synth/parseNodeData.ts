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

export function parseSrcNodeState({ type, data }: SynthSrcNodeState) {
  return { type, data: parseNodeData(type, data) };
}

export function parseFxNodeState({ type, data }: SynthFxNodeState) {
  return { type, data: parseNodeData(type, data) };
}
