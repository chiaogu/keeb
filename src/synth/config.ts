export type SynthState = {
  volume: number;
  harmonicity: number;
  modulationIndex: number;
  frequency: number;
  octaves: number;
  resonance: number;
};

type RangeStateConfig = {
  type: 'range';
  range: [number, number];
};

export type SynthStateConfig = {
  defaultValue: number;
} & RangeStateConfig;


export const config: Record<keyof SynthState, SynthStateConfig> = {
  volume: {
    defaultValue: 0.74,
    type: 'range',
    range: [-80, -5],
  },
  harmonicity: {
    defaultValue: 0.5,
    type: 'range',
    range: [0.1, 10],
  },
  modulationIndex: {
    defaultValue: 0.5,
    type: 'range',
    range: [1, 100],
  },
  frequency: {
    defaultValue: 0.225,
    type: 'range',
    range: [0, 5000],
  },
  octaves: {
    defaultValue: 0.333,
    type: 'range',
    range: [-10, 10],
  },
  resonance: {
    defaultValue: 1,
    type: 'range',
    range: [0, 7000],
  },
};