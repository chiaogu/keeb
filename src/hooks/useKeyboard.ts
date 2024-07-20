import { getDefaultKeyboard } from '@src/keyboard/defaults';
import { downloadKeyboard } from '@src/utils/file';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? getDefaultKeyboard();
}

export type KeyEvent = 'down' | 'up';

export default function useKeyboard() {
  const initConfig = useRef(getKeyboardConfig());
  const down = useKeyboardSound(initConfig.current.sound.down);
  const up = useKeyboardSound(initConfig.current.sound.up);
  const [name, setName] = useState(initConfig.current.name);
  const currentConfig = useMemo(
    () => ({
      ...initConfig.current,
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
  console.log(currentConfig);

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

  return useMemo(
    () => ({ down, up, name, setName, download }),
    [down, up, name, download],
  );
}

export type Keyboard = ReturnType<typeof useKeyboard>;
