import Keys from '@src/components/synth/Keys';
import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import { useMemo, useState } from 'react';
import SoundControl from '../SoundControl';
import KeySoundModifier from '../keyboard/KeySoundModifier';
import Keyboard from '../keyboard/Keyboard';
import RadioGroup from '../shared/RadioGroup';

function Main() {
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');
  const [tab, setTab] = useState<'config' | 'modifier'>('config');
  const [selectedKey, setSelectedKey] = useState<string>();

  const keyboard = useKeyboard();
  const { sound } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );

  return (
    <div className='flex flex-col items-center'>
      <Keys />
      <Keyboard
        className='mb-12'
        onPress={keyboard.down.sound.trigger}
        onRelease={keyboard.up.sound.trigger}
        onClick={(code) =>
          setSelectedKey(code === selectedKey ? undefined : code)
        }
        selectedKey={selectedKey}
      />
      <div className='mb-4 flex w-full max-w-[500px] flex-col items-center'>
        <div className='flex w-full flex-col items-center border-2 border-black p-8'>
          <RadioGroup
            label='key event'
            value={keyEvent}
            onChange={setKeyEvent}
            options={['down', 'up']}
          />
          <RadioGroup
            label='tab'
            value={tab}
            onChange={setTab}
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
      {tab === 'modifier' && <KeySoundModifier />}
    </div>
  );
}

export default Main;
