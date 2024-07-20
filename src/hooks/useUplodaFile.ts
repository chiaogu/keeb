import { loadFile } from '@src/utils/file';
import { useCallback, useMemo, useState } from 'react';

export default function useUplodaFile<T>(onLoad: (data: T) => void) {
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const file = await loadFile();
    setLoading(false);

    // TODO: validate
    onLoad(file as T);
  }, [onLoad]);

  return useMemo(() => ({ loading, load }), [load, loading]);
}
