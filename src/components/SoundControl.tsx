import { Sound } from "@src/hooks/useSound";
import SynthControl from "./synth/SynthControl";
import IconButton from "./shared/IconButton";

type SoundControlProps = {
  sound: Sound;
};

export default function SoundControl({ sound }: SoundControlProps) {
  return (
    <div className="flex w-full max-w-[500px] flex-col items-center space-y-5">
      {sound.synths.map((synth, index) => (
        <SynthControl
          key={synth.getState().id}
          name={`layer ${index}`}
          synth={synth}
          onRemove={() => sound.removeLayer(index)}
          removable={sound.synths.length > 1}
        />
      ))}
      <div className="flex w-full flex-col items-center border-2 border-black p-8">
        <div className="flex w-full items-end justify-between">
          <label className="font-bold">layer</label>
          <div className="flex space-x-2">
            <IconButton icon="add" onClick={() => sound.addLayer()}/>
          </div>
        </div>
      </div>
    </div>
  );
}
