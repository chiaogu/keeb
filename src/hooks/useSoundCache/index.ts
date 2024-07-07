import { Synth } from '@src/synth';
import * as Tone from '@src/tone';
import { useCallback, useEffect, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import logCacheSize from './logCacheSize';
import * as playerPool from './playerPool';
import renderSound from './renderSound';
import { SynthState } from '../useSynths';

export type SoundCache = Record<string, Record<string, Tone.ToneAudioBuffer>>;
const cache: SoundCache = {};

export default function useSoundCache() {
  const instanceId = useMemo(uuid, []);

  const clear = useCallback(() => {
    Object.values(cache[instanceId]).forEach((cache) => cache?.dispose());
    cache[instanceId] = {};
    logCacheSize(cache);
  }, [instanceId]);

  useEffect(() => {
    playerPool.lazyInit();
    cache[instanceId] = {};
    return () => clear();
  }, [clear, instanceId]);

  const trigger = useMemo(() => {
    function playCached(key: string, synths: SynthState[]) {
      try {
        playerPool.play(cache[instanceId][key]);
      } catch (e) {
        console.log(e);
        delete cache[instanceId][key];
        playRealtime(synths);
      }
    }

    function playRealtime(synths: SynthState[]) {
      synths.forEach(({ synth }) => synth.trigger());
    }

    async function renderCache(key: string, synths: SynthState[]) {
      cache[instanceId][key] = new Tone.ToneAudioBuffer();

      const buffer = await renderSound(synths.map((s) => s.state));

      if (buffer) {
        cache[instanceId][key] = buffer;
      }

      logCacheSize(cache);
    }

    return (key: string, synths: SynthState[]) => {
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
