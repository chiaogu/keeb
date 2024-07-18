import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import { getDefaultRandomConfig } from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import {
  getSoundStructureFieldPath,
  getSoundStructureValue,
  removeSoundStructureField,
} from '@src/utils/utils';
import { set } from 'lodash';
import { createContext, useContext, useMemo, useState } from 'react';
import { SoundFieldPath } from './RandomizationControl';
import { FieldRandomConfig } from '@src/types';
import { useDebounceCallback } from '@react-hook/debounce';

function useModifierContextValue(keyboard: Keyboard, keyEvent: KeyEvent) {
  const {
    sound: { synths, name },
    modifiers,
    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer,
    updateModifier,
    removeModifier,
    batchSetModifier,
    updateRandomConfig,
    loadModifiers,
  } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const selectedLayer = useMemo(
    () => modifiers[selectedLayerIndex],
    [modifiers, selectedLayerIndex],
  );
  
  // TODO: useThrottle
  const randomizeAfterConfigChange = useDebounceCallback(() => {
    batchSetModifier(selectedLayerIndex, Object.keys(selectedLayer.keys));
  }, 50);

  return {
    soundName: name,
    synths,
    modifiers,

    selectedLayerIndex,
    setSelectedLayerIndex,
    selectedLayer,

    addModifierLayer(...args: Parameters<typeof addModifierLayer>) {
      addModifierLayer(...args);
      setSelectedLayerIndex(modifiers.length);
    },
    removeModifierLayer(index: number) {
      removeModifierLayer(index);
      setSelectedLayerIndex(Math.max(Math.min(index, modifiers.length - 2), 0));
    },
    updateModiferLayer,
    loadModifiers,

    updateModifier,
    removeModifier,
    batchSetModifier,
    updateRandomConfig(field: SoundFieldPath, config: FieldRandomConfig) {
      updateRandomConfig(selectedLayerIndex, (draft) => {
        set(
          draft,
          getSoundStructureFieldPath(field),
          config,
        );
        return draft;
      });
      randomizeAfterConfigChange();
    },
    fixRandomConfig(oldField: SoundFieldPath, newField: SoundFieldPath) {
      if (selectedLayer.type !== 'random') return;
      updateRandomConfig(selectedLayerIndex, (draft) => {
        const value = getSoundStructureValue(selectedLayer.config, oldField);
        set(draft, getSoundStructureFieldPath(newField), value);
        removeSoundStructureField(draft, oldField);
        return draft;
      });
    },
    addRandomConfig(field: SoundFieldPath, node: SynthNodeState) {
      if (selectedLayer.type !== 'random') return;
      updateRandomConfig(selectedLayerIndex, (draft) => {
        set(
          draft,
          getSoundStructureFieldPath(field),
          getDefaultRandomConfig(field, node),
        );
        return draft;
      });
    },

    triggerUp(key: string) {
      keyboard.up.sound.trigger(key);
    },
    triggerDown(key: string) {
      keyboard.down.sound.trigger(key);
    },
  };
}

const ModifierContext = createContext<ReturnType<
  typeof useModifierContextValue
> | null>(null);

export function useModiferContext() {
  const contextValue = useContext(ModifierContext);
  if (!contextValue) throw new Error('No context provider found');
  return contextValue;
}

type ModifierContextProviderProps = {
  children: React.ReactNode;
  keyboard: Keyboard;
  keyEvent: KeyEvent;
};

export function ModifierContextProvider({
  keyEvent,
  keyboard,
  children,
}: ModifierContextProviderProps) {
  const contextValue = useModifierContextValue(keyboard, keyEvent);
  return (
    <ModifierContext.Provider value={contextValue}>
      {children}
    </ModifierContext.Provider>
  );
}
