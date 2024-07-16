import SoundStructure from '@src/components/SoundStructureTree/SoundStructure';
import { useMemo } from 'react';
import { useModiferContext } from './ModifierContext';

export default function SoundFieldPicker() {
  const { synths } = useModiferContext();

  // TODO: Filter based on field name
  const nodeMap = useMemo(() => {
    const result: Record<string, Record<string, Record<string, null>>> = {};
    return synths.reduce(
      (acc, synth) => ({
        ...acc,
        [synth.id]: [synth.src, ...synth.fxs].reduce(
          (nodeAcc, node) => ({
            ...nodeAcc,
            [node.id]: Object.keys(node.data).reduce(
              (fieldAcc, field) => ({
                ...fieldAcc,
                [field]: null,
              }),
              {},
            ),
          }),
          {},
        ),
      }),
      result,
    );
  }, [synths]);

  return (
    <SoundStructure
      synths={synths}
      structure={nodeMap}
      renderField={({ field }) => (
        <button className='mr-5 underline' onClick={() => {}}>
          {field}
        </button>
      )}
    />
  );
}
