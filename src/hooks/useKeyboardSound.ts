import useSound from "@src/hooks/useSound";
import defaultKeyboard from "@src/presets/keyboard/defaultKeyboard.json";
import { KeyboardConfig, SoundConfig } from "@src/types";
import * as storage from "@src/utils/localstorage";
import { useCallback, useMemo, useRef } from "react";
import useKeySounds from "./useKeySounds";

function getKeyboardConfig() {
  return storage.getKeyboardConfig() ?? (defaultKeyboard as KeyboardConfig);
}

export default function useKeyboardSound() {
  const config = useRef(getKeyboardConfig());

  const handleSoundChange = useCallback(
    (sound: SoundConfig, event: "down" | "up") => {
      storage.setKeyboardConfig({
        ...config.current,
        sound: {
          ...config.current.sound,
          [event]: sound,
        }
      });
    },
    [],
  );

  const down = useSound({
    config: config.current.sound.down,
    onChange: (sound) => handleSoundChange(sound, 'down'),
  });

  const up = useSound({
    config: config.current.sound.up,
    onChange: (sound) => handleSoundChange(sound, 'up'),
  });

  useKeySounds(down, up);

  return useMemo(() => ({ down, up }), [down, up]);
}
