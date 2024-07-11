import LabelField, { LabelFieldProps } from './LabelField';

type ReadOnlyProps = {
  label: string;
  value: string;
} & Omit<LabelFieldProps, 'children'>;

export default function ReadOnly({
  label,
  value,
  ...labelFieldProps
}: ReadOnlyProps) {
  return (
    <LabelField label={label} {...labelFieldProps}>
      <div className='flex flex-auto items-center justify-start'>{value}</div>
    </LabelField>
  );
}
