import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { getNumberDef, removeDefault } from '@src/utils/schema';
import { produce, WritableDraft } from 'immer';
import { z } from 'zod';

export type ModifierOp = ['add', number] | ['set', unknown];

export type SynthNodeModifier = {
  [option: string]: ModifierOp;
};

export type SynthModifier = {
  [nodeId: string]: SynthNodeModifier;
};

export type SoundModifier = {
  [synthId: string]: SynthModifier;
};

export type KeySoundModifier = {
  [key: string]: SoundModifier;
};

function modifierNumberData(
  draft: WritableDraft<SynthNodeState>,
  node: SynthNodeState,
  field: string,
  value: number,
) {
  const schema = removeDefault(
    nodeConfig[node.type].schema.shape[field as never],
  );
  if (schema instanceof z.ZodNumber) {
    const { min, max } = getNumberDef(schema);
    const newValue = Math.min(
      max,
      Math.max(min, (draft.data[field] as number) + value * (max - min)),
    );
    draft.data[field] = newValue;
  }
}

export function getModifiedNodeData(
  node: SynthNodeState,
  modifier: SynthModifier = {},
) {
  return produce(node, (draft) => {
    Object.entries(modifier[node.id] ?? {}).forEach(
      ([key, [action, value]]) => {
        if (action === 'add') {
          modifierNumberData(draft, node, key, value);
        } else if (action === 'set') {
          draft.data[key] = value;
        }
      },
    );
  }).data;
}
