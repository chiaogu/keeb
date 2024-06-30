type RadioGroupProps<T extends string> = {
  label: string;
  options: readonly T[];
  value?: T;
  onChange: (value: T) => void;
};

export default function RadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: RadioGroupProps<T>) {
  return (
    <div className="flex w-full">
      <label className="w-32 shrink-0">{label}</label>
      <div className="flex space-x-4">
        {options.map((option) => (
          <div className="flex space-x-1" key={option}>
            <input
              type="radio"
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <label onClick={() => onChange(option)}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
