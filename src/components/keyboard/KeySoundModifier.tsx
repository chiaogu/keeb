import { Keyboard, KeyEvent } from '@src/hooks/useKeyboard';
import { ModifierLayer } from '@src/types';
import { useMemo, useState } from 'react';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import ReadOnly from '../shared/ReadOnly';
import SectionHeader from '../shared/SectionHeader';
import KeyboardUI from './Keyboard';

type KeySoundModifierProps = {
  keyboard: Keyboard;
  keyEvent: KeyEvent;
};

export default function KeySoundModifier({
  keyboard,
  keyEvent,
}: KeySoundModifierProps) {
  const [selectedKey, setSelectedKey] = useState<string>();
  const { sound, modifiers, addModifierLayer } = useMemo(
    () => (keyEvent === 'down' ? keyboard.down : keyboard.up),
    [keyEvent, keyboard],
  );
  const [selectedLayer, selectLayer] = useState<ModifierLayer | undefined>(
    modifiers[0],
  );
  const layers = useMemo(
    () => modifiers.map(({ id, name }) => ({ label: name, key: id })),
    [modifiers],
  );
  const selectedKeyModifier = useMemo(() => {
    if (!selectedKey || !selectedLayer) return null;
    const modifiedOptions: { key: string; value: string }[] = [];
    Object.values(selectedLayer.keys[selectedKey] ?? {}).forEach((synth) => {
      Object.entries(synth).forEach(([nodeId, options]) => {
        Object.entries(options).forEach(([option, [operation, value]]) => {
          modifiedOptions.push({
            key: `${option}`,
            value: `${operation} ${value}`,
          });
        });
      });
    });
    return modifiedOptions;
  }, [selectedKey, selectedLayer]);

  return (
    <div className='flex  w-full flex-col items-center space-y-5'>
      <KeyboardUI
        onPress={keyboard.down.sound.trigger}
        onRelease={keyboard.up.sound.trigger}
        onClick={(code) =>
          setSelectedKey(code === selectedKey ? undefined : code)
        }
        selectedKey={selectedKey}
      />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        <RadioGroup
          label='layers'
          value={selectedLayer?.id}
          onChange={(id) => selectLayer(modifiers.find((m) => m.id === id))}
          options={layers}
        />
        <SectionHeader label='new'>
          <IconButton icon='add' onClick={addModifierLayer} />
        </SectionHeader>
      </div>
      {selectedLayer && (
        <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
          <SectionHeader className='bold' label={selectedLayer.name} />
          <ReadOnly label='id' value={selectedLayer.id} />
          {/* Add type to config */}
          <ReadOnly label='type' value='custom' />
        </div>
      )}
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        {!selectedKey && 'Select a key above'}
        {selectedKey && (
          <>
            <SectionHeader className='bold' label={selectedKey} />
            {selectedKeyModifier?.map(({ key, value }) => (
              <ReadOnly key={key} label={key} value={value} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
