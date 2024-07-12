import { getDefaultModifierLayer } from '@src/keyboard/defaults';
import { KeySoundConfig, ModifierLayer } from '@src/types';
import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import useSound from './useSound';
import useSoundCache from './useSoundCache';

type UpdateModifierArgs = {
  layerIndex: number;
  key: string;
  synthId: string;
  nodeId: string;
  field: string;
  value: unknown;
};

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
      addModifierLayer(name: string) {
        setModifiers((draft) => {
          draft.push({
            ...getDefaultModifierLayer(synths[0].state),
            name,
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
        key,
        synthId,
        nodeId,
        field,
        value,
      }: UpdateModifierArgs) {
        setModifiers((draft) => {
          draft[layerIndex].keys[key][synthId][nodeId][field] = ['add', value as number];
        });
      },
    }),
    [modifiers, rest, setModifiers, soundCache, states, synths],
  );
}

export type KeyboardSound = ReturnType<typeof useKeyboardSound>;
