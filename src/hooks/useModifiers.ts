import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import {
  isFieldRandomConfig,
  isModifierOp,
  iterateSoundStructure,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { KeyboardConfig, ModifierLayer, RandomizationConfig } from '@src/types';
import {
  getSoundStructureFieldPath,
  replaceSoundStructureField,
} from '@src/utils/utils';
import { isEmpty, set } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';

export default function useModifiers(keyboard: KeyboardConfig) {
  const [modifiers, setModifiers] = useImmer(keyboard.sound.modifiers);

  const loadModifierLayers = useCallback(
    (config: ModifierLayer[]) => {
      setModifiers(() => config);
    },
    [setModifiers],
  );

  const addModifierLayer = useCallback(
    ({ name, type }: Pick<ModifierLayer, 'name' | 'type'>) => {
      setModifiers((draft) => {
        if (type === 'custom') {
          draft.push({
            id: uuid(),
            keys: {},
            name,
            type,
          });
        }
        if (type === 'random') {
          draft.push({
            id: uuid(),
            keys: {},
            config: {},
            randomSeed: {},
            name,
            type,
          });
        }
      });
    },
    [setModifiers],
  );

  const removeModifierLayer = useCallback(
    (index: number) => {
      setModifiers((draft) => {
        draft.splice(index, 1);
      });
    },
    [setModifiers],
  );

  const updateModiferLayer = useCallback(
    (index: number, updates: Partial<Pick<ModifierLayer, 'name' | 'type'>>) => {
      setModifiers((draft) => {
        if (updates.name != null) {
          draft[index].name = updates.name;
        }

        if (updates.type === 'custom') {
          draft[index] = {
            id: uuid(),
            keys: {},
            name: draft[index].name,
            type: updates.type,
          };
        }

        if (updates.type === 'random') {
          draft[index] = {
            id: uuid(),
            keys: {},
            config: {},
            randomSeed: {},
            name: draft[index].name,
            type: updates.type,
          };
        }
      });
    },
    [setModifiers],
  );

  const updateModifier = useCallback(
    (
      layerIndex: number,
      keys: string[],
      updater: (modifier: SoundModifier) => SoundModifier,
    ) => {
      setModifiers((draft) => {
        keys.forEach((key) => {
          draft[layerIndex].keys[key] = updater(
            draft[layerIndex].keys[key] ?? {},
          );
        });
      });
    },
    [setModifiers],
  );

  const removeModifier = useCallback(
    (layerIndex: number, keys: string[]) => {
      setModifiers((draft) => {
        keys.forEach((key) => {
          delete draft[layerIndex].keys[key];
        });
      });
    },
    [setModifiers],
  );

  const batchSetModifier = useCallback(
    (layerIndex: number, keys: string[], resetSeed: boolean = false) => {
      const getSeed = () => Math.round(Math.random() * 100) / 100;

      setModifiers((draft) => {
        keys.forEach((key) => {
          if (draft[layerIndex].type !== 'random') return;

          const currentSeed = draft[layerIndex].randomSeed[key];
          const seed = currentSeed && !resetSeed ? currentSeed : getSeed();

          set(draft[layerIndex], ['randomSeed', key], seed);
          draft[layerIndex].keys[key] = {};

          // Don't set modifier when there is no random config
          if (isEmpty(draft[layerIndex].config)) {
            return;
          }

          iterateSoundStructure(
            draft[layerIndex].config,
            isFieldRandomConfig,
            (fieldPath, { min, max, options }) => {
              let modifier: ModifierOp | null = null;

              if (min != null && max != null) {
                modifier = ['add', min + seed * (max - min)];
              } else if (options != null) {
                modifier = [
                  'set',
                  // TODO: Sort by schema
                  options[Math.round(seed * (options.length - 1))],
                ];
              }

              if (modifier) {
                set(
                  draft[layerIndex].keys,
                  [key, ...getSoundStructureFieldPath(fieldPath)],
                  modifier,
                );
              }
            },
          );
        });
      });
    },
    [setModifiers],
  );

  const updateRandomConfig = useCallback(
    (
      layerIndex: number,
      updater: (config: RandomizationConfig) => RandomizationConfig,
    ) => {
      setModifiers((draft) => {
        if (draft[layerIndex].type !== 'random') return;
        draft[layerIndex].config = updater(draft[layerIndex].config);
      });
    },
    [setModifiers],
  );

  const fixInvalidFields = useCallback(
    (oldField: SoundFieldPath, newField: SoundFieldPath) => {
      setModifiers((draft) => {
        draft.forEach((layer) => {
          if (layer.type === 'random') {
            iterateSoundStructure(
              layer.config,
              isFieldRandomConfig,
              (field) => {
                if (
                  field.synthId === oldField.synthId &&
                  field.nodeId === oldField.nodeId
                ) {
                  replaceSoundStructureField(layer.config, field, {
                    ...newField,
                    fieldPath: field.fieldPath,
                  });
                }
              },
            );
          }

          Object.values(layer.keys).forEach((modifier) => {
            iterateSoundStructure(modifier, isModifierOp, (field) => {
              if (
                field.synthId === oldField.synthId &&
                field.nodeId === oldField.nodeId
              ) {
                replaceSoundStructureField(modifier, field, {
                  ...newField,
                  fieldPath: field.fieldPath,
                });
              }
            });
          });
        });
      });
    },
    [setModifiers],
  );

  return useMemo(
    () => ({
      layers: modifiers,
      addModifierLayer,
      removeModifierLayer,
      updateModiferLayer,
      updateModifier,
      removeModifier,
      batchSetModifier,
      updateRandomConfig,
      loadModifierLayers,
      fixInvalidFields,
    }),
    [
      modifiers,
      addModifierLayer,
      removeModifierLayer,
      updateModiferLayer,
      updateModifier,
      removeModifier,
      batchSetModifier,
      updateRandomConfig,
      loadModifierLayers,
      fixInvalidFields,
    ],
  );
}
