import useSound from '@src/hooks/useSound';
import defaultKeyboard from '@src/presets/keyboard/defaultKeyboard.json';
import { KeyboardConfig } from '@src/types';
import * as storage from '@src/utils/localstorage';
import { useEffect, useMemo, useRef } from 'react';
import useKeySounds from './useKeySounds';

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? (defaultKeyboard as KeyboardConfig);
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
