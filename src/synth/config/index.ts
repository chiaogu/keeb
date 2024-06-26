import { reverbConfig } from "./reverb";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";

type RangeControlConfig = {
  type: "range";
  range: [number, number];
  defaultValue: number;
};

type SelectControl = {
  type: "select";
  options: string[];
  defaultValue: string;
};

export type NodeControlConfig = RangeControlConfig | SelectControl;

export type SynthNodeControls = Record<string, NodeControlConfig>;

export type SrcNodeType = "metal" | "noise";
export type FxNodeType = "reverb";

export const nodeConfig: Record<SrcNodeType | FxNodeType, SynthNodeControls> = {
  metal: metalSynthConfig,
  noise: noiseSynthConfig,
  reverb: reverbConfig,  
};
