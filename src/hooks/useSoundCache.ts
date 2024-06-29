import createSynth, { Synth } from "@src/synth";
import * as Tone from "@src/tone";
import { useCallback, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import prettyBytes from "pretty-bytes";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

const cache: Record<string, Record<string, Tone.Player>> = {};

let renderQueue: Promise<Tone.ToneAudioBuffer | void> = Promise.resolve();

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
    Object.values(cache[instanceId]).forEach((cache) => cache.dispose());
    cache[instanceId] = {};
    logCacheSize();
  }, [instanceId]);

  useEffect(() => {
    cache[instanceId] = {};
    return () => clear();
  }, [clear, instanceId]);

  const trigger = useMemo(() => {
    function playCached(key: string, synths: Synth[]) {
      try {
        // !!!!!players pool
        cache[instanceId][key].start();
      } catch (e) {
        // console.log(e);
        delete cache[instanceId][key];
        playRealtime(synths);
      }
    }

    function playRealtime(synths: Synth[]) {
      synths.forEach(({ trigger }) => trigger());
    }

    async function renderCache(key: string, synths: Synth[]) {
      cache[instanceId][key] = new Tone.Player().toDestination();

      renderQueue = renderQueue.then(() =>
        Tone.Offline(async () => {
          const offlineSynths = synths.map((synth) =>
            createSynth(synth.getState()),
          );
          await Promise.all(offlineSynths.map(({ ready }) => ready()));
          playRealtime(offlineSynths);
        }, MAX_SOUND_DURATION),
      );
      const buffer = await renderQueue;

      if (!cache[instanceId][key]) {
        cache[instanceId][key] = new Tone.Player().toDestination();
      }

      if (buffer) {
        cache[instanceId][key].buffer = buffer;
      }

      logCacheSize();
    }

    return (key: string, synths: Synth[]) => {
      if (cache[instanceId][key]) {
        cache[instanceId][key].loaded
          ? playCached(key, synths)
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
