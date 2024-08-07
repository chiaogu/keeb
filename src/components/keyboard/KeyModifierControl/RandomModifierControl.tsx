import IconButton from '@src/components/shared/IconButton';
import SectionHeader from '@src/components/shared/SectionHeader';
import { keys } from '@src/keyboard/keys';
import { ModifierLayer } from '@src/types';
import { Fragment, memo, useCallback, useMemo, useState } from 'react';
import { KeysSelect } from './KeysSelect';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';
import { ModifierLayerInfo } from './ModifierLayerInfo';
import RandomizationControl, { SoundFieldPath } from './RandomizationControl';
import SoundFieldPicker from './SoundFieldPicker';

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
            <ModifierControl
              soundName='Debug'
              modifier={modifierKeys[selectedKey] ?? {}}
            />
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
    fixInvalidFields,
    addRandomConfig,
  } = useModiferContext();

  const modifiedKeys = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(selectedLayer.keys).map((key) => {
          return [key, selectedLayer.randomSeed[key] ?? 1];
        }),
      ),
    [selectedLayer.keys, selectedLayer.randomSeed],
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
      <div className='flex w-full max-w-[500px] flex-col items-center'>
        <ModifierLayerInfo />
        <KeysSelect
          onSelect={(selectedKeys) => {
            removeModifier(selectedLayerIndex, keys.flat());
            batchSetModifier(selectedLayerIndex, selectedKeys);
          }}
        />
        <SectionHeader label='randomize'>
          <IconButton
            icon='ifl'
            onClick={() => {
              removeModifier(selectedLayerIndex, keys.flat());
              batchSetModifier(
                selectedLayerIndex,
                Object.keys(selectedLayer.keys),
                true,
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
          selectingField={!!selectingField}
          selectedField={fixingField}
        />
        {selectingField && (
          <SoundFieldPicker
            soundName={soundName}
            onSelect={(newField, node) => {
              if (selectingField === 'fix' && fixingField) {
                fixInvalidFields(fixingField, newField);
              }
              if (selectingField === 'add' && node) {
                addRandomConfig(newField, node);
              }
              setSelectingField(false);
              setFixingField(undefined);
            }}
            onClose={() => {
              setSelectingField(false);
              setFixingField(undefined);
            }}
          />
        )}
      </div>
      {/* <KeysDebug
        modifiedKeys={modifiedKeys}
        modifierKeys={selectedLayer.keys}
      /> */}
    </>
  );
}
