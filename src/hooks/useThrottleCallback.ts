import { throttle, ThrottleSettings } from 'lodash-es';
import { useMemo } from 'react';

export default function useThrottleCallback(
  callback: (...args: unknown[]) => unknown,
  duration: number,
  { leading, trailing }: ThrottleSettings = { leading: true, trailing: true },
) {
  return useMemo(
    () => {
      return throttle(() => callback(), duration, { leading, trailing });
    },
    [callback, duration, leading, trailing],
  );
}
