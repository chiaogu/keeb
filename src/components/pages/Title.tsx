import { useCallback, useState } from 'react';
import KeyButton from '../keyboard/KeyButton';

type TitleProps = {
  onStart: () => void;
  message: React.ReactNode;
};

export default function Title({ onStart, message }: TitleProps) {
  const [pressed, setPressed] = useState(false);

  const handlePress = useCallback(async () => {
    setPressed(true);
  }, []);

  const handleRelease = useCallback(async () => {
    if (!pressed) return;
    setPressed(false);
  }, [pressed]);

  return (
    <div className='relative flex h-screen w-full items-center justify-center'>
      <div
        className='absolute size-full cursor-pointer '
        onPointerDown={handlePress}
        onPointerUp={async () => {
          handleRelease();
          await new Promise((resolve) => setTimeout(resolve, 100));
          onStart();
        }}
        onPointerCancel={handleRelease}
        onPointerLeave={handleRelease}
      ></div>
      {message}
      <KeyButton className='fixed bottom-4 left-6' pressed={pressed} />
    </div>
  );
}
