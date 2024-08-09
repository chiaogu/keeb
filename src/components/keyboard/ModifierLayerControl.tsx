import { ModifierLayerType } from '@src/types';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { downloadModifierLayers } from '@src/utils/file';
import { useCallback, useState } from 'react';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import { useModiferContext } from './KeyModifierControl/ModifierContext';

const layerTypes: ModifierLayerType[] = ['custom', 'random'];

export default function ModifierLayerControl() {
  const {
    modifiers,
    setSelectedLayerIndex,
    selectedLayer,
    selectedLayerIndex,
    addModifierLayer,
    soundName,
    loadModifierLayers,
    removeModifierLayer,
  } = useModiferContext();
  const [addingLayer, setAddingLayer] = useState(false);

  const toggleLayer = useCallback(
    (index: number) => {
      setSelectedLayerIndex(index === selectedLayerIndex ? -1 : index);
    },
    [selectedLayerIndex, setSelectedLayerIndex],
  );

  return (
    <div className='flex w-full flex-col items-center'>
      <SectionHeader label={`${soundName} modifier`} className='mb-2 font-bold'>
        <IconButton icon='upload' onClick={loadModifierLayers} />
        <IconButton
          icon='download'
          onClick={() =>
            downloadModifierLayers(`${soundName}-modifier`, modifiers)
          }
        />
        <IconButton
          icon='add'
          style={{
            opacity: addingLayer ? 0.3 : 1,
            pointerEvents: addingLayer ? 'none' : undefined,
          }}
          onClick={() => setAddingLayer(true)}
        />
      </SectionHeader>
      {modifiers.map((layer, index) => (
        <div className='mb-2 flex w-full' key={layer.id}>
          <button
            style={{ boxShadow: CONTROL_SHADOW }}
            className='mr-2 flex h-8 flex-1 items-center justify-between bg-white px-2 text-end'
            key={layer.id}
            onClick={() => toggleLayer(index)}
          >
            <div>{Object.keys(layer.keys).length} keys</div>
            <div>{layer.name}</div>
          </button>
          <IconButton
            className={`shrink-0 ${layer.id === selectedLayer?.id ? 'bg-white invert' : ''}`}
            icon='visibility'
            onClick={() => toggleLayer(index)}
          />
          <IconButton
            className='ml-2 shrink-0'
            icon='hearing'
          />
          <IconButton
            icon='remove'
            className='ml-2'
            onClick={() => removeModifierLayer(index)}
          />
        </div>
      ))}
      {addingLayer && (
        <div className='flex w-full justify-between'>
          <div className='flex w-full items-center justify-between'>
            <div>
              {layerTypes.map((type) => (
                <button
                  style={{ boxShadow: CONTROL_SHADOW }}
                  className='mr-2 h-8 bg-white px-2 active:invert'
                  key={type}
                  onClick={() => {
                    setAddingLayer(false);
                    addModifierLayer({
                      name: `layer ${modifiers.length}`,
                      type,
                    });
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className='w-32'></div>
          <IconButton icon='close' onClick={() => setAddingLayer(false)} />
        </div>
      )}
    </div>
  );
}
