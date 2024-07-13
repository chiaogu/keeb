import { DATA_KEY } from '@src/hooks/useKeyboardSound';
import { useMemo } from 'react';
import SectionHeader from '../../shared/SectionHeader';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';

export default function RandomModifierControl() {
  const {
    selectedKeys,
    selectedLayer,
    selectedLayerIndex,
    updateModifier,
    removeModifier,
    toggleKey,
  } = useModiferContext();

  const modifier = useMemo(
    () => selectedLayer.keys[DATA_KEY],
    [selectedLayer.keys],
  );

  const modifiedKeys = useMemo(
    () => Object.keys(selectedLayer.keys).filter((key) => key !== DATA_KEY),
    [selectedLayer.keys],
  );

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      <SectionHeader
        className='font-bold'
        label={`${modifiedKeys.length} selected`}
      />
      <ModifierControl
        modifier={modifier}
        onChange={(args) =>
          updateModifier({
            ...args,
            keys: [DATA_KEY, ...selectedKeys],
          })
        }
      />
    </div>
  );
}
