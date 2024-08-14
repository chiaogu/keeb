import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import { SoundStructureProps } from '@src/components/sound/SoundStructure';
import {
  isModifierOp,
  ModifierOp,
  SoundModifier,
} from '@src/keyboard/keySoundModifier';
import { SynthNodeState } from '@src/synth';
import { isSoundFieldPathEqual, splitCamelCase } from '@src/utils/utils';
import { memo, useCallback, useState } from 'react';
import KeyboardSoundStructure from '../KeyboardSoundStructure';
import FieldModifier from './FieldModifer';
import { SoundFieldPath } from './RandomizationControl';
import SoundFieldPicker from './SoundFieldPicker';

type ModifierControlProps = {
  soundName: string;
  modifier: SoundModifier;
  onChange?: (field: SoundFieldPath, modifier: ModifierOp) => void;
  onAdd?: (field: SoundFieldPath, node: SynthNodeState) => void;
  onFix?: (fixingField: SoundFieldPath, newField: SoundFieldPath) => void;
  onRemove?: (field: SoundFieldPath) => void;
  onRemoveKey?: () => void;
  keyCode: string;
};

const InnerModifierControl = memo(function ModifierControl({
  soundName,
  modifier,
  onChange,
  onAdd,
  onFix,
  onRemove,
  keyCode,
  onRemoveKey,
}: ModifierControlProps) {
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
    <div className='mb-4 flex w-full flex-col last:mb-0'>
      <SectionHeader className='font-bold' label={splitCamelCase(keyCode)}>
        {!selectingField && (
          <>
            <IconButton icon='remove' onClick={onRemoveKey} />
            <IconButton
              icon='add'
              onClick={() => {
                setSelectingField('add');
              }}
            />
          </>
        )}
        {selectingField && (
          <IconButton
            icon='close'
            onClick={() => {
              setSelectingField(false);
            }}
          />
        )}
      </SectionHeader>
      {selectingField && (
        <SoundFieldPicker
          excluded={modifier}
          soundName={soundName}
          onSelect={(newField, node) => {
            // TODO: Fix fixing functionaility
            if (selectingField === 'fix' && fixingField) {
              onFix?.(fixingField, newField);
            }
            if (selectingField === 'add' && node) {
              onAdd?.(newField, node);
            }
            setSelectingField(false);
            setFixingField(undefined);
          }}
        />
      )}
      {!selectingField && (
        <KeyboardSoundStructure
          structure={modifier}
          renderField={renderField}
          shouldRenderField={isModifierOp}
        />
      )}
    </div>
  );
});

export default function ModifierControl(props: ModifierControlProps) {
  return <InnerModifierControl {...props} />;
}
