import { Frequency } from "tone/build/esm/core/type/Units";

export function frequencyToHertz(value: Frequency): number {
  const frequency = value.valueOf();
  return typeof frequency === "string" ? parseFloat(frequency) : frequency;
}