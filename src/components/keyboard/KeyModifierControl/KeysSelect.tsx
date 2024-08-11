import { keys, modifiers } from '@src/keyboard/keys';
import { CONTROL_SHADOW } from '@src/utils/constants';
import { useCallback } from 'react';

type KeysSelectProps = {
  onSelect: (keys: string[]) => void;
  className?: string;
};

export function KeysSelect({ onSelect, className }: KeysSelectProps) {
  const KeyGroupButton = useCallback(
    ({ label, keys }: { label: string; keys: string[] }) => (
      <button
        style={{ boxShadow: CONTROL_SHADOW }}
        className='mb-2 mr-2 h-8 bg-white px-2 active:invert'
        onClick={() => onSelect(keys)}
      >
        {label}
      </button>
    ),
    [onSelect],
  );

  return (
    <div className={`inline-block w-full ${className}`}>
      <KeyGroupButton label='none' keys={[]} />
      <KeyGroupButton label='all' keys={keys.flat()} />
      {keys.map((row, index) => (
        <KeyGroupButton key={row[0]} label={`r${index + 1}`} keys={row} />
      ))}
      <KeyGroupButton label='modifiers' keys={modifiers} />
    </div>
  );
}
