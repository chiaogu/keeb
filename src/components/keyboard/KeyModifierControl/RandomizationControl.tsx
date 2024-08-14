import { RenderFieldProps } from '@src/components/sound/SoundStructure';
import { isFieldRandomConfig } from '@src/keyboard/keySoundModifier';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { isSoundFieldPathEqual } from '@src/utils/utils';
import { useCallback } from 'react';
import KeyboardSoundStructure from '../KeyboardSoundStructure';
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
  selectingField: boolean;
  selectedField?: SoundFieldPath;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
  onClickInvalidField,
  selectingField,
  selectedField,
}: RandomizationControlProps) {
  const { removeRandomConfig } = useModiferContext();

  const renderField = useCallback(
    (props: RenderFieldProps<FieldRandomConfig>) => {
      return (
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
          highlighted={
            !!selectedField && isSoundFieldPathEqual(selectedField, props)
          }
        />
      );
    },
    [
      onChange,
      onClickInvalidField,
      removeRandomConfig,
      selectedField,
      selectingField,
    ],
  );

  return (
    <KeyboardSoundStructure
      structure={radomConfig}
      renderField={renderField}
      shouldRenderField={isFieldRandomConfig}
    />
  );
}
