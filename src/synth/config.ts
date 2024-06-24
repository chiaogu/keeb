import { SynthState, SynthStateConfig } from "./type";

export const config: Record<keyof SynthState, SynthStateConfig> = {
  volume: {
    defaultValue: 0.5,
    type: 'range',
    range: [-80, -5],
  },
  harmonicity: {
    defaultValue: 0.5,
    type: 'range',
    range: [0.1, 10],
  },
};