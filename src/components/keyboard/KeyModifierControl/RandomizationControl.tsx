import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { useCallback } from 'react';
import FieldRandomControl from './FieldRandomControl';
import { useModiferContext } from './ModifierContext';

export type OnClickInvalidFieldArgs = {
  synthId: string;
  nodeId: string;
  field: string;
};

type RandomizationControlProps = {
  radomConfig: RandomizationConfig;
  onChange: (randomConfig: RandomizationConfig) => void;
  onClickInvalidField: (args: OnClickInvalidFieldArgs) => void;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
  onClickInvalidField,
}: RandomizationControlProps) {
  const { synths } = useModiferContext();

  const renderField = useCallback(
    ({
      field,
      value,
      node,
      synthId,
      nodeId,
    }: RenderFieldProps<FieldRandomConfig>) => (
      <FieldRandomControl
        node={node}
        field={field}
        randomConfig={value}
        onChange={(config) => {
          onChange({
            [synthId]: {
              [nodeId]: {
                [field]: config,
              },
            },
          });
        }}
        onClickInvalidField={() =>
          onClickInvalidField({ synthId, nodeId, field })
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
