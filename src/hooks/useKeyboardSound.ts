import { KeySoundModifier } from '@src/keyboard/keySoundModifier';
import { KeySoundConfig, ModifierLayer, ModifierLayerType } from '@src/types';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { v4 as uuid } from 'uuid';
import useSound from './useSound';
import useSoundCache from './useSoundCache';

export const DATA_KEY = 'KeyData';

export type UpdateModifierArgs = {
  layerIndex: number;
  keys: string[];
  synthId: string;
  nodeId: string;
  field: string;
  value: unknown;
};

function getDefaultKeys(type: ModifierLayerType): KeySoundModifier {
  if (type === 'random') {
    return {
      [DATA_KEY]: {},
    };
  }
  return {};
}

export default function useKeyboardSound(keySound: KeySoundConfig) {
  const soundCache = useSoundCache();
  const { synths, states, ...rest } = useSound(keySound.config);
  const [modifiers, setModifiers] = useImmer(keySound.modifiers);

  useEffect(() => {
    soundCache.clear();
  }, [soundCache, states, modifiers]);

  return useMemo(
    () => ({
      sound: {
        ...rest,
        synths: states,
        trigger(key: string) {
          // TODO: Apply multiple layers
          soundCache.trigger(key, synths, modifiers[0]?.keys?.[key]);
        },
      },
      modifiers,
      addModifierLayer(config: Pick<ModifierLayer, 'name' | 'type'>) {
        setModifiers((draft) => {
          draft.push({
            id: uuid(),
            keys: getDefaultKeys(config.type),
            ...config,
          });
        });
      },
      removeModifierLayer(index: number) {
        setModifiers((draft) => {
          draft.splice(index, 1);
        });
      },
      updateModiferLayer(index: number, updates: Pick<ModifierLayer, 'name'>) {
        setModifiers((draft) => {
          draft[index] = {
            ...draft[index],
            ...updates,
          };
        });
      },
      updateModifier({
        layerIndex,
        keys,
        synthId,
        nodeId,
        field,
        value,
      }: UpdateModifierArgs) {
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
      removeModifier(layerIndex: number, key: string) {
        setModifiers((draft) => {
          delete draft[layerIndex].keys[key];
        });
      },
    }),
    [modifiers, rest, setModifiers, soundCache, states, synths],
  );
}

export type KeyboardSound = ReturnType<typeof useKeyboardSound>;
