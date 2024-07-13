import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import KeyboardUI from './Keyboard';
import CustomModifierControl from './KeyModifierControl/CustomModifierControl';
import {
  ModifierContextProvider,
  useModiferContext,
} from './KeyModifierControl/ModifierContext';
import ModifierLayerControl from './ModifierLayerControl';
import RandomModifierControl from './KeyModifierControl/RandomModifierControl';

type KeySoundModifierProps = {
  keyboard: Keyboard;
  keyEvent: KeyEvent;
};

function Content({ keyboard }: { keyboard: Keyboard }) {
  const {
    selectedKeys,
    toggleKey,
    highlightedKeys,
    selectedLayer,
  } = useModiferContext();

  return (
    <div className='flex  w-full flex-col items-center space-y-5 pb-[50vh]'>
      <ModifierLayerControl />
      <KeyboardUI
        onRelease={(key) => {
          keyboard.up.sound.trigger(key);
        }}
        onPress={(key) => {
          keyboard.down.sound.trigger(key);
          toggleKey(key);
        }}
        selectedKeys={selectedKeys}
        highlightedKeys={highlightedKeys}
      />
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
      <Content keyboard={keyboard} />
    </ModifierContextProvider>
  );
}
