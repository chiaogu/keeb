import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import { keys } from '@src/keyboard/keys';
import { ModifierLayer, RandomizationConfig } from '@src/types';
import { Fragment, memo, useCallback, useMemo } from 'react';
import { KeysSelect } from './KeysSelect';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';
import RandomizationControl from './RandomizationControl';

const KeysDebug = memo(
  ({
    modifiedKeys,
    modifierKeys,
  }: {
    modifiedKeys: string[];
    modifierKeys: ModifierLayer['keys'];
  }) => {
    return (
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        {modifiedKeys.map((selectedKey) => (
          <Fragment key={selectedKey}>
            <SectionHeader className='font-bold' label={selectedKey} />
            <ModifierControl modifier={modifierKeys[selectedKey] ?? {}} />
          </Fragment>
        ))}
      </div>
    );
  },
);

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
        removeModifier(selectedLayerIndex, [key]);
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

  const handleConfigChange = useCallback(
    (config: RandomizationConfig) =>
      updateRandomConfig(selectedLayerIndex, config),
    [selectedLayerIndex, updateRandomConfig],
  );

  return (
    <>
      <ModifierKeyboard highlightedKeys={modifiedKeys} onPress={toggleKey} />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        <SectionHeader label='keys' className='mt-4 font-bold' />
        <KeysSelect
          onSelect={(selectedKeys) => {
            removeModifier(selectedLayerIndex, keys.flat());
            randomizeModifier(
              selectedLayerIndex,
              selectedKeys,
              selectedLayer.config,
            );
          }}
        />
        <SectionHeader label='modifier' className='mt-4 font-bold'>
          <IconButton icon='ifl' />
        </SectionHeader>
        <RandomizationControl
          radomConfig={selectedLayer.config}
          onChange={handleConfigChange}
        />
      </div>
      {/* TODO: Remove */}
      <KeysDebug
        modifiedKeys={modifiedKeys}
        modifierKeys={selectedLayer.keys}
      />
    </>
  );
}
