import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
  SoundStructureProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { UpdateModifierArgs } from '@src/hooks/useKeyboardSound';
import { ModifierOp, SoundModifier } from '@src/keyboard/keySoundModifier';
import { useCallback, useMemo } from 'react';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';

type ModifierControlProps = {
  modifier: SoundModifier;
  onChange: (args: Omit<UpdateModifierArgs, 'keys' | 'layerIndex'>) => void;
};

type ModifierStructure = SoundStructureProps<ModifierOp>;

function useModifierStructure({
  synthId,
  nodeId,
}: {
  synthId?: string;
  nodeId?: string;
}) {
  const { synths } = useModiferContext();
  const synth = useMemo(
    () => synths.find(({ id }) => id === synthId),
    [synthId, synths],
  );
  const node = useMemo(() => {
    const synthNodes = !synth ? null : [synth.src, ...synth.fxs];
    return synthNodes?.find(({ id }) => id === nodeId);
  }, [nodeId, synth]);

  return { synth, node };
}

const SynthHeader: ModifierStructure['synthHeader'] = (props) => {
  const { synth } = useModifierStructure(props);
  return (
    <SectionHeader
      key={props.synthId}
      label={synth?.name ?? 'missing sound layer'}
    />
  );
};

const NodeHeader: ModifierStructure['nodeHeader'] = (props) => {
  const { node } = useModifierStructure(props);
  return (
    <ReadOnly indent={2} label={node?.type ?? 'missing synth node'} value='' />
  );
};

function Field(
  props: RenderFieldProps<ModifierOp> & {
    onChange: ModifierControlProps['onChange'];
  },
) {
  const { node } = useModifierStructure(props);
  return (
    <FieldModifier
      field={props.field}
      modifier={props.value}
      node={node}
      onChange={(value) => {
        props.onChange({
          ...props,
          value,
        });
      }}
    />
  );
}

export default function ModifierControl({
  modifier,
  onChange,
}: ModifierControlProps) {
  const { synths } = useModiferContext();

  const renderField = useCallback(
    (props: RenderFieldProps<ModifierOp>) => (
      <Field {...props} onChange={onChange} />
    ),
    [onChange],
  );

  return (
    <>
      <SoundStructure
        structure={modifier}
        synthHeader={SynthHeader}
        nodeHeader={NodeHeader}
        renderField={renderField}
      />
      <IconButton
        className='mb-4 ml-[-11px] self-start'
        icon='add'
        onClick={() =>
          onChange({
            synthId: synths[0].id,
            nodeId: synths[0].src.id,
            field: 'frequency',
            value: 0,
          })
        }
      />
    </>
  );
}
