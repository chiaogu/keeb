import { Synth, SynthFxNodeState } from '@src/synth';
import { Immutable } from 'immer';
import { useState } from 'react';
import FxControl from './FxControl';
import NewFx from './NewFx';

type SrcNodeControlProps = Pick<Synth, 'setFxState' | 'removeFx' | 'addFx'> & {
  synthFxs: Immutable<SynthFxNodeState[]>;
};

export default function FxsControl({
  synthFxs,
  setFxState,
  removeFx,
  addFx,
}: SrcNodeControlProps) {
  const [newFxOpen, setNewFxOpen] = useState(false);

  return (
    <div className='flex w-full flex-col items-start'>
      {synthFxs.map((fx, index) => (
        <FxControl
          key={`${fx.type}-${index}`}
          fx={fx}
          onAdd={(type) => addFx(index, type)}
          onRemove={() => removeFx(index)}
          onChange={(fx) => {
            setFxState(index, fx);
          }}
        />
      ))}
      <NewFx
        open={newFxOpen}
        setOpen={setNewFxOpen}
        onSelect={(type) => addFx(synthFxs.length, type)}
      />
    </div>
  );
}
