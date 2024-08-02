import usePreventDefaultTouchStart from '@src/hooks/usePreventDefaultTouchStart';
import { CONTROL_SHADOW } from '@src/utils/constants';
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
  onDrag?: () => void;
  onRelease?: () => void;
};

const DRAG_THRESHOLD = 20;

// type UsePointerMovementProps = {
//   dragThreshold: number;
//   onDrag: (args: { x: number; y: number }) => void;
// };

// function useDrag({ dragThreshold, onDrag }: UsePointerMovementProps) {
//   const [dragging, setDragging] = useState(false);
//   const startPos = useRef({ x: 0, y: 0 });
//   const thresholdPassed = useRef(false);

//   useEffect(() => {
//     const cancel = () => {
//       setDragging(false);
//     };

//     const handlePointerMove = (moveEvent: PointerEvent) => {
//       if (!dragging) {
//         return;
//       }

//       const xDelta = moveEvent.clientX - startPos.current.x;
//       const yDelta = moveEvent.clientY - startPos.current.y;

//       if (!thresholdPassed.current && Math.abs(yDelta) > dragThreshold) {
//         cancel();
//         return;
//       }

//       if (!thresholdPassed.current && Math.abs(xDelta) > dragThreshold) {
//         thresholdPassed.current = true;
//         startPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
//         handlePointerMove(moveEvent);
//         return;
//       }

//       if (!thresholdPassed.current) {
//         return;
//       }

//       onDrag({ x: xDelta, y: yDelta });
//     };

//     addEventListener('pointermove', handlePointerMove);
//     addEventListener('pointerup', cancel);
//     addEventListener('pointercancel', cancel);
//     return () => {
//       removeEventListener('pointermove', handlePointerMove);
//       removeEventListener('pointerup', cancel);
//       removeEventListener('pointercancel', cancel);
//     };
//   }, [dragThreshold, dragging, onDrag]);

//   const handlePointerDown: PointerEventHandler = useCallback((downEvent) => {
//     document.body.style.cursor = 'grabbing';
//     thresholdPassed.current = false;
//     startPos.current = { x: downEvent.clientX, y: downEvent.clientY };
//     setDragging(true);
//   }, []);

//   return useMemo(() => ({
//     dragging,
//     handlePointerDown,
//   }), [dragging, handlePointerDown]);
// }

export default function SliderBase({
  value,
  onChange,
  max,
  min,
  indent = 0,
  render,
  sensitivity = 1,
  onDrag,
  onRelease,
}: SliderBaseProps) {
  const container = useRef<HTMLDivElement | null>(null);
  const startValue = useRef(value);
  const startPos = useRef({ x: 0, y: 0 });
  const thresholdPassed = useRef(false);
  const [dragging, setDragging] = useState(false);
  
  useEffect(() => {
    if (dragging) {
      onDrag?.();
    } else {
      onRelease?.();
    }
  }, [dragging, onDrag, onRelease]);

  useEffect(() => {
    const cancel = () => {
      setDragging(false);
      document.body.style.cursor = '';
    };

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
      document.body.style.cursor = 'grabbing';
      thresholdPassed.current = false;
      startPos.current = { x: downEvent.clientX, y: downEvent.clientY };
      startValue.current = value;
      setDragging(true);
    },
    [value],
  );

  const setElement = usePreventDefaultTouchStart();

  const marginLeft = Math.max(0, indent ?? 0) * 8;

  return (
    <div
      className='relative mb-2 flex h-8 touch-none items-center last:mb-0'
      style={{
        width: `calc(100% - ${marginLeft}px)`,
        marginLeft,
        cursor: dragging ? '' : 'grab',
        boxShadow: CONTROL_SHADOW,
      }}
      onPointerDown={handlePointerDown}
      ref={(element) => {
        container.current = element;
        setElement(element);
      }}
    >
      <div className='pointer-events-none absolute top-0 size-full bg-white'>
        {render({ normalValue: scale(value, min, max), dragging })}
      </div>
    </div>
  );
}
