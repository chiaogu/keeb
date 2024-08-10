import { SoundModifier } from '@src/keyboard/keySoundModifier';
import createSynth, { SynthConfig } from '@src/synth';
import * as Tone from '@src/tone';
import { Immutable } from 'immer';

let renderQueue: Promise<Tone.ToneAudioBuffer | void> = Promise.resolve();
const abortControllers: AbortController[] = [];

export function clearRenderQueue() {
  abortControllers
    .splice(0, abortControllers.length - 1)
    .forEach((c) => c.abort());
  renderQueue = Promise.resolve();
}

export default async function renderSound(
  synths: Immutable<SynthConfig[]>,
  modifiers: SoundModifier[],
) {
  const abortController = new AbortController();
  abortControllers.push(abortController);
  renderQueue = renderQueue.then(
    () => {
      if (abortController.signal.aborted) {
        return;
      }

      return Tone.Offline(async () => {
        const offlineSynths = synths.map((config) =>
          createSynth(config, Tone.getDestination()),
        );
        await Promise.all(offlineSynths.map(({ ready }) => ready()));
        offlineSynths.forEach((s) => s.trigger(modifiers));
      }, 1);
    },
    // TODO: Dynamic duration
  );
  const buffer = await renderQueue;
  return buffer;
}
