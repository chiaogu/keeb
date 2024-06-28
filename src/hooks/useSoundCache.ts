import createSynth, { Synth } from "@src/synth";
import * as Tone from "@src/tone";
import { useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import prettyBytes from 'pretty-bytes';

const cache: Record<string, Record<string, Tone.Player>> = {};

function logCacheSize() {
  let size = 0;
  Object.values(cache).forEach((instanceCache) =>
    Object.values(instanceCache).forEach(({ buffer }) => {
      size += buffer ? buffer.length : 0;
    }),
  );

  // console.log("cache size:", prettyBytes(size));
}

export default function useSoundCache() {
  const instanceId = useMemo(uuid, []);
  
  const clear = useCallback(() => {
    Object.values(cache[instanceId]).forEach((cache) =>
      cache.dispose(),
    );
    cache[instanceId] = {};
    logCacheSize();
  }, [instanceId]);

  useEffect(() => {
    cache[instanceId] = {};
    return () => clear();
  }, [clear, instanceId]);

  const trigger = useMemo(() => {
    function playCached(key: string) {
      cache[instanceId][key].start();
    }

    function playRealtime(synths: Synth[]) {
      synths.forEach(({ trigger }) => trigger());
    }

    async function renderCache(key: string, synths: Synth[]) {
      cache[instanceId][key] = new Tone.Player().toDestination();
      const buffer = await Tone.Offline(() => {
        playRealtime(synths.map((synth) => createSynth(synth.getState())));
      }, 1);
      cache[instanceId][key] = new Tone.Player().toDestination();
      cache[instanceId][key].buffer = buffer;

      logCacheSize();
    }

    return (key: string, synths: Synth[]) => {
      if (cache[instanceId][key]) {
        cache[instanceId][key].loaded
          ? playCached(key)
          : playRealtime(synths);
      } else {
        playRealtime(synths);
        renderCache(key, synths);
      }
    };
  }, [instanceId]);

  return useMemo(
    () => ({
      trigger,
      clear,
    }),
    [trigger, clear],
  );
}
