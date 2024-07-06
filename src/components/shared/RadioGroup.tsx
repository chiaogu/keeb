import LabelField, { LabelFieldProps } from './LabelField';

type RadioGroupProps<T extends string> = {
  label: string;
  options: readonly T[];
  value?: T;
  onChange: (value: T) => void;
} & Omit<LabelFieldProps, 'children'>;

export default function RadioGroup<T extends string>({
  value,
  onChange,
  options,
  ...labelFields
}: RadioGroupProps<T>) {
  return (
    <LabelField {...labelFields}>
      <div className='flex flex-wrap'>
        {options.map((option) => (
          <div className='mr-4 flex space-x-1' key={option}>
            <input
              type='radio'
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <label onClick={() => onChange(option)}>{option}</label>
          </div>
        ))}
      </div>
    </LabelField>
  );
}
