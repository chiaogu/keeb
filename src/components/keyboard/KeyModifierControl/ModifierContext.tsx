import { useDebounceCallback } from '@react-hook/debounce';
import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import useUplodaFile from '@src/hooks/useUplodaFile';
import {
  getDefaultModifier,
  getDefaultRandomConfig,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { FieldRandomConfig, ModifierLayer, RandomizationConfig } from '@src/types';
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
import { useMainContext } from '@src/components/shared/MainContext';

function useModifierContextValue(keyboard: Keyboard) {
  const {
    sound: { name },

    addModifierLayer: soundAddModifierLayer,
    removeModifierLayer: soundRemoveModifierLayer,
    updateModiferLayer: soundUpdateModiferLayer,

    updateModifier: soundUpdateModifier,
    removeModifier: soundRemoveModifier,
    batchSetModifier: soundBatchSetModifier,
    updateRandomConfig: soundUpdateRandomConfig,
    loadModifierLayers: soundLoadModifierLayers,
    fixInvalidFields: soundFixInvalidFields,
  } = keyboard.down;
  
  const modifiers = keyboard.modifier.layers;

  // TODO: Persist in main context
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(-1);
  const selectedLayer = useMemo(
    () => modifiers[selectedLayerIndex],
    [modifiers, selectedLayerIndex],
  );

  // TODO: useThrottle
  const randomizeAfterConfigChange = useDebounceCallback(() => {
    soundBatchSetModifier(selectedLayerIndex, Object.keys(selectedLayer.keys));
    keyboard.modifier.batchSetModifier(
      selectedLayerIndex,
      Object.keys(selectedLayer.keys),
    );
  }, 50);

  const addModifierLayer = useCallback(
    (...args: Parameters<typeof soundAddModifierLayer>) => {
      soundAddModifierLayer(...args);
      keyboard.modifier.addModifierLayer(...args);
      setSelectedLayerIndex(modifiers.length);
    },
    [soundAddModifierLayer, keyboard.modifier, modifiers.length],
  );

  const removeModifierLayer = useCallback(
    (index: number) => {
      soundRemoveModifierLayer(index);
      keyboard.modifier.removeModifierLayer(index);
      if (index < selectedLayerIndex) {
        setSelectedLayerIndex(selectedLayerIndex - 1);
      } else if (index >= modifiers.length - 1) {
        setSelectedLayerIndex(modifiers.length - 2);
      }
    },
    [
      keyboard.modifier,
      modifiers.length,
      selectedLayerIndex,
      soundRemoveModifierLayer,
    ],
  );

  const updateRandomConfig = useCallback(
    (field: SoundFieldPath, config: FieldRandomConfig) => {
      const updater = (draft: RandomizationConfig) => {
        set(draft, getSoundStructureFieldPath(field), config);
        return draft;
      };
      soundUpdateRandomConfig(selectedLayerIndex, updater);
      keyboard.modifier.updateRandomConfig(selectedLayerIndex, updater);
      randomizeAfterConfigChange();
    },
    [
      keyboard.modifier,
      randomizeAfterConfigChange,
      selectedLayerIndex,
      soundUpdateRandomConfig,
    ],
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
      soundUpdateRandomConfig(selectedLayerIndex, updater);
      keyboard.modifier.updateRandomConfig(selectedLayerIndex, updater);
      randomizeAfterConfigChange();
    },
    [
      keyboard.modifier,
      randomizeAfterConfigChange,
      selectedLayerIndex,
      soundUpdateRandomConfig,
    ],
  );

  const removeRandomConfig = useCallback(
    (field: SoundFieldPath) => {
      const updater = (draft: RandomizationConfig) => {
        removeSoundStructureField(draft, field);
        return draft;
      };
      soundUpdateRandomConfig(selectedLayerIndex, updater);
      keyboard.modifier.updateRandomConfig(selectedLayerIndex, updater);
      randomizeAfterConfigChange();
    },
    [
      keyboard.modifier,
      randomizeAfterConfigChange,
      selectedLayerIndex,
      soundUpdateRandomConfig,
    ],
  );

  const updateFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath, modifier: ModifierOp) => {
      const updater = (draft: SoundModifier) => {
        set(draft, getSoundStructureFieldPath(field), modifier);
        return draft;
      };
      soundUpdateModifier(selectedLayerIndex, keys, updater);
      keyboard.modifier.updateModifier(selectedLayerIndex, keys, updater);
    },
    [keyboard.modifier, selectedLayerIndex, soundUpdateModifier],
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
      soundUpdateModifier(selectedLayerIndex, keys, updater);
      keyboard.modifier.updateModifier(selectedLayerIndex, keys, updater);
    },
    [keyboard.modifier, selectedLayerIndex, soundUpdateModifier],
  );

  const removeFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath) => {
      const updater = (draft: SoundModifier) => {
        removeSoundStructureField(draft, field);
        return draft;
      };
      soundUpdateModifier(selectedLayerIndex, keys, updater);
      keyboard.modifier.updateModifier(selectedLayerIndex, keys, updater);
    },
    [keyboard.modifier, selectedLayerIndex, soundUpdateModifier],
  );

  // TODO: Validation
  const { load: loadModifierLayers } = useUplodaFile((layers) => {
    soundLoadModifierLayers(layers as ModifierLayer[]);
    keyboard.modifier.loadModifierLayers(layers as ModifierLayer[]);
  });

  return {
    soundName: name,
    // synths,
    modifiers,

    selectedLayerIndex,
    setSelectedLayerIndex,
    selectedLayer,

    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer(...args: Parameters<typeof soundUpdateModiferLayer>) {
      soundUpdateModiferLayer(...args);
      keyboard.modifier.updateModiferLayer(...args);
    },
    loadModifierLayers,

    fixInvalidFields(...args: Parameters<typeof soundFixInvalidFields>) {
      soundFixInvalidFields(...args);
      keyboard.modifier.fixInvalidFields(...args);
    },
    removeModifier(...args: Parameters<typeof soundRemoveModifier>) {
      soundRemoveModifier(...args);
      keyboard.modifier.removeModifier(...args);
    },
    batchSetModifier(...args: Parameters<typeof soundBatchSetModifier>) {
      soundBatchSetModifier(...args);
      keyboard.modifier.batchSetModifier(...args);
    },
    updateRandomConfig,
    addRandomConfig,
    removeRandomConfig,

    addFieldModifier,
    updateFieldModifier,
    removeFieldModifier,

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
