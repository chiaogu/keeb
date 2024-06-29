import { ChangeEvent, useCallback, useMemo } from "react";

type SliderProps = {
  label: string;
  value: number;
  max: number;
  min: number;
  step?: number;
  onChange: (v: number) => void;
};

const RESOLUTION = 100000;

export default function Slider({
  label,
  value,
  onChange,
  step,
  max,
  min,
}: SliderProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) / RESOLUTION;
      const denormalizedNewValue = min + (max - min) * newValue;
      onChange(denormalizedNewValue);
    },
    [max, min, onChange],
  );

  const normalizedValue = useMemo(() => {
    return (value - min) / (max - min);
  }, [max, min, value]);

  const normalizedStep = useMemo(() => {
    if (step === undefined) return undefined;
    return step / (max - min);
  }, [max, min, step]);

  return (
    <div className="flex w-full">
      <label className="w-32 shrink-0">
        {label}
      </label>
      <div className="flex flex-auto items-center">
        <input
          className="w-full"
          type="range"
          min="0"
          max={RESOLUTION}
          step={normalizedStep ? normalizedStep * RESOLUTION : undefined}
          value={normalizedValue * RESOLUTION}
          onChange={handleChange}
        />
        <div className="w-1/5 text-end">
          {(normalizedValue * 100).toFixed()}%
        </div>
      </div>
    </div>
  );
}
