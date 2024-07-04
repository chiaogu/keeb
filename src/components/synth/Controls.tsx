import Control from "./Control";
import { z } from "zod";
import { removeDefault } from "@src/utils/schema";
import { useMemo } from "react";
import { NodeControlConfig } from "@src/synth/config";

type ControlsProps<T extends z.ZodTypeAny> = {
  className?: string;
  schema: T;
  controls?: Partial<Record<string, NodeControlConfig>>;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  indent?: number;
};

export default function Controls<T extends z.ZodTypeAny>({
  className,
  schema,
  value,
  onChange,
  controls,
  indent = 0,
}: ControlsProps<T>) {
  const innerSchema = useMemo(() => removeDefault(schema), [schema]);

  if (!(innerSchema instanceof z.ZodObject)) {
    return null;
  }

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      {Object.entries(innerSchema.shape).map(([key, fieldSchema]) => (
        <Control
          key={key}
          name={key}
          value={value[key]}
          onChange={(v) =>
            onChange({
              ...value,
              [key]: v,
            })
          }
          schema={fieldSchema as z.ZodTypeAny}
          config={controls?.[key]}
          indent={indent}
        />
      ))}
    </div>
  );
}
