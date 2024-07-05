import * as Tone from "@src/tone";
import { z } from "zod";
import { reverbConfig } from "./reverb";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";
import { bitCrusherConfig } from "./bitCrusher";
import { membraneSynthConfig } from "./membraneSynth";
import { pluchSynthConfig } from "./pluckSynth";
import { amSynthConfig } from "./amSynth";
import { monoSynthConfig } from "./monoSynth";
import { fmSynthConfig } from "./fmSynth";
import { baseSynthConfig } from "./baseSynth";
import { autoWahConfig } from "./autoWah";
import { chebyshevConfig } from "./chebyshev";
import { autoFilterConfig } from "./autoFilter";
import { chorusConfig } from "./chorus";
import { distortionConfig } from "./distortion";
import { feedbackDelayConfig } from "./feedbackDelay";
import { freeverbConfig } from "./freeverb";
import { envelopeFrequencyShifterConfig } from "./envelopeFrequencyShifter";
import { jcreverbConfig } from "./jcReverb";
import { phaserConfig } from "./phaser";
import { pingPongDelayConfig } from "./pingPongDelay";
import { pitchShiftConfig } from "./pitchShift";
import { tremoloConfig } from "./tremolo";
import { vibratoConfig } from "./vibrato";
import { frequencyShifterConfig } from "./frequencyShifter";

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
};

export const nodeConfig = {
  ...srcNodeConfig,
  ...fxNodeConfig,
};

export type SrcNodeType = keyof typeof srcNodeConfig;
export type FxNodeType = keyof typeof fxNodeConfig;
export type SynthNodeType = SrcNodeType | FxNodeType;
