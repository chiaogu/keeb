import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import { SoundStructure } from '@src/components/SoundStructureTree/SoundStructure';
import * as Tone from '@src/tone';
import { get, isEmpty, unset } from 'lodash';
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

export function formatModifierValue(value: unknown) {
  if (typeof value === 'number') {
    return `${((value - 0.5) * 100).toFixed()}%`;
  } else {
    value;
  }
}

export function getSoundStructureFieldPath({
  synthId,
  nodeId,
  fieldPath,
}: SoundFieldPath) {
  return [synthId, nodeId, ...fieldPath];
}

export function getSoundStructureValue<T>(
  structure: SoundStructure<T>,
  field: SoundFieldPath,
) {
  return get(structure, getSoundStructureFieldPath(field));
}

export function removeSoundStructureField<T>(
  structure: SoundStructure<T>,
  field: SoundFieldPath,
) {
  const path = getSoundStructureFieldPath(field);
  
  do {
    unset(structure, path);
    path.pop();
  } while (path.length > 0 && isEmpty(get(structure, path)));

  return structure;
}