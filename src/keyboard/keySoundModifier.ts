import { SynthNodeState } from '@src/synth';
import { produce } from 'immer';

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

// TODO: Percentage instead of absolute value
export function getModifiedNodeData(
  node: SynthNodeState,
  modifier: SynthModifier = {},
) {
  return produce(node, (draft) => {
    Object.entries(modifier[node.id] ?? {}).forEach(
      ([key, [action, value]]) => {
        if (action === 'add') {
          (draft.data[key] as number) += value;
        } else if (action === 'set') {
          draft.data[key] = value;
        }
      },
    );
  }).data;
}
