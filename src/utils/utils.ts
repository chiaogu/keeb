import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import { SoundStructure } from '@src/components/SoundStructureTree/SoundStructure';
import { SynthConfig } from '@src/synth';
import { nodeConfig } from '@src/synth/config';
import { Envelope, zEnvelope } from '@src/synth/config/envelope';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import * as Tone from '@src/tone';
import { WritableDraft } from 'immer';
import { get, isEmpty, isEqual, set, unset } from 'lodash';
import React from 'react';
import { z } from 'zod';

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
  structure: SoundStructure<T> | WritableDraft<SoundStructure<T>>,
  field: SoundFieldPath,
) {
  return get(structure, getSoundStructureFieldPath(field));
}

export function removeSoundStructureField<T>(
  structure: SoundStructure<T> | WritableDraft<SoundStructure<T>>,
  field: SoundFieldPath,
) {
  const path = getSoundStructureFieldPath(field);

  do {
    unset(structure, path);
    path.pop();
  } while (path.length > 0 && isEmpty(get(structure, path)));

  return structure;
}

export function replaceSoundStructureField<T>(
  structure: SoundStructure<T> | WritableDraft<SoundStructure<T>>,
  oldField: SoundFieldPath,
  newField: SoundFieldPath,
) {
  const value = getSoundStructureValue(structure, oldField);
  if (value) {
    set(structure, getSoundStructureFieldPath(newField), value);
    removeSoundStructureField(structure, oldField);
  }
}

export function isSoundFieldPathEqual(
  fieldA: SoundFieldPath,
  fieldB: SoundFieldPath,
) {
  return isEqual(
    {
      synthId: fieldA.synthId,
      nodeId: fieldA.nodeId,
      fieldPath: fieldA.fieldPath,
    },
    {
      synthId: fieldB.synthId,
      nodeId: fieldB.nodeId,
      fieldPath: fieldB.fieldPath,
    },
  );
}

export function findEnvelope({ src, fxs }: SynthConfig) {
  if (src.data.envelope) {
    return zEnvelope.parse(src.data.envelope) as Envelope;
  }
  
  const fxEnvelope = fxs.find((fx) => fx.type === 'amplitudeEnvelope');
  if (fxEnvelope) {
    return zEnvelope.parse(fxEnvelope.data) as Envelope;
  }
}
