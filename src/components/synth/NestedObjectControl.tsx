import { Noise } from "@src/synth/config/noise";
import Control from "./Control";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NestedObjectControlProps<T extends z.ZodObject<any>> = {
  schema: T;
  label: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NestedObjectControl<T extends z.ZodObject<any>>({
  label,
  schema,
  value,
  onChange,
}: NestedObjectControlProps<T>) {
  return (
    <div className="mt-4 flex w-full flex-col items-center">
      <div className="flex w-full">
        <label className="w-32 shrink-0">{label}</label>
      </div>
      {Object.entries(schema.shape).map(([key, fieldSchema]) => (
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
        />
      ))}
    </div>
  );
}
