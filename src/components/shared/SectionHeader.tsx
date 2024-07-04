import { ReactNode } from "react";

type SectionHeaderProps = {
  label: string;
  className?: string;
  children?: ReactNode;
};

export default function SectionHeader({
  label,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div className={`flex w-full items-end justify-between ${className}`}>
      <label className="shrink-0">
        {label}
      </label>
      <div className="flex space-x-2">{children}</div>
    </div>
  );
}
