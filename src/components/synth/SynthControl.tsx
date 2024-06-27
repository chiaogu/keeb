import { Synth } from "@src/synth";
import SrcNodeControl from "./SrcNodeControl";
import FxsControl from "./FxsControl";

type SynthControlProps = {
  synth: Synth
}

export default function SynthControl({ synth }: SynthControlProps) {
  return (
    <div className="flex w-full flex-col items-center border-2 border-black p-8">
      <SrcNodeControl synth={synth} />
      <FxsControl synth={synth} />
    </div>
  );
}
