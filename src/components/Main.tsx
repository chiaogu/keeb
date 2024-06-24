import useSynth from "@src/hooks/useSynth";
import Keys from "./Keys";
import SynthControl from "./SynthControl";
import useKeySounds from "@src/hooks/useKeySounds";

function Main() {
  const downSynth = useSynth();
  const upSynth = useSynth();

  useKeySounds(downSynth, upSynth);

  return (
    <div className="flex h-screen w-screen flex-col items-center space-y-8">
      <Keys />
      <SynthControl synth={downSynth} />
      <SynthControl synth={upSynth} />
    </div>
  );
}

export default Main;
