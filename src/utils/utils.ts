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
