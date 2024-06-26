import Button from "./Button";

type FxActionsProps = {
  onRemove: () => void;
};

export default function FxActions({ onRemove }: FxActionsProps) {
  return (
    <div className="flex space-x-2">
      {/* <Button icon="swap_vert" /> */}
      <Button icon="remove" onClick={onRemove} />
      <Button icon="add" />
    </div>
  );
}
