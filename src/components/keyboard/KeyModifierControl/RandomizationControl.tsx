import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
  SoundStructureProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import useModifierStructure from '@src/hooks/useModifierStructure';
import { ModifierOp } from '@src/keyboard/keySoundModifier';
import { useCallback } from 'react';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';
import { RandomizationConfig } from '@src/types';

type ModifierControlProps = {
  radomConfig: RandomizationConfig;
  onChange: () => void;
};

type ModifierStructure = SoundStructureProps<ModifierOp>;

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

}

export default function RandomizationControl({
  radomConfig,
  onChange,
}: ModifierControlProps) {
  const { synths } = useModiferContext();

  return (
    <>
      {/* <SoundStructure
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
      /> */}
    </>
  );
}
