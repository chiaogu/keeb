import { SynthConfig, SynthNodeState } from '@src/synth';
import { useMemo } from 'react';

export type SoundStructure<T> = {
  [synthId: string]: {
    [nodId: string]: {
      [field: string]: T;
    };
  };
};

export type RenderFieldProps<T> = {
  synth: SynthConfig;
  node: SynthNodeState;
  field: string;
  value: T;
};

export type SoundStructureProps<T> = {
  synths: SynthConfig[];
  structure: SoundStructure<T>;
  renderSynthHeader: (props: { synth?: SynthConfig }) => React.ReactNode;
  renderNodeHeader: (props: {
    synth?: SynthConfig,
    node?: SynthNodeState,
  }) => React.ReactNode;
  renderField: (props: RenderFieldProps<T>) => React.ReactNode;
};

export default function SoundStructure<T>({
  synths,
  structure,
  renderSynthHeader,
  renderNodeHeader,
  renderField,
}: SoundStructureProps<T>) {
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
              const node = nodeMap[synthId][nodeId];
              return (
                <div
                  key={nodeId}
                  className='border-l-2 border-dotted border-l-black'
                >
                  {renderNodeHeader({ synth, node })}
                  {Object.entries(fields).map(([field, value]) => (
                    <div
                      key={`${synthId}-${nodeId}-${field}`}
                      className='ml-[16px] border-l-2 border-dotted border-l-black pl-[8px]'
                    >
                      {renderField({ synth, node, field, value })}
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
}
