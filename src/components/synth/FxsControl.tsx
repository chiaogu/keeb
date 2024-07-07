import { Synth, SynthFxNodeState } from '@src/synth';
import { Immutable } from 'immer';
import { useState } from 'react';
import FxControl from './FxControl';
import NewFx from './NewFx';

type SrcNodeControlProps = {
  fxs: Immutable<SynthFxNodeState[]>;
  onChange: Synth['setFxState'];
  onRemove: Synth['removeFx'];
  onAdd: Synth['addFx'];
};

export default function FxsControl({
  fxs,
  onChange,
  onRemove,
  onAdd,
}: SrcNodeControlProps) {
  const [newFxOpen, setNewFxOpen] = useState(false);

  return (
    <div className='flex w-full flex-col items-start'>
      {fxs.map((fx, index) => (
        <FxControl
          key={`${fx.type}-${index}`}
          fx={fx}
          onAdd={(type) => onAdd(index, type)}
          onRemove={() => onRemove(index)}
          onChange={(fx) => onChange(index, fx)}
        />
      ))}
      <NewFx
        open={newFxOpen}
        setOpen={setNewFxOpen}
        onSelect={(type) => onAdd(fxs.length, type)}
      />
    </div>
  );
}
