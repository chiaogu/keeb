import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { keys } from '@src/keyboard/keys';
import { useCallback, useRef, useState } from 'react';
import KeyButton from './KeyButton';
import getKeyCodeLabel from '@src/keyboard/getKeyLabel';

type TestButtonProps = {
  className?: string;
};

const allKeys = keys.flat();

export default function TestButton({ className }: TestButtonProps) {
  const pressedKey = useRef<{ key: string; code: string } | null>(null);
  const [pressed, setPressed] = useState(false);

  const handlePress = useCallback(() => {
    const code =
      allKeys[Math.round((allKeys.length - 1) * Math.random())];
    pressedKey.current = { code, key: getKeyCodeLabel(code).toLowerCase() };
    dispatchEvent(new KeyboardEvent('keydown', pressedKey.current));
  }, []);

  const handleRelease = useCallback(() => {
    if (!pressed) return;
    if (pressedKey.current) {
      dispatchEvent(new KeyboardEvent('keyup', pressedKey.current));
    }
  }, [pressed]);

  useKeyEvents({
    onKeydown: () => setPressed(true),
    onKeyUp: () => setPressed(false),
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
