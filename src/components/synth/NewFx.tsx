import { useCallback, useState } from "react";
import IconButton from "../shared/IconButton";
import NodeTypeSelect from "./NodeTypeSelect";
import { SynthFxNodeState } from "@src/synth";

type NewFxProps = {
  onSelect: (nodeState: SynthFxNodeState) => void;
}

export default function NewFx({ onSelect }: NewFxProps) {
  const [open, setOpen] = useState(false);
  const toggleSelecting = useCallback(() => setOpen((v) => !v), []);

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
          onSelect={(node) => {
            setOpen(false);
            onSelect(node as SynthFxNodeState);
          }}
        />
      )}
    </div>
  );
}
