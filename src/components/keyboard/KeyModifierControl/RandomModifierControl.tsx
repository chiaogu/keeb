import { useMemo } from 'react';
import SectionHeader from '../../shared/SectionHeader';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';

export default function RandomModifierControl() {
  const { selectedLayer, updateModifier } = useModiferContext();

  // const modifiedKeys = useMemo(
  //   () => Object.keys(selectedLayer.keys),
  //   [selectedLayer.keys],
  // );

  return (
    <>
      <ModifierKeyboard
        // selectedKeys={selectedKeys}
        // highlightedKeys={highlightedKeys}
        // onPress={toggleKey}
      />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        {/* <SectionHeader
          className='font-bold'
          label={`${modifiedKeys.length} selected`}
        /> */}
        {/* <ModifierControl
          modifier={modifier}
          onChange={(args) =>
            updateModifier({
              ...args,
              keys: [DATA_KEY, ...selectedKeys],
            })
          }
        /> */}
      </div>
    </>
  );
}
