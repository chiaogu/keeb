import { dummySynthConfig } from "./dummySynth";
import { metalSynthConfig } from "./metalSynth";
import { noiseSynthConfig } from "./noiseSynth";

type RangeControlConfig = {
  type: "range";
  range: [number, number];
};

export type NodeControlConfig = {
  defaultValue: number;
} & RangeControlConfig;

export type SynthNodeControls = Record<string, NodeControlConfig>;

export type SrcNodeType = "metal" | "noise";
export type FxNodeType = "dummy";
export type SynthNodeType = SrcNodeType | FxNodeType;

export const nodeConfig: Record<SynthNodeType, SynthNodeControls> = {
  metal: metalSynthConfig,
  noise: noiseSynthConfig,
  dummy: dummySynthConfig,  
};
