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

export type SynthNodeControls = Record<string, NodeControlConfig>;

export type SrcNodeType = "metal" | "noise";
export type FxNodeType = "reverb" | "bitCrusher";
export type SynthNodeType = SrcNodeType | FxNodeType;

export const srcNodeConfig: Record<SrcNodeType, SynthNodeControls> = {
  metal: metalSynthConfig,
  noise: noiseSynthConfig,
};

export const fxNodeConfig: Record<FxNodeType, SynthNodeControls> = {
  reverb: reverbConfig,  
  bitCrusher: bitCrusherConfig,
};

export const nodeConfig = {
  ...srcNodeConfig,
  ...fxNodeConfig,
};
