import { useDebounceCallback } from '@react-hook/debounce';
import { findSoundModifiers } from '@src/keyboard/keySoundModifier';
import { KeySoundConfig, ModifierLayer } from '@src/types';
import { channels } from '@src/utils/constants';
import { dispatchKeyEvent } from '@src/utils/utils';
import { omit } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import { KeyEvent } from './useKeyboard';
import useSound from './useSound';
import useSoundCache from './useSoundCache';
import useThrottleCallback from './useThrottleCallback';

export default function useKeyboardSound(
  keySound: KeySoundConfig,
  keyEvent: KeyEvent,
  keyboardModifiers: ModifierLayer[],
) {
  const channel = useMemo(() => channels[keyEvent], [keyEvent]);
  const soundCache = useSoundCache(channel);
  const sound = useSound(keySound.config, channel);

  const trigger = useCallback(
    (key: string) => {
      soundCache.trigger(
        sound.synths,
        findSoundModifiers(keyboardModifiers, key),
      );
    },
    [keyboardModifiers, soundCache, sound.synths],
  );

  const triggerRelease = useDebounceCallback(() => {
    dispatchKeyEvent({
      event: 'keyup',
      code: 'KeyQ',
      key: 'q',
      audio: false,
    });
  }, 300);

  const triggerKeyEvent = useThrottleCallback(
    useCallback(() => {
      requestAnimationFrame(() => {
        dispatchKeyEvent({
          event: keyEvent === 'up' ? 'keyup' : 'keydown',
          code: 'KeyQ',
          key: 'q',
        });
      });
      if (keyEvent === 'down') {
        triggerRelease();
      }
    }, [keyEvent, triggerRelease]),
    100,
  );

  useEffect(() => {
    soundCache.clear();
    triggerKeyEvent();
  }, [soundCache, triggerKeyEvent, trigger]);

  const keyboardSound = useMemo(
    () => ({
      ...omit(sound, ['states']),
      synths: sound.states,
      trigger,
    }),
    [sound, trigger],
  );

  return useMemo(
    () => ({
      sound: keyboardSound,
    }),
    [keyboardSound],
  );
}

export type KeyboardSound = ReturnType<typeof useKeyboardSound>;
