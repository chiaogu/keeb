import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { isFieldRandomConfig } from '@src/keyboard/keySoundModifier';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { isSoundFieldPathEqual } from '@src/utils/utils';
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
  selectedField?: SoundFieldPath;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
  onClickInvalidField,
  onClickAdd,
  selectingField,
  selectedField,
}: RandomizationControlProps) {
  const { synths, removeRandomConfig } = useModiferContext();

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
    <div className='mt-4 w-full'>
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
    </div>
  );
}
