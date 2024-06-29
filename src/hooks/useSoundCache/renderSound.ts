import createSynth, { Synth } from "@src/synth";
import * as Tone from "@src/tone";
import { MAX_SOUND_DURATION } from "@src/utils/constants";

let renderQueue: Promise<Tone.ToneAudioBuffer | void> = Promise.resolve();

export default async function renderSound(synths: Synth[]) {
  renderQueue = renderQueue.then(() =>
    Tone.Offline(async () => {
      const offlineSynths = synths.map((synth) =>
        createSynth(synth.getState()),
      );
      await Promise.all(offlineSynths.map(({ ready }) => ready()));
      offlineSynths.forEach(({ trigger }) => trigger());
    }, MAX_SOUND_DURATION),
  );
  const buffer = await renderQueue;
  return buffer;
}
