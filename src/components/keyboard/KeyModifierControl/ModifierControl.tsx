import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  SoundStructureProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { UpdateModifierArgs } from '@src/hooks/useKeyboardSound';
import {
  isModifierOp,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { SynthConfig } from '@src/synth';
import { memo, useCallback, useState } from 'react';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';
import { SoundFieldPath } from './RandomizationControl';
import SoundFieldPicker from './SoundFieldPicker';

type ModifierControlProps = {
  soundName: string;
  modifier: SoundModifier;
  onChange?: (args: Omit<UpdateModifierArgs, 'keys' | 'layerIndex'>) => void;
};

const InnerModifierControl = memo(function ModifierControl({
  soundName,
  modifier,
  onChange,
  synths,
}: ModifierControlProps & { synths: SynthConfig[] }) {
  const [fixingField, setFixingField] = useState<SoundFieldPath>();
  const [selectingField, setSelectingField] = useState<'add' | 'fix' | false>(
    false,
  );

  const renderField: SoundStructureProps<ModifierOp>['renderField'] =
    useCallback(
      ({ node, fieldPath, value, synthId, nodeId }) => {
        return (
          <FieldModifier
            field={fieldPath[fieldPath.length - 1]}
            modifier={value}
            node={node}
            onChange={(value) => {
              onChange?.({
                synthId,
                nodeId,
                value,
                field: fieldPath[fieldPath.length - 1],
              });
            }}
          />
        );
      },
      [onChange],
    );

  return (
    <>
      <SoundStructure
        synths={synths}
        structure={modifier}
        renderField={renderField}
        shouldRenderField={isModifierOp}
      />
      {!selectingField && (
        <SectionHeader label='new'>
          <IconButton
            icon='add'
            onClick={() => {
              setSelectingField('add');
              // onChange?.({
              //   synthId: synths[0].id,
              //   nodeId: synths[0].src.id,
              //   field: 'frequency',
              //   value: 0,
              // });
            }}
          />
        </SectionHeader>
      )}
      {selectingField && (
        <SoundFieldPicker
          soundName={soundName}
          onSelect={(newField, node) => {
            if (selectingField === 'fix' && fixingField) {
              // fixRandomConfig(fixingField, newField);
            }
            if (selectingField === 'add' && node) {
              // addRandomConfig(newField, node);
            }
            setSelectingField(false);
            setFixingField(undefined);
          }}
          onClose={() => {
            setSelectingField(false);
            setFixingField(undefined);
          }}
        />
      )}
    </>
  );
});

export default function ModifierControl(props: ModifierControlProps) {
  const { synths } = useModiferContext();
  return <InnerModifierControl {...props} synths={synths} />;
}
