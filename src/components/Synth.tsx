import { useEffect, useState } from 'react';
import Slider from './Slider';
import * as synth from '@src/synth';

export default function Synth() {
  const [synthState, setSynthState] = useState(synth.getState());
  const { volume } = synthState;
  
  useEffect(() => {
    synth.setState(synthState);
  }, [synthState]);

  return (
    <div className="flex flex-col items-center border-2 border-black w-96 p-8">
      <Slider
        label="volume"
        value={volume}
        onChange={(value) =>
          setSynthState((state) => ({ volume: value, state }))
        }
      />
    </div>
  );
}
