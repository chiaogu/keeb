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

export const keyModifier: KeySoundModifier = {
  KeyQ: {
    'a88e987f-dcee-4024-97d9-45c610478592': {
      'a43130ae-1f4a-41bb-b9f2-656ca0768b7b': {
        frequency: ['add', 300],
      },
      '37347d4c-05c7-439c-800e-37fcb1ebde4e': {
        frequency: ['add', 300],
      },
    },
  },
  KeyW: {
    'a88e987f-dcee-4024-97d9-45c610478592': {
      'a43130ae-1f4a-41bb-b9f2-656ca0768b7b': {
        frequency: ['add', -300],
      },
      '37347d4c-05c7-439c-800e-37fcb1ebde4e': {
        frequency: ['add', -300],
      },
    },
  },
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
