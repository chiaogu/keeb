import { ModifierLayerType } from '@src/types';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { downloadModifierLayers } from '@src/utils/file';
import { useState } from 'react';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import { useModiferContext } from './KeyModifierControl/ModifierContext';

const layerTypes: ModifierLayerType[] = ['custom', 'random'];

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

export default function ModifierLayerControl() {
  const {
    modifiers,
    setSelectedLayerIndex,
    selectedLayer,
    addModifierLayer,
    soundName,
    loadModifierLayers,
    removeModifierLayer
  } = useModiferContext();
  const [addingLayer, setAddingLayer] = useState(false);

  return (
    <div className='flex w-full flex-col items-center p-8'>
      <SectionHeader label={`${soundName} modifier`} className='mb-2 font-bold'>
        <IconButton icon='upload' onClick={loadModifierLayers} />
        <IconButton
          icon='download'
          onClick={() =>
            downloadModifierLayers(`${soundName}-modifier`, modifiers)
          }
        />
        <IconButton icon='add' 
            onClick={() =>
              addModifierLayer({ name: `layer ${modifiers.length}`, type: 'custom' })
            }/>
      </SectionHeader>
      {modifiers.map((layer, index) => (
        <div className='mb-2 flex w-full'>
          <button
            style={{ boxShadow: CONTROL_SHADOW }}
            className='mr-2 h-8 flex-1 bg-white px-2 text-end'
            key={layer.id}
            onClick={() => setSelectedLayerIndex(index)}
          >
            {layer.name}
          </button>
          <IconButton
            className={`shrink-0 ${layer.id === selectedLayer?.id ? 'bg-white invert' : ''}`}
            icon='visibility'
            onClick={() => setSelectedLayerIndex(index)}
          />
          <IconButton
            icon='remove'
            className='ml-2'
            onClick={() => removeModifierLayer(index)}
          />
        </div>
      ))}
      <SectionHeader label='new'>
        <IconButton
          icon={addingLayer ? 'close' : 'add'}
          onClick={() => setAddingLayer(!addingLayer)}
        />
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
  );
}
