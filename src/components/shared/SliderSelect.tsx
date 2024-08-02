import { scale } from '@src/utils/utils';
import { useEffect, useMemo, useState } from 'react';
import SliderBase, { SliderBaseProps } from './SliderBase';

type SliderSelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
} & Pick<SliderBaseProps, 'indent' | 'onDrag' | 'onRelease'>;

function easeInOutCirc(x: number, hardness: number = 2): number {
  return x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, hardness))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, hardness)) + 1) / 2;
}

function ease(value: number, optionElementWidths: number[]) {
  const lower = optionElementWidths[Math.floor(value)];
  const upper = optionElementWidths[Math.floor(value) + 1];
  const normalInRange = easeInOutCirc(value % 1, 3);
  const easedValue = scale(normalInRange, 0, 1, lower, upper);

  const currentWidth = upper - lower;
  const nextWidth =
    optionElementWidths[
      Math.min(optionElementWidths.length - 1, Math.floor(value) + 2)
    ] - upper;
  const easedWidth = scale(normalInRange, 0, 1, currentWidth, nextWidth);

  return { value: easedValue, width: easedWidth };
}

export default function SliderSelect({
  label,
  options,
  value,
  onChange,
  indent,
}: SliderSelectProps) {
  const [sliderValue, setSliderValue] = useState(options.indexOf(value));
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { scrollWidth, clientWidth } = useMemo(() => {
    const { scrollWidth = 0, clientWidth = 0 } = container ?? {};
    return { scrollWidth, clientWidth };
  }, [container]);

  const scrollX = useMemo(() => {
    return !container ? 0 : scrollWidth - clientWidth;
  }, [clientWidth, container, scrollWidth]);

  const eased = useMemo(() => {
    const widths = Array.from(
      container?.querySelectorAll('.slider-option') ?? [],
    ).map(({ clientWidth }) => clientWidth);
    const widthSum = widths.reduce((sum, w) => sum + w, 0);

    let normalSum = 0;
    const normalWidths: number[] = [0];
    widths.forEach((w) => {
      normalSum += w / widthSum;
      normalWidths.push(normalSum);
    });

    return ease(sliderValue, normalWidths);
  }, [container, sliderValue]);

  useEffect(() => {
    if (options.indexOf(value) !== Math.round(sliderValue)) {
      setSliderValue(options.indexOf(value));
    }
  }, [options, sliderValue, value]);

  return (
    <SliderBase
      sensitivity={1.2}
      indent={indent}
      value={sliderValue}
      max={options.length - 1}
      min={0}
      onChange={(v) => {
        setSliderValue(v);
        if (options.indexOf(value) !== Math.round(v)) {
          onChange(options[Math.round(v)]);
        }
      }}
      render={({ normalValue, dragging }) => {
        const normalScrollOffset = Math.max(
          0,
          Math.min(1, normalValue * 1.8 - 0.4),
        );
        return (
          <div className='relative flex size-full justify-between overflow-hidden'>
            <div className='flex h-full items-center justify-between bg-white pl-2 pr-4'>
              {label}
            </div>
            <div className='h-full overflow-hidden' ref={setContainer}>
              <div
                className='relative flex h-full w-fit bg-white '
                style={{
                  transform: `translateX(-${scrollX * normalScrollOffset}px)`,
                }}
              >
                {options.map((option) => (
                  <div
                    key={option}
                    className='slider-option flex h-full items-center text-clip px-4'
                    style={{
                      color: dragging ? 'black' : 'transparent',
                      transition: 'color 0.1s',
                    }}
                  >
                    {option}
                  </div>
                ))}
                <div
                  style={{
                    width: '100px',
                    left: `${(scrollWidth ?? 0) * eased.value}px`,
                    transform: `scaleX(${(scrollWidth ?? 0) * eased.width}%)`,
                    transformOrigin: '0 0',
                  }}
                  className='absolute left-0 top-0 h-full w-16 bg-white mix-blend-difference'
                ></div>
              </div>
            </div>
            <div
              style={{ opacity: dragging ? 0 : 1, transition: 'opacity 0.1s' }}
              className='absolute right-2 top-0 flex h-full items-center text-white mix-blend-difference'
            >
              {value}
            </div>
          </div>
        );
      }}
    />
  );
}
