import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import {
  SoundStructure,
  SoundStructureField,
} from '@src/components/SoundStructureTree/SoundStructure';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { FieldRandomConfig, ModifierLayer } from '@src/types';
import { RANDOM_SEED_ID } from '@src/utils/constants';
import { getNumberDef, removeDefault } from '@src/utils/schema';
import { produce, WritableDraft } from 'immer';
import { z } from 'zod';

export type ModifierOp = ['add', number] | ['set', string];

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
  modifiers: SynthModifier[],
) {
  return produce(node, (draft) => {
    modifiers.forEach((modifier) => {
      Object.entries(modifier[node.id] ?? {}).forEach(
        ([key, [action, value]]) => {
          if (action === 'add') {
            modifierNumberData(draft, node, key, value);
          } else if (action === 'set') {
            draft.data[key] = value;
          }
        },
      );
    });
  }).data;
}

export function getFieldRandomSeed(modifier: SoundModifier) {
  return modifier?.[RANDOM_SEED_ID]?.[RANDOM_SEED_ID]?.[RANDOM_SEED_ID]?.[1] as
    | number
    | undefined;
}

export function getDefaultRandomConfig(
  { fieldPath }: SoundFieldPath,
  node: SynthNodeState,
) {
  // TODO: Suppoer nested fields
  const schema = removeDefault(
    nodeConfig[node.type].schema.shape[
      fieldPath[fieldPath.length - 1] as never
    ],
  );

  if (schema instanceof z.ZodNumber) {
    return { min: -0.3, max: 0.3 };
  }
}

export function isFieldRandomConfig(
  field: SoundStructureField<FieldRandomConfig>,
): field is FieldRandomConfig {
  return (
    typeof field === 'object' &&
    (field.max != null || field.min != null || field.options != null)
  );
}

export function iterateSoundStructure<T>(
  structure: SoundStructure<T>,
  isLeafNode: (field: SoundStructureField<T>) => field is T,
  callback: (field: SoundFieldPath, value: T) => void,
) {
  Object.entries(structure).forEach(([synthId, nodes]) => {
    Object.entries(nodes).forEach(([nodeId, fields]) => {
      const iterate = (value: SoundStructureField<T>, fieldPath: string[]) => {
        if (isLeafNode(value)) {
          callback({ synthId, nodeId, fieldPath }, value);
        } else {
          Object.entries(value).map(([field, nestedValue]) => {
            iterate(nestedValue, [...fieldPath, field]);
          });
        }
      };
      Object.entries(fields).forEach(([field, value]) => {
        iterate(value, [field]);
      });
    });
  });
}

export function findSynthModifiers(
  soundModifiers: SoundModifier[],
  synthId: string,
) {
  const result: SynthModifier[] = [];
  soundModifiers.forEach((sound) => {
    Object.entries(sound).forEach(([_synthId, synthModifier]) => {
      if (synthId === _synthId) {
        result.push(synthModifier);
      }
    });
  });
  return result;
}


export function findSoundModifiers(
  layers: ModifierLayer[],
  key: string,
) {
  return layers.map(({ keys }) => keys[key]).filter(Boolean);
}
