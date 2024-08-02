import { CONTROL_SHADOW } from '@src/utils/constants';
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
    <div
      className={`flex h-8 w-full items-center justify-between ${className}`}
    >
      {onLabelChange ? (
        <input
          style={{ boxShadow: CONTROL_SHADOW }}
          className='h-full rounded-none bg-white pl-2 caret-black focus:outline-none'
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
        />
      ) : (
        <label className={`shrink-0 ${labelClassName}`}>{label}</label>
      )}
      <div className='flex items-center space-x-2'>{children}</div>
    </div>
  );
}
