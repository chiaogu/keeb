import Keys from "@src/components/synth/Keys";
import useKeySounds from "@src/hooks/useKeySounds";
import useSound, { SoundConfig } from "@src/hooks/useSound";
import soundPreset1 from "@src/sound/preset1.json";
import SoundControl from "../SoundControl";

function Main() {
  const downSound = useSound(soundPreset1 as SoundConfig);

  useKeySounds(downSound, downSound);

  return (
    <div className="flex h-screen w-screen flex-col items-center space-y-8">
      <Keys />
      <SoundControl sound={downSound} />
    </div>
  );
}

export default Main;
