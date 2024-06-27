import Keys from "@src/components/synth/Keys";
import useKeySounds from "@src/hooks/useKeySounds";
import useSound, { SoundConfig } from "@src/hooks/useSound";
import soundPreset1 from "@src/presets/sound/sound1.json";
import SoundControl from "../SoundControl";
import RadioGroup from "../shared/RadioGroup";
import { useState } from "react";

function Main() {
  const [keyEvent, setKeyEvent] = useState('down');
  const downSound = useSound(soundPreset1 as SoundConfig);
  const upSound = useSound(soundPreset1 as SoundConfig);

  useKeySounds(downSound, upSound);

  return (
    <div className="flex flex-col items-center space-y-5">
      <Keys />
      <div className="flex w-full max-w-[500px] flex-col items-center space-y-5">
        <div className="flex w-full flex-col items-center border-2 border-black p-8">
          <RadioGroup
            label="key event"
            value={keyEvent}
            onChange={setKeyEvent}
            options={['down', 'up']}
          />
        </div>
      </div>
      <SoundControl sound={keyEvent === 'down' ? downSound : upSound} />
    </div>
  );
}

export default Main;
