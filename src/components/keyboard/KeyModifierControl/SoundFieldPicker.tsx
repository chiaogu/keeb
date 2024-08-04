import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
  SoundStructureField,
} from '@src/components/sound/SoundStructure';
import { SynthNodeState } from '@src/synth';
import { useMemo } from 'react';
import { useModiferContext } from './ModifierContext';
import { SoundFieldPath } from './RandomizationControl';

function shouldRenderField(
  field: SoundStructureField<unknown>,
): field is unknown {
  return typeof field !== 'object';
}

type SoundFieldPickerProps = {
  soundName: string;
  onSelect: (args: SoundFieldPath, node?: SynthNodeState) => void;
  onClose: () => void;
};

export default function SoundFieldPicker({
  soundName,
  onSelect,
  onClose,
}: SoundFieldPickerProps) {
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
      const { fieldPath, synthId, nodeId, node } = props;
      return (
        <button
          className='mr-5 underline'
          onClick={() => onSelect({ synthId, nodeId, fieldPath }, node)}
        >
          {fieldPath[fieldPath.length - 1]}
        </button>
      );
    };
    return render;
  }, [onSelect]);

  return (
    <>
      <SectionHeader label={soundName} className='mt-4 font-bold'>
        <IconButton icon='close' onClick={onClose} />
      </SectionHeader>
      <SoundStructure
        synths={synths}
        structure={nodeMap}
        renderField={renderField}
        shouldRenderField={shouldRenderField}
      />
    </>
  );
}
