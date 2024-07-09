import { getDefaultKeyboard } from '@src/keyboard/defaults';
import * as storage from '@src/utils/localstorage';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useKeyEvents } from './useKeyEvents';
import useKeyboardSound from './useKeyboardSound';

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? getDefaultKeyboard();
}

export type KeyEvent = 'down' | 'up';

export default function useKeyboard() {
  const config = useRef(getKeyboardConfig());
  const down = useKeyboardSound(config.current.sound.down);
  const up = useKeyboardSound(config.current.sound.up);

  useEffect(() => {
    storage.setKeyboardConfig({
      ...config,
      sound: {
        down: {
          config: down.sound,
          modifier: down.modifier,
        },
        up: {
          config: up.sound,
          modifier: up.modifier,
        },
      },
    });
  }, [down, up]);

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

  return useMemo(() => ({ down, up }), [down, up]);
}
