import useSynth from "@src/hooks/useSynth";
import Keys from "@src/components/synth/Keys";
import SynthControl from "@src/components/synth/SynthControl";
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
