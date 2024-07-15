import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  SoundStructureProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { UpdateModifierArgs } from '@src/hooks/useKeyboardSound';
import { ModifierOp, SoundModifier } from '@src/keyboard/keySoundModifier';
import { SynthConfig, SynthNodeState } from '@src/synth';
import { memo, useCallback, useEffect } from 'react';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';

const SynthHeader = ({ synth }: { synth?: SynthConfig }) => (
  <SectionHeader label={synth?.name ?? 'missing sound layer'} />
);

function NodeHeader({ node }: { node?: SynthNodeState }): React.ReactNode {
  return (
    <ReadOnly indent={2} label={node?.type ?? 'missing synth node'} value='' />
  );
}

type ModifierControlProps = {
  modifier: SoundModifier;
  onChange?: (args: Omit<UpdateModifierArgs, 'keys' | 'layerIndex'>) => void;
};

const InnerModifierControl = memo(function ModifierControl({
  modifier,
  onChange,
  synths,
}: ModifierControlProps & { synths: SynthConfig[] }) {
  const renderField: SoundStructureProps<ModifierOp>['renderField'] =
    useCallback(
      (props) => (
        <FieldModifier
          field={props.field}
          modifier={props.value}
          node={props.node}
          onChange={(value) => {
            onChange?.({
              ...props,
              synthId: props.synth.id,
              nodeId: props.node.id,
              value,
            });
          }}
        />
      ),
      [onChange],
    );

  return (
    <>
      <SoundStructure
        synths={synths}
        structure={modifier}
        renderSynthHeader={SynthHeader}
        renderNodeHeader={NodeHeader}
        renderField={renderField}
      />
      <IconButton
        className='mb-4 ml-[-11px] self-start'
        icon='add'
        onClick={() =>
          onChange?.({
            synthId: synths[0].id,
            nodeId: synths[0].src.id,
            field: 'frequency',
            value: 0,
          })
        }
      />
    </>
  );
});

export default function ModifierControl(props: ModifierControlProps) {
  const { synths } = useModiferContext();
  return <InnerModifierControl {...props} synths={synths} />;
}
