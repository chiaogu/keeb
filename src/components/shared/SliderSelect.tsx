import { CONTROL_SHADOW } from '@src/utils/constants';
import { scale } from '@src/utils/utils';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import SliderBase, { SliderBaseProps } from './SliderBase';

type SliderSelectProps = {
  label: string;
  options: readonly (string | { value: string; label: ReactNode })[];
  value: string;
  onChange: (value: string) => void;
  onRelease: (value: string) => void;
  showOptions?: boolean;
  bgColor?: string;
  bgStyle?: React.CSSProperties;
  indicatorStyle?: React.CSSProperties;
} & Pick<SliderBaseProps, 'indent' | 'onDrag' | 'sensitivity'>;

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

function getOptionValue(option: SliderSelectProps['options'][number]) {
  return typeof option === 'string' ? option : option.value;
}

function findOptionIndex(options: SliderSelectProps['options'], value: string) {
  return options.findIndex((o) => getOptionValue(o) === value);
}

export function ControlSliderSelect(props: SliderSelectProps) {
  return (
    <div className='mb-2 h-8 w-full'>
      <SliderSelect
        {...props}
        bgColor='white'
        bgStyle={{
          boxShadow: CONTROL_SHADOW,
        }}
        indicatorStyle={{
          background: 'white',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
}

export default function SliderSelect({
  label,
  options,
  value,
  onChange,
  indent,
  showOptions,
  sensitivity = 1.2,
  bgColor,
  bgStyle,
  indicatorStyle,
  onDrag,
  onRelease,
}: SliderSelectProps) {
  const [sliderValue, setSliderValue] = useState(
    findOptionIndex(options, value),
  );
  const { width: clientWidth, ref } = useResizeDetector<HTMLDivElement>();

  const { scrollWidth, scrollX } = useMemo(() => {
    const scrollWidth = ref.current?.scrollWidth ?? 0;
    return {
      scrollWidth,
      scrollX: Math.max(0, scrollWidth - (clientWidth ?? 0)),
    };
  }, [clientWidth, ref]);

  const eased = useMemo(() => {
    const widths = Array.from(
      ref.current?.querySelectorAll('.slider-option') ?? [],
    ).map(({ clientWidth }) => clientWidth);
    const widthSum = widths.reduce((sum, w) => sum + w, 0);

    let normalSum = 0;
    const normalWidths: number[] = [0];
    widths.forEach((w) => {
      normalSum += w / widthSum;
      normalWidths.push(normalSum);
    });

    return ease(sliderValue, normalWidths);
    // clientWidth is requqired to trigger recalcuate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, sliderValue, clientWidth]);

  const handleRelease = useCallback(() => {
    const newValue = Math.round(sliderValue);
    setSliderValue(newValue);
    onRelease?.(getOptionValue(options[newValue]));
  }, [onRelease, options, sliderValue]);

  useEffect(() => {
    const index = findOptionIndex(options, value);
    if (index !== Math.round(sliderValue)) {
      setSliderValue(index);
    }
  }, [options, sliderValue, value]);

  return (
    <SliderBase
      className='h-full'
      sensitivity={sensitivity}
      indent={indent}
      value={sliderValue}
      max={options.length - 1}
      min={0}
      onChange={(v) => {
        setSliderValue(v);
        if (findOptionIndex(options, value) !== Math.round(v)) {
          onChange(getOptionValue(options[Math.round(v)]));
        }
      }}
      onDrag={onDrag}
      onRelease={handleRelease}
      render={({ normalValue, dragging }) => {
        const normalScrollOffset = Math.max(
          0,
          Math.min(1, normalValue * 1.8 - 0.4),
        );
        return (
          <div
            style={{
              ...bgStyle,
              background: bgColor,
            }}
            className='relative flex size-full justify-between overflow-hidden'
          >
            <div
              style={{
                background: bgColor,
              }}
              className={`flex h-full items-center justify-between ${label ? 'pl-2 pr-4' : ''}`}
            >
              {label}
            </div>
            <div className='h-full overflow-hidden' ref={ref}>
              <div
                className='relative flex h-full w-fit'
                style={{
                  transform: `translateX(-${scrollX * normalScrollOffset}px)`,
                  transition: !dragging
                    ? 'transform 0.15s ease-out'
                    : undefined,
                  background: bgColor,
                }}
              >
                {options.map((option) => (
                  <div
                    key={getOptionValue(option)}
                    className='slider-option flex h-full items-center text-clip px-4'
                    style={{
                      opacity: showOptions || dragging ? 1 : 0,
                      transition: 'opacity 0.1s',
                    }}
                    onClick={() => {
                      if (!showOptions) {
                        return;
                      }
                      const optionValue = getOptionValue(option);
                      onChange(optionValue);
                      onRelease?.(optionValue);
                    }}
                  >
                    {typeof option === 'string' ? option : option.label}
                  </div>
                ))}
                <div
                  style={{
                    width: '100px',
                    left: `${(scrollWidth ?? 0) * eased.value}px`,
                    transform: `scaleX(${(scrollWidth ?? 0) * eased.width}%)`,
                    transformOrigin: '0 0',
                    transition: !dragging
                      ? 'transform 0.15s ease-out, left 0.15s ease-out'
                      : undefined,
                    ...indicatorStyle,
                  }}
                  className='pointer-events-none absolute left-0 top-0 h-full w-16'
                ></div>
              </div>
            </div>
            <div
              style={{
                opacity: showOptions || dragging ? 0 : 1,
                transition: 'opacity 0.1s',
              }}
              className='pointer-events-none absolute right-2 top-0 flex h-full items-center text-white mix-blend-difference'
            >
              {value}
            </div>
          </div>
        );
      }}
    />
  );
}
