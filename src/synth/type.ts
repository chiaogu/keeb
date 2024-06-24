export type SynthState = {
  volume: number;
  harmonicity: number;
};

type RangeStateConfig = {
  type: 'range';
  range: [number, number];
};

export type SynthStateConfig = {
  defaultValue: number;
} & RangeStateConfig;
