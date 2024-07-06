import { z } from 'zod';
import * as Tone from '@src/tone';
import { amSynthConfig } from './amSynth';
import { amplitudeEnvelopeConfig } from './amplitudeEnvelope';
import { autoFilterConfig } from './autoFilter';
import { autoWahConfig } from './autoWah';
import { baseSynthConfig } from './baseSynth';
import { bitCrusherConfig } from './bitCrusher';
import { chebyshevConfig } from './chebyshev';
import { chorusConfig } from './chorus';
import { compressorConfig } from './compressor';
import { distortionConfig } from './distortion';
import { envelopeFrequencyShifterConfig } from './envelopeFrequencyShifter';
import { eq3Config } from './eq3';
import { feedbackDelayConfig } from './feedbackDelay';
import { fmSynthConfig } from './fmSynth';
import { freeverbConfig } from './freeverb';
import { frequencyShifterConfig } from './frequencyShifter';
import { gateConfig } from './gate';
import { jcreverbConfig } from './jcReverb';
import { limiterConfig } from './limiter';
import { membraneSynthConfig } from './membraneSynth';
import { metalSynthConfig } from './metalSynth';
import { monoSynthConfig } from './monoSynth';
import { multibandCompressorConfig } from './multibandCompressor';
import { noiseSynthConfig } from './noiseSynth';
import { phaserConfig } from './phaser';
import { pingPongDelayConfig } from './pingPongDelay';
import { pitchShiftConfig } from './pitchShift';
import { pluchSynthConfig } from './pluckSynth';
import { reverbConfig } from './reverb';
import { tremoloConfig } from './tremolo';
import { vibratoConfig } from './vibrato';

export type NodeControlConfig = {
  label?: string | null;
};

export type SynthNodeConfig<
  T extends Tone.ToneAudioNode,
  Z extends z.ZodTypeAny,
> = {
  schema: Z;
  createNode: () => T;
  controls?: Partial<Record<keyof z.infer<Z>, NodeControlConfig>>;
  setState?: (node: T, state: z.infer<Z>) => void;
  trigger?: (
    node: T,
    state: z.infer<Z>,
    src: { duration: number; delay: number },
  ) => void;
  ready?: (node: T) => Promise<void>;
};

export const srcNodeConfig = {
  base: baseSynthConfig,
  mono: monoSynthConfig,
  fm: fmSynthConfig,
  am: amSynthConfig,
  noise: noiseSynthConfig,
  pluck: pluchSynthConfig,
  membrane: membraneSynthConfig,
  metal: metalSynthConfig,
};

export const fxNodeConfig = {
  reverb: reverbConfig,
  bitCrusher: bitCrusherConfig,
  autoWah: autoWahConfig,
  chebyshev: chebyshevConfig,
  autoFilter: autoFilterConfig,
  chorus: chorusConfig,
  distortion: distortionConfig,
  feedbackDelay: feedbackDelayConfig,
  freeverb: freeverbConfig,
  frequencyShifter: frequencyShifterConfig,
  envelopeFrequencyShifter: envelopeFrequencyShifterConfig,
  jcReverb: jcreverbConfig,
  phaser: phaserConfig,
  pingPongDelay: pingPongDelayConfig,
  pitchShift: pitchShiftConfig,
  tremolo: tremoloConfig,
  vibrato: vibratoConfig,
  amplitudeEnvelope: amplitudeEnvelopeConfig,
  compressor: compressorConfig,
  eq3: eq3Config,
  multibandCompressor: multibandCompressorConfig,
  gate: gateConfig,
  limiter: limiterConfig,
};

export const nodeConfig = {
  ...srcNodeConfig,
  ...fxNodeConfig,
};

export type SrcNodeType = keyof typeof srcNodeConfig;
export type FxNodeType = keyof typeof fxNodeConfig;
export type SynthNodeType = SrcNodeType | FxNodeType;
