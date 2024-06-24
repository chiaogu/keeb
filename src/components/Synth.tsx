import { useCallback, useEffect, useState } from 'react';
import * as synth from '@src/synth';
import Control from './Control';
import { SynthState } from '@src/synth/type';
import { useKeyEvents } from '@src/hooks/useKeyEvents';

function useKeySounds() {
  const onKeydown = useCallback(() => {
    synth.triggerKeyDown();
  }, []);
  
  const onKeyUp = useCallback(() => {
    synth.triggerKeyUp();
  }, []);
  
  useKeyEvents(onKeydown, onKeyUp);
}

export default function Synth() {
  const [synthState, setSynthState] = useState(synth.getState());

  useEffect(() => {
    synth.setState(synthState);
  }, [synthState]);
  
  useKeySounds();

  return (
    <div className="flex flex-col items-center border-2 border-black w-[500px] p-8">
      {Object.entries(synthState).map(([key, value]) => (
        <Control
          key={key}
          field={key as keyof SynthState}
          value={value}
          onChange={(value) =>
            setSynthState((state) => ({ ...state, [key]: value }))
          }
        />
      ))}
    </div>
  );
}
