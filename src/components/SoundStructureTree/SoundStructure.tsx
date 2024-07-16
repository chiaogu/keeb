import { SynthConfig, SynthNodeState } from '@src/synth';
import { typedMemo } from '@src/utils/utils';
import { useMemo } from 'react';
import SectionHeader from '../shared/SectionHeader';

export type SoundStructure<T> = {
  [synthId: string]: {
    [nodId: string]: {
      [field: string]: T;
    };
  };
};

export type RenderFieldProps<T> = {
  synth?: SynthConfig;
  node?: SynthNodeState;
  field: string;
  value: T;
  synthId: string;
  nodeId: string;
};

export type SoundStructureProps<T> = {
  synths: SynthConfig[];
  structure: SoundStructure<T>;
  renderSynthHeader?: (props: { synth?: SynthConfig }) => React.ReactNode;
  renderNodeHeader?: (props: {
    synth?: SynthConfig;
    node?: SynthNodeState;
  }) => React.ReactNode;
  renderField: (props: RenderFieldProps<T>) => React.ReactNode;
};

const SynthHeader = ({ synth }: { synth?: SynthConfig }) => (
  <SectionHeader
    label={synth?.name ?? 'unknown'}
    labelClassName={synth ? undefined : 'invert px-2'}
  />
);

function NodeHeader({ node }: { node?: SynthNodeState }): React.ReactNode {
  return (
    <SectionHeader
      className='ml-[16px]'
      labelClassName={node ? '' : 'invert px-2'}
      label={node?.type ?? 'unknown'}
    />
  );
}

const SoundStructure = typedMemo(
  <T,>({
    synths,
    structure,
    renderSynthHeader = SynthHeader,
    renderNodeHeader = NodeHeader,
    renderField,
  }: SoundStructureProps<T>) => {
    const synthMap = useMemo(() => {
      const result: Record<string, SynthConfig> = {};
      return synths.reduce(
        (acc, synth) => ({ ...acc, [synth.id]: synth }),
        result,
      );
    }, [synths]);

    const nodeMap = useMemo(() => {
      const result: Record<string, Record<string, SynthNodeState>> = {};
      return synths.reduce(
        (acc, synth) => ({
          ...acc,
          [synth.id]: [synth.src, ...synth.fxs].reduce(
            (nodeAcc, node) => ({
              ...nodeAcc,
              [node.id]: node,
            }),
            {},
          ),
        }),
        result,
      );
    }, [synths]);

    return (
      <>
        {Object.entries(structure).map(([synthId, nodes]) => {
          const synth = synthMap[synthId];
          return (
            <div key={synthId} className='w-full'>
              {renderSynthHeader({ synth })}
              {Object.entries(nodes).map(([nodeId, fields]) => {
                const node = nodeMap[synthId]?.[nodeId];
                return (
                  <div
                    key={nodeId}
                    className='border-l-2 border-dotted border-l-black'
                  >
                    {renderNodeHeader({ synth, node })}
                    {Object.entries(fields).map(([field, value]) => (
                      <div
                        key={`${synthId}-${nodeId}-${field}`}
                        className='ml-[16px] border-l-2 border-dotted border-l-black pl-[14px]'
                      >
                        {renderField({
                          synth,
                          node,
                          field,
                          value,
                          synthId,
                          nodeId,
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    );
  },
);

export default SoundStructure;
