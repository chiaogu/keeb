import { Envelope } from "@src/synth/config/envelope";
import Slider from "../shared/Slider";

type EnvelopeProps = {
  envelope: Envelope;
  label: string;
  onChange: (adsr: Envelope) => void;
};

const adsrLabels = ["attack", "decay", "sustain", "release"] as const;

export default function EnvelopeControl({
  envelope,
  label,
  onChange,
}: EnvelopeProps) {
  return (
    <div className="mt-4 flex w-full flex-col items-center">
      <div className="flex w-full">
        <label className="w-32 shrink-0">{label}</label>
      </div>
      {adsrLabels.map((adsr) => (
        <Slider
          key={`${label}-${adsr}`}
          label={adsr}
          value={envelope[adsr]}
          onChange={(newV) => {
            const newEnvelope: Envelope = { ...envelope };
            newEnvelope[adsr] = newV;
            onChange(newEnvelope);
          }}
          min={0}
          max={1}
        />
      ))}
    </div>
  );
}
