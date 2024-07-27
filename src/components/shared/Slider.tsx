import { ChangeEvent, useCallback, useMemo } from 'react';

type SliderProps = {
  label: string;
  value: number;
  max: number;
  min: number;
  step?: number;
  indent?: number;
  onChange: (v: number) => void;
  renderValue?: (normalizedValue: number) => React.ReactNode;
};

const RESOLUTION = 100000;

export default function Slider({
  value,
  onChange,
  step,
  max,
  min,
  renderValue = (v) => `${(v * 100).toFixed()}%`,
  indent = 0,
  label,
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
    <div
      className='relative mb-2 flex h-8 w-full items-center'
      style={{
        marginLeft: Math.max(0, indent ?? 0) * 8,
      }}
    >
      <input
        className='size-full opacity-0'
        type='range'
        min='0'
        max={RESOLUTION}
        step={normalizedStep ? normalizedStep * RESOLUTION : undefined}
        value={normalizedValue * RESOLUTION}
        onChange={handleChange}
      />
      <div className='pointer-events-none absolute top-0 size-full bg-white'>
        <div
          style={{
            width: `${normalizedValue * 100}%`,
          }}
          className='h-full bg-black'
        ></div>
        <div
          style={{ transform: 'translateY(-50%)' }}
          className='absolute left-1 top-1/2 text-white bg-black mix-blend-difference'
        >
          {label}
        </div>
        <div
          style={{ transform: 'translateY(-50%)' }}
          className='absolute right-1 top-1/2 text-white mix-blend-difference'
        >
          {renderValue(normalizedValue)}
        </div>
      </div>
    </div>
  );
}
