import { SynthFxNodeState } from "@src/synth";
import FxActions from "./FxActions";
import { FxNodeType, nodeConfig } from "@src/synth/config";
import Control from "./Control";
import { splitCamelCase } from "@src/utils/utils";
import { useState } from "react";
import NewFx from "./NewFx";

type FxControlProps = {
  fx: SynthFxNodeState;
  onRemove: () => void;
  onChange: (key: string, v: unknown) => void;
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
      {Object.entries(nodeConfig[fx.type].schema.shape).map(
        ([key, schema]) => {
          const controls = nodeConfig[fx.type].controls;
          return (
            <Control
              key={key}
              config={controls?.[key as keyof typeof controls]}
              schema={schema}
              name={key}
              value={fx.data[key]}
              onChange={(v) => onChange(key, v)}
            />
          );
        },
      )}
    </>
  );
}
