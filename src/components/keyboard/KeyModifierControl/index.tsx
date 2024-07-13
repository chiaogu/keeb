import IconButton from '@src/components/shared/IconButton';
import { Fragment } from 'react/jsx-runtime';
import SectionHeader from '../../shared/SectionHeader';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';

export default function KeyModifierControl() {
  const {
    selectedKeys,
    selectedLayer,
    selectedLayerIndex,
    updateModifier,
    removeModifier,
    toggleKey,
  } = useModiferContext();

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
      {selectedKeys.length === 0 && 'select a key'}
      {selectedKeys.map((selectedKey) => (
        <Fragment key={selectedKey}>
          <SectionHeader className='font-bold' label={selectedKey}>
            <IconButton
              icon='remove'
              onClick={() => {
                removeModifier(selectedLayerIndex, selectedKey);
                toggleKey(selectedKey);
              }}
            />
          </SectionHeader>
          <ModifierControl
            modifier={selectedLayer.keys[selectedKey] ?? {}}
            onChange={(args) =>
              updateModifier({
                ...args,
                key: selectedKey,
              })
            }
          />
        </Fragment>
      ))}
    </div>
  );
}
