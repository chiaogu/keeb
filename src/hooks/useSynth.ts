import createSynth from "@src/synth";
import getDefaultNodeState from "@src/synth/getDefaultNodeState";
import { useRef } from "react";

export default function useSynth() {
  const synthRef = useRef(
    createSynth({
      src: {
        type: "metal",
        data: getDefaultNodeState('metal'),
      },
      fxs: [],
    }),
  );
  return synthRef.current;
}
