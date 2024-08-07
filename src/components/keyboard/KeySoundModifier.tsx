import { KeyEvent } from '@src/hooks/useKeyboard';
import { COLOR } from '@src/utils/constants';
import { useState } from 'react';
import IconButton from '../shared/IconButton';
import { useMainContext } from '../shared/MainContext';
import RadioGroup from '../shared/RadioGroup';
import SectionHeader from '../shared/SectionHeader';
import CustomModifierControl from './KeyModifierControl/CustomModifierControl';
import {
  ModifierContextProvider,
  useModiferContext,
} from './KeyModifierControl/ModifierContext';
import RandomModifierControl from './KeyModifierControl/RandomModifierControl';
import ModifierLayerControl from './ModifierLayerControl';

function Content() {
  const { selectedLayer } = useModiferContext();

  return (
    <div className='flex  w-full flex-col items-center space-y-5'>
      <ModifierLayerControl />
      {selectedLayer?.type === 'custom' && <CustomModifierControl />}
      {selectedLayer?.type === 'random' && <RandomModifierControl />}
    </div>
  );
}

export default function KeySoundModifier() {
  const { keyboard } = useMainContext();
  const [keyEvent, setKeyEvent] = useState<KeyEvent>('down');
  return (
    <ModifierContextProvider keyboard={keyboard} keyEvent={keyEvent}>
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
      <Content />
    </ModifierContextProvider>
  );
}
