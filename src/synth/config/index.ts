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
};

export type SrcNodeType = "metal" | "noise";
export type FxNodeType = "reverb" | "bitCrusher";
export type SynthNodeType = SrcNodeType | FxNodeType;

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
