import { getDefaultKeyboard } from '@src/keyboard/defaults';
import { KeyboardConfig } from '@src/types';
import { downloadKeyboard } from '@src/utils/file';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';
import useModifiers from './useModifiers';
import useUploadKeyboard from './useUploadKeyboard';

function getKeyboardConfig() {
  return storage.getCurrentKeyboard() ?? getDefaultKeyboard();
}

export type KeyEvent = 'down' | 'up';

export default function useKeyboard() {
  const initConfig = useMemo(() => getKeyboardConfig(), []);
  const modifier = useModifiers(initConfig);
  const down = useKeyboardSound(initConfig.sound.down, 'down', modifier.layers);
  const up = useKeyboardSound(initConfig.sound.up, 'up', modifier.layers);
  const [name, setName] = useState(initConfig.name);
  const [id, setId] = useState(initConfig.id);

  const currentConfig = useMemo(
    () => ({
      id,
      name,
      sound: {
        down: {
          config: down.sound,
        },
        up: {
          config: up.sound,
        },
        modifiers: modifier.layers,
      },
    }),
    [down.sound, id, modifier.layers, name, up.sound],
  );

  useEffect(() => {
    storage.setCurrentKeyboard(currentConfig);
  }, [currentConfig]);

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      down.sound.trigger(e.code);
    },
    [down],
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!e.repeat) {
        up.sound.trigger(e.code);
      }
    },
    [up],
  );

  const keyEventHandlers = useMemo(
    () => ({ onKeydown, onKeyUp }),
    [onKeyUp, onKeydown],
  );

  useKeyEvents(keyEventHandlers);

  const download = useCallback(() => {
    downloadKeyboard(currentConfig);
  }, [currentConfig]);

  // TODO: Validation
  const setKeyboard = useCallback(
    (data: KeyboardConfig) => {
      setId(data.id);
      setName(data.name);
      up.sound.loadConfig(data.sound.up.config);
      down.sound.loadConfig(data.sound.down.config);
      modifier.loadModifierLayers(data.sound.modifiers);
    },
    [down.sound, modifier, up.sound],
  );

  const upload = useUploadKeyboard(setKeyboard);
  const loadPreset = useCallback((id: string) => {
    const preset = storage.getKeyboardConfig(id);
    preset && setKeyboard(preset);
  }, [setKeyboard]);

  const reset = useCallback(() => {
    const defaultKeyboard = getDefaultKeyboard();
    setId(defaultKeyboard.id);
    setName(defaultKeyboard.name);
    up.sound.loadConfig(defaultKeyboard.sound.up.config);
    down.sound.loadConfig(defaultKeyboard.sound.down.config);
    modifier.loadModifierLayers(defaultKeyboard.sound.modifiers);
  }, [down.sound, modifier, up.sound]);

  return useMemo(
    () => ({
      down,
      up,
      name,
      setName,
      download,
      upload,
      reset,
      modifier,
      loadPreset,
      id,
    }),
    [down, up, name, download, upload, reset, modifier, loadPreset, id],
  );
}

export type Keyboard = ReturnType<typeof useKeyboard>;
