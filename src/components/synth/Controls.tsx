import { NodeControlConfig } from '@src/synth/config';
import { removeDefault } from '@src/utils/schema';
import { useMemo } from 'react';
import { z } from 'zod';
import Control from './Control';

type ControlsProps<T extends z.ZodTypeAny> = {
  className?: string;
  schema: T;
  controls?: Partial<Record<string, NodeControlConfig>>;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>, key: string) => void;
  indent?: number;
  onDrag?: () => void;
  onRelease?: () => void;
};

export default function Controls<T extends z.ZodTypeAny>({
  className,
  schema,
  value,
  onChange,
  controls,
  indent = 0,
  onDrag,
  onRelease,
}: ControlsProps<T>) {
  const innerSchema = useMemo(() => removeDefault(schema), [schema]);
  const fields = useMemo(
    () =>
      innerSchema instanceof z.ZodObject
        ? Object.entries(innerSchema.shape)
        : null,
    [innerSchema],
  );

  if (!fields) {
    return null;
  }

  return (
    <div
      className={`flex w-full flex-col items-center ${className} ${indent > 0 ? 'mb-2 border-l-2 border-dotted border-l-black' : ''}`}
    >
      {fields.map(([key, fieldSchema], index) => (
        <div className={`w-full ${index === fields.length - 1 ? '' : 'mb-2'}`}>
          <Control
            key={key}
            name={key}
            value={value[key]}
            onChange={(v) =>
              onChange(
                {
                  ...value,
                  [key]: v,
                },
                key,
              )
            }
            schema={fieldSchema as z.ZodTypeAny}
            config={controls?.[key]}
            indent={indent}
            onDrag={onDrag}
            onRelease={onRelease}
          />
        </div>
      ))}
    </div>
  );
}
