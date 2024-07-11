import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import { useMemo, useState } from 'react';
import KeyboardUI from './Keyboard';
import KeyModifierControl from './KeyModifierControl';
import ModifierLayerControl from './ModifierLayerControl';

type KeySoundModifierProps = {
  keyboard: Keyboard;
  keyEvent: KeyEvent;
};

export default function KeySoundModifier({
  keyboard,
  keyEvent,
}: KeySoundModifierProps) {
  const [selectedKey, setSelectedKey] = useState<string>();
  const {
    modifiers,
    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer,
  } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const selectedLayer = useMemo(
    () => modifiers[selectedLayerIndex],
    [modifiers, selectedLayerIndex],
  );
  const highlightedKeys = useMemo(() => {
    if (!selectedLayer) return [];
    return Object.keys(selectedLayer.keys);
  }, [selectedLayer]);

  return (
    <div className='flex  w-full flex-col items-center space-y-5'>
      <ModifierLayerControl
        modifiers={modifiers}
        selectedLayer={selectedLayer}
        setSelectedLayerIndex={setSelectedLayerIndex}
        addModifierLayer={(name) => {
          addModifierLayer(name);
          setSelectedLayerIndex(modifiers.length);
        }}
        removeModifierLayer={(index) => {
          removeModifierLayer(index);
          setSelectedLayerIndex(Math.min(index, modifiers.length - 2));
        }}
        updateModiferLayer={updateModiferLayer}
      />
      <KeyModifierControl
        selectedKey={selectedKey}
        selectedLayer={selectedLayer}
      />
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
