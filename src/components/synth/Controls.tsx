import Control from "./Control";
import { z } from "zod";
import { removeDefault } from "@src/utils/schema";
import { useMemo } from "react";
import { NodeControlConfig } from "@src/synth/config";

type ControlsProps<T extends z.ZodTypeAny> = {
  className?: string;
  schema: T;
  controls?: Partial<Record<string, NodeControlConfig>>;
  label?: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

export default function Controls<T extends z.ZodTypeAny>({
  className,
  label,
  schema,
  value,
  onChange,
  controls,
}: ControlsProps<T>) {
  const innerSchema = useMemo(() => removeDefault(schema), [schema]);

  if (!(innerSchema instanceof z.ZodObject)) {
    return null;
  }

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      {label && (
        <div className="mt-4 flex w-full">
          <label className="w-32 shrink-0">{label}</label>
        </div>
      )}
      {Object.entries(innerSchema.shape).map(([key, fieldSchema]) => (
        <Control
          key={`${label}-${key}`}
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
        />
      ))}
    </div>
  );
}
