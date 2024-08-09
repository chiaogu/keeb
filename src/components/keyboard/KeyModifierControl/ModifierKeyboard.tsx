import SliderBase from '@src/components/shared/SliderBase';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import Keyboard, { KeyboardProps } from '../Keyboard';
import { useModiferContext } from './ModifierContext';
import { useViewport } from '@src/hooks/useViewport';

type ScrollBarProps = {
  clientWidth: number;
  scrollWidth: number;
  scrollX: number;
  onChange: (v: number) => void;
};

function ScrollBar({
  clientWidth,
  scrollWidth,
  scrollX,
  onChange,
}: ScrollBarProps) {
  const ratio = clientWidth / scrollWidth;
  const range = scrollWidth - clientWidth;
  const value = scrollX / range;

  return (
    <SliderBase
      className='mt-4 h-8'
      sensitivity={2}
      value={value}
      max={1}
      min={0}
      onChange={(v) => onChange(range * v)}
      render={() => (
        <div className='size-full'>
          <div
            style={{
              boxShadow: CONTROL_SHADOW,
              width: `${clientWidth * ratio}px`,
              transform: `translateX(${value * range * ratio}px)`,
            }}
            className='flex size-full origin-left items-center justify-center bg-white'
          >
            <span className='material-symbols-outlined'>width</span>
          </div>
        </div>
      )}
    />
  );
}

export default function ModifierKeyboard(props: KeyboardProps) {
  const { triggerUp, triggerDown } = useModiferContext();
  const [offsetX, setOffsetX] = useState(0);
  const { width: clientWidth = 0, ref } = useResizeDetector<HTMLDivElement>();
  const viewport = useViewport();

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollWidth = contentRef.current?.clientWidth ?? 0;
  const overflow = scrollWidth > viewport.width - 64;

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || !overflow) return;

      const maxOffset = scrollWidth - clientWidth;
      setOffsetX((x) => Math.min(maxOffset, Math.max(0, x - e.deltaX)));
    },
    [overflow, scrollWidth, clientWidth],
  );
  
  useEffect(() => {
    setOffsetX(overflow ? 0 : (scrollWidth - clientWidth) / 2);
  }, [clientWidth, overflow, scrollWidth]);

  return (
    <>
      <div
        className='flex w-full overflow-visible'
        onWheel={handleWheel}
        ref={ref}
      >
        <div
          className='size-fit'
          style={{ transform: `translateX(-${offsetX}px)` }}
          ref={contentRef}
        >
          <Keyboard
            {...props}
            onRelease={(key) => {
              triggerUp(key);
              props.onRelease?.(key);
            }}
            onPress={(key) => {
              triggerDown(key);
              props.onPress?.(key);
            }}
          />
        </div>
      </div>
      {overflow && (
        <ScrollBar
          clientWidth={clientWidth}
          scrollWidth={scrollWidth}
          scrollX={offsetX}
          onChange={setOffsetX}
        />
      )}
    </>
  );
}
