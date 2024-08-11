import { CONTROL_SHADOW } from '@src/utils/constants';
import { useCallback } from 'react';
import { LabelFieldProps } from './LabelField';

type Option = { label: string; key: string };

type RadioGroupProps<T> = {
  multi?: boolean;
  label: string;
  options: readonly T[];
  values?: string[];
  onChange: (value: string[]) => void;
} & Omit<LabelFieldProps, 'children'>;

export default function RadioGroup<T extends string | Option>({
  values = [],
  onChange,
  options,
  multi,
  ...labelFields
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
    <div className='flex flex-wrap'>
      {options.map((option) => {
        const key = typeof option === 'string' ? option : option.key;
        const label = typeof option === 'string' ? option : option.label;
        return (
          <div className='mr-4 flex space-x-1' key={key}>
            {/* <input
                type='radio'
                value={label}
                checked={values.includes(key)}
                onChange={() => handleClick(key)}
              />
              <label onClick={() => handleClick(key)}>{label}</label> */}
            <button
              style={{ boxShadow: CONTROL_SHADOW }}
              className='mb-2 mr-2 h-8 bg-white px-2 active:invert'
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
