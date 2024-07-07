import useSynthState from '@src/hooks/useSynthState';
import { Synth } from '@src/synth';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import FxsControl from './FxsControl';
import SrcNodeControl from './SrcNodeControl';

type SynthControlProps = {
  name: string;
  synth: Synth;
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
  const synthState = useSynthState(synth);

  return (
    <div className='flex w-full flex-col items-center border-2 border-black p-8'>
      <SectionHeader className='font-bold' label={name}>
        {removable && <IconButton icon='remove' onClick={onRemove} />}
      </SectionHeader>
      <SrcNodeControl
        src={synthState.state.src}
        onChange={(...args) => {
          synthState.setSrcState(...args);
          onSrcChange(...args);
        }}
      />
      <FxsControl
        fxs={synthState.state.fxs}
        onAdd={(...args) => {
          synthState.addFx(...args);
          onAddFx(...args);
        }}
        onRemove={(...args) => {
          synthState.removeFx(...args);
          onRemoveFx(...args);
        }}
        onChange={(...args) => {
          synthState.setFxState(...args);
          onFxChange(...args);
        }}
      />
    </div>
  );
}
