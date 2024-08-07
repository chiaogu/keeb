import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import createFxClass from '../createFxClass';
import { zEnvelope } from './envelope';
import { zInnerFilter } from './filter';
import { zBaseSynthFx } from './shared';
import { z } from 'zod';
import { calculateEnvelope } from '@src/utils/utils';

interface FilterEnvelopeOptions extends Tone.FilterOptions {
  envelope: Tone.EnvelopeOptions;
  octaves: number;
  exponent: number;
}

export class FilterEnvelope extends Tone.Filter {
  private _envelope: Tone.FrequencyEnvelope;

  constructor() {
    super();

    this._envelope = new Tone.FrequencyEnvelope();
    this._envelope.connect(this.frequency);
  }

  set({
    envelope,
    octaves,
    exponent,
    frequency,
    ...filter
  }: Tone.RecursivePartial<FilterEnvelopeOptions>) {
    if (envelope) this._envelope.set(envelope);
    if (frequency) this._envelope.baseFrequency = frequency;
    if (octaves) this._envelope.octaves = octaves;
    if (exponent) this._envelope.exponent = exponent;
    if (filter) super.set(filter);
    return this;
  }

  dispose(): this {
    super.dispose();
    this._envelope.dispose();
    return this;
  }

  triggerAttackRelease(duration: Tone.Unit.Time, time?: Tone.Unit.Time) {
    this._envelope.triggerAttackRelease(duration, time);
  }

  static getDefaults(): FilterEnvelopeOptions {
    const envelope = Tone.FrequencyEnvelope.getDefaults();
    const { octaves, exponent } = envelope;
    return {
      ...Tone.Filter.getDefaults(),
      octaves,
      exponent,
      envelope,
    };
  }
}

export const filterEnvelopeConfig = createConfig(
  createFxClass(FilterEnvelope),
  zBaseSynthFx.extend({
    ...zInnerFilter.shape,
    octaves: z.number().min(-10).max(10).catch(1),
    exponent: z.number().min(0).max(10).catch(0),
    envelope: zEnvelope,
  }),
  {
    setState(node, state, { duration }) {
      node.set({
        ...state,
        rolloff: parseInt(state.rolloff) as Tone.FilterRollOff,
        envelope: {
          ...state.envelope,
          ...calculateEnvelope(state.envelope, duration),
        },
      });
    },
    trigger(node, { duration, delay }) {
      node.triggerAttackRelease(duration, `+${delay}`);
    },
  },
);
