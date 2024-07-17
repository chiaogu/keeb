import SoundStructure, {
  RenderFieldProps,
  SoundStructureField,
} from '@src/components/SoundStructureTree/SoundStructure';
import { useMemo } from 'react';
import { useModiferContext } from './ModifierContext';

function shouldRenderField(
  field: SoundStructureField<unknown>,
): field is unknown {
  return typeof field !== 'object';
}

type SoundFieldPickerProps = {
  onSelect: (args: {
    synthId: string;
    nodeId: string;
    fieldPath: string[];
  }) => void;
};

export default function SoundFieldPicker({ onSelect }: SoundFieldPickerProps) {
  const { synths } = useModiferContext();

  const nodeMap = useMemo(() => {
    const result: Record<string, Record<string, Record<string, unknown>>> = {};
    return synths.reduce(
      (acc, synth) => ({
        ...acc,
        [synth.id]: [synth.src, ...synth.fxs].reduce(
          (nodeAcc, node) => ({
            ...nodeAcc,
            [node.id]: node.data,
          }),
          {},
        ),
      }),
      result,
    );
  }, [synths]);

  const renderField = useMemo(() => {
    const render = (props: RenderFieldProps<unknown>) => {
      const { fieldPath, synthId, nodeId } = props;
      return (
        <button
          className='mr-5 underline'
          onClick={() => onSelect({ synthId, nodeId, fieldPath })}
        >
          {fieldPath[fieldPath.length - 1]}
        </button>
      );
    };
    return render;
  }, [onSelect]);

  return (
    <SoundStructure
      synths={synths}
      structure={nodeMap}
      renderField={renderField}
      shouldRenderField={shouldRenderField}
    />
  );
}
