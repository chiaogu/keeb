import { CONTROL_SHADOW } from '@src/utils/constants';
import { useCallback } from 'react';

type Option = { label: string; key: string };

type RadioGroupProps<T> = {
  multi?: boolean;
  options: readonly T[];
  values?: string[];
  onChange: (value: string[]) => void;
  getBackground?: (start: number, end: number) => string;
};

export default function RadioGroup<T extends string | Option>({
  values = [],
  onChange,
  options,
  multi,
}: RadioGroupProps<T>) {
  const handleClick = useCallback(
    (key: string) => {
      if (multi) {
        if (values.includes(key)) {
          onChange(values.filter((v) => v !== key));
        } else {
          onChange([...values, key]);
        }
      } else {
        onChange([key]);
      }
    },
    [multi, onChange, values],
  );

  return (
    <div className='-mb-2 flex flex-wrap'>
      {options.map((option) => {
        const key = typeof option === 'string' ? option : option.key;
        const label = typeof option === 'string' ? option : option.label;
        const selected = values.includes(key);
        // const selectedBackground
        return (
          <div className='flex space-x-1' key={key}>
            <button
              style={{
                boxShadow: CONTROL_SHADOW,
                background: 'black',
                color: 'white',
                filter: selected ? undefined : 'invert(1)',
              }}
              className='mb-2 mr-2 h-8 px-2 active:invert'
              key={key}
              onClick={() => handleClick(key)}
            >
              {label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
