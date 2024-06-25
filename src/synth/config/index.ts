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
