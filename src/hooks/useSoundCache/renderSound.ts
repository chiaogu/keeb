import { SoundModifier } from '@src/keyboard/keySoundModifier';
import createSynth, { SynthConfig } from '@src/synth';
import * as Tone from '@src/tone';
import { MAX_SOUND_DURATION } from '@src/utils/constants';
import { Immutable } from 'immer';

let renderQueue: Promise<Tone.ToneAudioBuffer | void> = Promise.resolve();

export default async function renderSound(
  synths: Immutable<SynthConfig[]>,
  modifiers: SoundModifier[],
) {
  renderQueue = renderQueue.then(() =>
    Tone.Offline(async () => {
      const offlineSynths = synths.map(createSynth);
      await Promise.all(offlineSynths.map(({ ready }) => ready()));
      offlineSynths.forEach((s) => s.trigger(modifiers));
    }, MAX_SOUND_DURATION),
  );
  const buffer = await renderQueue;
  return buffer;
}
