import { useState } from "react";
import Control from "./Control";
import { Synth } from "@src/synth";
import { nodeConfig } from "@src/synth/config";
import useSynthState from "@src/hooks/useSynthState";

type SrcNodeControlProps = {
  synth: Synth;
};

export default function FxsControl({ synth }: SrcNodeControlProps) {
  const { state, setFxState } = useSynthState(synth);

  return (
    <div className="flex w-full flex-col items-center">
      {state.fxs.map((fx, index) => (
        <div key={`${fx.type}-${index}`}>
          <label>{fx.type}</label>
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
        </div>
      ))}
    </div>
  );
}
