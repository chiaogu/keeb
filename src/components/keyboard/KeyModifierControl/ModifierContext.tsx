import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import { createContext, useContext, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

function useModifierContextValue(keyboard: Keyboard, keyEvent: KeyEvent) {
  const [selectedKeys, setSelectedKeys] = useImmer<string[]>([]);
  const {
    sound: { synths },
    modifiers,
    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer,
    updateModifier,
    removeModifier,
  } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const selectedLayer = useMemo(
    () => modifiers[selectedLayerIndex],
    [modifiers, selectedLayerIndex],
  );
  const highlightedKeys = useMemo(() => {
    if (!selectedLayer) return [];
    return Object.keys(selectedLayer.keys);
  }, [selectedLayer]);

  return {
    synths,
    modifiers,

    selectedKeys,
    toggleKey(key: string) {
      setSelectedKeys((draft) => {
        const index = draft.indexOf(key);
        if (index === -1) {
          draft.push(key);
        } else {
          draft.splice(index, 1);
        }
      });
    },
    highlightedKeys,

    selectedLayerIndex,
    setSelectedLayerIndex(index: number) {
      setSelectedLayerIndex(index);
      setSelectedKeys([]);
    },
    selectedLayer,

    addModifierLayer(...args: Parameters<typeof addModifierLayer>) {
      addModifierLayer(...args);
      setSelectedLayerIndex(modifiers.length);
    },
    removeModifierLayer(index: number) {
      removeModifierLayer(index);
      setSelectedLayerIndex(Math.min(index, modifiers.length - 2));
    },
    updateModiferLayer,
    updateModifier,
    removeModifier,
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
