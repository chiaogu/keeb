import { Synth } from "@src/synth";
import SrcNodeControl from "./SrcNodeControl";
import FxsControl from "./FxsControl";
import useSynthState from "@src/hooks/useSynthState";
import IconButton from "../shared/IconButton";

type SynthControlProps = {
  name: string;
  synth: Synth;
  onRemove: () => void;
  removable: boolean;
};

export default function SynthControl({
  synth,
  name,
  onRemove,
  removable,
}: SynthControlProps) {
  const synthState = useSynthState(synth);

  return (
    <div className="flex w-full flex-col items-center border-2 border-black p-8">
      <div className="flex w-full items-end justify-between">
        <label>{name}</label>
        <div className="flex space-x-2">
          {removable && <IconButton icon="remove" onClick={onRemove} />}
        </div>
      </div>
      <SrcNodeControl synth={synthState} />
      <FxsControl synth={synthState} />
    </div>
  );
}
