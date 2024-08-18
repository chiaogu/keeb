import SliderBase from '@src/components/shared/SliderBase';
import { useViewport } from '@src/hooks/useViewport';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import Keyboard, { KeyboardProps } from '../Keyboard';

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

function getHoveringKeyCode({ x, y }: { x: number; y: number }) {
  const element = document.elementFromPoint(x, y) as HTMLDivElement;
  return element?.dataset.keycode;
}

function useMousePosition() {
  const pos = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const handleDrag = ({ x, y }: PointerEvent) => {
      pos.current = { x, y };
    };

    addEventListener('pointermove', handleDrag);
    return () => {
      removeEventListener('pointermove', handleDrag);
    };
  }, []);

  return pos;
}

const DRAG_SCROLL_ZONE = 48;

function useDragScrolling(
  scroll: (setX: (x: number) => number) => void,
  onPress?: (keyCode: string) => void,
) {
  const [scrollV, setScrollV] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pressedKeys = useRef<Set<string>>();
  const viewport = useViewport();
  const mouse = useMousePosition();

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const keycode = getHoveringKeyCode(mouse.current);
    pressedKeys.current = new Set(keycode);

    const handleDrag = (e: PointerEvent) => {
      if (e.x < DRAG_SCROLL_ZONE) {
        setScrollV(-1);
      } else if (e.x > viewport.width - DRAG_SCROLL_ZONE) {
        setScrollV(1);
      } else {
        setScrollV(0);
      }
    };

    const cancel = () => {
      setScrollV(0);
      setDragging(false);
    };

    addEventListener('pointermove', handleDrag);
    addEventListener('pointerup', cancel);
    addEventListener('pointercancel', cancel);
    return () => {
      removeEventListener('pointermove', handleDrag);
      removeEventListener('pointerup', cancel);
      removeEventListener('pointercancel', cancel);
      cancel();
    };
  }, [dragging, mouse, viewport.width]);

  useEffect(() => {
    let cancelled = false;
    const loop = () => {
      const keycode = getHoveringKeyCode(mouse.current);
      if (keycode && !pressedKeys.current?.has(keycode)) {
        onPress?.(keycode);
        pressedKeys.current?.add(keycode);
      }

      scroll((x) => x + scrollV * 3);

      if (!cancelled) {
        requestAnimationFrame(loop);
      }
    };
    if (scrollV !== 0) {
      loop();
    }
    return () => {
      cancelled = true;
    };
  }, [mouse, onPress, scroll, scrollV]);

  return {
    dragScrolling: scrollV !== 0,
    startDragging() {
      setDragging(true);
    },
    stopDragging() {
      setDragging(false);
    },
  };
}

export default function ModifierKeyboard(props: KeyboardProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const { width: clientWidth = 0, ref } = useResizeDetector<HTMLDivElement>();
  const viewport = useViewport();

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollWidth = contentRef.current?.clientWidth ?? 0;
  const overflow = scrollWidth > viewport.width - 64;

  const scroll = useCallback(
    (setX: (x: number) => number) => {
      if (!overflow) {
        return;
      }
      const maxOffset = scrollWidth - clientWidth;
      setOffsetX((x) => Math.min(maxOffset, Math.max(0, setX(x))));
    },
    [clientWidth, overflow, scrollWidth],
  );

  const { dragScrolling, startDragging, stopDragging } = useDragScrolling(
    scroll,
    props.onPress,
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || !overflow) return;
      scroll((x) => x - e.deltaX);
    },
    [overflow, scroll],
  );

  useEffect(() => {
    setOffsetX(overflow ? 0 : (scrollWidth - clientWidth) / 2);
    setFirstRender(false);
  }, [clientWidth, overflow, scrollWidth]);

  return (
    <>
      <div
        className='flex w-full overflow-visible'
        style={{ opacity: firstRender ? 0 : 1 }}
        onWheel={handleWheel}
        onPointerDown={(e) => {
          startDragging();
          ref.current?.releasePointerCapture(e.pointerId);
        }}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
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
              props.onRelease?.(key);
            }}
            onPress={(key) => {
              if (!dragScrolling) {
                props.onPress?.(key);
              }
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
