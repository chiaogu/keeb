import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import { Tab } from '@src/types';
import { channels, COLOR } from '@src/utils/constants';
import { useMemo, useState } from 'react';
import KeyEvents from '../keyboard/KeyEvents';
import KeySoundModifier from '../keyboard/KeySoundModifier';
import TestButton from '../keyboard/TestButton';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import SectionHeader from '../shared/SectionHeader';
import SoundControl from '../sound/SoundControl';

function Main() {
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');
  const [tab, setTab] = useState<Tab>('config');

  const keyboard = useKeyboard();
  const { sound } = useMemo(() => keyboard[keyEvent], [keyEvent, keyboard]);
  const channel = useMemo(() => channels[keyEvent], [keyEvent]);

  return (
    <div className='flex flex-col items-center pb-[70vh]'>
      {/* <Keys /> */}
      <div className='my-4 flex w-full max-w-[500px] flex-col items-center'>
        <div
          style={{ background: COLOR.BG }}
          className='flex w-full flex-col items-center p-8'
        >
          <SectionHeader
            label={keyboard.name}
            onLabelChange={keyboard.setName}
            className='font-bold'
          >
            <IconButton icon='scan_delete' onClick={keyboard.reset} />
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
            className='mb-4'
          />
          <KeyEvents />
        </div>
      </div>
      {tab === 'config' && (
        <SoundControl
          sound={sound}
          channel={channel}
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
      <TestButton keyboard={keyboard} />
    </div>
  );
}

export default Main;
