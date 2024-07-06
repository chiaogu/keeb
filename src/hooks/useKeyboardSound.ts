import { Immutable } from 'immer';
import { useMemo, useRef } from 'react';
import useSound from '@src/hooks/useSound';
import defaultKeyboard from '@src/presets/keyboard/defaultKeyboard.json';
import { KeyboardConfig, SoundConfig } from '@src/types';
import * as storage from '@src/utils/localstorage';
import useKeySounds from './useKeySounds';

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? (defaultKeyboard as KeyboardConfig);
}

function createSoundChangeHandler(
  config: KeyboardConfig,
  event: 'down' | 'up',
) {
  return (sound: Immutable<SoundConfig>) => {
    storage.setKeyboardConfig({
      ...config,
      sound: {
        ...config.sound,
        [event]: sound,
      },
    });
  };
}

export default function useKeyboardSound() {
  const config = useRef(getKeyboardConfig());

  const handleUpSoundChange = useMemo(
    () => createSoundChangeHandler(config.current, 'up'),
    [],
  );

  const handleDownSoundChange = useMemo(
    () => createSoundChangeHandler(config.current, 'down'),
    [],
  );

  const down = useSound({
    config: config.current.sound.down,
    onChange: handleDownSoundChange,
  });

  const up = useSound({
    config: config.current.sound.up,
    onChange: handleUpSoundChange,
  });

  useKeySounds(down, up);

  return useMemo(() => ({ down, up }), [down, up]);
}
