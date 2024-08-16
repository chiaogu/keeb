import { shouldShowKeyEventVisual } from '@src/utils/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyEvents } from './useKeyEvents';

export default function usePressedKeys() {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const press = useCallback((code: string) => {
    setPressedKeys((keys) => Array.from(new Set([...keys, code])));
  }, []);

  const release = useCallback((code: string) => {
    setPressedKeys((keys) => keys.filter((key) => key !== code));
  }, []);

  const eventHandlers = useMemo(
    () => ({
      onKeydown: (e: KeyboardEvent) =>
        shouldShowKeyEventVisual(e) && press(e.code),
      onKeyUp: (e: KeyboardEvent) =>
        shouldShowKeyEventVisual(e) && release(e.code),
    }),
    [press, release],
  );

  useKeyEvents(eventHandlers);

  useEffect(() => {
    const handleBlur = () => setPressedKeys([]);
    addEventListener('blur', handleBlur);
    return () => removeEventListener('blur', handleBlur);
  }, []);

  return { pressedKeys, press, release };
}
