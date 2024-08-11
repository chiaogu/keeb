import { CONTROL_SHADOW } from '@src/utils/constants';
import { useEffect, useMemo, useState } from 'react';
import SliderBase, { SliderBaseProps } from './SliderBase';
import { useResizeDetector } from 'react-resize-detector';

type SliderProps = {
  label: string;
  offsetMode?: boolean;
  renderValue?: (normalizedValue: number) => React.ReactNode;
} & Omit<SliderBaseProps, 'render'>;

export default function Slider({
  label,
  renderValue = (v) => `${(v * 100).toFixed()}%`,
  offsetMode,
  ...sliderProps
}: SliderProps) {
  const { width = 0, ref } = useResizeDetector<HTMLDivElement>();
  const [firstRender, setFirstRender] = useState(true);
  const { value, min, max } = sliderProps;

  const [offserValue, normalOffsetZero] = useMemo(
    () => [
      value / (max - min),
      Math.abs(min) / (max - min)
    ],
    [max, min, value],
  );

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
    <SliderBase
      className='h-8'
      {...sliderProps}
      sensitivity={1.2}
      render={({ dragging, normalValue }) => (
        <div
          style={{
            boxShadow: CONTROL_SHADOW,
          }}
          className='size-full bg-white'
          ref={ref}
        >
          <div
            style={{
              transform: `scaleX(${firstRender ? 0 : (offsetMode ? offserValue : normalValue) * 100}%)`,
              transition: dragging ? undefined : 'transform 0.15s',
              marginLeft: offsetMode ? `${width * normalOffsetZero}px` : undefined,
            }}
            className='size-full origin-left bg-black'
          ></div>
          <div
            style={{ transform: 'translateY(-50%)' }}
            className='absolute left-2 top-1/2 bg-black text-white mix-blend-difference'
          >
            {label}
          </div>
          <div
            style={{ transform: 'translateY(-50%)' }}
            className='absolute right-2 top-1/2 text-white mix-blend-difference'
          >
            {renderValue(offsetMode ? offserValue : normalValue)}
          </div>
        </div>
      )}
    />
  );
}
