import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { isFieldRandomConfig } from '@src/keyboard/keySoundModifier';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { useCallback } from 'react';
import FieldRandomControl from './FieldRandomControl';
import { useModiferContext } from './ModifierContext';

export type SoundFieldPath = {
  synthId: string;
  nodeId: string;
  fieldPath: string[];
};

type RandomizationControlProps = {
  radomConfig: RandomizationConfig;
  onChange: (field: SoundFieldPath, config: FieldRandomConfig) => void;
  onClickInvalidField: (args: SoundFieldPath) => void;
  onClickAdd: () => void;
  selectingField: boolean;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
  onClickInvalidField,
  onClickAdd,
  selectingField,
}: RandomizationControlProps) {
  const { synths, removeRandomConfig } = useModiferContext();

  const renderField = useCallback(
    (props: RenderFieldProps<FieldRandomConfig>) => (
      <FieldRandomControl
        node={props.node}
        fieldPath={props.fieldPath}
        randomConfig={props.value}
        onChange={(config) => {
          onChange(props, config);
        }}
        onClickInvalidField={() => onClickInvalidField(props)}
        onClickRemove={() => removeRandomConfig(props)}
        showFixButton={!selectingField}
      />
    ),
    [onChange, onClickInvalidField, removeRandomConfig, selectingField],
  );

  return (
    <>
      <SoundStructure
        synths={synths}
        structure={radomConfig}
        renderField={renderField}
        shouldRenderField={isFieldRandomConfig}
      />
      {!selectingField && (
        <SectionHeader label='new'>
          <IconButton icon='add' onClick={onClickAdd} />
        </SectionHeader>
      )}
    </>
  );
}
