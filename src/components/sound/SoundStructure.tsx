import { SynthConfig, SynthNodeState } from '@src/synth';
import { typedMemo } from '@src/utils/utils';
import { useMemo } from 'react';
import SectionHeader from '../shared/SectionHeader';

export type SoundStructureField<T> = T | { [nestedField: string]: T };

export type SoundStructure<T> = {
  [synthId: string]: {
    [nodId: string]: {
      [field: string]: SoundStructureField<T>;
    };
  };
};

export type RenderFieldProps<T> = {
  synth?: SynthConfig;
  node?: SynthNodeState;
  fieldPath: string[];
  value: T;
  synthId: string;
  nodeId: string;
};

type RenderNestedFieldProps<T> = Omit<RenderFieldProps<T>, 'value'> & {
  value: SoundStructureField<T>;
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
  shouldRenderField: (field: SoundStructureField<T>) => field is T;
};

const SynthHeader = ({ synth }: { synth?: SynthConfig }) => (
  <SectionHeader
    label={synth?.name ?? 'unknown'}
    // labelClassName={synth ? undefined : 'invert px-2'}
    labelClassName={synth ? undefined : 'line-through'}
  />
);

function NodeHeader({ node }: { node?: SynthNodeState }): React.ReactNode {
  return (
    <SectionHeader
      className='ml-[8px]'
      // labelClassName={node ? '' : 'invert px-2'}
      labelClassName={node ? '' : 'line-through'}
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
    shouldRenderField,
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

    const renderNestedField = useMemo(() => {
      const render = (
        props: RenderNestedFieldProps<T> & {
          level?: number;
        },
      ) => {
        const { fieldPath, value, level = 0, node } = props;
        
        return (
          <div
            key={fieldPath.join()}
            style={{ paddingLeft: level * 8 }}
            className={
              level ? 'border-l-2 border-dotted border-l-black' : undefined
            }
          >
            {shouldRenderField(value) && (
              <>{renderField({ ...props, value })}</>
            )}
            {!shouldRenderField(value) && (
              <>
                <SectionHeader
                  labelClassName={node ? '' : 'line-through'}
                  // labelClassName={node ? '' : 'invert px-2'}
                  label={fieldPath[fieldPath.length - 1]}
                />
                {
                  Object.entries(value).map(([field, v]) =>
                    render({
                      ...props,
                      value: v,
                      level: level + 1,
                      fieldPath: [...fieldPath, field],
                    }),
                  )
                }
              </>
            )}
          </div>
        );
      };
      return render;
    }, [renderField, shouldRenderField]);

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
                        className='ml-[8px] border-l-2 border-dotted border-l-black pl-[8px]'
                      >
                        {renderNestedField({
                          synth,
                          node,
                          fieldPath: [field],
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
