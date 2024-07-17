import { getFieldRandomSeed, ModifierOp } from '@src/keyboard/keySoundModifier';
import { KeySoundConfig, ModifierLayer, RandomizationConfig } from '@src/types';
import { RANDOM_SEED_ID } from '@src/utils/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';
import useSound from './useSound';
import useSoundCache from './useSoundCache';
import useUplodaFile from './useUplodaFile';

export type UpdateModifierArgs = {
  layerIndex: number;
  keys: string[];
  synthId: string;
  nodeId: string;
  field: string;
  value: unknown;
};

export default function useKeyboardSound(keySound: KeySoundConfig) {
  const soundCache = useSoundCache();
  const { synths, states, ...rest } = useSound(keySound.config);
  const [modifiers, setModifiers] = useImmer(keySound.modifiers);
  // TODO: Validation
  const { load } = useUplodaFile(setModifiers);

  useEffect(() => {
    soundCache.clear();
  }, [soundCache, states, modifiers]);

  const sound = useMemo(
    () => ({
      ...rest,
      synths: states,
      trigger(key: string) {
        // TODO: Apply multiple layers
        soundCache.trigger(key, synths, modifiers[0]?.keys?.[key]);
      },
    }),
    [modifiers, rest, soundCache, states, synths],
  );

  const addModifierLayer = useCallback(
    (config: Pick<ModifierLayer, 'name' | 'type'>) => {
      setModifiers((draft) => {
        draft.push({
          id: uuid(),
          keys: {},
          config: {},
          ...config,
        });
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
    (index: number, updates: Pick<ModifierLayer, 'name'>) => {
      setModifiers((draft) => {
        draft[index] = {
          ...draft[index],
          ...updates,
        };
      });
    },
    [setModifiers],
  );

  const updateModifier = useCallback(
    ({
      layerIndex,
      keys,
      synthId,
      nodeId,
      field,
      value,
    }: UpdateModifierArgs) => {
      setModifiers((draft) => {
        keys.forEach((key) => {
          draft[layerIndex].keys = {
            ...draft[layerIndex].keys,
            [key]: {
              ...draft[layerIndex].keys[key],
              [synthId]: {
                ...draft[layerIndex].keys[key]?.[synthId],
                [nodeId]: {
                  ...draft[layerIndex].keys[key]?.[synthId]?.[nodeId],
                  [field]: ['add', value as number],
                },
              },
            },
          };
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

  const randomizeModifier = useCallback(
    (layerIndex: number, keys: string[]) => {
      setModifiers((draft) => {
        keys.forEach((key) => {
          if (draft[layerIndex].type !== 'random') return;

          if (Object.keys(draft[layerIndex].config).length === 0) {
            draft[layerIndex].keys = {
              ...draft[layerIndex].keys,
              [key]: {
                [RANDOM_SEED_ID]: {
                  [RANDOM_SEED_ID]: {
                    [RANDOM_SEED_ID]: ['add', Math.random()],
                  },
                },
              },
            };
            return;
          }

          const seed =
            getFieldRandomSeed(draft[layerIndex].keys[key]) ?? Math.random();

          // TODO: Support nested fields
          Object.entries(draft[layerIndex].config).forEach(
            ([synthId, nodes]) => {
              Object.entries(nodes).forEach(([nodeId, fields]) => {
                Object.entries(fields).forEach(
                  ([field, { max, min, options }]) => {
                    let modifier: ModifierOp | null = null;
                    if (min != null && max != null) {
                      modifier = ['add', min + seed * (max - min)];
                    } else if (options != null) {
                      modifier = [
                        'set',
                        options[Math.round(seed * (options.length - 1))],
                      ];
                    }

                    if (!modifier) return;

                    draft[layerIndex].keys = {
                      ...draft[layerIndex].keys,
                      [key]: {
                        ...draft[layerIndex].keys[key],
                        [synthId]: {
                          ...draft[layerIndex].keys[key]?.[synthId],
                          [nodeId]: {
                            ...draft[layerIndex].keys[key]?.[synthId]?.[nodeId],
                            [field]: modifier,
                          },
                        },
                        [RANDOM_SEED_ID]: {
                          [RANDOM_SEED_ID]: {
                            [RANDOM_SEED_ID]: ['add', seed],
                          },
                        },
                      },
                    };
                  },
                );
              });
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

  return {
    sound,
    modifiers,
    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer,
    updateModifier,
    removeModifier,
    randomizeModifier,
    updateRandomConfig,
    loadModifiers: load,
  };
}

export type KeyboardSound = ReturnType<typeof useKeyboardSound>;
