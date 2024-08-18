import { SoundConfig } from '@src/types';
import { v4 as uuid } from 'uuid';
import useUplodaFile from './useUplodaFile';

export function loadSoundConfig(config: SoundConfig) {
  return {
    ...config,
    id: uuid(),
    synths: config.synths.map((s) => ({
      ...s,
      id: uuid(),
      src: { ...s.src, id: uuid() },
      fxs: s.fxs.map((fx) => ({ ...fx, id: uuid() })),
    })),
  };
}

export default function useUploadSound(onLoad: (data: SoundConfig) => void) {
  const { load } = useUplodaFile((data: SoundConfig) => {
    onLoad(loadSoundConfig(data));
  });

  return load;
}
