import { z } from 'zod';
import * as Tone from '@src/tone';
import createConfig from '../createConfig';
import { zEnvelope } from './envelope';
import { zBaseSynthFx } from './shared';

interface EnvelopeFrequencyShifterOptions extends Tone.EffectOptions {
  frequency: number;
  octaves: number;
  exponent: number;
  envelope: Tone.EnvelopeOptions;
}

export class EnvelopeFrequencyShifter extends Tone.FrequencyShifter {
  private _envelope: Tone.FrequencyEnvelope;

  constructor() {
    super();

    this._envelope = new Tone.FrequencyEnvelope();
    this._envelope.connect(this.frequency);
  }

  set({
    frequency,
    envelope,
    octaves,
    exponent,
    wet,
  }: Tone.RecursivePartial<EnvelopeFrequencyShifterOptions>) {
    if (wet) this.wet.setValueAtTime(wet, 0);
    if (frequency) this._envelope.baseFrequency = frequency;
    if (envelope) this._envelope.set(envelope);
    if (octaves) this._envelope.octaves = octaves;
    if (exponent) this._envelope.exponent = exponent;
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

  static getDefaults(): EnvelopeFrequencyShifterOptions {
    return Object.assign(Tone.Effect.getDefaults(), {
      frequency: 0,
      octaves: 1,
      exponent: 0,
      envelope: Tone.FrequencyEnvelope.getDefaults(),
    });
  }
}

export const envelopeFrequencyShifterConfig = createConfig(
  EnvelopeFrequencyShifter,
  zBaseSynthFx.extend({
    frequency: z.number().min(0).max(5000),
    octaves: z.number().min(-10).max(10).catch(1),
    exponent: z.number().min(0).max(10).catch(0),
    envelope: zEnvelope,
  }),
  {
    trigger(node, _state, { duration, delay }) {
      node.triggerAttackRelease(duration, `+${delay}`);
    },
  },
);
