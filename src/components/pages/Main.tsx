import { useState } from 'react';
import Keys from '@src/components/synth/Keys';
import useKeyboardSound from '@src/hooks/useKeyboardSound';
import SoundControl from '../SoundControl';
import RadioGroup from '../shared/RadioGroup';

function Main() {
  const [keyEvent, setKeyEvent] = useState('down');
  const keyboard = useKeyboardSound();

  return (
    <div className='flex flex-col items-center space-y-5'>
      <Keys />
      <div className='flex w-full max-w-[500px] flex-col items-center space-y-5'>
        <div className='flex w-full flex-col items-center border-2 border-black p-8'>
          <RadioGroup
            label='key event'
            value={keyEvent}
            onChange={setKeyEvent}
            options={['down', 'up']}
          />
        </div>
      </div>
      <SoundControl sound={keyEvent === 'down' ? keyboard.down : keyboard.up} />
    </div>
  );
}

export default Main;
