import Control from "./Control";
import { Synth } from "@src/synth";
import { nodeConfig } from "@src/synth/config";
import useSynthState from "@src/hooks/useSynthState";
import { Fragment } from "react/jsx-runtime";

type SrcNodeControlProps = {
  synth: Synth;
};

export default function FxsControl({ synth }: SrcNodeControlProps) {
  const { state, setFxState } = useSynthState(synth);

  return (
    <div className="flex w-full flex-col items-start">
      {state.fxs.map((fx, index) => (
        <Fragment key={`${fx.type}-${index}`}>
          <label className="mt-4">{fx.type}</label>
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
    </div>
  );
}
