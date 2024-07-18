import { useDebounceCallback } from '@react-hook/debounce';
import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import { keys } from '@src/keyboard/keys';
import { getFieldRandomSeed } from '@src/keyboard/keySoundModifier';
import { FieldRandomConfig, ModifierLayer, RandomizationConfig } from '@src/types';
import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { KeysSelect } from './KeysSelect';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';
import RandomizationControl, { SoundFieldPath } from './RandomizationControl';
import SoundFieldPicker from './SoundFieldPicker';
import { set } from 'lodash';

const KeysDebug = memo(
  ({
    modifiedKeys,
    modifierKeys,
  }: {
    modifiedKeys: { [key: string]: number };
    modifierKeys: ModifierLayer['keys'];
  }) => {
    return (
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        {Object.keys(modifiedKeys).map((selectedKey) => (
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
  const [fixingField, setFixingField] = useState<SoundFieldPath>();
  const [selectingField, setSelectingField] = useState<'add' | 'fix' | false>(
    false,
  );
  const selectedLayer = useSelectedLayer();
  const {
    batchSetModifier,
    selectedLayerIndex,
    updateRandomConfig,
    removeModifier,
    soundName,
    fixRandomConfig,
    addRandomConfig,
  } = useModiferContext();

  const modifiedKeys = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selectedLayer.keys).map(([key, modifier]) => {
          return [key, getFieldRandomSeed(modifier) ?? 1];
        }),
      ),
    [selectedLayer.keys],
  );

  const toggleKey = useCallback(
    (key: string) => {
      if (modifiedKeys[key]) {
        removeModifier(selectedLayerIndex, [key]);
      } else {
        batchSetModifier(selectedLayerIndex, [key]);
      }
    },
    [modifiedKeys, batchSetModifier, removeModifier, selectedLayerIndex],
  );

  return (
    <>
      <ModifierKeyboard highlightedKeys={modifiedKeys} onPress={toggleKey} />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        <KeysSelect
          onSelect={(selectedKeys) => {
            removeModifier(selectedLayerIndex, keys.flat());
            batchSetModifier(selectedLayerIndex, selectedKeys);
          }}
        />
        <SectionHeader label='modifier' className='mt-4 font-bold'>
          <IconButton
            icon='ifl'
            onClick={() => {
              removeModifier(selectedLayerIndex, keys.flat());
              batchSetModifier(
                selectedLayerIndex,
                Object.keys(selectedLayer.keys),
              );
            }}
          />
        </SectionHeader>
        <RandomizationControl
          radomConfig={selectedLayer.config}
          onChange={updateRandomConfig}
          onClickInvalidField={(args) => {
            setSelectingField('fix');
            setFixingField(args);
          }}
          onClickAdd={() => {
            setSelectingField('add');
          }}
        />
        {selectingField && (
          <>
            <SectionHeader label={soundName} className='mt-4 font-bold'>
              <IconButton
                icon='close'
                onClick={() => {
                  setSelectingField(false);
                  setFixingField(undefined);
                }}
              />
            </SectionHeader>
            <SoundFieldPicker
              onSelect={(newField, node) => {
                if (selectingField === 'fix' && fixingField) {
                  fixRandomConfig(fixingField, newField);
                } if (selectingField === 'add' && node) {
                  addRandomConfig(newField, node);
                }
                setSelectingField(false);
                setFixingField(undefined);
              }}
            />
          </>
        )}
      </div>
      <KeysDebug
        modifiedKeys={modifiedKeys}
        modifierKeys={selectedLayer.keys}
      />
    </>
  );
}
