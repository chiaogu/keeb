import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zEnvelope } from './envelope';
import { zNoise } from './noise';
import { zBaseSynthSrc } from './shared';
import { calculateEnvelope } from '@src/utils/utils';

export const noiseSynthConfig = createConfig(
  Tone.NoiseSynth,
  zBaseSynthSrc.extend({
    ...zNoise.shape,
    envelope: zEnvelope,
  }),
  {
    setState(node, state, { duration }) {
      node.set({
        ...state,
        noise: {
          type: state.type,
          playbackRate: state.playbackRate,
          fadeIn: state.fadeIn,
          fadeOut: state.fadeOut,
        },
        envelope: calculateEnvelope(state.envelope, duration)
      });
    },
    trigger(node, state) {
      node.triggerAttackRelease(state.duration, `+${state.delay}`);
    },
  },
);
