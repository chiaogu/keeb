import { getDefaultKeyboard, getDefaultSound } from '@src/keyboard/defaults';
import { downloadKeyboard } from '@src/utils/file';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';
import useUplodaFile from './useUplodaFile';
import { KeyboardConfig } from '@src/types';
import { channels } from '@src/utils/constants';

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? getDefaultKeyboard();
}

export type KeyEvent = 'down' | 'up';

export default function useKeyboard() {
  const initConfig = useRef(getKeyboardConfig());
  const down = useKeyboardSound(initConfig.current.sound.down, channels.down);
  const up = useKeyboardSound(initConfig.current.sound.up, channels.up);
  const [name, setName] = useState(initConfig.current.name);
  const currentConfig = useMemo(
    () => ({
      name,
      sound: {
        down: {
          config: down.sound,
          modifiers: down.modifiers,
        },
        up: {
          config: up.sound,
          modifiers: up.modifiers,
        },
      },
    }),
    [down.modifiers, down.sound, name, up.modifiers, up.sound],
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
      up.sound.trigger(e.code);
    },
    [up],
  );

  useKeyEvents({ onKeydown, onKeyUp });

  const download = useCallback(() => {
    downloadKeyboard(currentConfig);
  }, [currentConfig]);
  
  // TODO: Validation
  const { load: upload } = useUplodaFile((data: KeyboardConfig) => {
    setName(data.name);
    up.sound.loadConfig(data.sound.up.config);
    up.loadModifierLayers(data.sound.up.modifiers);
    down.sound.loadConfig(data.sound.down.config);
    down.loadModifierLayers(data.sound.down.modifiers);
  });

  const reset = useCallback(() => {
    setName('untitled');
    up.sound.loadConfig(getDefaultSound());
    up.loadModifierLayers([]);
    down.sound.loadConfig(getDefaultSound());
    down.loadModifierLayers([]);
  }, [down, up]);
  
  return useMemo(
    () => ({ down, up, name, setName, download, upload, reset }),
    [down, up, name, download, upload, reset],
  );
}

export type Keyboard = ReturnType<typeof useKeyboard>;
