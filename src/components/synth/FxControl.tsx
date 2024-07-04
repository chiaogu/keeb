import { SynthFxNodeState } from "@src/synth";
import FxActions from "./FxActions";
import { FxNodeType, nodeConfig } from "@src/synth/config";
import { splitCamelCase } from "@src/utils/utils";
import { useState } from "react";
import NewFx from "./NewFx";
import Controls from "./Controls";
import SectionHeader from "../shared/SectionHeader";

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
      <SectionHeader className="mt-4 font-bold" label={splitCamelCase(fx.type)}>
        <FxActions onRemove={onRemove} onAdd={() => setNewFxOpen(true)} />
      </SectionHeader>
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
