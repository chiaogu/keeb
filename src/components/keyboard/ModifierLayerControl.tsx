import { KeyboardSound } from '@src/hooks/useKeyboardSound';
import { ModifierLayer, ModifierLayerType } from '@src/types';
import { useMemo, useState } from 'react';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import ReadOnly from '../shared/ReadOnly';
import SectionHeader from '../shared/SectionHeader';

const layerTypes: ModifierLayerType[] = ['custom', 'batch', 'random'];

function AddLayer({
  onSelect,
}: {
  onSelect: (type: ModifierLayerType) => void;
}) {
  return (
    <div className='flex w-full'>
      <label className='w-32 shrink-0'>type</label>
      <div className='inline-block w-full'>
        {layerTypes.map((type) => (
          <button
            className='mr-5 underline'
            key={type}
            onClick={() => onSelect(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

type ModifierLayerProps = {
  modifiers: ModifierLayer[];
  selectedLayer?: ModifierLayer;
  setSelectedLayerIndex: (index: number) => void;
  addModifierLayer: KeyboardSound['addModifierLayer'];
  removeModifierLayer: KeyboardSound['removeModifierLayer'];
  updateModiferLayer: KeyboardSound['updateModiferLayer'];
};

export default function ModifierLayerControl({
  modifiers,
  selectedLayer,
  setSelectedLayerIndex,
  addModifierLayer,
  removeModifierLayer,
  updateModiferLayer,
}: ModifierLayerProps) {
  const layers = useMemo(
    () => modifiers.map(({ id, name }) => ({ label: name, key: id })),
    [modifiers],
  );
  const layerIndex = useMemo(
    () => (selectedLayer ? modifiers.indexOf(selectedLayer) : -1),
    [modifiers, selectedLayer],
  );
  const [addingLayer, setAddingLayer] = useState(false);

  return (
    <>
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        <RadioGroup
          label='layers'
          value={selectedLayer?.id}
          onChange={(id) =>
            setSelectedLayerIndex(modifiers.findIndex((m) => m.id === id))
          }
          options={layers}
        />
        <SectionHeader className='mt-4' label='new'>
          <IconButton icon={addingLayer ? 'close' : 'add' } onClick={() => setAddingLayer(!addingLayer)} />
        </SectionHeader>
        {addingLayer && (
          <AddLayer
            onSelect={(type) => {
              setAddingLayer(false);
              addModifierLayer({ name: `layer ${modifiers.length}`, type });
            }}
          />
        )}
      </div>
      {selectedLayer && (
        <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
          <SectionHeader
            className='font-bold'
            label={selectedLayer.name}
            onLabelChange={(name) => updateModiferLayer(layerIndex, { name })}
          >
            <IconButton
              icon='remove'
              onClick={() => removeModifierLayer(layerIndex)}
            />
          </SectionHeader>
          <ReadOnly label='type' value={selectedLayer.type} />
        </div>
      )}
    </>
  );
}
