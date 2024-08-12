import { CONTROL_SHADOW } from '@src/utils/constants';
import { scale } from '@src/utils/utils';
import { CSSProperties, useEffect, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import SliderBase from './SliderBase';

type SliderRangeProps = {
  label: string;
  max: number;
  min: number;
  lower: number;
  upper: number;
  onLowerChange: (v: number) => void;
  onUpperChange: (v: number) => void;
  background?: string;
};

function OneSideSlider({
  value,
  onChange,
  style,
}: {
  value: number;
  onChange: (v: number) => void;
  style: CSSProperties;
}) {
  return (
    <div className='absolute size-full origin-left' style={style}>
      <SliderBase
        className='h-full'
        min={0}
        max={1}
        value={value}
        sensitivity={1.1}
        onChange={onChange}
        render={() => null}
      />
    </div>
  );
}

export default function SliderRange({
  label,
  max,
  min,
  lower,
  upper,
  onLowerChange,
  onUpperChange,
  background = 'black',
}: SliderRangeProps) {
  const { width = 0, ref } = useResizeDetector<HTMLDivElement>();
  const [firstRender, setFirstRender] = useState(true);
  const normalLower = scale(lower, min, max, 0, 1);
  const normalUpper = scale(upper, min, max, 0, 1);
  const center = normalLower + (normalUpper - normalLower) / 2;

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
    <div
      style={{
        boxShadow: CONTROL_SHADOW,
      }}
      className='relative flex size-full h-8 bg-white'
      ref={ref}
    >
      <OneSideSlider
        style={{ transform: `scaleX(${center * 100}%)` }}
        value={normalLower}
        onChange={(v) => {
          onLowerChange(min + Math.min(v, normalUpper) * (max - min));
        }}
      />
      <OneSideSlider
        style={{
          transform: `scaleX(${(1 - center) * 100}%)`,
          left: `${width * center}px`,
        }}
        value={normalUpper}
        onChange={(v) => {
          onUpperChange(min + Math.max(v, normalLower) * (max - min));
        }}
      />
      <div
        style={{
          transform: `scaleX(${firstRender ? 0 : Math.max(0.5, (normalUpper - normalLower) * 100)}%)`,
          left: `${width * (normalLower / 2 - (1 - normalUpper) / 2)}px`,
          background,
        }}
        className='pointer-events-none absolute size-full bg-black'
      ></div>
      <div className='pointer-events-none absolute left-0 top-0 flex size-full justify-between px-2 mix-blend-difference'>
        <div className='flex h-full items-center text-white'>
          {label}
        </div>
        <div className='flex h-full items-center text-white'>
          {lower === upper
            ? `${Math.round(lower * 100)}%`
            : `${Math.round(lower * 100)}% — ${Math.round(upper * 100)}%`}
        </div>
      </div>
    </div>
  );
}
