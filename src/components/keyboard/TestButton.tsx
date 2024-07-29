import { Keyboard } from '@src/hooks/useKeyboard';
import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { keys } from '@src/keyboard/keys';
import { useCallback, useRef, useState } from 'react';
import KeyButton from './KeyButton';

type TestButtonProps = {
  className?: string;
  keyboard: Keyboard;
};

const allKeys = keys.flat();

export default function TestButton({ className, keyboard }: TestButtonProps) {
  const pressedKey = useRef<string | null>(null);
  const [pressed, setPressed] = useState(false);

  const handlePress = useCallback(() => {
    pressedKey.current =
      allKeys[Math.round((allKeys.length - 1) * Math.random())];
    setPressed(true);
    keyboard.down.sound.trigger(pressedKey.current);
  }, [keyboard.down.sound]);

  const handleRelease = useCallback(() => {
    if (!pressed) return;
    setPressed(false);
    if (pressedKey.current) {
      keyboard.down.sound.trigger(pressedKey.current);
    }
  }, [keyboard.down.sound, pressed]);

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
