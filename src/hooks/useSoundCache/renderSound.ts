import { SoundModifier } from '@src/keyboard/keySoundModifier';
import createSynth, { SynthConfig } from '@src/synth';
import * as Tone from '@src/tone';
import { Immutable } from 'immer';

let renderQueue: Promise<Tone.ToneAudioBuffer | void> = Promise.resolve();

export default async function renderSound(
  synths: Immutable<SynthConfig[]>,
  modifiers: SoundModifier[],
) {
  renderQueue = renderQueue.then(
    () =>
      Tone.Offline(async () => {
        const offlineSynths = synths.map((config) =>
          createSynth(config, Tone.getDestination()),
        );
        await Promise.all(offlineSynths.map(({ ready }) => ready()));
        offlineSynths.forEach((s) => s.trigger(modifiers));
      }, 1),
    // TODO: Dynamic duration
  );
  const buffer = await renderQueue;
  return buffer;
}
