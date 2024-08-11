import { KeyEvent } from '@src/hooks/useKeyboard';
import { useState } from 'react';
import { useMainContext } from '../shared/MainContext';
import RadioGroup from '../shared/RadioGroup';
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
    <div className='flex w-full max-w-[500px] flex-col items-center p-8'>
      <ModifierLayerControl />
      {selectedLayer && <div className='my-8 w-full border-b-2 border-dotted border-black bg-transparent'></div>}
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
      <RadioGroup
        values={[keyEvent]}
        onChange={([value]) => setKeyEvent(value as KeyEvent)}
        options={['down', 'up']}
      />
      <Content />
    </ModifierContextProvider>
  );
}
