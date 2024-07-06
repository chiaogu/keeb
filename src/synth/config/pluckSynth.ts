import { z } from 'zod';
import * as Tone from '@src/tone';
import { MAX_SOUND_DURATION } from '@src/utils/constants';
import { SynthNodeConfig } from '.';
import withToneDefaults from '../withToneDefaults';
import { zBaseSynthSrc } from './shared';

const zPluckSynth = withToneDefaults(
  zBaseSynthSrc.extend({
    frequency: z.number().min(0).max(1000).catch(500),
    attackNoise: z.number().min(0.1).max(20),
    dampening: z.number().min(0.001).max(7000),
    release: z.number().min(0).max(MAX_SOUND_DURATION),
    resonance: z.number().min(0).max(0.9999).catch(0.88),
  }),
  Tone.PluckSynth,
);

export const pluchSynthConfig: SynthNodeConfig<
  Tone.PluckSynth,
  typeof zPluckSynth
> = {
  schema: zPluckSynth,
  createNode: () => new Tone.PluckSynth(),
  trigger(node, state) {
    node.triggerAttackRelease(
      state.frequency,
      state.duration,
      `+${state.delay}`,
    );
  },
};
