import { useCallback } from 'react';
import { useKeyEvents } from './useKeyEvents';
import { Sound } from './useSound';

export default function useKeySounds(down: Sound, up: Sound) {
  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      down.trigger(e.key);
    },
    [down],
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      up.trigger(e.key);
    },
    [up],
  );

  useKeyEvents({ onKeydown, onKeyUp });
}
