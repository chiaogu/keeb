import { ReactNode } from 'react';

export type LabelFieldProps = {
  label: string;
  children: ReactNode;
  indent?: number;
};

export default function LabelField({
  label,
  children,
  indent = 0,
}: LabelFieldProps) {
  return (
    <div className='flex w-full'>
      <label className={`mr-4 w-36 shrink-0 ${indent > 0 ? 'pl-2' : ''}`}>
        {label}
      </label>
      {children}
    </div>
  );
}
