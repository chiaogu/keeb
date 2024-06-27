import { SynthControlState } from "@src/hooks/useSynthState";
import FxControl from "./FxControl";
import NewFx from "./NewFx";
import { useState } from "react";

type SrcNodeControlProps = {
  synth: SynthControlState;
};

export default function FxsControl({ synth }: SrcNodeControlProps) {
  const { state, setFxState, removeFx, addFx } = synth;
  const [newFxOpen, setNewFxOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-start">
      {state.fxs.map((fx, index) => (
        <FxControl
          key={`${fx.type}-${index}`}
          fx={fx}
          onAdd={(node) => addFx(index, node)}
          onRemove={() => removeFx(index)}
          onChange={(key, value) => {
            setFxState(index, {
              ...fx,
              data: { ...fx.data, [key]: value },
            });
          }}
        />
      ))}
      <NewFx
        open={newFxOpen}
        setOpen={setNewFxOpen}
        onSelect={(node) => addFx(state.fxs.length, node)}
      />
    </div>
  );
}
