import { ModifierLayer } from '@src/types';
import { useMemo } from 'react';
import ReadOnly from '../shared/ReadOnly';
import SectionHeader from '../shared/SectionHeader';
import IconButton from '../shared/IconButton';

type KeyModifierProps = {
  selectedKey?: string;
  selectedLayer?: ModifierLayer;
};

export default function KeyModifierControl({
  selectedKey,
  selectedLayer,
}: KeyModifierProps) {
  const selectedKeyModifier = useMemo(() => {
    if (!selectedKey || !selectedLayer) return null;
    const modifiedOptions: { key: string; value: string }[] = [];
    Object.values(selectedLayer.keys[selectedKey] ?? {}).forEach((synth) => {
      Object.entries(synth).forEach(([_nodeId, options]) => {
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
    <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      {!selectedKey && 'select a key'}
      {selectedKey && (
        <>
          <SectionHeader className='font-bold' label={selectedKey} />
          {selectedKeyModifier?.map(({ key, value }) => (
            <ReadOnly key={key} label={key} value={value} />
          ))}
          <SectionHeader label='new'>
            <IconButton
              icon='add'
              onClick={() => {}}
            />
          </SectionHeader>
        </>
      )}
    </div>
  );
}
