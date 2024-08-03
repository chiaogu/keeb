import SliderBase, { SliderBaseProps } from './SliderBase';

type SliderProps = {
  label: string;
  renderValue?: (normalizedValue: number) => React.ReactNode;
} & Omit<SliderBaseProps, 'render'>;

export default function Slider({
  label,
  renderValue = (v) => `${(v * 100).toFixed()}%`,
  ...sliderProps
}: SliderProps) {
  return (
    <SliderBase
      {...sliderProps}
      sensitivity={1.2}
      render={({ normalValue }) => (
        <>
          <div
            style={{
              transform: `scaleX(${normalValue * 100}%)`,
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
            {renderValue(normalValue)}
          </div>
        </>
      )}
    />
  );
}
