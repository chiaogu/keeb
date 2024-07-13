import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import CustomModifierControl from './KeyModifierControl/CustomModifierControl';
import {
  ModifierContextProvider,
  useModiferContext,
} from './KeyModifierControl/ModifierContext';
import RandomModifierControl from './KeyModifierControl/RandomModifierControl';
import ModifierLayerControl from './ModifierLayerControl';

type KeySoundModifierProps = {
  keyboard: Keyboard;
  keyEvent: KeyEvent;
};

function Content() {
  const { selectedLayer } = useModiferContext();

  return (
    <div className='flex  w-full flex-col items-center space-y-5 pb-[70vh]'>
      <ModifierLayerControl />
      {selectedLayer?.type === 'custom' && <CustomModifierControl />}
      {selectedLayer?.type === 'random' && <RandomModifierControl />}
    </div>
  );
}

export default function KeySoundModifier({
  keyboard,
  keyEvent,
}: KeySoundModifierProps) {
  return (
    <ModifierContextProvider keyboard={keyboard} keyEvent={keyEvent}>
      <Content/>
    </ModifierContextProvider>
  );
}
