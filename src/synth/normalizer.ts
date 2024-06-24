import { config, SynthState } from './config';

function normalize(key: keyof SynthState, value: number) {
  switch (config[key].type) {
    case 'range': {
      const [min, max] = config[key].range;
      return (value - min) / (max - min);
    }
  }
}

function denormalize(key: keyof SynthState, value?: number) {
  if (value === undefined) return undefined;
  switch (config[key].type) {
    case 'range': {
      const [min, max] = config[key].range;
      return min + (max - min) * value;
    }
  }
}

export function normalizeState(synthState: SynthState) {
  return Object.fromEntries(
    Object.entries(synthState).map(([key, value]) => [
      key,
      normalize(key as keyof SynthState, value),
    ])
  ) as SynthState;
}

export function denormalizeState(synthState: Partial<SynthState>) {
  return Object.fromEntries(
    Object.entries(synthState).map(([key, value]) => [
      key,
      denormalize(key as keyof SynthState, value),
    ])
  );
}
