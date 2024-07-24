import { animated, useSpring } from '@react-spring/web';
import { useKeyEvents } from '@src/hooks/useKeyEvents';
import { useCallback } from 'react';

type TimeCursorProps = {
  width: number;
  maxDelayAndDuration: number;
};

export default function TimeCursor({
  width,
  maxDelayAndDuration,
}: TimeCursorProps) {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }));

  const onKeydown = useCallback(() => {
    api.start({
      from: { x: 0 },
      to: { x: width },
      reset: true,
      config: { duration: maxDelayAndDuration * 1000 },
    });
  }, [api, maxDelayAndDuration, width]);

  useKeyEvents({ onKeydown });

  return (
    <animated.div
      style={springs}
      className='absolute h-full w-[2px] bg-white mix-blend-difference'
    ></animated.div>
  );
}
