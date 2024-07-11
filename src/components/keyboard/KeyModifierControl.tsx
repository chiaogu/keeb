import { ModifierLayer, SoundConfig } from '@src/types';
import IconButton from '../shared/IconButton';
import ReadOnly from '../shared/ReadOnly';
import SectionHeader from '../shared/SectionHeader';

type KeyModifierProps = {
  selectedKey?: string;
  selectedLayer: ModifierLayer;
  sound: SoundConfig;
};

export default function KeyModifierControl({
  selectedKey,
  selectedLayer,
  sound,
}: KeyModifierProps) {
  return (
    <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      {!selectedKey && 'select a key'}
      {/* TODO: Memoize */}
      {selectedKey && (
        <>
          <SectionHeader className='font-bold' label={selectedKey} />
          {Object.entries(selectedLayer.keys[selectedKey]).map(
            ([synthId, nodes]) => {
              const synth = sound.synths.find(({ id }) => id === synthId);
              return (
                <div key={synthId} className='w-full'>
                  <SectionHeader
                    key={synthId}
                    label={synth?.name ?? 'missing sound layer'}
                  />
                  {Object.entries(nodes).map(([nodeId, properties]) => {
                    const synthNodes = !synth
                      ? null
                      : [synth.src, ...synth.fxs];
                    const node = synthNodes?.find(({ id }) => id === nodeId);
                    return (
                      <div
                        key={nodeId}
                        className='border-l-2 border-dotted border-l-black'
                      >
                        <ReadOnly
                          indent={2}
                          label={node?.type ?? 'missing synth node'}
                          value=''
                        />
                        {Object.entries(properties).map(
                          ([property, [operation, value]]) => {
                            const valid = node?.data?.[property] != undefined;
                            return (
                              <ReadOnly
                                className='border-l-2 border-dotted border-l-black'
                                key={property}
                                indent={3}
                                label={`${valid ? '' : '[invalid]'} ${property}`}
                                value={`${operation} ${value}`}
                              />
                            );
                          },
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            },
          )}
          <SectionHeader label='new'>
            <IconButton icon='add' onClick={() => {}} />
          </SectionHeader>
        </>
      )}
    </div>
  );
}
