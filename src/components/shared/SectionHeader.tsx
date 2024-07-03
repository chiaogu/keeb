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
      <label className="w-32 shrink-0">
        <b>{label}</b>
      </label>
      <div className="flex space-x-2">{children}</div>
    </div>
  );
}