import Keys from '@src/components/synth/Keys';
import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import { Tab } from '@src/types';
import { useMemo, useState } from 'react';
import SoundControl from '../sound/SoundControl';
import KeySoundModifier from '../keyboard/KeySoundModifier';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import SectionHeader from '../shared/SectionHeader';

function Main() {
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');
  const [tab, setTab] = useState<Tab>('config');

  const keyboard = useKeyboard();
  const { sound } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );

  return (
    <div className='flex flex-col items-center pb-[70vh]'>
      <Keys />
      <div className='mb-4 flex w-full max-w-[500px] flex-col items-center'>
        <div className='flex w-full flex-col items-center border-2 border-black p-8'>
          <SectionHeader label={keyboard.name} onLabelChange={keyboard.setName} className='font-bold'>
            <IconButton icon='reset_settings' onClick={keyboard.reset} />
            <IconButton icon='upload' onClick={keyboard.upload} />
            <IconButton icon='download' onClick={keyboard.download} />
          </SectionHeader>
          <RadioGroup
            label='event'
            values={[keyEvent]}
            onChange={([value]) => setKeyEvent(value as KeyEvent)}
            options={['down', 'up']}
          />
          <RadioGroup
            label='tab'
            values={[tab]}
            onChange={([value]) => setTab(value as Tab)}
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
          onSynthNameChange={(index, name) =>
            sound.updateLayer(index, { name })
          }
        />
      )}
      {tab === 'modifier' && (
        <KeySoundModifier keyboard={keyboard} keyEvent={keyEvent} />
      )}
    </div>
  );
}

export default Main;
