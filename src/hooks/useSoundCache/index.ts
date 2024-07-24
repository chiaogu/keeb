import { SoundModifier } from '@src/keyboard/keySoundModifier';
import { Synth } from '@src/synth';
import * as Tone from '@src/tone';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import logCacheSize from './logCacheSize';
import { createPlayerPool } from './playerPool';
import renderSound from './renderSound';

export type SoundCache = Record<string, Record<string, Tone.ToneAudioBuffer>>;
const cache: SoundCache = {};

export default function useSoundCache(destination: Tone.ToneAudioNode) {
  const playerPool = useRef(createPlayerPool(destination));
  const instanceId = useMemo(uuid, []);

  // TODO: Clear render queue
  const clear = useCallback(() => {
    Object.values(cache[instanceId]).forEach((cache) => cache?.dispose());
    cache[instanceId] = {};
    logCacheSize(cache);
  }, [instanceId]);

  useEffect(() => {
    cache[instanceId] = {};
    return () => clear();
  }, [clear, instanceId]);

  const trigger = useMemo(() => {
    function playCached(
      key: string,
      synths: Synth[],
      modifiers: SoundModifier[],
    ) {
      try {
        playerPool.current?.play(cache[instanceId][key]);
      } catch (e) {
        console.log(e);
        delete cache[instanceId][key];
        playRealtime(synths, modifiers);
      }
    }

    function playRealtime(synths: Synth[], modifiers: SoundModifier[]) {
      synths.forEach((synth) => synth.trigger(modifiers));
    }

    async function renderCache(
      key: string,
      synths: Synth[],
      modifiers: SoundModifier[],
    ) {
      cache[instanceId][key] = new Tone.ToneAudioBuffer();

      const buffer = await renderSound(
        synths.map((s) => s.state),
        modifiers,
      );

      if (buffer) {
        cache[instanceId][key] = buffer;
      }

      logCacheSize(cache);
    }

    return (key: string, synths: Synth[], modifiers: SoundModifier[] = []) => {
      if (cache[instanceId][key]) {
        cache[instanceId][key].loaded
          ? playCached(key, synths, modifiers)
          : playRealtime(synths, modifiers);
      } else {
        playRealtime(synths, modifiers);
        renderCache(key, synths, modifiers);
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
