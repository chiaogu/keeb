import IconButton from '@src/components/shared/IconButton';
import { isEmpty } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { useModiferContext } from './ModifierContext';
import ModifierControl from './ModifierControl';
import ModifierKeyboard from './ModifierKeyboard';
import { ModifierLayerInfo } from './ModifierLayerInfo';

export default function CustomModifierControl() {
  const {
    selectedLayer,
    selectedLayerIndex,
    addFieldModifier,
    updateFieldModifier,
    removeFieldModifier,
    fixInvalidFields,
    removeModifier,
    soundName,
  } = useModiferContext();
  const highlightedKeys = useMemo(() => {
    if (!selectedLayer) return {};
    return Object.fromEntries(
      Object.entries(selectedLayer.keys)
        .filter(([_key, modifier]) => !isEmpty(modifier))
        .map(([key]) => [key, 1]),
    );
  }, [selectedLayer]);
  const [selectedKeys, setSelectedKeys] = useImmer<string[]>(
    Object.keys(highlightedKeys),
  );

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
      <ModifierLayerInfo className='mb-4'>
        <IconButton
          icon={selectedKeys.length > 0 ? 'remove_selection' : 'select'}
          onClick={() => {
            if (selectedKeys.length > 0) {
              setSelectedKeys([]);
            } else {
              setSelectedKeys(Object.keys(selectedLayer.keys));
            }
          }}
        />
      </ModifierLayerInfo>
      <ModifierKeyboard
        selectedKeys={selectedKeys}
        highlightedKeys={highlightedKeys}
        onPress={toggleKey}
      />
      <div className='mt-8 flex w-full flex-col items-center'>
        {/* {selectedKeys.length === 0 && 'select a key'} */}
        {selectedKeys.map((key) => (
          <ModifierControl
            key={key}
            keyCode={key}
            modifier={selectedLayer.keys[key] ?? {}}
            onChange={(field, modifier) => {
              updateFieldModifier([key], field, modifier);
            }}
            onAdd={(field, node) => {
              addFieldModifier([key], field, node);
            }}
            onFix={(fixingField, newField) => {
              fixInvalidFields(fixingField, newField);
            }}
            onRemove={(field) => {
              removeFieldModifier([key], field);
            }}
            onRemoveKey={() => {
              removeModifier(selectedLayerIndex, [key]);
              toggleKey(key);
            }}
          />
        ))}
      </div>
    </>
  );
}
