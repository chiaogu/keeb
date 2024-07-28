import {
  PointerEventHandler,
  ReactNode,
  useCallback,
  useMemo,
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
};

const DRAG_THRESHOLD = 20;

export default function SliderBase({
  value,
  onChange,
  max,
  min,
  indent = 0,
  render,
}: SliderBaseProps) {
  const container = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const normalValue = useMemo(() => {
    return (value - min) / (max - min);
  }, [max, min, value]);

  const handlePointerDown: PointerEventHandler = useCallback(
    (downEvent) => {
      let startPos = { x: downEvent.clientX, y: downEvent.clientY };
      let thresholdPassed = false;
      setDragging(true);

      const cancel = () => {
        setDragging(false);
        removeEventListener('pointermove', handlePointerMove);
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const xDelta = moveEvent.clientX - startPos.x;
        const yDelta = moveEvent.clientY - startPos.y;
        
        if (!thresholdPassed && Math.abs(yDelta) > DRAG_THRESHOLD) {
          cancel();
          return;
        }

        if (!thresholdPassed && Math.abs(xDelta) > DRAG_THRESHOLD) {
          thresholdPassed = true;
          startPos = { x: moveEvent.clientX, y: moveEvent.clientY };
          handlePointerMove(moveEvent);
          return;
        }

        if (!container.current || !thresholdPassed) {
          return;
        }

        const { clientWidth } = container.current;
        const normalDelta = (xDelta / clientWidth) * 1.5;
        const denormalizedNewValue =
          min +
          (max - min) * Math.max(0, Math.min(1, normalValue + normalDelta));
        onChange(denormalizedNewValue);
      };

      addEventListener('pointermove', handlePointerMove);
      addEventListener('pointerup', cancel, { once: true });
    },
    [max, min, normalValue, onChange],
  );

  return (
    <div
      className='relative mb-2 flex h-8 w-full touch-none items-center'
      style={{
        marginLeft: Math.max(0, indent ?? 0) * 8,
      }}
      onPointerDown={handlePointerDown}
      ref={container}
    >
      <div className='pointer-events-none absolute top-0 size-full bg-white'>
        {render({ normalValue, dragging })}
      </div>
    </div>
  );
}
