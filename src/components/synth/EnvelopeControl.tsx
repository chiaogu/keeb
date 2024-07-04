import { Envelope, zEnvelope } from "@src/synth/config/envelope";
import Slider from "../shared/Slider";
import SectionHeader from "../shared/SectionHeader";
import Controls from "./Controls";

type EnvelopeProps = {
  envelope: Envelope;
  label: string;
  onChange: (adsr: Envelope) => void;
};

export default function EnvelopeControl({
  envelope,
  label,
  onChange,
}: EnvelopeProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <SectionHeader label={label}/>
      <Controls
        indent={1}
        schema={zEnvelope}
        value={envelope}
        onChange={(newEnvelope) => onChange(newEnvelope as Envelope)}
      />
    </div>
  );
}
