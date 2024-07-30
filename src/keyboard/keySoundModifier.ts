import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import {
  SoundStructure,
  SoundStructureField,
} from '@src/components/SoundStructureTree/SoundStructure';
import { SynthNodeState } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { FieldRandomConfig, ModifierLayer } from '@src/types';
import { getNestedFieldSchema, getNumberDef } from '@src/utils/schema';
import { produce, WritableDraft } from 'immer';
import { get, set } from 'lodash-es';
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
  fieldPath: string[],
  value: number,
) {
  const schema = getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);
  if (schema instanceof z.ZodNumber) {
    const { min, max } = getNumberDef(schema);
    const newValue = Math.min(
      max,
      Math.max(
        min,
        (get(draft.data, fieldPath) as number) + value * (max - min),
      ),
    );
    set(draft.data, fieldPath, newValue);
  }
}

export function getModifiedNodeData(
  synthId: string,
  node: SynthNodeState,
  modifiers: SoundModifier[],
) {
  return produce(node, (draft) => {
    modifiers.forEach((modifier) => {
      iterateSoundStructure(
        modifier,
        isModifierOp,
        (field: SoundFieldPath, [action, value]) => {
          if (synthId !== field.synthId || node.id !== field.nodeId) {
            return;
          }
          
          if (action === 'add') {
            modifierNumberData(draft, node, field.fieldPath, value);
          } else if (action === 'set') {
            set(draft.data, field.fieldPath, value);
          }
        },
      );
    });
  }).data;
}

export function getDefaultRandomConfig(
  { fieldPath }: SoundFieldPath,
  node: SynthNodeState,
) {
  const schema = getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);

  if (schema instanceof z.ZodNumber) {
    return { min: -0.3, max: 0.3 };
  }

  if (schema instanceof z.ZodEnum) {
    return { options: schema.options };
  }
}

export function isModifierOp(
  field: SoundStructureField<ModifierOp>,
): field is ModifierOp {
  return Array.isArray(field) && field.length === 2;
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

export function findSoundModifiers(layers: ModifierLayer[], key: string) {
  return layers.map(({ keys }) => keys[key]).filter(Boolean);
}

export function getDefaultModifier(
  { fieldPath }: SoundFieldPath,
  node: SynthNodeState,
) {
  const schema = getNestedFieldSchema(nodeConfig[node.type].schema, fieldPath);

  if (schema instanceof z.ZodNumber) {
    return ['add', 0];
  }

  if (schema instanceof z.ZodEnum) {
    return ['set', schema.options[0]];
  }
}
