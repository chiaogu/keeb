import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zEnvelope } from './envelope';
import { zNoise } from './noise';
import { zBaseSynthSrc } from './shared';

const zNoiseSynth = zBaseSynthSrc.extend({
  ...zNoise.shape,
  envelope: zEnvelope,
});

export const noiseSynthConfig = createConfig(Tone.NoiseSynth, zNoiseSynth, {
  setState(node, state) {
    node.set({
      ...state,
      noise: {
        type: state.type,
        playbackRate: state.playbackRate,
        fadeIn: state.fadeIn,
        fadeOut: state.fadeOut,
      },
    });
  },
  trigger(node, state) {
    node.triggerAttackRelease(state.duration, `+${state.delay}`);
  },
});
