import { usePressedKeys } from '../hooks/useKeyEvents';

export default function Keys() {
  const pressedKeys = usePressedKeys();
  
  return (
    <div className="h-40">
      <h1 className="text-[72px] font-bold">
        {pressedKeys.join(' ')}
      </h1>
    </div>
  );
}