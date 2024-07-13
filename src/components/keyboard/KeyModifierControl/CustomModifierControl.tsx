import IconButton from '@src/components/shared/IconButton';
import { useCallback, useEffect, useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useImmer } from 'use-immer';
import SectionHeader from '../../shared/SectionHeader';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';

export default function CustomModifierControl() {
  const { selectedLayer, selectedLayerIndex, updateModifier, removeModifier } =
    useModiferContext();
  const [selectedKeys, setSelectedKeys] = useImmer<string[]>([]);
  const highlightedKeys = useMemo(() => {
    if (!selectedLayer) return [];
    return Object.keys(selectedLayer.keys);
  }, [selectedLayer]);

  const toggleKey = useCallback(
    (key: string) => {
      setSelectedKeys((draft) => {
        const index = draft.indexOf(key);
        if (index === -1) {
          draft.push(key);
        } else {
          draft.splice(index, 1);
        }
      });
    },
    [setSelectedKeys],
  );

  useEffect(() => {
    setSelectedKeys([]);
  }, [selectedLayer.id, setSelectedKeys]);

  return (
    <>
      <ModifierKeyboard
        selectedKeys={selectedKeys}
        highlightedKeys={highlightedKeys}
        onPress={toggleKey}
      />
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
                  keys: [selectedKey],
                })
              }
            />
          </Fragment>
        ))}
      </div>
    </>
  );
}
