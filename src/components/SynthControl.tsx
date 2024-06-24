import { useEffect, useState } from "react";
import Control from "./Control";
import { SynthState } from "@src/synth/config";
import { Synth } from "@src/synth";

type SynthControlProps = {
  synth: Synth
}

export default function SynthControl({ synth }: SynthControlProps) {
  const [synthState, setSynthState] = useState(synth.getState());

  useEffect(() => {
    synth.setState(synthState);
  }, [synth, synthState]);

  return (
    <div className="flex w-[500px] flex-col items-center border-2 border-black p-8">
      {Object.entries(synthState).map(([key, value]) => (
        <Control
          key={key}
          field={key as keyof SynthState}
          value={value}
          onChange={(value) =>
            setSynthState((state) => ({ ...state, [key]: value }))
          }
        />
      ))}
    </div>
  );
}
