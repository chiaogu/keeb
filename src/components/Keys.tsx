import { useCallback } from 'react';
import { useKeyEvents, usePressedKeys } from '../hooks/useKeyEvents';
import * as synth from '../synth';

function useKeySounds() {
  const onKeydown = useCallback(() => {
    synth.triggerKeyDown();
  }, []);
  
  const onKeyUp = useCallback(() => {
    synth.triggerKeyUp();
  }, []);
  
  useKeyEvents(onKeydown, onKeyUp);
}

export default function Keys() {
  const pressedKeys = usePressedKeys();
  
  useKeySounds();
  
  return (
    <div className="h-40">
      <h1 className="text-[72px] font-bold">
        {pressedKeys.join(' ')}
      </h1>
    </div>
  );
}