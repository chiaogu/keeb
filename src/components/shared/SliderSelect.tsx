import { useMemo, useState } from 'react';
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
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const scrollX = useMemo(() => {
    if (!container) return 0;
    return container.scrollWidth - container.clientWidth;
  }, [container]);

  const index = useMemo(() => options.indexOf(value), [options, value]);

  return (
    <SliderBase
      indent={indent}
      value={index}
      max={options.length - 1}
      min={0}
      step={1}
      onChange={(v) => onChange(options[Math.round(v)])}
      render={({ normalValue, dragging }) => (
        <>
          <div
            className='relative size-full overflow-hidden'
            ref={setContainer}
          >
            <div className='flex h-full w-fit'>
              {options.map((option) => (
                <div
                  key={option}
                  className='flex h-full items-center text-clip bg-white px-4'
                  style={{
                    color: dragging ? 'black' : 'transparent',
                    transform: `translateX(-${scrollX * Math.max(0, Math.min(1, normalValue * 1.8 - 0.4))}px)`,
                    transition: 'transform 0.1s linear, color 0.1s',
                    filter: `invert(${option === value ? '1' : '0'})`,
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
            <div
              style={{
                color: dragging ? 'transparent' : 'white',
                transition: 'color 0.1s',
              }}
              className='absolute top-0 flex size-full items-center justify-between px-1 text-white mix-blend-difference'
            >
              <div>{label}</div>
              <div>{options[index]}</div>
            </div>
          </div>
        </>
      )}
    />
  );
}