import { useState } from 'react';
import * as synth from '../synth';

export default function Keys() {
  const [pressedKeys, setPressedKeys] = useState([]);
  
  return (
    <button className={container} onClick={() => synth.makeNoise()}>Click</button>
  );
}