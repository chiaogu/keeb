import { Synth, SynthConfig } from '@src/synth';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import FxsControl from './FxsControl';
import SrcNodeControl from './SrcNodeControl';
import { COLOR } from '@src/utils/constants';

type SynthControlProps = {
  synth: SynthConfig;
  removable: boolean;
  onRemove: () => void;
  onSrcChange: Synth['setSrcState'];
  onFxChange: Synth['setFxState'];
  onAddFx: Synth['addFx'];
  onRemoveFx: Synth['removeFx'];
  onNameChange: (name: string) => void;
};

export default function SynthControl({
  synth,
  removable,
  onRemove,
  onSrcChange,
  onFxChange,
  onAddFx,
  onRemoveFx,
  onNameChange,
}: SynthControlProps) {
  return (
    <div
      style={{ background: COLOR.BG }}
      className='flex w-full flex-col items-center p-8'
    >
      <SectionHeader
        className='mb-2 font-bold'
        label={synth.name ?? 'untitled'}
        onLabelChange={onNameChange}
      >
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
