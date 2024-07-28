import {
  ChangeEvent,
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
  step?: number;
  indent?: number;
  onChange: (v: number) => void;
  render: (props: { normalValue: number; dragging: boolean }) => ReactNode;
};

const RESOLUTION = 100000;

export default function SliderBase({
  value,
  onChange,
  step,
  max,
  min,
  indent = 0,
  render,
}: SliderBaseProps) {
  const container = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) / RESOLUTION;
      const denormalizedNewValue = min + (max - min) * newValue;
      onChange(denormalizedNewValue);
    },
    [max, min, onChange],
  );

  const normalValue = useMemo(() => {
    return (value - min) / (max - min);
  }, [max, min, value]);

  const normalStep = useMemo(() => {
    if (step === undefined) return undefined;
    return step / (max - min);
  }, [max, min, step]);

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
        const distance = Math.hypot(xDelta, yDelta);

        if (!thresholdPassed && distance > 20) {
          thresholdPassed = true;
          startPos = { x: moveEvent.clientX, y: moveEvent.clientY };
        }

        if (!container.current || !thresholdPassed) {
          return;
        }

        // container.current.style.touchAction = 'auto';
        // cancel();

        const { clientWidth } = container.current;
        const normalDelta =
          ((moveEvent.clientX - startPos.x) / clientWidth) * 1;
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
