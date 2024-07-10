import LabelField from './LabelField';

type ReadOnlyProps = {
  label: string;
  value: string;
};

export default function ReadOnly({ label, value }: ReadOnlyProps) {
  return (
    <LabelField label={label}>
      <div className='flex flex-auto items-center justify-start'>{value}</div>
    </LabelField>
  );
}
