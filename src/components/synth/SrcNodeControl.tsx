import { SrcNodeType, nodeConfig, srcNodeConfig } from "@src/synth/config";
import RadioGroup from "@src/components//shared/RadioGroup";
import { SynthControlState } from "@src/hooks/useSynthState";
import Controls from "./Controls";
import { zBaseSynthSrc } from "@src/synth/config/shared";
import { omit } from "@src/utils/schema";
import SectionHeader from "../shared/SectionHeader";

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
      <Controls
        schema={zBaseSynthSrc}
        value={state.src.data}
        onChange={(data) =>
          setSrcState({
            ...state.src,
            data: data,
          })
        }
      />
      <SectionHeader className="mt-4 font-bold" label={state.src.type} />
      <Controls
        schema={omit(
          nodeConfig[state.src.type].schema,
          Object.keys(zBaseSynthSrc.shape),
        )}
        controls={nodeConfig[state.src.type].controls}
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
