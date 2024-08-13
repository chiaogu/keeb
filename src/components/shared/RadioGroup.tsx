import { CONTROL_SHADOW } from '@src/utils/constants';
import { useCallback } from 'react';

type Option = { label: string; key: string };

type RadioGroupProps<T> = {
  multi?: boolean;
  options: readonly T[];
  values?: string[];
  onChange: (value: string[]) => void;
  getBackground?: (index: number) => string;
};

function getOptionValue(option: string | Option) {
  return typeof option === 'string' ? option : option.key;
}

export default function RadioGroup<T extends string | Option>({
  values = [],
  onChange,
  options,
  multi,
  getBackground = () => 'black',
}: RadioGroupProps<T>) {
  const handleClick = useCallback(
    (key: string) => {
      if (multi) {
        let newValues: Set<string>;
        if (values.includes(key)) {
          newValues = new Set(values.filter((v) => v !== key));
        } else {
          newValues = new Set([...values, key]);
        }

        const sorted = options
          .filter((o) => newValues.has(getOptionValue(o)))
          .map(getOptionValue);

        onChange(sorted);
      } else {
        onChange([key]);
      }
    },
    [multi, onChange, options, values],
  );

  return (
    <div className='-mb-2 flex flex-wrap'>
      {options.map((option, index) => {
        const key = typeof option === 'string' ? option : option.key;
        const label = typeof option === 'string' ? option : option.label;
        const selected = values.includes(key);

        return (
          <div className='flex space-x-1' key={key}>
            <button
              style={{
                boxShadow: CONTROL_SHADOW,
                background: selected ? getBackground(index) : 'white',
                color: selected ? 'white' : 'black',
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
