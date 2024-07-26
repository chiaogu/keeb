import * as Tone from '@src/tone';
import { removeDefault } from '@src/utils/schema';
import { calculateEnvelope } from '@src/utils/utils';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zEnvelope, zInnerEnvelope } from './envelope';
import { zBaseSynthFx } from './shared';

export const amplitudeEnvelopeConfig = createConfig(
  createFxClass(Tone.AmplitudeEnvelope),
  zBaseSynthFx.merge(removeDefault(zEnvelope) as typeof zInnerEnvelope),
  {
    trigger(node, src) {
      node.triggerAttackRelease(src.duration, src.delay);
    },
    setState(node, state, { duration }) {
      node.set(calculateEnvelope(state, duration));
    },
  },
);
