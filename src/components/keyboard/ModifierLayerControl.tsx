import { KeyboardSound } from '@src/hooks/useKeyboardSound';
import { ModifierLayer } from '@src/types';
import { useMemo } from 'react';
import IconButton from '../shared/IconButton';
import RadioGroup from '../shared/RadioGroup';
import ReadOnly from '../shared/ReadOnly';
import SectionHeader from '../shared/SectionHeader';

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
        <SectionHeader label='new'>
          <IconButton
            icon='add'
            onClick={() => addModifierLayer(`layer ${modifiers.length}`)}
          />
        </SectionHeader>
      </div>
      {selectedLayer && (
        <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
          <SectionHeader
            className='font-bold'
            label={selectedLayer.name}
            onLabelChange={(value) =>
              updateModiferLayer(layerIndex, (draft) => {
                draft.name = value;
              })
            }
          >
            {modifiers.length > 1 && (
              <IconButton
                icon='remove'
                onClick={() => removeModifierLayer(layerIndex)}
              />
            )}
          </SectionHeader>
          <ReadOnly label='type' value={selectedLayer.type} />
        </div>
      )}
    </>
  );
}
