import createSynth from "@src/synth";
import { metalSynthConfig } from "@src/synth/config/metalSynth";
import { useRef } from "react";

export default function useSynth() {
  const synthRef = useRef(
    createSynth({
      src: {
        type: "metal",
        data: Object.fromEntries(
          Object.entries(metalSynthConfig).map(([key, { defaultValue }]) => [
            key,
            defaultValue,
          ]),
        ),
      },
      fx: [],
    }),
  );
  return synthRef.current;
}
