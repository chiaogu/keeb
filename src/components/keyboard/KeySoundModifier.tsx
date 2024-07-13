import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import KeyboardUI from './Keyboard';
import KeyModifierControl from './KeyModifierControl';
import {
  ModifierContextProvider,
  useModiferContext,
} from './KeyModifierControl/ModifierContext';
import ModifierLayerControl from './ModifierLayerControl';

type KeySoundModifierProps = {
  keyboard: Keyboard;
  keyEvent: KeyEvent;
};

function Content({ keyboard }: { keyboard: Keyboard }) {
  const {
    selectedKey,
    setSelectedKey,
    highlightedKeys,
    selectedLayer,
  } = useModiferContext();

  return (
    <div className='flex  w-full flex-col items-center space-y-5'>
      <ModifierLayerControl />
      {selectedLayer && <KeyModifierControl />}
      <KeyboardUI
        onPress={keyboard.down.sound.trigger}
        onRelease={keyboard.up.sound.trigger}
        onClick={(code) =>
          setSelectedKey(code === selectedKey ? undefined : code)
        }
        selectedKey={selectedKey}
        highlightedKeys={highlightedKeys}
      />
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
