import { ChangeEvent, useCallback, useMemo } from "react";

type SliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

const RESOLUTION = 100000;

export default function Slider({ label, value, onChange }: SliderProps) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value) / RESOLUTION);
  }, [onChange]);
  
  return (
    <div className="flex justify-between w-full">
      <label className="w-1/4">{label}</label>
      <input
        className="w-1/2"
        type="range"
        name="volume"
        min="0"
        max={RESOLUTION}
        value={value * RESOLUTION}
        onChange={handleChange}
      />
      <div className="w-1/5 text-end">{value.toFixed(3)}</div>
    </div>
  );
}
