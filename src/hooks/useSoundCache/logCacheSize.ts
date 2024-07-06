import prettyBytes from 'pretty-bytes';
import { SoundCache } from '.';

export default function logCacheSize(cache: SoundCache) {
  let size = 0;
  Object.values(cache).forEach((instanceCache) =>
    Object.values(instanceCache).forEach((buffer) => {
      size += buffer ? buffer.length : 0;
    }),
  );
  // console.log("cache size:", prettyBytes(size));
}
