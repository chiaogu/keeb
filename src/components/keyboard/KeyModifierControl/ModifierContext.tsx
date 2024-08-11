import { useDebounceCallback } from '@react-hook/debounce';
import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import useUplodaFile from '@src/hooks/useUplodaFile';
import {
  getDefaultModifier,
  getDefaultRandomConfig,
  ModifierOp,
} from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { FieldRandomConfig } from '@src/types';
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

function useModifierContextValue(keyboard: Keyboard, keyEvent: KeyEvent) {
  const {
    sound: { synths, name },
    modifiers,

    addModifierLayer: soundAddModifierLayer,
    removeModifierLayer: soundRemoveModifierLayer,
    updateModiferLayer,

    updateModifier: soundUpdateModifier,
    removeModifier,
    batchSetModifier,
    updateRandomConfig: soundUpdateRandomConfig,
    loadModifierLayers: soundLoadModifierLayers,
    fixInvalidFields,
  } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );
  
  // TODO: Persist in main context
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(-1);
  const selectedLayer = useMemo(
    () => modifiers[selectedLayerIndex],
    [modifiers, selectedLayerIndex],
  );

  // TODO: useThrottle
  const randomizeAfterConfigChange = useDebounceCallback(() => {
    batchSetModifier(selectedLayerIndex, Object.keys(selectedLayer.keys));
  }, 50);

  const addModifierLayer = useCallback(
    (...args: Parameters<typeof soundAddModifierLayer>) => {
      soundAddModifierLayer(...args);
      setSelectedLayerIndex(modifiers.length);
    },
    [soundAddModifierLayer, modifiers.length],
  );

  const removeModifierLayer = useCallback(
    (index: number) => {
      soundRemoveModifierLayer(index);
      if (index < selectedLayerIndex) {
        setSelectedLayerIndex(selectedLayerIndex - 1);
      } else if (index >= modifiers.length - 1) {
        setSelectedLayerIndex(modifiers.length - 2);
      }
    },
    [modifiers.length, selectedLayerIndex, soundRemoveModifierLayer],
  );

  const updateRandomConfig = useCallback(
    (field: SoundFieldPath, config: FieldRandomConfig) => {
      soundUpdateRandomConfig(selectedLayerIndex, (draft) => {
        set(draft, getSoundStructureFieldPath(field), config);
        return draft;
      });
      randomizeAfterConfigChange();
    },
    [randomizeAfterConfigChange, selectedLayerIndex, soundUpdateRandomConfig],
  );

  const addRandomConfig = useCallback(
    (field: SoundFieldPath, node: SynthNodeState) => {
      soundUpdateRandomConfig(selectedLayerIndex, (draft) => {
        set(
          draft,
          getSoundStructureFieldPath(field),
          getDefaultRandomConfig(field, node),
        );
        return draft;
      });
      randomizeAfterConfigChange();
    },
    [randomizeAfterConfigChange, selectedLayerIndex, soundUpdateRandomConfig],
  );

  const removeRandomConfig = useCallback(
    (field: SoundFieldPath) => {
      soundUpdateRandomConfig(selectedLayerIndex, (draft) => {
        removeSoundStructureField(draft, field);
        return draft;
      });
      randomizeAfterConfigChange();
    },
    [randomizeAfterConfigChange, selectedLayerIndex, soundUpdateRandomConfig],
  );

  const updateFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath, modifier: ModifierOp) => {
      soundUpdateModifier(selectedLayerIndex, keys, (draft) => {
        set(draft, getSoundStructureFieldPath(field), modifier);
        return draft;
      });
    },
    [selectedLayerIndex, soundUpdateModifier],
  );

  const addFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath, node: SynthNodeState) => {
      soundUpdateModifier(selectedLayerIndex, keys, (draft) => {
        set(
          draft,
          getSoundStructureFieldPath(field),
          getDefaultModifier(field, node),
        );
        return draft;
      });
    },
    [selectedLayerIndex, soundUpdateModifier],
  );

  const removeFieldModifier = useCallback(
    (keys: string[], field: SoundFieldPath) => {
      soundUpdateModifier(selectedLayerIndex, keys, (draft) => {
        removeSoundStructureField(draft, field);
        return draft;
      });
    },
    [selectedLayerIndex, soundUpdateModifier],
  );

  // TODO: Validation
  const { load: loadModifierLayers } = useUplodaFile(soundLoadModifierLayers);

  return {
    soundName: name,
    synths,
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
