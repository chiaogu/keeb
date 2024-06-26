import { NodeControlConfig } from "@src/synth/config";
import Slider from "@src/components/shared/Slider";
import RadioGroup from "@src/components/shared/RadioGroup";
import { useMemo } from "react";

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
  const label = useMemo(() => name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase(), [name]);

  if (config.type === "range") {
    return <Slider label={label} value={value as number} onChange={onChange} />;
  } else if (config.type === "select") {
    return (
      <RadioGroup
        label={label}
        value={value as string}
        onChange={onChange}
        options={config.options}
      />
    );
  }

  return null;
}
