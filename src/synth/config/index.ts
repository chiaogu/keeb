import * as Tone from "@src/tone";
import { z } from "zod";
import { reverbConfig } from "./reverb";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";
import { bitCrusherConfig } from "./bitCrusher";
import { membraneSynthConfig } from "./membraneSynth";
import { pluchSynthConfig } from "./pluckSynth";
import { amSynthConfig } from "./amSynth";

export type NodeControlConfig = {
  label?: string | null;
}

export type SynthNodeConfig<
  T extends Tone.ToneAudioNode,
  Z extends z.ZodTypeAny,
> = {
  schema: Z;
  createNode: () => T;
  controls?: Partial<Record<keyof z.infer<Z>, NodeControlConfig>>;
  setState?: (node: T, state: z.infer<Z>) => void;
  trigger?: (node: T, state: z.infer<Z>) => void;
  ready?: (node: T) => Promise<void>;
};

export const srcNodeConfig = {
  metal: metalSynthConfig,
  noise: noiseSynthConfig,
  membrane: membraneSynthConfig,
  pluck: pluchSynthConfig,
  am: amSynthConfig,
};

export const fxNodeConfig = {
  reverb: reverbConfig,
  bitCrusher: bitCrusherConfig,
};

export const nodeConfig = {
  ...srcNodeConfig,
  ...fxNodeConfig,
};

export type SrcNodeType = keyof typeof srcNodeConfig;
export type FxNodeType = keyof typeof fxNodeConfig;
export type SynthNodeType = SrcNodeType | FxNodeType;
