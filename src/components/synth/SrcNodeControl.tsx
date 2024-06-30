import Control from "./Control";
import { SrcNodeType, nodeConfig, srcNodeConfig } from "@src/synth/config";
import RadioGroup from "@src/components//shared/RadioGroup";
import { SynthControlState } from "@src/hooks/useSynthState";

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
      {Object.entries(nodeConfig[state.src.type].controls).map(
        ([key, config]) => {
          const schema = nodeConfig[state.src.type].schema.shape;
          return (
            <Control
              key={key}
              config={config}
              schema={schema[key as keyof typeof schema]}
              name={key}
              value={state.src.data[key]}
              onChange={(value) =>
                setSrcState({
                  ...state.src,
                  data: { ...state.src.data, [key]: value },
                })
              }
            />
          );
        },
      )}
    </div>
  );
}
