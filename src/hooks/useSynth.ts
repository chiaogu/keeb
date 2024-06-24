import createSynth from "@src/synth";
import { useRef } from "react";

export default function useSynth() {
  const synthRef = useRef(createSynth());
  return synthRef.current;
}