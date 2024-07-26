import { SoundFieldPath } from '@src/components/keyboard/KeyModifierControl/RandomizationControl';
import { SoundStructure } from '@src/components/SoundStructureTree/SoundStructure';
import { SynthConfig } from '@src/synth';
import { Envelope, zEnvelope } from '@src/synth/config/envelope';
import * as Tone from '@src/tone';
import { WritableDraft } from 'immer';
import { get, isEmpty, isEqual, set, unset } from 'lodash';
import React from 'react';
import { MAX_SAMPLE_SIZE } from './constants';

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

export function resizeCavas(
  w: number,
  h: number,
  ctx: CanvasRenderingContext2D,
) {
  ctx.canvas.width = w * devicePixelRatio;
  ctx.canvas.height = h * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

export function downSample(values: Float32Array) {
  let resampled = new Float32Array(MAX_SAMPLE_SIZE);
  if (values.length > MAX_SAMPLE_SIZE) {
    for (let i = 0; i < MAX_SAMPLE_SIZE; i++) {
      resampled[i] = values[Math.floor((i / MAX_SAMPLE_SIZE) * values.length)];
    }
  } else {
    resampled = values;
  }
  const max = Math.max(0.001, ...resampled) * 1.1;
  const min = Math.min(-0.001, ...resampled) * 1.1;

  return { resampled, min, max };
}

export function scale(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export function clampEnevelop(envelope: Envelope) {
  const { attack } = envelope;
  const decay = Math.max(attack, envelope.decay);
  const release = Math.max(decay, envelope.release);
  return {
    ...envelope,
    release,
    decay,
  };
}

export function calculateEnvelope(
  envelope: Envelope,
  duration: number,
): Envelope {
  const clamped = clampEnevelop(envelope);
  const { attack } = clamped;
  const decay = clamped.decay - attack;
  const release = clamped.release - decay;
  return {
    ...clamped,
    attack: attack * duration,
    decay: decay * duration,
    release: release * duration,
  };
}
