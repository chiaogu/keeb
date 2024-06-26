import { Fragment } from "react/jsx-runtime";
import { Synth } from "@src/synth";
import { nodeConfig } from "@src/synth/config";
import useSynthState from "@src/hooks/useSynthState";
import Button from "@src/components/shared/Button";
import FxActions from "./FxActions";
import Control from "./Control";

type SrcNodeControlProps = {
  synth: Synth;
};

export default function FxsControl({ synth }: SrcNodeControlProps) {
  const { state, setFxState, removeFx } = useSynthState(synth);

  return (
    <div className="flex w-full flex-col items-start">
      {state.fxs.map((fx, index) => (
        <Fragment key={`${fx.type}-${index}`}>
          <div className="mt-4 flex w-full items-end justify-between">
            <label>{fx.type}</label>
            <FxActions onRemove={() => removeFx(index)} />
          </div>
          {Object.entries(nodeConfig[fx.type]).map(([key, config]) => (
            <Control
              key={key}
              config={config}
              name={key}
              value={fx.data[key]}
              onChange={(value) => {
                setFxState(index, {
                  ...fx,
                  data: { ...fx.data, [key]: value },
                });
              }}
            />
          ))}
        </Fragment>
      ))}
      <div className="mt-4 flex w-full items-end justify-between">
        <label>fx</label>
        <div className="flex space-x-2">
          <Button icon="add" />
        </div>
      </div>
    </div>
  );
}
