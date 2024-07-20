import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  SoundStructureProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import {
  isModifierOp,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { SynthConfig, SynthNodeState } from '@src/synth';
import { isSoundFieldPathEqual } from '@src/utils/utils';
import { memo, useCallback, useState } from 'react';
import FieldModifier from './FieldModifer';
import { useModiferContext } from './ModifierContext';
import { SoundFieldPath } from './RandomizationControl';
import SoundFieldPicker from './SoundFieldPicker';

type ModifierControlProps = {
  soundName: string;
  modifier: SoundModifier;
  onChange?: (field: SoundFieldPath, modifier: ModifierOp) => void;
  onAdd?: (field: SoundFieldPath, node: SynthNodeState) => void;
  onFix?: (fixingField: SoundFieldPath, newField: SoundFieldPath) => void;
  onRemove?: (field: SoundFieldPath) => void;
};

const InnerModifierControl = memo(function ModifierControl({
  soundName,
  modifier,
  onChange,
  synths,
  onAdd,
  onFix,
  onRemove,
}: ModifierControlProps & { synths: SynthConfig[] }) {
  const [fixingField, setFixingField] = useState<SoundFieldPath>();
  const [selectingField, setSelectingField] = useState<'add' | 'fix' | false>(
    false,
  );

  const renderField: SoundStructureProps<ModifierOp>['renderField'] =
    useCallback(
      (props) => {
        return (
          <FieldModifier
            fieldPath={props.fieldPath}
            modifier={props.value}
            node={props.node}
            onChange={(value) => {
              onChange?.(props, value);
            }}
            onRemove={() => {
              onRemove?.(props);
            }}
            onClickInvalidField={() => {
              setSelectingField('fix');
              setFixingField(props);
            }}
            showFixButton={!selectingField}
            highlighted={
              !!fixingField && isSoundFieldPathEqual(fixingField, props)
            }
          />
        );
      },
      [fixingField, onChange, onRemove, selectingField],
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
            }}
          />
        </SectionHeader>
      )}
      {selectingField && (
        <SoundFieldPicker
          soundName={soundName}
          onSelect={(newField, node) => {
            console.log(selectingField, fixingField, newField);
            if (selectingField === 'fix' && fixingField) {
              onFix?.(fixingField, newField);
            }
            if (selectingField === 'add' && node) {
              onAdd?.(newField, node);
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
