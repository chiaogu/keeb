import {
  FxNodeType,
  SrcNodeType,
  SynthNodeType,
  fxNodeConfig,
  srcNodeConfig,
} from "@src/synth/config";
import { splitCamelCase } from "@src/utils/utils";

type NodeType = "src" | "fx";

type NodeTypeSelectProps = {
  type: NodeType;
  onSelect: (type: SynthNodeType) => void;
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
            className="mr-5 underline"
            key={option}
            onClick={() => onSelect(option)}
          >
            {splitCamelCase(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
