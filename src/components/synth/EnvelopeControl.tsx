import { Envelope, zEnvelope } from '@src/synth/config/envelope';
import { useCallback, useState } from 'react';
import { useMainContext } from '../shared/MainContext';
import SectionHeader from '../shared/SectionHeader';
import Controls from './Controls';
import { useDebounceCallback } from '@react-hook/debounce';

type EnvelopeProps = {
  label: string;
  envelope: Envelope;
  onChange: (adsr: Envelope) => void;
  indent?: number;
};

export default function EnvelopeControl({
  label,
  envelope,
  onChange,
  indent = 0,
}: EnvelopeProps) {
  const [dragging, setDragging] = useState(false);
  const { setScreen, resetScreen } = useMainContext();
  const { attack, decay, sustain, release } = envelope;

  const handleDrag = useCallback(() => {
    setDragging(true);
    setScreen({
      type: 'adsr',
      envelope: { attack, decay, sustain, release },
    });
  }, [attack, decay, sustain, release, setScreen]);
  
  const reset = useDebounceCallback(() => {
    if (!dragging) resetScreen();
  }, 1000);

  const handleRelease = useCallback(() => {
    setDragging(false);
    reset();
  }, [reset]);

  const handleChange = useCallback(
    (newEnvelope: Record<string, unknown>, key: string) => {
      const e = newEnvelope as Envelope;
      let { attack, decay, release } = e;

      if (key !== 'attack') {
        attack = Math.min(1 - release, Math.min(decay, attack));
      }

      if (key !== 'decay') {
        decay = Math.min(1 - release, Math.max(attack, decay));
      }

      if (key !== 'release') {
        release = 1 - Math.max(attack, Math.max(decay, 1 - release));
      }

      onChange({
        ...e,
        attack,
        decay,
        release,
      });
    },
    [onChange],
  );

  return (
    <div className='flex w-full flex-col items-center'>
      <SectionHeader label={label} />
      <Controls
        indent={indent + 1}
        schema={zEnvelope}
        value={envelope}
        onChange={handleChange}
        onDrag={handleDrag}
        onRelease={handleRelease}
      />
    </div>
  );
}
