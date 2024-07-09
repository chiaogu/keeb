import { SynthNodeState } from '@src/synth';
import { produce } from 'immer';

export type SynthModifier = {
  [nodeId: string]: {
    [option: string]: ['add', number] | ['set', unknown];
  };
};

export type SoundModifier = {
  [synthId: string]: SynthModifier;
};

export type KeySoundModifier = {
  [key: string]: SoundModifier;
};

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
