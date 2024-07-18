import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { useCallback } from 'react';
import FieldRandomControl from './FieldRandomControl';
import { useModiferContext } from './ModifierContext';
import { isFieldRandomConfig } from '@src/keyboard/keySoundModifier';

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
};

export default function RandomizationControl({
  radomConfig,
  onChange,
  onClickInvalidField,
  onClickAdd,
}: RandomizationControlProps) {
  const { synths } = useModiferContext();

  const renderField = useCallback(
    (props: RenderFieldProps<FieldRandomConfig>) => (
      <FieldRandomControl
        node={props.node}
        field={props.fieldPath[props.fieldPath.length - 1]}
        randomConfig={props.value}
        onChange={(config) => {
          onChange(props, config);
        }}
        onClickInvalidField={() =>
          onClickInvalidField(props)
        }
      />
    ),
    [onChange, onClickInvalidField],
  );

  return (
    <>
      <SoundStructure
        synths={synths}
        structure={radomConfig}
        renderField={renderField}
        shouldRenderField={isFieldRandomConfig}
      />
      <SectionHeader label='new'>
        <IconButton
          icon='add'
          onClick={onClickAdd}
        />
      </SectionHeader>
    </>
  );
}
