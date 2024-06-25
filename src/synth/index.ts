import { FxNodeType, SrcNodeType } from "./config";
import createSynthNode, { SupportedToneNode } from "./createSynthNode";
import setToneNodeState from "./setToneNodeState";
import triggerToneNode from "./triggerToneNode";

export type SynthState = {
  src: { type: SrcNodeType, data: Record<string, unknown> },
  fx: { type: FxNodeType, data: Record<string, unknown> }[],
};

export type Synth = {
  setSrcState: (srcState: SynthState['src']) => void,
  getState: () => SynthState,
  trigger: () => void,
};

export default function createSynth(initState: SynthState) {
  let synth: SupportedToneNode | null = null;
  let state: SynthState = initState;
  
  setSrcState(state.src);

  function setSrcState(newState: SynthState['src']) {
    if (synth === null || newState.type !== state.src.type) {
      if (synth) synth.disconnect().dispose();  
      synth = createSynthNode(newState.type).toDestination();
    }
    
    setToneNodeState(synth, newState.data);
    
    state = { ...state, src: newState };
  }

  function trigger() {
    if (!synth) throw new Error('synth does not exist');
    triggerToneNode(synth);
  }
  
  return {
    setSrcState,
    getState: () => state,
    trigger,
  };
}
