import Keys from '@src/components/synth/Keys';
import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import { useMemo, useState } from 'react';
import SoundControl from '../SoundControl';
import KeySoundModifier from '../keyboard/KeySoundModifier';
import RadioGroup from '../shared/RadioGroup';
import { Tab } from '@src/types';

function Main() {
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');
  const [tab, setTab] = useState<Tab>('modifier');

  const keyboard = useKeyboard();
  const { sound } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );

  return (
    <div className='flex flex-col items-center'>
      <Keys />
      <div className='mb-4 flex w-full max-w-[500px] flex-col items-center'>
        <div className='flex w-full flex-col items-center border-2 border-black p-8'>
          <RadioGroup
            label='key event'
            value={keyEvent}
            onChange={(value) => setKeyEvent(value as KeyEvent)}
            options={['down', 'up']}
          />
          <RadioGroup
            label='tab'
            value={tab}
            onChange={(value) => setTab(value as Tab)}
            options={['config', 'modifier']}
          />
        </div>
      </div>
      {tab === 'config' && (
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
      )}
      {tab === 'modifier' && <KeySoundModifier keyboard={keyboard} keyEvent={keyEvent}/>}
    </div>
  );
}

export default Main;
