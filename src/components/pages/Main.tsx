import useKeyboard, { KeyEvent } from '@src/hooks/useKeyboard';
import { channels, COLOR } from '@src/utils/constants';
import { useMemo, useState } from 'react';
import KeyEvents from '../keyboard/KeyEvents';
import KeySoundModifier from '../keyboard/KeySoundModifier';
import TestButton from '../keyboard/TestButton';
import IconButton from '../shared/IconButton';
import { MainContextProvider, useMainContext } from '../shared/MainContext';
import RadioGroup from '../shared/RadioGroup';
import SectionHeader from '../shared/SectionHeader';
import SoundControl from '../sound/SoundControl';
import StickyHeader from './StickyHeader/StickyHeader';

function Main() {
  const { tab } = useMainContext();
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');

  const keyboard = useKeyboard();
  const { sound } = useMemo(() => keyboard[keyEvent], [keyEvent, keyboard]);

  return (
    <div className='flex flex-col items-center pb-[70vh] pt-2'>
      <StickyHeader channel={channels[keyEvent]} />
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
        </div>
      </div>
      {tab === 'sound' && (
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
      {tab === 'tweaks' && (
        <KeySoundModifier keyboard={keyboard} keyEvent={keyEvent} />
      )}
      <TestButton />
    </div>
  );
}

export default function MainWithContext() {
  return (
    <MainContextProvider>
      <Main />
    </MainContextProvider>
  );
}
