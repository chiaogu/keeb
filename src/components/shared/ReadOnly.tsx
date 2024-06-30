type ReadOnlyProps = {
  label: string;
  value: string;
};

export default function ReadOnly({
  label,
  value,
}: ReadOnlyProps) {
  return (
    <div className="flex w-full">
      <label className="w-32 shrink-0">
        {label}
      </label>
      <div className="flex flex-auto items-center justify-end">
        {value}
      </div>
    </div>
  );
}
