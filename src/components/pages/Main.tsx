import Keys from '@src/components/synth/Keys';
import useKeyboardSound, { KeyEvent } from '@src/hooks/useKeyboardSound';
import { useMemo, useState } from 'react';
import SoundControl from '../SoundControl';
import RadioGroup from '../shared/RadioGroup';

function Main() {
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');
  const keyboard = useKeyboardSound();
  const sound = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );

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
      <SoundControl
        sound={sound}
        onRemoveLayer={sound.removeLayer}
        onAddLayer={sound.addLayer}
        onSrcChange={sound.setSrcState}
        onFxChange={sound.setFxState}
        onRemoveFx={sound.removeFx}
        onAddFx={sound.addFx}
        onNameChange={sound.setName}
        onLoadSound={sound.loadConfig}
      />
    </div>
  );
}

export default Main;
