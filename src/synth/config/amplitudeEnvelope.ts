import * as Tone from '@src/tone';
import { calculateEnvelope } from '@src/utils/utils';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zEnvelope } from './envelope';
import { zBaseSynthFx } from './shared';

export const amplitudeEnvelopeConfig = createConfig(
  createFxClass(Tone.AmplitudeEnvelope),
  zBaseSynthFx.extend({
    envelope: zEnvelope,
  }),
  {
    trigger(node, src) {
      node.triggerAttackRelease(src.duration, `+${src.delay}`);
    },
    setState(node, state, { duration }) {
      node.set({
        ...state,
        ...calculateEnvelope(state.envelope, duration),
      });
    },
  },
);
