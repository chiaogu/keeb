import { Fragment, useCallback, useMemo } from 'react';
import { useModiferContext } from './ModifierContext';
import ModifierKeyboard from './ModifierKeyboard';
import RandomizationControl from './RandomizationControl';
import SectionHeader from '@src/components/shared/SectionHeader';
import IconButton from '@src/components/shared/IconButton';
import ModifierControl from './ModifierControl';

function useSelectedLayer() {
  const { selectedLayer } = useModiferContext();
  if (selectedLayer.type !== 'random') {
    throw new Error(
      `${selectedLayer.type} is not supported in RandomModifierControl`,
    );
  }
  return selectedLayer;
}

export default function RandomModifierControl() {
  const selectedLayer = useSelectedLayer();
  const {
    randomizeModifier,
    selectedLayerIndex,
    updateRandomConfig,
    removeModifier,
  } = useModiferContext();

  const modifiedKeys = useMemo(
    () => Object.keys(selectedLayer.keys),
    [selectedLayer.keys],
  );

  const toggleKey = useCallback(
    (key: string) => {
      if (modifiedKeys.includes(key)) {
        removeModifier(selectedLayerIndex, key);
      } else {
        randomizeModifier(selectedLayerIndex, [key], selectedLayer.config);
      }
    },
    [
      modifiedKeys,
      randomizeModifier,
      removeModifier,
      selectedLayer.config,
      selectedLayerIndex,
    ],
  );

  return (
    <>
      <ModifierKeyboard highlightedKeys={modifiedKeys} onPress={toggleKey} />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        <RandomizationControl
          radomConfig={selectedLayer.config}
          onChange={(config) => updateRandomConfig(selectedLayerIndex, config)}
        />
      </div>
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        {modifiedKeys.map((selectedKey) => (
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
              onChange={() => {}}
            />
          </Fragment>
        ))}
      </div>
    </>
  );
}
