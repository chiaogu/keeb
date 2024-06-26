import * as Tone from "@src/tone";

export function frequencyToHertz(value: Tone.Unit.Frequency): number {
  const frequency = value.valueOf();
  return typeof frequency === "string" ? parseFloat(frequency) : frequency;
}