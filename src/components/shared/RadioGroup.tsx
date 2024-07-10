import LabelField, { LabelFieldProps } from './LabelField';

type Option = { label: string; key: string };

type RadioGroupProps<T> = {
  label: string;
  options: readonly T[];
  value?: string;
  onChange: (value: string) => void;
} & Omit<LabelFieldProps, 'children'>;

export default function RadioGroup<T extends string | Option>({
  value,
  onChange,
  options,
  ...labelFields
}: RadioGroupProps<T>) {
  return (
    <LabelField {...labelFields}>
      <div className='flex flex-wrap'>
        {options.map((option) => {
          const key = typeof option === 'string' ? option : option.key;
          const label = typeof option === 'string' ? option : option.label;
          return (
            <div className='mr-4 flex space-x-1' key={key}>
              <input
                type='radio'
                value={label}
                checked={value === key}
                onChange={() => onChange(key)}
              />
              <label onClick={() => onChange(key)}>{label}</label>
            </div>
          );
        })}
      </div>
    </LabelField>
  );
}
