import useSynthState from '@src/hooks/useSynthState';
import { Synth } from '@src/synth';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import FxsControl from './FxsControl';
import SrcNodeControl from './SrcNodeControl';

type SynthControlProps = {
  name: string;
  synth: Synth;
  onRemove: () => void;
  removable: boolean;
};

export default function SynthControl({
  synth,
  name,
  onRemove,
  removable,
}: SynthControlProps) {
  const synthState = useSynthState(synth);

  return (
    <div className='flex w-full flex-col items-center border-2 border-black p-8'>
      <SectionHeader className='font-bold' label={name}>
        {removable && <IconButton icon='remove' onClick={onRemove} />}
      </SectionHeader>
      <SrcNodeControl synth={synthState} />
      <FxsControl synth={synthState} />
    </div>
  );
}
