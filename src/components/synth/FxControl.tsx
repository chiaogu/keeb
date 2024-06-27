import { SynthFxNodeState } from "@src/synth";
import FxActions from "./FxActions";
import { nodeConfig } from "@src/synth/config";
import Control from "./Control";
import { splitCamelCase } from "@src/utils";

type FxControlProps = {
  fx: SynthFxNodeState;
  onRemove: () => void;
  onChange: (key: string, v: unknown) => void;
};

export default function FxControl({ fx, onRemove, onChange }: FxControlProps) {
  return (
    <>
      <div className="mt-4 flex w-full items-end justify-between">
        <label>{splitCamelCase(fx.type)}</label>
        <FxActions onRemove={onRemove} />
      </div>
      {Object.entries(nodeConfig[fx.type].controls).map(([key, config]) => (
        <Control
          key={key}
          config={config}
          name={key}
          value={fx.data[key]}
          onChange={(v) => onChange(key, v)}
        />
      ))}
    </>
  );
}