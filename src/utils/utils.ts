import { SoundStructure } from '@src/components/SoundStructureTree/SoundStructure';
import * as Tone from '@src/tone';
import React from 'react';

export function frequencyToHertz(value: Tone.Unit.Frequency): number {
  const frequency = value.valueOf();
  return typeof frequency === 'string' ? parseFloat(frequency) : frequency;
}

export function splitCamelCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
}

interface IdentityFunction {
  <T>(fn: T): T;
}
export const typedMemo: IdentityFunction = React.memo;

export function findFirstField<T>(
  obj: SoundStructure<T>,
): { synthId: string; nodeId: string; field: string; value: T } | undefined {
  const firstLayer = Object.entries(obj);
  if (firstLayer.length === 0) return undefined;

  const [synthId, nodes] = firstLayer[0];
  const secondLayer = Object.entries(nodes);
  if (secondLayer.length === 0) return undefined;

  const [nodeId, fields] = secondLayer[0];
  const thirdLayer = Object.entries(fields);
  if (thirdLayer.length === 0) return undefined;

  const [field, value] = thirdLayer[0];

  return {
    synthId,
    nodeId,
    field,
    value,
  };
}

export function formatModifierValue(value: unknown) {
  if (typeof value === 'number') {
    return `${((value - 0.5) * 100).toFixed()}%`;
  } else {
    value;
  }
}