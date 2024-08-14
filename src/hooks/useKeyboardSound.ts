import { useDebounceCallback } from '@react-hook/debounce';
import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import {
  findSoundModifiers,
  isFieldRandomConfig,
  isModifierOp,
  iterateSoundStructure,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { KeySoundConfig, ModifierLayer, RandomizationConfig } from '@src/types';
import { channels } from '@src/utils/constants';
import {
  dispatchKeyEvent,
  getSoundStructureFieldPath,
  replaceSoundStructureField,
} from '@src/utils/utils';
import { isEmpty, omit, set } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';
import { KeyEvent } from './useKeyboard';
import useSound from './useSound';
import useSoundCache from './useSoundCache';
import useThrottleCallback from './useThrottleCallback';

export default function useKeyboardSound(
  keySound: KeySoundConfig,
  keyEvent: KeyEvent,
) {
  const channel = useMemo(() => channels[keyEvent], [keyEvent]);
  const soundCache = useSoundCache(channel);
  const sound = useSound(keySound.config, channel);
  const [modifiers, setModifiers] = useImmer(keySound.modifiers);

  const trigger = useCallback(
    (key: string) => {
      soundCache.trigger(sound.synths, findSoundModifiers(modifiers, key));
    },
    [modifiers, soundCache, sound.synths],
  );

  const triggerRelease = useDebounceCallback(() => {
    dispatchKeyEvent({
      event: 'keyup',
      code: 'KeyQ',
      key: 'q',
      audio: false,
    });
  }, 300);

  const triggerKeyEvent = useThrottleCallback(
    useCallback(() => {
      requestAnimationFrame(() => {
        dispatchKeyEvent({
          event: keyEvent === 'up' ? 'keyup' : 'keydown',
          code: 'KeyQ',
          key: 'q',
        });
      });
      if (keyEvent === 'down') {
        triggerRelease();
      }
    }, [keyEvent, triggerRelease]),
    100,
  );

  useEffect(() => {
    soundCache.clear();
    triggerKeyEvent();
  }, [soundCache, triggerKeyEvent, trigger]);

  const keyboardSound = useMemo(
    () => ({
      ...omit(sound, ['states']),
      synths: sound.states,
      trigger,
    }),
    [sound, trigger],
  );

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
      sound: keyboardSound,
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
    }),
    [
      keyboardSound,
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

export type KeyboardSound = ReturnType<typeof useKeyboardSound>;
