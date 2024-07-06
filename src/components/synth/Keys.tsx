import { usePressedKeys } from '@src/hooks/useKeyEvents';

export default function Keys() {
  const pressedKeys = usePressedKeys();

  return (
    <div className='min-h-32'>
      <h1 className='text-[72px] font-bold'>{pressedKeys.join(' ')}</h1>
    </div>
  );
}
