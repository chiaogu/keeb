import { useCallback } from "react";
import { useKeyEvents } from "./useKeyEvents";
import { Synth } from "@src/synth";

export default function useKeySounds(downSynth: Synth, upSynth: Synth) {
  const onKeydown = useCallback(() => {
    downSynth.trigger();
  }, [downSynth]);

  const onKeyUp = useCallback(() => {
    upSynth.trigger();
  }, [upSynth]);

  useKeyEvents(onKeydown, onKeyUp);
}
