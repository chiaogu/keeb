import { useEffect } from 'react';

type UseKeyEventsArgs = {
  onKeydown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
  repeat?: boolean;
};

export function useKeyEvents({
  onKeydown,
  onKeyUp,
  repeat = false,
}: UseKeyEventsArgs) {
  useEffect(() => {
    if (!onKeydown) return;
    const handleKeydown = (e: KeyboardEvent) => {
      if (!repeat && !e.repeat) onKeydown(e);
    };
    addEventListener('keydown', handleKeydown);
    return () => removeEventListener('keydown', handleKeydown);
  }, [onKeydown, repeat]);

  useEffect(() => {
    if (!onKeyUp) return;
    addEventListener('keyup', onKeyUp);
    return () => removeEventListener('keyup', onKeyUp);
  }, [onKeyUp]);
}
