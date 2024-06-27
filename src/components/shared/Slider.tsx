import { ChangeEvent, useCallback } from "react";

type SliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
};

const RESOLUTION = 100000;

export default function Slider({ label, value, onChange, step }: SliderProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value) / RESOLUTION);
    },
    [onChange],
  );

  return (
    <div className="flex w-full">
      <label className="w-32 shrink-0">{label}</label>
      <div className="flex flex-auto items-center">
        <input
          className="w-full"
          type="range"
          name="volume"
          min="0"
          max={RESOLUTION}
          step={step ? step * RESOLUTION : undefined}
          value={value * RESOLUTION}
          onChange={handleChange}
        />
        <div className="w-1/5 text-end">{(value * 100).toFixed()}%</div>
      </div>
    </div>
  );
}
