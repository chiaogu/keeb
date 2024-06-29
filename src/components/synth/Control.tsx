import { NodeControlConfig } from "@src/synth/config";
import Slider from "@src/components/shared/Slider";
import RadioGroup from "@src/components/shared/RadioGroup";
import { useMemo } from "react";
import { splitCamelCase } from "@src/utils/utils";
import { ADSR } from "@src/types";
import Envelope from "./Envelope";

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
  const label = useMemo(() => splitCamelCase(name), [name]);

  if (config.type === "range") {
    return (
      <Slider
        label={label}
        value={value as number}
        onChange={onChange}
        min={config.range[0]}
        max={config.range[1]}
        step={config.step}
      />
    );
  } else if (config.type === "select") {
    return (
      <RadioGroup
        label={label}
        value={value as string}
        onChange={onChange}
        options={config.options}
      />
    );
  } else if (config.type === "adsr") {
    return <Envelope adsr={value as ADSR} label={label} onChange={onChange} />;
  }

  return null;
}
