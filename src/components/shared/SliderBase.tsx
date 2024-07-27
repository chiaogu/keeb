import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';

export type SliderBaseProps = {
  value: number;
  max: number;
  min: number;
  step?: number;
  indent?: number;
  onChange: (v: number) => void;
  render: (props: { normalValue: number; dragging: boolean }) => ReactNode;
};

const RESOLUTION = 100000;

export default function SliderBase({
  value,
  onChange,
  step,
  max,
  min,
  indent = 0,
  render,
}: SliderBaseProps) {
  const [dragging, setDragging] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) / RESOLUTION;
      const denormalizedNewValue = min + (max - min) * newValue;
      onChange(denormalizedNewValue);
    },
    [max, min, onChange],
  );

  const normalValue = useMemo(() => {
    return (value - min) / (max - min);
  }, [max, min, value]);

  const normalStep = useMemo(() => {
    if (step === undefined) return undefined;
    return step / (max - min);
  }, [max, min, step]);

  const handleMouseDown = useCallback(() => {
    setDragging(true);
    addEventListener('mouseup', () => setDragging(false), { once: true });
  }, []);

  return (
    <div
      className='relative mb-2 flex h-8 w-full items-center'
      style={{
        marginLeft: Math.max(0, indent ?? 0) * 8,
      }}
      onMouseDown={handleMouseDown}
    >
      <input
        className='size-full opacity-0'
        type='range'
        min='0'
        max={RESOLUTION}
        step={normalStep ? normalStep * RESOLUTION : undefined}
        value={normalValue * RESOLUTION}
        onChange={handleChange}
      />
      <div className='pointer-events-none absolute top-0 size-full bg-white'>
        {render({ normalValue, dragging })}
      </div>
    </div>
  );
}
