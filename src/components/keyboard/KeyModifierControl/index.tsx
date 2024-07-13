import IconButton from '../../shared/IconButton';
import SectionHeader from '../../shared/SectionHeader';
import { useModiferContext } from './ModifierContext';
import SynthModifierControl from './SynthModifier';

export default function KeyModifierControl() {
  const {
    synths,
    selectedKey,
    selectedLayer,
    updateModifier,
    selectedLayerIndex,
  } = useModiferContext();

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      {!selectedKey && 'select a key'}
      {selectedKey && (
        <>
          <SectionHeader className='font-bold' label={selectedKey} />
          {Object.entries(selectedLayer.keys[selectedKey] ?? {}).map(
            ([synthId, nodes]) => (
              <SynthModifierControl
                key={synthId}
                synthId={synthId}
                synths={synths}
                nodes={nodes}
                onChange={(args) =>
                  updateModifier({
                    ...args,
                    key: selectedKey,
                    layerIndex: selectedLayerIndex,
                    synthId,
                  })
                }
              />
            ),
          )}
          <SectionHeader className='mt-4' label='new'>
            <IconButton
              icon='add'
              onClick={() =>
                updateModifier({
                  synthId: synths[0].id,
                  nodeId: synths[0].src.id,
                  field: 'frequency',
                  value: 0,
                  key: selectedKey,
                  layerIndex: selectedLayerIndex,
                })
              }
            />
          </SectionHeader>
        </>
      )}
    </div>
  );
}
