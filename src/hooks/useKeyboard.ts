import { KeyboardConfig } from '@src/types';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';

function getDefaultKeyboardConfig(): KeyboardConfig {
  return {
    sound: {
      up: {
        id: uuid(),
        name: 'untitled',
        synths: [
          {
            id: uuid(),
            src: { type: 'mono', data: {} },
            fxs: [],
          },
        ],
      },
      down: {
        id: uuid(),
        name: 'untitled',
        synths: [
          {
            id: uuid(),
            src: { type: 'mono', data: {} },
            fxs: [],
          },
        ],
      },
    },
  };
}

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? getDefaultKeyboardConfig();
}

export type KeyEvent = 'down' | 'up';

export default function useKeyboard() {
  const config = useRef(getKeyboardConfig());
  const down = useKeyboardSound(config.current.sound.down);
  const up = useKeyboardSound(config.current.sound.up);

  useEffect(() => {
    storage.setKeyboardConfig({
      ...config,
      sound: { down, up },
    });
  }, [down, up]);

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      down.trigger(e.code);
    },
    [down],
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      up.trigger(e.code);
    },
    [up],
  );

  useKeyEvents({ onKeydown, onKeyUp });

  return useMemo(() => ({ down, up }), [down, up]);
}
