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
    synths,
    modifiers,

    selectedKey,
    setSelectedKey,
    highlightedKeys,

    selectedLayerIndex,
    setSelectedLayerIndex,
    selectedLayer,

    addModifierLayer,
    removeModifierLayer,
    updateModiferLayer,
    updateModifier,
  } = useModiferContext();

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
      {selectedLayer && (
        <KeyModifierControl
          synths={synths}
          selectedKey={selectedKey}
          selectedLayer={selectedLayer}
          onChange={(args) =>
            selectedKey &&
            updateModifier({
              ...args,
              key: selectedKey,
              layerIndex: selectedLayerIndex,
            })
          }
        />
      )}
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
