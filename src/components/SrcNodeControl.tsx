import { useEffect, useState } from "react";
import Control from "./Control";
import { Synth } from "@src/synth";
import { nodeConfig } from "@src/synth/config";
import getDefaultNodeState from "@src/synth/getDefaultNodeState";
import RadioGroup from "./RadioGroup";

type SrcNodeControlProps = {
  synth: Synth;
};

export default function SrcNodeControl({ synth }: SrcNodeControlProps) {
  const [srcState, setSrcState] = useState(synth.getState().src);

  useEffect(() => {
    synth.setSrcState(srcState);
  }, [synth, srcState]);

  return (
    <div className="flex w-full flex-col items-center">
      <RadioGroup
        label="type"
        options={["metal", "noise"]}
        value={srcState.type}
        onChange={(type) => setSrcState({
          type,
          data: getDefaultNodeState(type),
        })}
      />
      {Object.entries(nodeConfig[srcState.type]).map(([key, config]) => (
        <Control
          key={key}
          config={config}
          name={key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase()}
          value={srcState.data[key]}
          onChange={(value) =>
            setSrcState((state) => ({
              ...state,
              data: { ...state.data, [key]: value },
            }))
          }
        />
      ))}
    </div>
  );
}
