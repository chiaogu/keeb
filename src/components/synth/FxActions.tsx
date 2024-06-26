import IconButton from "@src/components/shared/IconButton";

type FxActionsProps = {
  onRemove: () => void;
};

export default function FxActions({ onRemove }: FxActionsProps) {
  return (
    <div className="flex space-x-2">
      {/* <IconButton icon="swap_vert" /> */}
      <IconButton icon="remove" onClick={onRemove} />
      <IconButton icon="add" />
    </div>
  );
}
