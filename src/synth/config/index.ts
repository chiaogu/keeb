import * as Tone from "@src/tone";
import { reverbConfig } from "./reverb";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";
import { bitCrusherConfig } from "./bitCrusher";

type RangeControlConfig = {
  type: "range";
  range: [number, number];
  defaultValue: number;
  step?: number;
};

type SelectControl = {
  type: "select";
  options: string[];
  defaultValue: string;
};

export type NodeControlConfig = RangeControlConfig | SelectControl;

export type SynthNodeConfig<T extends Tone.ToneAudioNode> = {
  ToneClass: { new (): T };
  controls: Record<string, NodeControlConfig>;
  setState: (node: T, state: Record<string, unknown>) => void;
  trigger?: (node: T) => void;
};

export const srcNodeConfig = {
  metal: metalSynthConfig,
  noise: noiseSynthConfig,
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
