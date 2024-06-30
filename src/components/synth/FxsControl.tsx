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
          onAdd={(type) => addFx(index, type)}
          onRemove={() => removeFx(index)}
          onChange={(fx) => {
            setFxState(index, fx);
          }}
        />
      ))}
      <NewFx
        open={newFxOpen}
        setOpen={setNewFxOpen}
        onSelect={(type) => addFx(state.fxs.length, type)}
      />
    </div>
  );
}
