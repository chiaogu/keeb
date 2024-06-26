import { useCallback, useEffect } from "react";
import * as Tone from "tone";

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
    addEventListener('keydown', handleStart);
    return () => {
      removeEventListener('click', handleStart);
      removeEventListener('keydown', handleStart);
    };
  }, [handleStart]);
  
  return (
    <div className="flex h-screen w-screen cursor-pointer items-center justify-center">
      <div>Click anywhere or press any key to start</div>
    </div>
  );
}
