import { useState } from 'react';
import { SynthFxNodeState } from '@src/synth';
import { FxNodeType, nodeConfig } from '@src/synth/config';
import { splitCamelCase } from '@src/utils/utils';
import SectionHeader from '../shared/SectionHeader';
import Controls from './Controls';
import NewFx from './NewFx';
import IconButton from '../shared/IconButton';

type FxControlProps = {
  fx: SynthFxNodeState;
  onRemove: () => void;
  onChange: (fx: SynthFxNodeState) => void;
  onAdd: (node: FxNodeType) => void;
};

export default function FxControl({
  fx,
  onRemove,
  onChange,
  onAdd,
}: FxControlProps) {
  const [newFxOpen, setNewFxOpen] = useState(false);
  return (
    <>
      {newFxOpen && (
        <NewFx open={newFxOpen} setOpen={setNewFxOpen} onSelect={onAdd} />
      )}
      <SectionHeader className='mt-4 font-bold' label={splitCamelCase(fx.type)}>
        <IconButton icon='remove' onClick={onRemove} />
        <IconButton icon='add' onClick={() => setNewFxOpen(true)} />
      </SectionHeader>
      <Controls
        schema={nodeConfig[fx.type].schema}
        controls={nodeConfig[fx.type].controls}
        value={fx.data}
        onChange={(data) => onChange({ ...fx, data })}
      />
    </>
  );
}
