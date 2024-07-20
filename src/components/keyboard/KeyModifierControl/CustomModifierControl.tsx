import IconButton from '@src/components/shared/IconButton';
import { useCallback, useMemo } from 'react';
import { useImmer } from 'use-immer';
import SectionHeader from '../../shared/SectionHeader';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';

export default function CustomModifierControl() {
  const {
    selectedLayer,
    selectedLayerIndex,
    addFieldModifier,
    updateFieldModifier,
    removeFieldModifier,
    fixFieldModifier,
    removeModifier,
    soundName,
  } = useModiferContext();
  const [selectedKeys, setSelectedKeys] = useImmer<string[]>([]);
  const highlightedKeys = useMemo(() => {
    if (!selectedLayer) return {};
    return Object.fromEntries(
      Object.keys(selectedLayer.keys).map((key) => [key, 1]),
    );
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

  return (
    <>
      <ModifierKeyboard
        selectedKeys={selectedKeys}
        highlightedKeys={highlightedKeys}
        onPress={toggleKey}
      />
      <div className='flex w-full max-w-[500px] flex-col items-center border-2 border-black p-8'>
        {selectedKeys.length === 0 && 'select a key'}
        {selectedKeys.map((key) => (
          <div key={key} className='mb-4 flex w-full flex-col'>
            <SectionHeader className='font-bold' label={key}>
              <IconButton
                icon='remove'
                onClick={() => {
                  removeModifier(selectedLayerIndex, [key]);
                  toggleKey(key);
                }}
              />
            </SectionHeader>
            <ModifierControl
              soundName={soundName}
              modifier={selectedLayer.keys[key] ?? {}}
              onChange={(field, modifier) => {
                updateFieldModifier([key], field, modifier);
              }}
              onAdd={(field, node) => {
                addFieldModifier([key], field, node);
              }}
              onFix={(fixingField, newField) => {
                fixFieldModifier([key], fixingField, newField);
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
