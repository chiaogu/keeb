import * as Tone from '@src/tone';
import { useCallback, useEffect } from 'react';

type TitleProps = {
  onStart: () => void;
};

export default function Title({ onStart }: TitleProps) {
  const handleStart = useCallback(async () => {
    await Tone.start();
    onStart();
  }, [onStart]);

  useEffect(() => {
    addEventListener('click', handleStart);
    return () => {
      removeEventListener('click', handleStart);
    };
  }, [handleStart]);

  return (
    <div className='flex h-screen w-screen cursor-pointer items-center justify-center'>
      <div>start</div>
    </div>
  );
}
