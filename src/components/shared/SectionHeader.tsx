import { CONTROL_SHADOW } from '@src/utils/constants';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';

type SectionHeaderProps = {
  label: string;
  className?: string;
  children?: ReactNode;
  onLabelChange?: (value: string) => void;
  labelClassName?: string;
  labelStyle?: CSSProperties;
};

export default function SectionHeader({
  label,
  className,
  children,
  onLabelChange,
  labelClassName,
  labelStyle,
}: SectionHeaderProps) {
  const [span, setSpan] = useState<HTMLSpanElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(span?.clientWidth ?? 0);
  }, [span?.clientWidth, label]);

  return (
    <div
      className={`flex h-8 w-full items-center justify-between ${className}`}
    >
      {onLabelChange ? (
        <div
          className='relative h-full w-fit overflow-hidden bg-white'
          style={{ boxShadow: CONTROL_SHADOW }}
        >
          <span
            className='pointer-events-none absolute flex h-full min-w-8 items-center truncate whitespace-nowrap p-2 font-medium'
            ref={setSpan}
          >
            {label}
          </span>
          <input
            style={{ width }}
            className='h-full rounded-none pl-2 text-transparent caret-black focus:outline-none'
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
          />
        </div>
      ) : (
        <label className={`truncate whitespace-nowrap ${labelClassName}`} style={labelStyle}>{label}</label>
      )}
      {children && <div className='ml-2 flex items-center space-x-2'>{children}</div>}
    </div>
  );
}
