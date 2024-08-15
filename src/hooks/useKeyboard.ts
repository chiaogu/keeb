import { getDefaultKeyboard, getDefaultSound } from '@src/keyboard/defaults';
import { KeyboardConfig } from '@src/types';
import { downloadKeyboard } from '@src/utils/file';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';
import useModifiers from './useModifiers';
import useUplodaFile from './useUplodaFile';

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? getDefaultKeyboard();
}

export type KeyEvent = 'down' | 'up';

export default function useKeyboard() {
  const initConfig = useMemo(() => getKeyboardConfig(), []);
  const modifier = useModifiers(initConfig);
  const down = useKeyboardSound(initConfig.sound.down, 'down', modifier.layers);
  const up = useKeyboardSound(initConfig.sound.up, 'up', modifier.layers);
  const [name, setName] = useState(initConfig.name);
  const currentConfig = useMemo(
    () => ({
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
    [down.sound, modifier.layers, name, up.sound],
  );

  useEffect(() => {
    storage.setKeyboardConfig(currentConfig);
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
  const { load: upload } = useUplodaFile((data: KeyboardConfig) => {
    setName(data.name);
    up.sound.loadConfig(data.sound.up.config);
    down.sound.loadConfig(data.sound.down.config);
    // TODO: Fix ids based on with the newly generated ones
    modifier.loadModifierLayers(data.sound.modifiers);
  });

  const reset = useCallback(() => {
    setName('untitled');
    up.sound.loadConfig(getDefaultSound());
    down.sound.loadConfig(getDefaultSound());
    modifier.loadModifierLayers([]);
  }, [down.sound, modifier, up.sound]);

  return useMemo(
    () => ({ down, up, name, setName, download, upload, reset, modifier }),
    [down, up, name, download, upload, reset, modifier],
  );
}

export type Keyboard = ReturnType<typeof useKeyboard>;
