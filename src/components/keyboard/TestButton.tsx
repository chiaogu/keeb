import { useKeyEvents } from '@src/hooks/useKeyEvents';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';
import { getRandomKeyCode } from '@src/utils/utils';
import { useCallback, useRef, useState } from 'react';
import KeyButton from './KeyButton';

type TestButtonProps = {
  className?: string;
};

export default function TestButton({ className }: TestButtonProps) {
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

  useKeyEvents({
    onKeydown: createKetEventHandler(true),
    onKeyUp: createKetEventHandler(false),
  });

  return (
    <KeyButton
      className={`fixed bottom-6 left-6 ${className}`}
      pressed={pressed}
      onPress={handlePress}
      onRelease={handleRelease}
    />
  );
}
