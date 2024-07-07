import { ReactNode } from 'react';

type SectionHeaderProps = {
  label: string;
  className?: string;
  children?: ReactNode;
  onLabelChange?: (value: string) => void;
};

export default function SectionHeader({
  label,
  className,
  children,
  onLabelChange,
}: SectionHeaderProps) {
  return (
    <div className={`flex w-full items-end justify-between ${className}`}>
      {onLabelChange ? (
        <input value={label} onChange={(e) => onLabelChange(e.target.value)} />
      ) : (
        <label className='shrink-0'>{label}</label>
      )}
      <div className='flex space-x-4'>{children}</div>
    </div>
  );
}
