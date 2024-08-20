import { getDefaultKeyboard } from '@src/keyboard/defaults';
import {
  getKeyboardConfig,
  getKeyboardPresets,
  setCurrentKeyboard,
} from '@src/utils/localstorage';
import { pick, orderBy } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

const presetFields = ['id', 'name', 'created'] as const;

export default function useKeyboardPresets() {
  const [presetIds, setPresets] = useState(getKeyboardPresets());

  const presets = useMemo(
    () =>
      orderBy(presetIds.map((id) => {
        const config = getKeyboardConfig(id);
        return config
          ? pick(config, presetFields)
          : null;
      }).filter(x => x != null), 'created', 'desc'),
    [presetIds],
  );
  
  const refresh = useCallback(() => {
    setPresets(getKeyboardPresets());
  }, []);

  const createNew = useCallback(() => {
    const newConfig = getDefaultKeyboard();
    setCurrentKeyboard(newConfig);
    refresh();
    return newConfig;
  }, [refresh]);

  return {
    presets,
    createNew,
    refresh,
  };
}
