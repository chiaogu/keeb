import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure from '@src/components/SoundStructureTree/SoundStructure';
import { UpdateModifierArgs } from '@src/hooks/useKeyboardSound';
import { SoundModifier } from '@src/keyboard/keySoundModifier';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';

type ModifierControlProps = {
  modifier: SoundModifier;
  onChange: (args: Omit<UpdateModifierArgs, 'keys' | 'layerIndex'>) => void;
};

export default function ModifierControl({
  modifier,
  onChange,
}: ModifierControlProps) {
  const { synths } = useModiferContext();
  return (
    <>
      <SoundStructure
        synths={synths}
        structure={modifier}
        renderSynthHeader={({ synth }) => (
          <SectionHeader label={synth?.name ?? 'missing sound layer'} />
        )}
        renderNodeHeader={({ node }) => (
          <ReadOnly
            indent={2}
            label={node?.type ?? 'missing synth node'}
            value=''
          />
        )}
        renderField={(props) => (
          <FieldModifier
            field={props.field}
            modifier={props.value}
            node={props.node}
            onChange={(value) => {
              onChange({
                ...props,
                synthId: props.synth.id,
                nodeId: props.node.id,
                value,
              });
            }}
          />
        )}
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
