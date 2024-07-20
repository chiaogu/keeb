import LabelField from '@src/components/shared/LabelField';
import { keys } from '@src/keyboard/keys';
import { useCallback } from 'react';

type KeysSelectProps = {
  onSelect: (keys: string[]) => void;
  className?: string;
};

export function KeysSelect({ onSelect, className }: KeysSelectProps) {
  const KeyGroupButton = useCallback(
    ({ label, keys }: { label: string; keys: string[] }) => (
      <button className='mr-5 underline' onClick={() => onSelect(keys)}>
        {label}
      </button>
    ),
    [onSelect],
  );

  return (
    <LabelField label='keys'>
      <div className={`inline-block w-full ${className}`}>
        <KeyGroupButton label='none' keys={[]} />
        <KeyGroupButton label='all' keys={keys.flat()} />
        {keys.map((row, index) => (
          <KeyGroupButton key={row[0]} label={`r${index + 1}`} keys={row} />
        ))}
      </div>
    </LabelField>
  );
}
