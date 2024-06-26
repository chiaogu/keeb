import { useMemo, useState } from "react";
import { Synth, SynthState } from "@src/synth";

export default function useSynthState(
  synth: Synth,
): Pick<Synth, "setSrcState" | "setFxState" | "setFxs"> & {
  state: SynthState;
} {
  const [state, setState] = useState(synth.getState());

  return useMemo(() => {
    function wrapSetState<P extends ReadonlyArray<unknown>>(
      synthFunc: (...params: P) => void,
    ) {
      return (...args: P) => {
        synthFunc(...args);
        setState({ ...synth.getState() });
      };
    }

    return {
      state,
      setSrcState: wrapSetState(synth.setSrcState),
      setFxs: wrapSetState(synth.setFxs),
      setFxState: wrapSetState(synth.setFxState),
    };
  }, [state, synth]);
}
