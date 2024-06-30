import { useCallback } from "react";
import IconButton from "../shared/IconButton";
import NodeTypeSelect from "./NodeTypeSelect";
import { FxNodeType } from "@src/synth/config";

type NewFxProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (type: FxNodeType) => void;
}

export default function NewFx({ onSelect, open, setOpen }: NewFxProps) {
  const toggleSelecting = useCallback(() => setOpen((v) => !v), [setOpen]);

  return (
    <div className="flex w-full flex-col">
      <div className="mt-4 flex items-end justify-between">
        <label>fx</label>
        <div className="flex">
          <IconButton icon={open ? 'close' : 'add'} onClick={toggleSelecting} />
        </div>
      </div>
      {open && (
        <NodeTypeSelect
          type="fx"
          onSelect={(type) => {
            setOpen(false);
            onSelect(type as FxNodeType);
          }}
        />
      )}
    </div>
  );
}
