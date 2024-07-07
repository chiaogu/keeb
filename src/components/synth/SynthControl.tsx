import { Synth, SynthConfig } from '@src/synth';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import FxsControl from './FxsControl';
import SrcNodeControl from './SrcNodeControl';

type SynthControlProps = {
  name: string;
  synth: SynthConfig;
  removable: boolean;
  onRemove: () => void;
  onSrcChange: Synth['setSrcState'];
  onFxChange: Synth['setFxState'];
  onAddFx: Synth['addFx'];
  onRemoveFx: Synth['removeFx'];
};

export default function SynthControl({
  synth,
  name,
  removable,
  onRemove,
  onSrcChange,
  onFxChange,
  onAddFx,
  onRemoveFx,
}: SynthControlProps) {
  return (
    <div className='flex w-full flex-col items-center border-2 border-black p-8'>
      <SectionHeader className='font-bold' label={name}>
        {removable && <IconButton icon='remove' onClick={onRemove} />}
      </SectionHeader>
      <SrcNodeControl src={synth.src} onChange={onSrcChange} />
      <FxsControl
        fxs={synth.fxs}
        onAdd={onAddFx}
        onRemove={onRemoveFx}
        onChange={onFxChange}
      />
    </div>
  );
}
