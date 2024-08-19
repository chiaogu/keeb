import { getDefaultKeyboard } from '@src/keyboard/defaults';
import {
  getKeyboardConfig,
  getKeyboardPresets,
  setCurrentKeyboard,
} from '@src/utils/localstorage';
import { useCallback, useMemo, useState } from 'react';

export default function useKeyboardPresets() {
  const [presetIds, setPresets] = useState(getKeyboardPresets());

  const presets = useMemo(
    () =>
      presetIds.map((id) => {
        const config = getKeyboardConfig(id);
        return config
          ? {
              id,
              name: config.name,
            }
          : null;
      }).filter(x => x != null),
    [presetIds],
  );
  
  const refresh = useCallback(() => {
    setPresets(getKeyboardPresets());
  }, []);

  const createNew = useCallback(() => {
    setCurrentKeyboard(getDefaultKeyboard());
    refresh();
  }, [refresh]);

  return {
    presets,
    createNew,
    refresh,
  };
}
