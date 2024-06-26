import { useEffect, useState } from "react";
import Control from "./Control";
import { Synth } from "@src/synth";
import { nodeConfig } from "@src/synth/config";
import getDefaultNodeState from "@src/synth/getDefaultNodeState";
import RadioGroup from "./RadioGroup";
import useSynthState from "@src/hooks/useSynthState";

type SrcNodeControlProps = {
  synth: Synth;
};

export default function SrcNodeControl({ synth }: SrcNodeControlProps) {
  const { state, setSrcState } = useSynthState(synth);

  return (
    <div className="flex w-full flex-col items-center">
      <RadioGroup
        label="type"
        options={["metal", "noise"]}
        value={state.src.type}
        onChange={(type) => setSrcState({
          type,
          data: getDefaultNodeState(type),
        })}
      />
      {Object.entries(nodeConfig[state.src.type]).map(([key, config]) => (
        <Control
          key={key}
          config={config}
          name={key}
          value={state.src.data[key]}
          onChange={(value) =>
            setSrcState({
              ...state.src,
              data: { ...state.src.data, [key]: value },
            })
          }
        />
      ))}
    </div>
  );
}
