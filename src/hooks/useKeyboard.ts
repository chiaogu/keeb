import { getDefaultKeyboard } from '@src/keyboard/defaults';
import { KeyboardConfig } from '@src/types';
import { downloadKeyboard } from '@src/utils/file';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';
import useModifiers from './useModifiers';
import useUploadKeyboard from './useUploadKeyboard';
import { pick } from 'lodash-es';

export type KeyEvent = 'down' | 'up';

const metaFields = ['id', 'created'] as const;

export default function useKeyboard(initConfig: KeyboardConfig) {
  const modifier = useModifiers(initConfig);
  const down = useKeyboardSound(initConfig.sound.down, 'down', modifier.layers);
  const up = useKeyboardSound(initConfig.sound.up, 'up', modifier.layers);
  const [name, setName] = useState(initConfig.name);
  const [meta, setMeata] = useState(pick(initConfig, metaFields));

  const currentConfig = useMemo(
    () => ({
      ...meta,
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
    [down.sound, meta, modifier.layers, name, up.sound],
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
      setMeata(pick(data, metaFields));
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
    setMeata(pick(defaultKeyboard, metaFields));
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
      ...meta,
    }),
    [down, up, name, download, upload, reset, modifier, loadPreset, meta],
  );
}

export type Keyboard = ReturnType<typeof useKeyboard>;
