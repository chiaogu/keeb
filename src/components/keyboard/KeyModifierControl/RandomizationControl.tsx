import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
  SoundStructureField,
} from '@src/components/SoundStructureTree/SoundStructure';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { useCallback } from 'react';
import FieldRandomControl from './FieldRandomControl';
import { useModiferContext } from './ModifierContext';

function shouldRenderField(
  field: SoundStructureField<FieldRandomConfig>,
): field is FieldRandomConfig {
  return (
    typeof field === 'object' &&
    (field.max != null || field.min != null || field.options != null)
  );
}

export type SoundFieldPath = {
  synthId: string;
  nodeId: string;
  fieldPath: string[];
};

type RandomizationControlProps = {
  radomConfig: RandomizationConfig;
  onChange: (randomConfig: RandomizationConfig) => void;
  onClickInvalidField: (args: SoundFieldPath) => void;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
  onClickInvalidField,
}: RandomizationControlProps) {
  const { synths } = useModiferContext();

  const renderField = useCallback(
    ({
      fieldPath,
      value,
      node,
      synthId,
      nodeId,
    }: RenderFieldProps<FieldRandomConfig>) => (
      <FieldRandomControl
        node={node}
        field={fieldPath[fieldPath.length - 1]}
        randomConfig={value}
        onChange={(config) => {
          onChange({
            [synthId]: {
              [nodeId]: {
                [fieldPath[fieldPath.length - 1]]: config,
              },
            },
          });
        }}
        onClickInvalidField={() =>
          onClickInvalidField({ synthId, nodeId, fieldPath })
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
        shouldRenderField={shouldRenderField}
      />
      <SectionHeader label='new'>
        <IconButton
          icon='add'
          onClick={() => {
            onChange({
              [synths[0].id]: {
                [synths[0].src.id]: {
                  frequency: {
                    min: -0.3,
                    max: 0.3,
                  },
                },
              },
            });
          }}
        />
      </SectionHeader>
    </>
  );
}
