import { Synth } from "@src/synth";
import SrcNodeControl from "./SrcNodeControl";

type SynthControlProps = {
  synth: Synth
}

export default function SynthControl({ synth }: SynthControlProps) {
  return (
    <div className="flex w-[500px] flex-col items-center border-2 border-black p-8">
      <SrcNodeControl synth={synth} />
    </div>
  );
}
