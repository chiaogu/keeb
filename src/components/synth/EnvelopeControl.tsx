import { Envelope, zEnvelope } from '@src/synth/config/envelope';
import { useCallback, useEffect } from 'react';
import { useMainContext } from '../shared/MainContext';
import SectionHeader from '../shared/SectionHeader';
import Controls from './Controls';

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
  const { setTimelineVisible } = useMainContext();
  
  const handleDrag = useCallback(() => {
    setTimelineVisible(true);
  }, [setTimelineVisible]);

  const handleRelease = useCallback(() => {
    setTimelineVisible(false);
  }, [setTimelineVisible]);

  return (
    <div className='flex w-full flex-col items-center'>
      <SectionHeader label={label} />
      <Controls
        indent={indent + 1}
        schema={zEnvelope}
        value={envelope}
        onChange={(newEnvelope) => onChange(newEnvelope as Envelope)}
        onDrag={handleDrag}
        onRelease={handleRelease}
      />
    </div>
  );
}
