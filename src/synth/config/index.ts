import * as Tone from "@src/tone";
import { reverbConfig } from "./reverb";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";
import { bitCrusherConfig } from "./bitCrusher";
import { membraneSynthConfig } from "./membraneSynth";
import { z } from "zod";

export type NodeControlConfig =
  | {
      type: "range";
    }
  | {
      type: "select";
    }
  | {
      type: "envelope";
    };

export type SynthNodeConfig<
  T extends Tone.ToneAudioNode,
  Z extends z.ZodTypeAny,
> = {
  schema: Z;
  controls?: Partial<Record<keyof z.infer<Z>, NodeControlConfig>>;
  createNode: () => T;
  setState: (node: T, state: z.infer<Z>) => void;
  trigger?: (node: T, state: z.infer<Z>) => void;
  ready?: (node: T) => Promise<void>;
};

export const srcNodeConfig = {
  metal: metalSynthConfig,
  noise: noiseSynthConfig,
  membrane: membraneSynthConfig,
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
