import { useCallback, useMemo } from 'react';
import { useModiferContext } from './ModifierContext';
import ModifierKeyboard from './ModifierKeyboard';
import RandomizationControl from './RandomizationControl';

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
    </>
  );
}
