import useSound from '@src/hooks/useSound';
import { KeyboardConfig } from '@src/types';
import * as storage from '@src/utils/localstorage';
import { useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import useKeySounds from './useKeySounds';

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

export default function useKeyboardSound() {
  const config = useRef(getKeyboardConfig());
  const down = useSound(config.current.sound.down);
  const up = useSound(config.current.sound.up);

  useEffect(() => {
    storage.setKeyboardConfig({
      ...config,
      sound: { down, up },
    });
  }, [down, up]);

  useKeySounds(down, up);

  return useMemo(() => ({ down, up }), [down, up]);
}
