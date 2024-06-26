import { Synth } from "@src/synth";
import useSynthState from "@src/hooks/useSynthState";
import Button from "@src/components/shared/Button";
import FxControl from "./FxControl";
import NewFx from "./NewFx";

type SrcNodeControlProps = {
  synth: Synth;
};

export default function FxsControl({ synth }: SrcNodeControlProps) {
  const { state, setFxState, removeFx, addFx } = useSynthState(synth);

  return (
    <div className="flex w-full flex-col items-start">
      {state.fxs.map((fx, index) => (
        <FxControl
          key={`${fx.type}-${index}`}
          fx={fx}
          onRemove={() => removeFx(index)}
          onChange={(key, value) => {
            setFxState(index, {
              ...fx,
              data: { ...fx.data, [key]: value },
            });
          }}
        />
      ))}
      <NewFx onSelect={(node) => addFx(state.fxs.length, node)}/>
    </div>
  );
}
