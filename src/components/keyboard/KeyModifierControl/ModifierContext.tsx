import { useDebounceCallback } from '@react-hook/debounce';
import { useMainContext } from '@src/components/shared/MainContext';
import { Keyboard } from '@src/hooks/useKeyboard';
import useUplodaFile from '@src/hooks/useUplodaFile';
import {
  getDefaultModifier,
  getDefaultRandomConfig,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import {
  FieldRandomConfig,
  ModifierLayer,
  RandomizationConfig,
} from '@src/types';
import {
  getSoundStructureFieldPath,
  removeSoundStructureField,
} from '@src/utils/utils';
import { set } from 'lodash-es';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { SoundFieldPath } from './RandomizationControl';

function useModifierContextValue(keyboard: Keyboard) {
  const {
    layers: modifiers,
    updateModiferLayer,
    fixInvalidFields,
    removeModifier,
    batchSetModifier,
  } = keyboard.modifier;

  // TODO: Persist in main context
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(-1);
  const selectedLayer = useMemo(
    () => modifiers[selectedLayerIndex],
    [modifiers, selectedLayerIndex],
  );

  // TODO: useThrottle
  const randomizeAfterConfigChange = useDebounceCallback(() => {
    keyboard.modifier.batchSetModifier(
      selectedLayerIndex,
      Object.keys(selectedLayer.keys),
    );
  }, 50);

  const addModifierLayer = useCallback(
    (...args: Parameters<typeof keyboard.modifier.addModifierLayer>) => {
      keyboard.modifier.addModifierLayer(...args);
      setSelectedLayerIndex(modifiers.length);
    },
    [keyboard, modifiers.length],
  );

  const removeModifierLayer = useCallback(
    (index: number) => {
      keyboard.modifier.removeModifierLayer(index);
      if (index < selectedLayerIndex) {
        setSelectedLayerIndex(selectedLayerIndex - 1);
      } else if (index >= modifiers.length - 1) {
        setSelectedLayerIndex(modifiers.length - 2);
      }
    },
    [keyboard.modifier, modifiers.length, selectedLayerIndex],
  );

  const updateRandomConfig = useCallback(
    (field: SoundFieldPath, config: FieldRandomConfig) => {
      const updater = (draft: RandomizationConfig) => {
        set(draft, getSoundStructureFieldPath(field), config);
        return draft;
      };
      keyboard.modifier.updateRandomConfig(selectedLayerIndex, updater);
      randomizeAfterConfigChange();
    },
    [keyboard.modifier, randomizeAfterConfigChange, selectedLayerIndex],
  );

  const addRandomConfig = useCallback(
    (field: SoundFieldPath, node: SynthNodeState) => {
      const updater = (draft: RandomizationConfig) => {
        set(
          draft,
          getSoundStructureFieldPath(field),
          getDefaultRandomConfig(field, node),
        );
        return draft;
      };
      keyboard.modifier.updateRandomConfig(selectedLayerIndex, updater);
      randomizeAfterConfigChange();
    },
    [keyboard.modifier, randomizeAfterConfigChange, selectedLayerIndex],
  );

  const removeRandomConfig = useCallback(
    (field: SoundFieldPath) => {
      const updater = (draft: RandomizationConfig) => {
        removeSoundStructureField(draft, field);
        return draft;
      };
      keyboard.modifier.updateRandomConfig(selectedLayerIndex, updater);
      randomizeAfterConfigChange();
    },
    [keyboard.modifier, randomizeAfterConfigChange, selectedLayerIndex],
  );

  const updateFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath, modifier: ModifierOp) => {
      const updater = (draft: SoundModifier) => {
        set(draft, getSoundStructureFieldPath(field), modifier);
        return draft;
      };
      keyboard.modifier.updateModifier(selectedLayerIndex, keys, updater);
    },
    [keyboard.modifier, selectedLayerIndex],
  );

  const addFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath, node: SynthNodeState) => {
      const updater = (draft: SoundModifier) => {
        set(
          draft,
          getSoundStructureFieldPath(field),
          getDefaultModifier(field, node),
        );
        return draft;
      };
      keyboard.modifier.updateModifier(selectedLayerIndex, keys, updater);
    },
    [keyboard.modifier, selectedLayerIndex],
  );

  const removeFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath) => {
      const updater = (draft: SoundModifier) => {
        removeSoundStructureField(draft, field);
        return draft;
      };
      keyboard.modifier.updateModifier(selectedLayerIndex, keys, updater);
    },
    [keyboard.modifier, selectedLayerIndex],
  );

  // TODO: Validation
  const { load: loadModifierLayers } = useUplodaFile((layers) => {
    keyboard.modifier.loadModifierLayers(layers as ModifierLayer[]);
  });

  return {
    modifiers,

    selectedLayerIndex,
    setSelectedLayerIndex,
    selectedLayer,

    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer,
    loadModifierLayers,

    fixInvalidFields,
    removeModifier,
    batchSetModifier,
    updateRandomConfig,
    addRandomConfig,
    removeRandomConfig,

    addFieldModifier,
    updateFieldModifier,
    removeFieldModifier,
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
};

export function ModifierContextProvider({
  children,
}: ModifierContextProviderProps) {
  const { keyboard } = useMainContext();
  const contextValue = useModifierContextValue(keyboard);
  return (
    <ModifierContext.Provider value={contextValue}>
      {children}
    </ModifierContext.Provider>
  );
}
