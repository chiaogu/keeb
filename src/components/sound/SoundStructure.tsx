import { SynthConfig, SynthNodeState } from '@src/synth';
import { typedMemo } from '@src/utils/utils';
import { Fragment, useMemo } from 'react';
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
    labelClassName={synth ? undefined : 'line-through'}
  />
);

function NodeHeader({ node }: { node?: SynthNodeState }): React.ReactNode {
  return (
    <SectionHeader
      className='ml-[8px]'
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
          last: boolean;
        },
      ): React.ReactNode => {
        const { fieldPath, value, level = 0, node, last } = props;
        const shouldRender = shouldRenderField(value);

        if (shouldRender) {
          const fieldNode = shouldRender
            ? renderField({ ...props, value })
            : null;
          return !fieldNode ? null : (
            <div className='mb-[2px] flex' key={fieldPath.join()}>
              <div
                style={{ paddingLeft: level * 8 }}
                className={
                  level
                    ? `${last ? 'h-8' : ''} border-l-2 border-dotted border-l-black`
                    : undefined
                }
              ></div>
              <div className='mb-[-2px] size-full'>{fieldNode}</div>
            </div>
          );
        }

        const nestedNodes = Object.entries(value)
          .map(([field, v], index) =>
            render({
              ...props,
              value: v,
              level: level + 1,
              fieldPath: [...fieldPath, field],
              last: index === Object.keys(value).length - 1,
            }),
          )
          .filter(Boolean);

        return nestedNodes.length === 0 ? null : (
          <Fragment key={fieldPath.join()}>
            <SectionHeader
              labelClassName={node ? '' : 'line-through'}
              // labelClassName={node ? '' : 'invert px-2'}
              label={fieldPath[fieldPath.length - 1]}
            />
            {nestedNodes}
          </Fragment>
        );
      };
      return render;
    }, [renderField, shouldRenderField]);

    return (
      <>
        {Object.entries(structure).map(([synthId, nodes]) => {
          const synth = synthMap[synthId];
          const synthChildrenNodes = Object.entries(nodes)
            .map(([nodeId, fields]) => {
              const node = nodeMap[synthId]?.[nodeId];
              const nodeChildrenNodes = Object.entries(fields)
                .map(([field, value], index) => {
                  const nestedFiledNodes = renderNestedField({
                    synth,
                    node,
                    fieldPath: [field],
                    value,
                    synthId,
                    nodeId,
                    last: index === Object.keys(fields).length - 1,
                  });
                  return !nestedFiledNodes ? null : (
                    <div
                      key={`${synthId}-${nodeId}-${field}`}
                      className='ml-[8px] border-l-2 border-dotted border-l-black pl-[8px]'
                    >
                      {nestedFiledNodes}
                    </div>
                  );
                })
                .filter((node) => node != null);
              return nodeChildrenNodes.length === 0 ? null : (
                <div
                  key={nodeId}
                  className='border-l-2 border-dotted border-l-black'
                >
                  {renderNodeHeader({ synth, node })}
                  {nodeChildrenNodes}
                </div>
              );
            })
            .filter(Boolean);
          return synthChildrenNodes.length === 0 ? null : (
            <div key={synthId} className='w-full'>
              {renderSynthHeader({ synth })}
              {synthChildrenNodes}
            </div>
          );
        })}
      </>
    );
  },
);

export default SoundStructure;
