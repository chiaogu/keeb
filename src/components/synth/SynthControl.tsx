import { Synth, SynthConfig } from '@src/synth';
import { COLOR } from '@src/utils/constants';
import SectionHeader from '../shared/SectionHeader';
import FxsControl from './FxsControl';
import SrcNodeControl from './SrcNodeControl';

type SynthControlProps = {
  synth: SynthConfig;
  onSrcChange: Synth['setSrcState'];
  onFxChange: Synth['setFxState'];
  onAddFx: Synth['addFx'];
  onRemoveFx: Synth['removeFx'];
  onNameChange: (name: string) => void;
};

export default function SynthControl({
  synth,
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
      ></SectionHeader>
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
