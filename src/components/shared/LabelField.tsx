import { ReactNode } from 'react';

export type LabelFieldProps = {
  label: string;
  children: ReactNode;
  indent?: number;
  className?: string;
  onClick?: () => void;
};

export default function LabelField({
  label,
  children,
  indent = 0,
  className,
  onClick,
}: LabelFieldProps) {
  return (
    <div className='flex w-full items-start'>
      <div
        style={{
          paddingLeft: indent > 0 ? 8 : 0,
          marginLeft: Math.max(0, indent - 1) * 8,
        }}
        className='mr-4 w-36 shrink-0'
      >
        <label
          className={`inline-block bg-white ${className}`}
          onClick={onClick}
        >
          {label}
        </label>
      </div>
      {children}
    </div>
  );
}
