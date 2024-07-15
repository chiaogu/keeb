import LabelField from '@src/components/shared/LabelField';
import { keys } from '@src/keyboard/keys';
import { useCallback } from 'react';

type KeysSelectProps = {
  onSelect: (keys: string[]) => void;
};

export function KeysSelect({ onSelect }: KeysSelectProps) {
  const KeyGroupButton = useCallback(
    ({ label, keys }: { label: string; keys: string[] }) => (
      <button className='mr-5 underline' onClick={() => onSelect(keys)}>
        {label}
      </button>
    ),
    [onSelect],
  );

  return (
    <LabelField label='select'>
      <div className='inline-block w-full'>
        <KeyGroupButton label='none' keys={[]} />
        <KeyGroupButton label='all' keys={keys.flat()} />
        {keys.map((row, index) => (
          <KeyGroupButton key={row[0]} label={`r${index + 1}`} keys={row} />
        ))}
      </div>
    </LabelField>
  );
}
