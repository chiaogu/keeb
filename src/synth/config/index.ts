import * as Tone from "@src/tone";
import { reverbConfig } from "./reverb";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";
import { bitCrusherConfig } from "./bitCrusher";
import { membraneSynthConfig } from "./membraneSynth";
import { Envelope } from "@src/types";

export type NodeControlConfig =
  | {
      type: "range";
      range: [number, number];
      defaultValue: number;
      step?: number;
    }
  | {
      type: "select";
      options: string[];
      defaultValue: string;
    }
  | {
      type: "envelope";
      defaultValue: Envelope;
    };

export type SynthNodeConfig<T extends Tone.ToneAudioNode> = {
  controls: Record<string, NodeControlConfig>;
  createNode: () => T;
  setState: (node: T, state: Record<string, unknown>) => void;
  trigger?: (node: T, state: Record<string, unknown>) => void;
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
