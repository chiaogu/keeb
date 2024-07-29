import { scale } from '@src/utils/utils';
import {
  PointerEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export type SliderBaseProps = {
  value: number;
  max: number;
  min: number;
  indent?: number;
  onChange: (v: number) => void;
  render: (props: { normalValue: number; dragging: boolean }) => ReactNode;
  sensitivity?: number;
};

const DRAG_THRESHOLD = 20;

export default function SliderBase({
  value,
  onChange,
  max,
  min,
  indent = 0,
  render,
  sensitivity = 1,
}: SliderBaseProps) {
  const container = useRef<HTMLDivElement>(null);
  const startValue = useRef(value);
  const startPos = useRef({ x: 0, y: 0 });
  const thresholdPassed = useRef(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const cancel = () => setDragging(false);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragging) {
        return;
      }

      const xDelta = moveEvent.clientX - startPos.current.x;
      const yDelta = moveEvent.clientY - startPos.current.y;

      if (!thresholdPassed.current && Math.abs(yDelta) > DRAG_THRESHOLD) {
        cancel();
        return;
      }

      if (!thresholdPassed.current && Math.abs(xDelta) > DRAG_THRESHOLD) {
        thresholdPassed.current = true;
        startPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
        handlePointerMove(moveEvent);
        return;
      }

      if (!container.current || !thresholdPassed.current) {
        return;
      }

      const { clientWidth } = container.current;
      const normalDelta = (xDelta / clientWidth) * sensitivity;
      const denormalizedNewValue =
        min +
        (max - min) *
          Math.max(
            0,
            Math.min(1, scale(startValue.current, min, max) + normalDelta),
          );
      onChange(denormalizedNewValue);
    };

    addEventListener('pointermove', handlePointerMove);
    addEventListener('pointerup', cancel);
    addEventListener('pointercancel', cancel);
    return () => {
      removeEventListener('pointermove', handlePointerMove);
      removeEventListener('pointerup', cancel);
      removeEventListener('pointercancel', cancel);
    };
  }, [dragging, max, min, onChange, sensitivity]);

  const handlePointerDown: PointerEventHandler = useCallback(
    (downEvent) => {
      thresholdPassed.current = false;
      startPos.current = { x: downEvent.clientX, y: downEvent.clientY };
      startValue.current = value;
      setDragging(true);
    },
    [value],
  );

  return (
    <div
      className='relative mb-2 flex h-8 w-full touch-none items-center last:mb-0'
      style={{
        marginLeft: Math.max(0, indent ?? 0) * 8,
      }}
      onPointerDown={handlePointerDown}
      ref={container}
    >
      <div className='pointer-events-none absolute top-0 size-full bg-white'>
        {render({ normalValue: scale(value, min, max), dragging })}
      </div>
    </div>
  );
}
