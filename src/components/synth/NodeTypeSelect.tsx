import {
  FxNodeType,
  SrcNodeType,
  fxNodeConfig,
  srcNodeConfig,
} from "@src/synth/config";
import { SynthNodeState } from "@src/synth";
import getDefaultNodeState from "@src/synth/getDefaultNodeState";
import { splitCamelCase } from "@src/utils";

type NodeType = "src" | "fx";

type NodeTypeSelectProps = {
  type: NodeType;
  onSelect: (nodeState: SynthNodeState) => void;
};

const options = {
  src: Object.keys(srcNodeConfig) as SrcNodeType[],
  fx: Object.keys(fxNodeConfig) as FxNodeType[],
};

export default function NodeTypeSelect({
  type,
  onSelect,
}: NodeTypeSelectProps) {
  return (
    <div className="flex w-full">
      <label className="w-32 shrink-0">type</label>
      <div className="inline-block w-full">
        {options[type].map((option) => (
          <button
            className="mr-8"
            key={option}
            onClick={() =>
              onSelect({
                type: option,
                data: getDefaultNodeState(option),
              })
            }
          >
            {splitCamelCase(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
