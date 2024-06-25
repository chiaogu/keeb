import { NodeControlConfig } from "@src/synth/config";
import Slider from "./Slider";
import RadioGroup from "./RadioGroup";

type ControlProps = {
  config: NodeControlConfig;
  name: string;
  value: unknown;
  onChange: (v: unknown) => void;
};

export default function Control({
  config,
  name,
  value,
  onChange,
}: ControlProps) {
  if (config.type === "range") {
    return <Slider label={name} value={value as number} onChange={onChange} />;
  } else if (config.type === "select") {
    return (
      <RadioGroup
        label={name}
        value={value as string}
        onChange={onChange}
        options={config.options}
      />
    );
  }

  return null;
}
