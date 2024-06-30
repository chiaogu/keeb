import { SrcNodeType, nodeConfig, srcNodeConfig } from "@src/synth/config";
import RadioGroup from "@src/components//shared/RadioGroup";
import { SynthControlState } from "@src/hooks/useSynthState";
import NestedObjectControl from "./NestedObjectControl";

type SrcNodeControlProps = {
  synth: SynthControlState;
};

const srcTypeOptions = Object.keys(srcNodeConfig) as SrcNodeType[];

export default function SrcNodeControl({ synth }: SrcNodeControlProps) {
  const { state, setSrcState } = synth;

  return (
    <div className="flex w-full flex-col items-center">
      <RadioGroup
        label="type"
        options={srcTypeOptions}
        value={state.src.type}
        onChange={(type) => setSrcState({ type, data: {} })}
      />
      <NestedObjectControl
        schema={nodeConfig[state.src.type].schema}
        value={state.src.data}
        onChange={(data) =>
          setSrcState({
            ...state.src,
            data: data,
          })
        }
      />
    </div>
  );
}
