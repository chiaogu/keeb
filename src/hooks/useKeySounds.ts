import { useCallback } from "react";
import { useKeyEvents } from "./useKeyEvents";
import { Sound } from "./useSound";

export default function useKeySounds(down: Sound, up: Sound) {
  const onKeydown = useCallback(() => {
    down.trigger();
  }, [down]);

  const onKeyUp = useCallback(() => {
    up.trigger();
  }, [up]);

  useKeyEvents(onKeydown, onKeyUp);
}
