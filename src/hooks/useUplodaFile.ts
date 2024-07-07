import { SoundConfig } from '@src/types';
import { loadFile } from '@src/utils/file';
import { useCallback, useMemo, useState } from 'react';

export default function useUploadSound(onLoad: (sound: SoundConfig) => void) {
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const file = await loadFile();
    setLoading(false);

    // TODO: validate
    onLoad(file as SoundConfig);
  }, [onLoad]);

  return useMemo(() => ({ loading, load }), [load, loading]);
}
