import { useCallback, useEffect, useMemo, useState } from "react";

const KEY_LABEL: Record<string, string> = {
  ' ': 'Space',
};

export function usePressedKeys() {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  
  const onKeydown = useCallback((e: KeyboardEvent) => {
    const label = KEY_LABEL[e.key] ?? e.key;
    if (!e.repeat) setPressedKeys((keys) => Array.from(new Set([...keys, label])));
  }, []);
  
  const onKeyUp = useCallback((e: KeyboardEvent) => {
    const label = KEY_LABEL[e.key] ?? e.key;
    setPressedKeys((keys) => keys.filter(key => key !== label));
  }, []);
  
  useKeyEvents(onKeydown, onKeyUp);

  return pressedKeys;
}

export function useKeyEvents(
  onKeydown: (e: KeyboardEvent) => void,
  onKeyUp: (e: KeyboardEvent) => void,
  repeat = false,
) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!repeat && !e.repeat) onKeydown(e);
    };
    addEventListener('keydown', handleKeydown);
    return () => removeEventListener('keydown', handleKeydown);
  }, [onKeydown, repeat]);
  
  useEffect(() => {
    addEventListener('keyup', onKeyUp);
    return () => removeEventListener('keyup', onKeyUp);
  }, [onKeyUp]);
}