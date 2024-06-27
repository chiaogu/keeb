import Control from "./Control";
import { nodeConfig } from "@src/synth/config";
import getDefaultNodeState from "@src/synth/getDefaultNodeState";
import RadioGroup from "@src/components//shared/RadioGroup";
import { SynthControlState } from "@src/hooks/useSynthState";

type SrcNodeControlProps = {
  synth: SynthControlState;
};

export default function SrcNodeControl({ synth }: SrcNodeControlProps) {
  const { state, setSrcState } = synth;

  return (
    <div className="flex w-full flex-col items-center">
      <RadioGroup
        label="type"
        options={["metal", "noise"]}
        value={state.src.type}
        onChange={(type) =>
          setSrcState({
            type,
            data: getDefaultNodeState(type),
          })
        }
      />
      {Object.entries(nodeConfig[state.src.type].controls).map(
        ([key, config]) => (
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
        ),
      )}
    </div>
  );
}
