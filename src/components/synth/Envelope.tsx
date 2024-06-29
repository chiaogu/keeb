import { ADSR } from "@src/types";
import Slider from "../shared/Slider";

type EnvelopeProps = {
  adsr: ADSR;
  label: string;
  onChange: (adsr: ADSR) => void;
};

const adsrLabel = ["attack", "decay", "sustain", "release"];

export default function Envelope({ adsr, label, onChange }: EnvelopeProps) {
  return (
    <div className="mt-4 flex w-full flex-col items-center">
      <div className="flex w-full">
        <label className="w-32 shrink-0">{label}</label>
      </div>
      {adsr.map((v, index) => (
        <Slider
          key={`${label}-${adsrLabel[index]}`}
          label={`${adsrLabel[index]}`}
          value={v}
          onChange={(newV) => {
            const newAdsr: ADSR = [...adsr];
            newAdsr[index] = newV;
            onChange(newAdsr);
          }}
          min={0}
          max={1}
        />
      ))}
    </div>
  );
}
