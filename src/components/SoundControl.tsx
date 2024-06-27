import { Sound } from "@src/hooks/useSound";
import SynthControl from "./synth/SynthControl";

type SoundControlProps = {
  sound: Sound;
};

export default function SoundControl({ sound }: SoundControlProps) {
  return (
    <div className="flex w-full max-w-[500px] flex-col items-center space-y-8">
      {sound.synths.map((synth, index) => (
        <SynthControl key={index} synth={synth} />
      ))}
    </div>
  );
}
