import { useKeyEvents } from '@src/hooks/useKeyEvents';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import { getRandomKeyCode } from '@src/utils/utils';
import { useCallback, useMemo, useRef, useState } from 'react';
import KeyButton from './KeyButton';

export default function TestButton() {
  const pressedKey = useRef<{ key: string; code: string } | null>(null);
  const [pressed, setPressed] = useState(false);

  const handlePress = useCallback(() => {
    const code = getRandomKeyCode();
    pressedKey.current = { code, key: getKeyCodeLabel(code).toLowerCase() };
    dispatchEvent(new KeyboardEvent('keydown', pressedKey.current));
  }, []);

  const handleRelease = useCallback(() => {
    if (!pressed) return;
    if (pressedKey.current) {
      dispatchEvent(new KeyboardEvent('keyup', pressedKey.current));
    }
  }, [pressed]);

  const createKetEventHandler = useCallback(
    (newPressed: boolean) => () => {
      if (pressed === newPressed) {
        setPressed(!newPressed);
        setTimeout(() => setPressed(newPressed), 50);
      } else {
        setPressed(newPressed);
      }
    },
    [pressed],
  );
  
  const eventHandlers = useMemo(() => ({
    onKeydown: createKetEventHandler(true),
    onKeyUp: createKetEventHandler(false),
  }), [createKetEventHandler]);

  useKeyEvents(eventHandlers);

  return (
    <KeyButton
      className='fixed bottom-4 left-6 z-10'
      pressed={pressed}
      onPress={handlePress}
      onRelease={handleRelease}
    />
  );
}
