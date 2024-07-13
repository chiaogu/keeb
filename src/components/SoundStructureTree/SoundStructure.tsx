export type SoundStructure<T> = {
  [synthId: string]: {
    [nodId: string]: {
      [field: string]: T;
    };
  };
};

export type RenderFieldProps<T> = {
  synthId: string;
  nodeId: string;
  field: string;
  value: T;
};

export type SoundStructureProps<T> = {
  structure: SoundStructure<T>;
  synthHeader: (props: { synthId: string }) => React.ReactNode;
  nodeHeader: (props: { synthId: string; nodeId: string }) => React.ReactNode;
  renderField: (props: RenderFieldProps<T>) => React.ReactNode;
};

export default function SoundStructure<T>({
  structure,
  synthHeader,
  nodeHeader,
  renderField,
}: SoundStructureProps<T>) {
  return (
    <>
      {Object.entries(structure).map(([synthId, nodes]) => (
        <div key={synthId} className='w-full'>
          {synthHeader({ synthId })}
          {Object.entries(nodes).map(([nodeId, fields]) => (
            <div
              key={nodeId}
              className='border-l-2 border-dotted border-l-black'
            >
              {nodeHeader({ synthId, nodeId })}
              {Object.entries(fields).map(([field, value]) => (
                <div
                  key={`${synthId}-${nodeId}-${field}`}
                  className='ml-[16px] border-l-2 border-dotted border-l-black pl-[8px]'
                >
                  {renderField({ synthId, nodeId, field, value })}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
