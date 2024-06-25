import { useEffect, useState } from "react";
import Control from "./Control";
import { Synth } from "@src/synth";
import { SrcNodeType } from "@src/synth/config";
import { metalSynthConfig } from "@src/synth/config/metalSynth";
import SrcTypeRadio from "./SrcTypeRadio";

function getControls(type: SrcNodeType) {
  switch (type) {
    case "metal":
      return metalSynthConfig;
    default:
      return {};
  }
}

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
      <SrcTypeRadio
        value={srcState.type}
        onChange={(type) => setSrcState((state) => ({ ...state, type }))}
      />
      {Object.entries(getControls(srcState.type)).map(([key, { type }]) => (
        <Control
          key={key}
          type={type}
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
