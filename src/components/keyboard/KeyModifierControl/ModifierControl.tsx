import IconButton from '@src/components/shared/IconButton';
import SoundStructure, {
  SoundStructureProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { UpdateModifierArgs } from '@src/hooks/useKeyboardSound';
import { ModifierOp, SoundModifier } from '@src/keyboard/keySoundModifier';
import { SynthConfig } from '@src/synth';
import { memo, useCallback } from 'react';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';

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
              synthId: props.synthId,
              nodeId: props.nodeId,
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
