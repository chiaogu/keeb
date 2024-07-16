import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure, {
  RenderFieldProps,
} from '@src/components/SoundStructureTree/SoundStructure';
import { SynthConfig, SynthNodeState } from '@src/synth';
import { FieldRandomConfig, RandomizationConfig } from '@src/types';
import { useCallback } from 'react';
import FieldRandomControl from './FieldRandomControl';
import { useModiferContext } from './ModifierContext';

const SynthHeader = ({ synth }: { synth?: SynthConfig }) => (
  <SectionHeader label={synth?.name ?? 'missing sound layer'} />
);

function NodeHeader({ node }: { node?: SynthNodeState }): React.ReactNode {
  return (
    <SectionHeader
      className='ml-[16px]'
      label={node?.type ?? 'missing synth node'}
    />
  );
}

type RandomizationControlProps = {
  radomConfig: RandomizationConfig;
  onChange: (randomConfig: RandomizationConfig) => void;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
}: RandomizationControlProps) {
  const { synths } = useModiferContext();

  const renderField = useCallback(
    ({ synth, field, value, node }: RenderFieldProps<FieldRandomConfig>) => (
      <FieldRandomControl
        node={node}
        field={field}
        randomConfig={value}
        onChange={(config) => {
          onChange({
            [synth.id]: {
              [node.id]: {
                [field]: config,
              },
            },
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
        structure={radomConfig}
        renderSynthHeader={SynthHeader}
        renderNodeHeader={NodeHeader}
        renderField={renderField}
      />
      <IconButton
        className='mb-4 ml-[-11px] self-start'
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
    </>
  );
}
