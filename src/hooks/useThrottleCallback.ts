import { throttle } from 'lodash-es';

export default function useThrottleCallback() {
  const throttleCall = throttle(
    (callback) => {
      callback();
    },
    100,
    { leading: true, trailing: true },
  );
}