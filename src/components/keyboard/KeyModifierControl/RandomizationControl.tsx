import IconButton from '@src/components/shared/IconButton';
import ReadOnly from '@src/components/shared/ReadOnly';
import SectionHeader from '@src/components/shared/SectionHeader';
import SoundStructure from '@src/components/SoundStructureTree/SoundStructure';
import { RandomizationConfig } from '@src/types';
import FieldRandomControl from './FieldRandomControl';
import { useModiferContext } from './ModifierContext';

type RandomizationControlProps = {
  radomConfig: RandomizationConfig;
  onChange: (randomConfig: RandomizationConfig) => void;
};

export default function RandomizationControl({
  radomConfig,
  onChange,
}: RandomizationControlProps) {
  const { synths } = useModiferContext();
  return (
    <>
      <SoundStructure
        synths={synths}
        structure={radomConfig}
        renderSynthHeader={({ synth }) => (
          <SectionHeader label={synth?.name ?? 'missing sound layer'} />
        )}
        renderNodeHeader={({ node }) => (
          <ReadOnly
            indent={2}
            label={node?.type ?? 'missing synth node'}
            value=''
          />
        )}
        renderField={({ synth, field, value, node }) => (
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
        )}
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
