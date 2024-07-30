import { useEffect, useMemo, useState } from 'react';
import SliderBase, { SliderBaseProps } from './SliderBase';

type SliderSelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
} & Pick<SliderBaseProps, 'indent'>;

export default function SliderSelect({
  label,
  options,
  value,
  onChange,
  indent,
}: SliderSelectProps) {
  const [sliderValue, setSliderValue] = useState(options.indexOf(value));
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const scrollX = !container
    ? 0
    : container.scrollWidth - container.clientWidth;

  const selectedOptionElement = useMemo(() => {
    const index = options.indexOf(value);
    return container?.children[0].children?.[index] as HTMLDivElement;
  }, [container?.children, options, value]);

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
            <div className='flex h-full items-center justify-between bg-white pl-1 pr-4'>
              {label}
            </div>
            <div className='h-full w-fit overflow-hidden' ref={setContainer}>
              <div
                className='relative flex h-full w-fit'
                style={{
                  transform: `translateX(-${scrollX * normalScrollOffset}px)`,
                }}
              >
                {options.map((option) => (
                  <div
                    key={option}
                    className='flex h-full items-center text-clip bg-white px-4'
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
                    transform: `translateX(${selectedOptionElement?.offsetLeft ?? 0}px) scaleX(${selectedOptionElement?.clientWidth}%)`,
                    transformOrigin: '0 0',
                    transition: 'transform 0.1s ease-in-out',
                  }}
                  className='absolute left-0 top-0 h-full w-16 bg-white mix-blend-difference'
                ></div>
              </div>
            </div>
            <div
              style={{ opacity: dragging ? 0 : 1, transition: 'opacity 0.1s' }}
              className='absolute right-1 top-0 flex h-full items-center text-white mix-blend-difference'
            >
              {value}
            </div>
          </div>
        );
      }}
    />
  );
}
