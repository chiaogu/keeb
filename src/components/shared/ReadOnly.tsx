import LabelField, { LabelFieldProps } from './LabelField';

type ReadOnlyProps = {
  label: string;
  value?: React.ReactNode;
} & Omit<LabelFieldProps, 'children'>;

export default function ReadOnly({
  label,
  value,
  ...labelFieldProps
}: ReadOnlyProps) {
  return (
    <LabelField label={label} {...labelFieldProps}>
      {value && <div className='flex flex-auto items-center justify-end'>{value}</div>}
    </LabelField>
  );
}
