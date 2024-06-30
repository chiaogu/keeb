import { SynthFxNodeState } from "@src/synth";
import FxActions from "./FxActions";
import { FxNodeType, nodeConfig } from "@src/synth/config";
import { splitCamelCase } from "@src/utils/utils";
import { useState } from "react";
import NewFx from "./NewFx";
import Controls from "./Controls";

type FxControlProps = {
  fx: SynthFxNodeState;
  onRemove: () => void;
  onChange: (fx: SynthFxNodeState) => void;
  onAdd: (node: FxNodeType) => void;
};

export default function FxControl({
  fx,
  onRemove,
  onChange,
  onAdd,
}: FxControlProps) {
  const [newFxOpen, setNewFxOpen] = useState(false);
  return (
    <>
      {newFxOpen && (
        <NewFx open={newFxOpen} setOpen={setNewFxOpen} onSelect={onAdd} />
      )}
      <div className="mt-4 flex w-full items-end justify-between">
        <label>{splitCamelCase(fx.type)}</label>
        <FxActions onRemove={onRemove} onAdd={() => setNewFxOpen(true)} />
      </div>
      <Controls
        schema={nodeConfig[fx.type].schema}
        controls={nodeConfig[fx.type].controls}
        value={fx.data}
        onChange={(data) =>
          onChange({ ...fx, data })
        }
      />
    </>
  );
}
