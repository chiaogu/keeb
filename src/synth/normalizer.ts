import {
  NodeControlConfig,
  SynthNodeControls,
} from "./config";

function denormalize(config: NodeControlConfig, value?: unknown) {
  if (value === undefined) return undefined;

  switch (config.type) {
    case "range": {
      const [min, max] = config.range;
      return min + (max - min) * (value as number);
    }
  }
}

export function denormalizeState(
  config: SynthNodeControls,
  state: Record<string, unknown>,
) {
  return Object.fromEntries(
    Object.entries(state).map(([key, value]) => [
      key,
      denormalize(config[key], value),
    ]),
  );
}
