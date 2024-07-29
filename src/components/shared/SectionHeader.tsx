import { ReactNode } from 'react';

type SectionHeaderProps = {
  label: string;
  className?: string;
  children?: ReactNode;
  onLabelChange?: (value: string) => void;
  labelClassName?: string;
};

export default function SectionHeader({
  label,
  className,
  children,
  onLabelChange,
  labelClassName,
}: SectionHeaderProps) {
  return (
    <div className={`flex w-full h-8 items-center justify-between ${className}`}>
      {onLabelChange ? (
        <input className='h-full rounded-none bg-white caret-black focus:outline-none' value={label} onChange={(e) => onLabelChange(e.target.value)} />
      ) : (
        <label className={`shrink-0 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className='flex space-x-4'>{children}</div>
    </div>
  );
}
