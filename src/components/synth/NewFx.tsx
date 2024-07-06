import { FxNodeType } from '@src/synth/config';
import { useCallback } from 'react';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import NodeTypeSelect from './NodeTypeSelect';

type NewFxProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (type: FxNodeType) => void;
};

export default function NewFx({ onSelect, open, setOpen }: NewFxProps) {
  const toggleSelecting = useCallback(() => setOpen((v) => !v), [setOpen]);

  return (
    <div className='flex w-full flex-col'>
      <SectionHeader className='mt-4 font-bold' label='fx'>
        <IconButton icon={open ? 'close' : 'add'} onClick={toggleSelecting} />
      </SectionHeader>
      {open && (
        <NodeTypeSelect
          type='fx'
          onSelect={(type) => {
            setOpen(false);
            onSelect(type as FxNodeType);
          }}
        />
      )}
    </div>
  );
}
